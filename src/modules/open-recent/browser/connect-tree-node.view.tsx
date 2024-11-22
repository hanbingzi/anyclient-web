import cls from 'classnames';
import React from 'react';

// import {
//   TreeNode,
//   CompositeTreeNode,
//   INodeRendererProps,
//   ClasslistComposite,
//   PromptHandle,
//   TreeNodeType,
//   RenamePromptHandle,
//   NewPromptHandle,
// } from '@opensumi/ide-components';
import { Loading } from '@opensumi/ide-components';
import { getIcon, URI } from '@opensumi/ide-core-browser';

import { ServerEntity, ServerNode } from '../common/connect-tree-node.define';

import styles from './connect-tree-node.module.less';
import { ConnectTreeDecorationService } from './services/connect-tree-decoration.service';
import { ConnectDragAndDropService } from './services/connect-tree-dnd.service';
import {
  ClasslistComposite,
  CompositeTreeNode,
  INodeRendererProps,
  NewPromptHandle,
  PromptHandle,
  RenamePromptHandle,
  TreeNode,
  TreeNodeType,
} from '../../components/recycle-tree';
import { ServerIconFinder } from '../../base//config/server-icon.config';

export interface IFileTreeNodeProps {
  item: any;
  defaultLeftPadding?: number;
  leftPadding?: number;
  decorationService: ConnectTreeDecorationService;
  //labelService: LabelService;
  decorations?: ClasslistComposite;
  dndService: ConnectDragAndDropService;
  onTwistierClick?: (ev: React.MouseEvent, item: TreeNode | CompositeTreeNode, type: TreeNodeType) => void;
  onClick: (ev: React.MouseEvent, item: TreeNode | CompositeTreeNode, type: TreeNodeType, activeUri?: URI) => void;
  onDoubleClick: (
    ev: React.MouseEvent,
    item: TreeNode | CompositeTreeNode,
    type: TreeNodeType,
    activeUri?: URI,
  ) => void;
  onContextMenu: (
    ev: React.MouseEvent,
    item: TreeNode | CompositeTreeNode,
    type: TreeNodeType,
    activeUri?: URI,
  ) => void;
  template?: React.JSXElementConstructor<any>;
  // 是否有文件夹图标，没有的情况下文件图标会与父目录小箭头对齐
  hasFolderIcons?: boolean;
  // 是否有文件
  hasFileIcons?: boolean;
  // 是否隐藏箭头
  hidesExplorerArrows?: boolean;
  // 是否处于编辑态
  hasPrompt?: boolean;
}

export type FileTreeNodeRenderedProps = IFileTreeNodeProps & INodeRendererProps;

export const ConnectTreeNodeView: React.FC<FileTreeNodeRenderedProps> = ({
  item,
  onClick,
  onDoubleClick,
  onContextMenu,
  dndService,
  itemType,
  decorationService,
  //labelService,
  leftPadding = 8,
  onTwistierClick,
  decorations,
  defaultLeftPadding = 8,
  template: Template,
  hasFolderIcons,
  hasFileIcons,
  hidesExplorerArrows,
  hasPrompt,
}: FileTreeNodeRenderedProps) => {
  // const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const isRenamePrompt = itemType === TreeNodeType.RenamePrompt;
  const isNewPrompt = itemType === TreeNodeType.NewPrompt;
  const isPrompt = isRenamePrompt || isNewPrompt;
  // const isCompactName = !isPrompt && item.name.indexOf(Path.separator) >= 0;

  const decoration = isPrompt ? null : decorationService.getDecoration(item.uri, ServerNode.is(item));

  const handleClick = (ev: React.MouseEvent) => {
    if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
      // if (isCompactName) {
      //   setActiveIndex(item.name.split(Path.separator).length - 1);
      // }
      onClick(ev, item, itemType);
    }
  };

  const handleDoubleClick = (ev: React.MouseEvent) => {
    if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
      // if (isCompactName) {
      //   setActiveIndex(item.name.split(Path.separator).length - 1);
      // }
      onDoubleClick(ev, item, itemType);
    }
  };

  const handlerTwistierClick = (ev: React.MouseEvent) => {
    if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
      if (onTwistierClick) {
        onTwistierClick(ev, item, itemType);
      } else {
        onClick(ev, item, itemType);
      }
    }
  };

  const handleContextMenu = React.useCallback(
    (ev: React.MouseEvent) => {
      if (ev.nativeEvent.which === 0) {
        return;
      }
      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        onContextMenu(ev, item as TreeNode, itemType);
      }
    },
    [onContextMenu, item],
  );

  const handleDragStart = React.useCallback(
    (ev: React.DragEvent) => {
      const { handleDragStart } = dndService;
      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        handleDragStart(ev, item);
      }
    },
    [dndService, item],
  );

  const handleDragLeave = React.useCallback(
    (ev: React.DragEvent) => {
      const { handleDragLeave } = dndService;

      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        handleDragLeave(ev, item);
      }
    },
    [dndService, item],
  );

  const handleDragEnter = React.useCallback(
    (ev: React.DragEvent) => {
      const { handleDragEnter } = dndService;
      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        handleDragEnter(ev, item);
      }
    },
    [dndService, item],
  );

  const handleDrop = React.useCallback(
    (ev: React.DragEvent) => {
      const { handleDrop } = dndService;

      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        handleDrop(ev, item);
      }
    },
    [dndService, item],
  );

  const handleDragOver = React.useCallback(
    (ev: React.DragEvent) => {
      const { handleDragOver } = dndService;
      if (itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode) {
        handleDragOver(ev, item);
      }
    },
    [dndService, item],
  );

  let isFile = '' === item.levelType;

  let isDirectory = itemType === TreeNodeType.CompositeTreeNode;

  let paddingLeft;
  if (isPrompt) {
    if (isNewPrompt) {
      isDirectory = (item as NewPromptHandle).type === TreeNodeType.CompositeTreeNode;
      paddingLeft = `${
        defaultLeftPadding +
        ((item as NewPromptHandle).parent.depth + 1 || 0) * (leftPadding || 0) +
        (isDirectory ? 0 : hasFolderIcons ? (hidesExplorerArrows ? 0 : 20) : 0)
      }px`;
    } else {
      isDirectory = (item as RenamePromptHandle).target.type === TreeNodeType.CompositeTreeNode;
      paddingLeft = `${
        defaultLeftPadding +
        ((item as RenamePromptHandle).target.depth || 0) * (leftPadding || 0) +
        (isDirectory ? 0 : hasFolderIcons ? (hidesExplorerArrows ? 0 : 20) : 0)
      }px`;
    }
  } else {
    paddingLeft = `${
      defaultLeftPadding +
      (item.depth || 0) * (leftPadding || 0) +
      (isDirectory ? 0 : hasFolderIcons ? (hidesExplorerArrows ? 0 : 20) : 0)
    }px`;
  }
  //console.log('padding-left:',paddingLeft)
  const fileTreeNodeStyle = {
    color: decoration ? decoration.color : '',
    height: FILE_TREE_NODE_HEIGHT,
    lineHeight: `${FILE_TREE_NODE_HEIGHT}px`,
    paddingLeft,
    opacity: hasPrompt && !isPrompt ? '.6' : '1',
  } as React.CSSProperties;

  const renderFolderToggle = (node: ServerNode | PromptHandle, clickHandler: any) => {
    if (decorations && decorations?.classlist.indexOf(styles.mod_loading) > -1) {
      return <Loading />;
    }
    if (isPrompt && node instanceof PromptHandle) {
      let isDirectory = false;
      if (isRenamePrompt) {
        isDirectory = (node as RenamePromptHandle).target.type === TreeNodeType.CompositeTreeNode;
      } else {
        isDirectory = (node as NewPromptHandle).type === TreeNodeType.CompositeTreeNode;
      }
      if (isDirectory) {
        return (
          <div
            className={cls(styles.file_tree_node_segment, styles.expansion_toggle, getIcon('arrow-right'), {
              [`${styles.mod_collapsed}`]:
                isNewPrompt ||
                !(
                  isRenamePrompt &&
                  (node as RenamePromptHandle).target.type === TreeNodeType.CompositeTreeNode &&
                  ((node as RenamePromptHandle).target as ServerNode).expanded
                ),
            })}
          />
        );
      }
    } else {
      return (
        <div
          onClick={clickHandler}
          className={cls(styles.file_tree_node_segment, styles.expansion_toggle, getIcon('arrow-right'), {
            [`${styles.mod_collapsed}`]: !(node as ServerNode).expanded,
          })}
        />
      );
    }
  };

  const renderIcon = (node: ServerNode | ServerEntity) => {
    let isOpen = isDirectory && (node as ServerNode).expanded;
    let icon = ServerIconFinder.getServerIcon(node.serverType!, node.nodeType, isDirectory, isOpen);
    return (
      <div
        className={cls(styles.server_icon, node.nodeStat !== 'success' && styles.server_icon_disable)}
        style={{ height: FILE_TREE_NODE_HEIGHT, paddingTop: `${(FILE_TREE_NODE_HEIGHT - 16) / 2}px` }}
      >
        {icon}
        {/*{node.headIcon}*/}
      </div>
    );
    // let nodeUri: URI;
    // let isDirectory: boolean;
    // if (isPrompt && node instanceof PromptHandle) {
    //   if (node instanceof RenamePromptHandle) {
    //     nodeUri = ((node as RenamePromptHandle).target! as File | ServerNode).uri.resolve(node.$.value);
    //     isDirectory = ServerNode.is((node as RenamePromptHandle).target);
    //   } else {
    //     nodeUri = (node.parent! as ServerNode).uri.resolve(node.$.value);
    //     isDirectory = node.type === TreeNodeType.CompositeTreeNode;
    //   }
    // } else {
    //   nodeUri = node.uri;
    //   isDirectory = node.filestat.isDirectory;
    // }
    // const iconClass = labelService.getIcon(nodeUri, {
    //   isDirectory,
    //   isOpenedDirectory: isDirectory && (node as ServerNode).expanded,
    // });
    // if ((isDirectory && !hasFolderIcons) || (!isDirectory && !hasFileIcons)) {
    //   return null;
    // }
    // //console.log(hasFileIcons,iconClass)
    // return (
    //   <div
    //     className={cls(styles.file_icon, iconClass, {expanded: isDirectory && (node as ServerNode).expanded})}
    //     style={{height: FILE_TREE_NODE_HEIGHT, lineHeight: `${FILE_TREE_NODE_HEIGHT}px`}}
    //   ></div>
    // );
  };

  const renderDisplayName = (node: ServerNode | ServerEntity) => {
    //console.log('renderDisplayName-->',Template)
    if (Template) {
      return <Template />;
    }
    if (isPrompt && node instanceof PromptHandle) {
      return (
        <div className={cls(styles.file_tree_node_segment, styles.file_tree_node_inputbox)}>
          <div className={cls('input-box', styles.file_tree_node_prompt_box)}>
            <node.ProxiedInput wrapperStyle={{ height: FILE_TREE_NODE_HEIGHT, padding: '0 5px' }} />
          </div>
        </div>
      );
    }
    return (
      <div
        className={cls(
          styles.file_tree_node_segment,
          styles.file_tree_node_displayname,
          (node.levelType === 'server' || node.levelType === 'node') &&
            (node as ServerNode).nodeStat !== 'success' &&
            styles.display_name_disable,
        )}
      >
        {node.displayName}
      </div>
    );
  };

  const renderStatusTail = () => (
    <div className={cls(styles.file_tree_node_segment, styles.file_tree_node_tail)}>{renderBadge()}</div>
  );

  const renderBadge = () => {
    if (!decoration) {
      return null;
    }
    return <div className={styles.file_tree_node_status}>{decoration.badge.slice()}</div>;
  };

  const renderTwice = (item) => {
    if (hidesExplorerArrows) {
      return null;
    }
    if (isDirectory) {
      return renderFolderToggle(item, handlerTwistierClick);
    } else if (isPrompt) {
      return renderFolderToggle(item, () => {});
    }
    // else {
    //   return (<div className={styles.expansion_empty} style={{height: FILE_TREE_NODE_HEIGHT}}></div>);
    // }
  };

  const getItemTooltip = () => {
    let tooltip = item.tooltip;
    if (decoration && decoration.badge) {
      tooltip += ` • ${decoration.tooltip}`;
    }
    return tooltip;
  };

  return (
    <div
      key={item.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      title={getItemTooltip()}
      className={cls(styles.file_tree_node, decorations ? decorations.classlist : null)}
      style={fileTreeNodeStyle}
      draggable={itemType === TreeNodeType.TreeNode || itemType === TreeNodeType.CompositeTreeNode}
      data-id={item.id}
    >
      <div className={cls(styles.file_tree_node_content)}>
        {renderTwice(item)}
        {renderIcon(item)}
        <div className={isPrompt ? styles.file_tree_node_prompt_wrap : styles.file_tree_node_overflow_wrap}>
          {renderDisplayName(item)}
        </div>
        {renderStatusTail()}
      </div>
    </div>
  );
};

export const FILE_TREE_NODE_HEIGHT = 22;
export const FILE_TREE_BADGE_LIMIT = 99;
