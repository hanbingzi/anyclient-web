// import {ServerTreeNodeRenderer} from './tree-node.view';
// import {ServerTreeService} from './tree.service';
// import {IServerRecycleTreeProps} from '../common/types';
// import './less/styles.less';
// import 'react-ctxmenu-trigger/assets/index.css';
// import {
//     INodeRendererWrapProps,
//     ITreeNodeOrCompositeTreeNode,
//     RecycleTree,
//     RecycleTreeFilterDecorator
// } from '../../components/recycle-tree';
// import {useInjectable} from "@opensumi/ide-core-browser";
// import {IServerOpenRecentManagerService} from "../../open-recent";
//
import React, { useCallback } from 'react';

import cls from 'classnames';
import { ServerCompositeTreeNode, ServerTreeNode } from '../common/tree-node.define';
import { DECORATIONS, IBasicInlineMenuPosition, IBasicNodeRendererProps } from '../common/types';
import './less/styles.less';
import styles from './less/tree-node.module.less';
import { Button, Icon, Loading } from '@opensumi/ide-components';
import { PromptHandle, TreeNodeType } from '../../components/recycle-tree';
import { ServerIconFinder } from '../../base/config/server-icon.config';
import { FolderIcon } from '../../base/config/server-icon';

export const ServerTreeNodeRenderer: React.FC<
  IBasicNodeRendererProps & { item: ServerCompositeTreeNode | ServerTreeNode }
> = ({
  item,
  itemType,
  className,
  itemHeight = 22,
  indent = 16,
  //   isConnect,
  onClick,
  onDbClick,
  onTwistierClick,
  onContextMenu,
  decorations,
  template: Template,
  inlineMenus = [],
  inlineMenuActuator = () => {},
}: IBasicNodeRendererProps & { item: ServerCompositeTreeNode | ServerTreeNode }) => {
  const isRenamePrompt = itemType === TreeNodeType.RenamePrompt;
  const isNewPrompt = itemType === TreeNodeType.NewPrompt;
  const isPrompt = isRenamePrompt || isNewPrompt;
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (onClick) {
        event.stopPropagation();
        onClick(event, item as any);
      }
    },
    [onClick],
  );

  const handleDbClick = useCallback(
    (event: React.MouseEvent) => {
      if (onDbClick) {
        event.stopPropagation();
        onDbClick(event, item as any);
      }
    },
    [onDbClick],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (onContextMenu) {
        event.stopPropagation();
        event.preventDefault();
        onContextMenu(event, item as any);
      }
    },
    [onContextMenu],
  );

  const handlerTwistierClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (onTwistierClick) {
        onTwistierClick(event, item as any);
      } else if (onClick) {
        onClick(event, item as any);
      }
    },
    [onClick, onTwistierClick],
  );

  //console.log(item.name,"item.depth:",item.depth,",indent:",indent,",!ServerCompositeTreeNode.is(item):",!ServerCompositeTreeNode.is(item))
  //const paddingLeft = `${8 + (item.depth || 0) * (indent || 0) + (!ServerCompositeTreeNode.is(item) ? 20 : 0)}px`;
  const paddingLeft = `${8 + (item.depth - 1) * indent}px`;

  const editorNodeStyle = {
    height: itemHeight,
    lineHeight: `${itemHeight}px`,
    paddingLeft,
  } as React.CSSProperties;

  const renderIcon = useCallback((node: ServerCompositeTreeNode | ServerTreeNode) => {
    let icon;
    if (ServerCompositeTreeNode.is(node)) {
      if (node.expanded) {
        icon = FolderIcon.openIcon;
      } else {
        icon = FolderIcon.closeIcon;
      }
    } else {
      icon = ServerIconFinder.getServerIcon(node.serverType!);
    }
    return (
      <div className={cls('icon', node.iconClassName)} style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}>
        {icon}
      </div>
    );
  }, []);

  const getName = useCallback(
    (node: ServerCompositeTreeNode | ServerTreeNode) => node.displayName?.replace(/\n/g, '↵'),
    [],
  );

  const renderDisplayName = (node: ServerCompositeTreeNode | ServerTreeNode) => {
    if (Template) {
      return <Template />;
    }
    if (isPrompt && node instanceof PromptHandle) {
      return (
        <div className={cls('input-box')}>
          <node.ProxiedInput wrapperStyle={{ height: itemHeight, padding: '0 5px' }} />
        </div>
      );
    }
    return (
      <div
        className={cls(
          'segment',
          'display_name',
          // {'display_name_init': item.nodeStat === 'init' || item.nodeStat === 'error'},
        )}
      >
        {getName(node)}
      </div>
    );
  };

  const renderDescription = useCallback((node: ServerCompositeTreeNode | ServerTreeNode) => {
    if (!node.description) {
      return null;
    }
    return <div className={cls('segment_grow', 'description')}>{node.description}</div>;
  }, []);

  const inlineMenuActions = useCallback(
    (item: ServerCompositeTreeNode | ServerTreeNode) => {
      if (Array.isArray(inlineMenus)) {
        return inlineMenus;
      } else if (typeof inlineMenus === 'function') {
        return inlineMenus(item);
      }
    },
    [inlineMenus],
  );

  const renderNodeTail = () => {
    const isServerCompositeTreeNode = ServerCompositeTreeNode.is(item);
    const actions = inlineMenuActions(item)?.filter((menu) =>
      isServerCompositeTreeNode
        ? menu.position === IBasicInlineMenuPosition.TREE_CONTAINER
        : menu.position === IBasicInlineMenuPosition.TREE_NODE,
    );
    if (!actions?.length) {
      return null;
    }
    const handleActionClick = useCallback((event: React.MouseEvent, action) => {
      event.stopPropagation();
      inlineMenuActuator(item, action);
    }, []);
    return (
      <div className={cls('segment', 'tail')}>
        {actions.map((action) => (
          <Button
            style={{ marginRight: '5px' }}
            type='icon'
            key={`${item.id}-${action.icon}`}
            icon={action.icon}
            title={action.title}
            onClick={(e) => handleActionClick(e, action)}
          />
        ))}
      </div>
    );
  };

  const renderFolderToggle = (node: ServerCompositeTreeNode, clickHandler: any) => {
    return (
      <Icon
        className={cls('segment', 'expansion_toggle', {
          ['mod_collapsed']: !(node as ServerCompositeTreeNode).expanded,
        })}
        onClick={clickHandler}
        icon='arrow-right'
      />
    );
  };

  const renderTwice = (item: ServerCompositeTreeNode | ServerTreeNode) => {
    if (decorations && decorations?.classlist.indexOf(DECORATIONS.LOADING) > -1) {
      return <Loading />;
    }

    if (!(item as ServerCompositeTreeNode).expandable) {
      return <div className={cls('segment', 'expansion_toggle')}></div>;
    }
    if (ServerCompositeTreeNode.is(item)) {
      return renderFolderToggle(item as ServerCompositeTreeNode, handlerTwistierClick);
    }
  };

  return (
    <div
      key={item.id}
      onClick={handleClick}
      onDoubleClick={handleDbClick}
      onContextMenu={handleContextMenu}
      className={cls('tree_node' as any, className, decorations && decorations.classlist)}
      style={editorNodeStyle}
      data-id={item.id}
    >
      <div className='content'>
        {renderTwice(item)}
        {renderIcon(item)}
        <div className={isPrompt ? styles.tree_node_prompt_wrap : styles.tree_node_overflow_wrap}>
          {renderDisplayName(item)}
          {renderDescription(item)}
        </div>
        {renderNodeTail()}
      </div>
    </div>
  );
};
