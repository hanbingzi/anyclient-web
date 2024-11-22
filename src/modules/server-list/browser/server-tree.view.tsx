import React, { memo, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { CommandService, DisposableCollection, useInjectable, ViewState } from '@opensumi/ide-core-browser';
import { BasicTreeModel, ServerTreeService } from './server-tree.service';
import {
  INodeRendererWrapProps,
  IRecycleTreeHandle,
  ITreeNodeOrCompositeTreeNode,
  RecycleTree,
  RecycleTreeFilterDecorator,
} from '../../components/recycle-tree';
import { ServerCompositeTreeNode, ServerTreeNode } from '../common/tree-node.define';
import { ServerCommandIds } from '../../base/command/menu.command';
import { IServerRecycleTreeProps } from '../common/types';
import { ServerTreeNodeRenderer } from './server-tree-node.view';

export const ServerTree = ({ viewState }: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;

  // const [isReady, setIsReady] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model, setModel] = useState<BasicTreeModel | undefined>();
  const serverTreeService = useInjectable<ServerTreeService>(ServerTreeService); //useRef<BasicTreeService>(new BasicTreeService(treeData, resolveTestChildren));
  const commandService = useInjectable<CommandService>(CommandService);

  const treeHandle = useRef<IRecycleTreeHandle>();
  const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  const { filterMode: defaultFilterMode } = serverTreeService;

  const [filterMode, setFilterMode] = useState<boolean>(defaultFilterMode);
  const disposableRef: RefObject<DisposableCollection> = useRef(new DisposableCollection());

  useEffect(() => {
    ensureLoaded();
    const disposable = serverTreeService.onDidUpdateTreeModel(async (model?: BasicTreeModel) => {
      await model?.root.ensureLoaded();
      setModel(model);
    });

    disposableRef.current?.push(
      serverTreeService.onFilterModeChange((flag) => {
        setFilterMode(flag);
      }),
    );

    const handleBlur = () => {
      serverTreeService?.enactiveFocusedDecoration();
    };
    wrapperRef.current?.addEventListener('blur', handleBlur, true);

    return () => {
      wrapperRef.current?.removeEventListener('blur', handleBlur, true);
      disposable.dispose();
      serverTreeService?.dispose();
      disposableRef.current?.dispose();
    };
  }, []);

  const ensureLoaded = async () => {
    const model = serverTreeService.model;
    if (model) {
      await model.root.ensureLoaded();
      await model.root.expandedAll();
    }
    setModel(model);
  };

  useEffect(() => {
    if (wrapperRef.current) {
      serverTreeService.initContextKey(wrapperRef.current);
    }
  }, [wrapperRef.current]);

  const handleTreeReady = useCallback((handle: IRecycleTreeHandle) => {
    treeHandle.current = handle;
    serverTreeService.handleTreeHandler(handle);
  }, []);

  const handleItemClick = useCallback((event: React.MouseEvent, item: ServerCompositeTreeNode | ServerTreeNode) => {
    serverTreeService?.activeFocusedDecoration(item);
    //console.log('list  click->', item)
    if (ServerCompositeTreeNode.is(item)) {
      toggleDirectory(item);
    } else {
      commandService.executeCommand(ServerCommandIds.openServerInfo.id, item.primaryId);
    }
  }, []);

  const handleItemDbClick = useCallback((event: React.MouseEvent, item: ServerCompositeTreeNode | ServerTreeNode) => {
    serverTreeService?.activeLoadingDecoration(item);
    if (item instanceof ServerCompositeTreeNode) {
      serverTreeService?.loadData(item);
    }
    setTimeout(() => {
      serverTreeService?.enactiveLoadingDecoration(item);
    }, 3000);
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent, item: ServerCompositeTreeNode | ServerTreeNode) => {
    if (item) {
      serverTreeService?.activeContextMenuDecoration(item);
    } else {
      serverTreeService?.enactiveFocusedDecoration();
    }
    const { handleContextMenu } = serverTreeService;
    handleContextMenu(event, item);
  }, []);

  const toggleDirectory = useCallback((item: ServerCompositeTreeNode) => {
    if (item.expanded) {
      treeHandle.current?.collapseNode(item);
    } else {
      treeHandle.current?.expandNode(item);
    }
  }, []);

  const handleTwistierClick = useCallback((event: React.MouseEvent, item: ServerCompositeTreeNode | ServerTreeNode) => {
    if (ServerCompositeTreeNode.is(item)) {
      toggleDirectory(item);
    }
  }, []);

  const handleOuterClick = useCallback(() => {
    serverTreeService?.enactiveFocusedDecoration();
  }, []);

  const beforeFilterValueChange = useCallback(async () => {
    ////console.log('server-list.view--->展开所有')
    const { expandAll } = serverTreeService;
    await expandAll();
  }, [serverTreeService]);

  return (
    <div
      className='basic_tree'
      tabIndex={-1}
      ref={wrapperRef}
      onClick={handleOuterClick}
      // onContextMenu={handleOuterContextMenu}
    >
      {/*{renderContextMenu()}*/}
      {/*{model ? (*/}
      {/*    <RecycleTree*/}
      {/*        height={height}*/}
      {/*        width={width}*/}
      {/*        itemHeight={itemHeight}*/}
      {/*        model={model}*/}
      {/*        onReady={handleTreeReady}*/}
      {/*        className={cls(containerClassname)}*/}
      {/*    >*/}
      {/*        {renderTreeNode}*/}
      {/*    </RecycleTree>*/}
      {/*) : null}*/}

      <ServerTreeView
        // isLoading={isLoading}
        // isReady={isReady}
        height={height}
        model={model}
        filterMode={filterMode}
        //locationToCurrentFile={locationToCurrentFile}
        beforeFilterValueChange={beforeFilterValueChange}
        onTreeReady={handleTreeReady}
        onContextMenu={handleContextMenu}
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDbClick}
        onTwistierClick={handleTwistierClick}
      />
    </div>
  );
};

const FilterableRecycleTree = RecycleTreeFilterDecorator(RecycleTree);

export const ServerTreeView = memo(
  ({
    // isReady,
    // isLoading,
    model,
    filterMode,
    onTreeReady,
    beforeFilterValueChange,
    height,
    itemHeight = 22,
    itemClassname,
    indent,
    inlineMenus,
    inlineMenuActuator,
    onItemClick,
    onItemDoubleClick,
    onContextMenu,
    onTwistierClick,
  }: IServerRecycleTreeProps) => {
    const serverTreeService = useInjectable<ServerTreeService>(ServerTreeService);

    // 直接渲染节点不建议通过 Inline 的方式进行渲染
    // 否则每次更新时均会带来比较大的重绘成本
    // 参考：https://github.com/bvaughn/react-window/issues/413#issuecomment-848597993
    const renderTreeNode = useCallback((props: INodeRendererWrapProps) => {
      return (
        <ServerTreeNodeRenderer
          item={props.item as any}
          itemType={props.itemType}
          template={(props as any).template}
          itemHeight={itemHeight}
          indent={indent}
          className={itemClassname}
          inlineMenus={inlineMenus}
          inlineMenuActuator={inlineMenuActuator}
          //  isConnect={serverOpenRecentManager.isConnect((props.item as any).primary)}
          onClick={onItemClick}
          onDbClick={onItemDoubleClick}
          onContextMenu={onContextMenu}
          onTwistierClick={onTwistierClick}
          decorations={serverTreeService.decorations.getDecorations(props.item as ITreeNodeOrCompositeTreeNode)}
        />
      );
    }, []);

    if (model) {
      return (
        <>
          <FilterableRecycleTree
            height={height}
            itemHeight={itemHeight}
            onReady={onTreeReady}
            model={model}
            filterEnabled={filterMode}
            beforeFilterValueChange={beforeFilterValueChange}
            // filterAfterClear={locationToCurrentFile}
            filterAutoFocus={true}
            leaveBottomBlank={true}
          >
            {renderTreeNode}
          </FilterableRecycleTree>
        </>
      );
    } else {
      return <div>我应该制作成引导页面</div>;
    }
  },
);

ServerTreeView.displayName = 'ServerTreeView';
