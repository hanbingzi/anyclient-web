import {
  ClasslistComposite,
  INodeRendererProps,
  IRecycleTreeFilterHandle,
  ITreeNodeOrCompositeTreeNode,
  TreeModel,
} from '../../components/recycle-tree';
import { ServerCompositeTreeNode, ServerTreeNode } from './tree-node.define';
import { IServerTreeNode } from '../../base/model/server-tree-node.model';
import React from 'react';

export enum IBasicInlineMenuPosition {
  TREE_NODE = 1,
  TREE_CONTAINER,
}

export interface IBasicInlineMenu {
  /**
   * 默认图标，可以使用框架内置的图标集
   * 也可以传入自定义的 ClassName
   */
  icon: string;
  /**
   * 菜单文本
   */
  title: string;
  /**
   * 点击菜单执行的命令
   */
  command: string;
  /**
   * 行内菜单的位置
   * TREE_NODE 代表子节点
   * TREE_CONTAINER 代表包含子节点的目录节点（菜单位于右侧）
   */
  position: IBasicInlineMenuPosition;
}

export type IBasicInlineMenuActuator = (node: ITreeNodeOrCompositeTreeNode, action: IBasicInlineMenu) => void;

export interface IBasicContextMenu {
  /**
   * 菜单文本
   */
  title: string;
  /**
   * 菜单唯一 ID
   */
  id: string;
  /**
   * 分组标识
   */
  group?: string;
}

/**
 * 这里的 ID 为命令传入的 ID
 */
export type IBasicContextMenuActuator = (node: ITreeNodeOrCompositeTreeNode, id: string) => void;

export interface IServerRecycleTreeProps {
  model?: TreeModel;

  isReady?: boolean;

  isLoading?: boolean;
  /**
   * Tree 容器高度
   */
  height: number;
  /**
   * Tree 容器宽度
   * 不传入时，默认自动撑开 100% 父节点宽度
   */
  width?: number;
  /**
   * 节点高度, 默认值为 22
   */
  itemHeight?: number;
  /**
   * 节点缩进，默认值为 8
   */
  indent?: number;
  /**
   * 追加的容器样式名，用于自定义更多样式
   */
  containerClassname?: string;
  /**
   * 追加的节点样式名，用于自定义更多样式
   */
  itemClassname?: string;

  filterMode: boolean;

  beforeFilterValueChange?: () => Promise<void>;

  locationToCurrentFile?: (location: string) => void;

  /**
   * 当组件渲染时提供了该方法时，组件展开前会尝试使用该方法去获取需要展示的节点
   */
  resolveChildren?: (node?: IServerTreeNode) => IServerTreeNode[] | null;
  /**
   * 排序函数
   */
  sortComparator?: (a: IServerTreeNode, b: IServerTreeNode) => number;
  /**
   * 单击事件
   */
  onItemClick?: (event: React.MouseEvent, node?: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 双击事件
   */
  onItemDoubleClick?: (event: React.MouseEvent, node?: ServerCompositeTreeNode | ServerTreeNode) => void;
  /**
   * 右键菜单事件
   */
  onContextMenu?: (event: React.MouseEvent, node?: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 箭头点击事件
   */
  onTwistierClick?: (event: React.MouseEvent, node: ITreeNodeOrCompositeTreeNode) => void;

  /**
   * 右键菜单定义，但传入了 `onContextMenu` 函数时将有限执行 `onContextMenu` 函数
   */
  contextMenus?: IBasicContextMenu[] | ((node: ITreeNodeOrCompositeTreeNode) => IBasicContextMenu[]);
  /**
   * 右键菜单点击的执行逻辑
   */
  contextMenuActuator?: IBasicContextMenuActuator;
  /**
   * 行内菜单定义
   */
  inlineMenus?: IBasicInlineMenu[] | ((node: ITreeNodeOrCompositeTreeNode) => IBasicInlineMenu[]);
  /**
   * 行内菜单点击的执行逻辑
   */
  inlineMenuActuator?: IBasicInlineMenuActuator;
  /**
   * 用于挂载 Tree 上的一些操作方法
   * 如：ensureVisible 等
   */
  // onReady?: (api: IRecycleTreeHandle) => void;

  onTreeReady?: (handle: IRecycleTreeFilterHandle) => void;
}

export interface IBasicNodeProps {
  /**
   * 节点高度
   */
  itemHeight?: number;
  /**
   * 追加样式
   */
  className?: string;
  /**
   * 节点缩进
   */
  indent?: number;

  /**
   * 是否处于连接状态
   */
  // isConnect?: boolean;
  /**
   * 节点装饰
   */
  decorations?: ClasslistComposite;
  /**
   * 单击事件
   */
  onClick?: (event: React.MouseEvent, node?: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 双击事件
   */
  onDbClick?: (event: React.MouseEvent, node?: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 右键菜单事件
   */
  onContextMenu?: (event: React.MouseEvent, node?: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 箭头点击事件
   */
  onTwistierClick?: (event: React.MouseEvent, node: ITreeNodeOrCompositeTreeNode) => void;
  /**
   * 右键菜单定义，但传入了 `onContextMenu` 函数时将优先执行 `onContextMenu` 函数
   */
  contextMenus?: IBasicContextMenu[] | ((node: ITreeNodeOrCompositeTreeNode) => IBasicContextMenu[]);
  /**
   * 右键菜单点击的执行逻辑
   */
  contextMenuActuator?: IBasicContextMenuActuator;
  /**
   * 行内菜单定义
   */
  inlineMenus?: IBasicInlineMenu[] | ((node: ITreeNodeOrCompositeTreeNode) => IBasicInlineMenu[]);
  /**
   * 行内菜单点击的执行逻辑
   */
  inlineMenuActuator?: IBasicInlineMenuActuator;

  template?: React.JSXElementConstructor<any>;
}

export type IBasicNodeRendererProps = INodeRendererProps & IBasicNodeProps;

export const DECORATIONS = {
  SELECTED: 'mod_selected',
  FOCUSED: 'mod_focused',
  ACTIVED: 'mod_actived',
  LOADING: 'mod_loading',
  CONNECT: 'mod_connect',
};
