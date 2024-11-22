import { CompositeTreeNode, ICompositeTreeNode, ITree, TreeNode } from '../../components/recycle-tree';
import { IServerTreeNode } from '../../base/model/server-tree-node.model';
import { ServerInfo } from '../../local-store-db/common/model.define';

export const BasicTreeRootName = 'BasicTreeRoot';

export class BasicTreeRoot extends CompositeTreeNode {
  // private _raw: IServerTreeNode;

  // constructor(tree: ITree, parent: ServerCompositeTreeNode | undefined, data: IServerTreeNode) {
  constructor(tree: ITree, parent: ServerCompositeTreeNode | undefined) {
    super(tree, parent);
    // this._raw = data;
  }

  get name() {
    // return `BasicTreeRoot_${this._uid}`;
    return BasicTreeRootName;
  }

  // get raw() {
  //     return this._raw;
  // }

  get expanded() {
    return true;
  }
}

export class ServerCompositeTreeNode extends CompositeTreeNode {
  private _displayName: string;
  private _whenReady: Promise<void>;
  private _raw: IServerTreeNode;

  constructor(
    tree: ITree,
    parent: ServerCompositeTreeNode | ICompositeTreeNode | undefined,
    data: IServerTreeNode,
    id?: number,
  ) {
    super(tree, parent, undefined, {}, { disableCache: true });
    // if (data.expanded) {
    //     this._whenReady = this.setExpanded();
    // }
    this._uid = id || this._uid;
    // 每个节点应该拥有自己独立的路径，不存在重复性
    // this.name = String(this._uid);

    this._displayName = data.displayName;
    this.name = data.nodeName;
    //this.serverType = data.serverType;
    this._raw = data;
    TreeNode.setTreeNode(this._uid, this.path, this);
  }

  get whenReady() {
    return this._whenReady;
  }

  get displayName() {
    return this._displayName;
  }

  get icon() {
    return this.raw.icon;
  }

  // get headIcon() {
  //     return this.raw.headIcon;
  // }

  get iconClassName() {
    return this.raw.iconClassName;
  }

  get description() {
    return this.raw.description;
  }

  get raw() {
    return this._raw;
  }

  get sort() {
    return this.raw.sort;
  }

  // get nodeType() {
  //     return this.raw.nodeType;
  // }

  get levelType() {
    return this.raw.levelType;
  }

  get serverType() {
    return this.raw.serverType;
  }

  get primaryId() {
    return this.raw.primaryId;
  }

  get nodeStat() {
    return this.raw.nodeStat;
  }

  get info() {
    return this.raw.serverInfo;
  }

  get key() {
    return this.raw.key;
  }

  private updateName(name: string) {
    if (this.name !== name) {
      TreeNode.removeTreeNode(this._uid, this.path);
      this.name = name;
      // 更新name后需要重设节点路径索引
      TreeNode.setTreeNode(this._uid, this.path, this);
    }
  }

  updateMetaData(meta: { label: string; info?: ServerInfo }) {
    this._displayName = meta.label;
    this._raw.nodeName = meta.label;
    this._raw.serverInfo = meta.info;
    this.updateName(meta.label);
  }

  get expandable() {
    // return this._raw.expandable ? !!this._raw.expandable :
    //     (this._raw.children && this._raw.children.length > 0) ? true : false;
    // return !!this._raw.expandable;
    return this._raw.children && this._raw.children.length > 0
      ? true
      : this.children && this.children.length > 0
      ? true
      : false;
  }
}

export class ServerTreeNode extends TreeNode {
  private _displayName: string;
  private _raw: IServerTreeNode;

  constructor(tree: ITree, parent: ServerCompositeTreeNode | undefined, data: IServerTreeNode, id?: number) {
    super(tree, parent, undefined, {}, { disableCache: true });
    this._uid = id || this._uid;
    // 每个节点应该拥有自己独立的路径，不存在重复性
    // this.name = String(this._uid);
    this._displayName = data.nodeName;
    this.name = data.nodeName;
    this._raw = data;
    TreeNode.setTreeNode(this._uid, this.path, this);
  }

  get displayName() {
    return this._displayName;
  }

  get description() {
    return this.raw.description;
  }

  get icon() {
    return this.raw.icon;
  }

  get iconClassName() {
    return this.raw.iconClassName;
  }

  get raw() {
    return this._raw;
  }

  get key() {
    return this.raw.key;
  }

  get sort() {
    return this.raw.sort;
  }

  // get headIcon() {
  //     return this.raw.headIcon;
  // }

  get info() {
    return this.raw.serverInfo;
  }

  // get nodeType() {
  //     return this.raw.nodeType;
  // }

  get levelType() {
    return this.raw.levelType;
  }

  get serverType() {
    return this.raw.serverType;
  }

  get primaryId() {
    return this.raw.primaryId;
  }

  get nodeStat() {
    return this.raw.nodeStat;
  }

  private updateName(name: string) {
    if (this.name !== name) {
      TreeNode.removeTreeNode(this._uid, this.path);
      this.name = name;
      // 更新name后需要重设节点路径索引
      TreeNode.setTreeNode(this._uid, this.path, this);
    }
  }

  updateMetaData(meta: { label: string; info?: ServerInfo }) {
    this._displayName = meta.label;
    this._raw.nodeName = meta.label;
    this._raw.serverInfo = meta.info;
    this.updateName(meta.label);
  }
}
