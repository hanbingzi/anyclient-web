// import { TreeNode, ICompositeTreeNode, CompositeTreeNode, ITree } from '@opensumi/ide-components';
import { URI } from '@opensumi/ide-core-browser';
import { FileStat } from '@opensumi/ide-file-service';
import { IConnectTreeService } from './index';
import { CompositeTreeNode, ICompositeTreeNode, ITree, TreeNode } from '../../components/recycle-tree';
import { IServerTreeNode, LevelType, NodeStat } from '../../base/model/server-tree-node.model';
import { AllNodeType, ServerType } from '../../base/types/server-node.types';
import { ServerInfo } from '../../local-store-db/common/model.define';
import { isNotNull, isNull } from '../../base/utils/object-util';

export class ServerNode extends CompositeTreeNode {
  /** redis例子：
   * dispalyName:db1(10) , nodeName:db1 ,nodeValue:1，
   */
  private _displayName: string;
  private _nodeName: string;
  // 跟name重复
  private _nodeValue?: string | number;
  private fileTreeService: IConnectTreeService;
  private _serverType?: ServerType;
  private _levelType?: LevelType;
  private _nodeStat?: NodeStat;
  private _nodeType?: AllNodeType;
  private _primaryId?: string;
  private _openRecentId?: string;
  private _serverInfo?: ServerInfo;
  // private _headIcon: ReactNode;
  private _sort?: number;
  //private _serverTreeNode?:IServerTreeNode;

  constructor(
    tree: IConnectTreeService,
    parent: ICompositeTreeNode | undefined,
    public uri: URI = new URI(''),
    name = '',
    public filestat: FileStat = { children: [], isDirectory: true, uri: '', lastModification: 0 },
    public serverTreeNode: IServerTreeNode | undefined,
    public tooltip?: string,
    id?: number,
  ) {
    super(tree as ITree, parent, undefined, { name }, { disableCache: true });
    if (!parent) {
      // 根节点默认展开节点
      this.setExpanded();
    }
    this.fileTreeService = tree;
    this._uid = id || this._uid;
    TreeNode.setTreeNode(this._uid, this.path, this);
    serverTreeNode && this.initServerData(serverTreeNode);
  }

  initServerData(serverTreeNode: IServerTreeNode) {
    //this._serverTreeNode = serverTreeNode;
    this._displayName = serverTreeNode.displayName;
    this._nodeName = serverTreeNode.nodeName;
    this._nodeValue = serverTreeNode.nodeValue;
    this._serverType = serverTreeNode.serverType;
    this._levelType = serverTreeNode.levelType;
    this._nodeStat = serverTreeNode.nodeStat;
    this._nodeType = serverTreeNode.nodeType;
    this._primaryId = serverTreeNode.primaryId;
    this._serverInfo = serverTreeNode.serverInfo;
    //  this._headIcon = serverNode.headIcon
    this._sort = serverTreeNode.sort;
    this._openRecentId = serverTreeNode.openRecentId;
  }
  // get serverTreeNode(){
  //   return this._serverTreeNode;
  // }

  get displayName() {
    return this._displayName || this.name;
  }

  get nodeName() {
    return this._nodeName;
  }

  get nodeValue() {
    return this._nodeValue;
  }

  get serverType(): ServerType | undefined {
    return this._serverType;
  }

  get levelType(): LevelType | undefined {
    return this._levelType;
  }

  get nodeStat(): NodeStat | undefined {
    return this._nodeStat;
  }

  get nodeType(): AllNodeType | undefined {
    return this._nodeType;
  }

  get primaryId(): string | undefined {
    return this._primaryId;
  }

  get openRecentId(): string | undefined {
    return this._openRecentId;
  }

  get sort(): number | undefined {
    return this._sort;
  }

  get dbName(): string | number {
    const db = this.serverTreeNode!.db;
    if (isNotNull(db)) {
      return db!;
    }
    return '';
    // let parent: ServerNode = this.parent as ServerNode;
    // while (true) {
    //   if (!parent) {
    //     break;
    //   }
    //   if (parent.nodeType === 'db' || parent.nodeType === 'redisDb') {
    //     return parent.nodeName;
    //   }
    //   parent = parent.parent as ServerNode;
    // }
  }

  // get info(): ServerInfo {
  //   if (!this._info) {
  //     if (this.parent instanceof ServerNode) {
  //       return this.parent.info;
  //     } else {
  //       return null;
  //     }
  //   }
  //   return this._info;
  // }

  get serverInfo(): ServerInfo | undefined {
    return this._serverInfo;
  }

  getServerInfo(): ServerInfo | undefined | null {
    if (this.levelType === 'server') {
      return this.serverInfo;
    }
    let parentNode = this.parent as ServerNode;
    while (true) {
      if (parentNode.levelType === 'server') {
        return parentNode.serverInfo;
      }
      parentNode = parentNode.parent as ServerNode;
      if (!parentNode) {
        return null;
      }
    }
    //  return null;
  }

  // get headIcon() {
  //   return this._headIcon;
  // }

  private updateName(name: string) {
    if (this.name !== name) {
      TreeNode.removeTreeNode(this._uid, this.path);
      this.name = name;
      // 更新name后需要重设节点路径索引
      TreeNode.setTreeNode(this._uid, this.path, this);
    }
  }

  private updateDisplayName(name: string) {
    this._displayName = name;
  }

  private updateURI(uri: URI) {
    this.uri = uri;
  }

  private updateServerTreeNode(serverTreeNode: IServerTreeNode) {
    this.serverTreeNode = serverTreeNode;
  }

  private updateToolTip(tooltip: string) {
    this.tooltip = tooltip;
  }

  updateNodeStat(stat: NodeStat) {
    this._nodeStat = stat;
    if (this.serverTreeNode) this.serverTreeNode.nodeStat = stat;
  }

  private updateFileStat(filestat: FileStat) {
    this.filestat = filestat;
  }

  updateSort(sort: number) {
    this._sort = sort;
    if (this.serverTreeNode) {
      this.serverTreeNode.sort = sort;
    }
  }

  updateMetaData(meta: {
    serverTreeNode?: IServerTreeNode;
    fileStat?: FileStat;
    tooltip?: string;
    name?: string;
    displayName?: string;
    uri?: URI;
  }) {
    const { serverTreeNode, fileStat, tooltip, name, displayName, uri } = meta;
    displayName && this.updateDisplayName(displayName);
    name && this.updateName(name);
    serverTreeNode && this.updateServerTreeNode(serverTreeNode);
    fileStat && this.updateFileStat(fileStat);
    uri && this.updateURI(uri);
    tooltip && this.updateToolTip(tooltip);
  }

  dispose() {
    super.dispose();
    this.fileTreeService.removeNodeCacheByPath(this.path);
  }
}

export class ServerEntity extends TreeNode {
  private fileTreeService: IConnectTreeService;
  private _displayName: string;
  private _nodeName: string;
  private _nodeValue?: string | number;
  private _serverType?: ServerType;
  private _levelType?: LevelType;
  private _nodeStat?: NodeStat;
  private _nodeType?: AllNodeType;
  private _primaryId?: string;
  private _serverInfo?: ServerInfo;
  // private _headIcon: ReactNode;
  // private _raw:IServerTreeNode;
  public uri: URI = new URI('');

  constructor(
    tree: IConnectTreeService,
    parent: CompositeTreeNode | undefined,
    // public uri: URI = new URI(''),
    name = '',
    public serverTreeNode: IServerTreeNode, // FileStat = {children: [], isDirectory: false, uri: '', lastModification: 0},
    public tooltip?: string,
    id?: number,
  ) {
    super(tree as ITree, parent, undefined, { name }, { disableCache: true });
    this.fileTreeService = tree;
    this._uid = id || this._uid;
    TreeNode.setTreeNode(this._uid, this.path, this);
    this.initServerData(serverTreeNode);
  }

  initServerData(serverNode: IServerTreeNode) {
    this._displayName = serverNode.displayName;
    this._nodeName = serverNode.nodeName;
    this._nodeValue = serverNode.nodeValue;
    this._serverType = serverNode.serverType;
    this._levelType = serverNode.levelType;
    this._nodeStat = serverNode.nodeStat;
    this._nodeType = serverNode.nodeType;
    this._primaryId = serverNode.primaryId;
    // this._headIcon = serverNode.headIcon;
    if (serverNode.serverInfo) {
      this._serverInfo = serverNode.serverInfo;
    }
  }

  get displayName() {
    return this._displayName || this.name;
  }

  get nodeName() {
    return this._nodeName;
  }

  get nodeValue() {
    return this._nodeValue;
  }

  get serverType(): ServerType | undefined {
    return this._serverType;
  }

  get levelType(): LevelType | undefined {
    return this._levelType;
  }

  get nodeStat(): NodeStat | undefined {
    return this._nodeStat;
  }

  get nodeType(): AllNodeType | undefined {
    return this._nodeType;
  }

  get primaryId(): string | undefined {
    return this._primaryId;
  }

  get dbName(): string | number {
    const db = this.serverTreeNode.db;
    if (isNotNull(db)) {
      return db!;
    }
    return '';
  }

  get serverInfo(): ServerInfo | undefined {
    return this._serverInfo;
  }

  getServerInfo(): ServerInfo | undefined | null {
    if (this.levelType === 'server') {
      return this.serverInfo;
    }
    let parentNode = this.parent as ServerNode;
    while (true) {
      if (parentNode.levelType === 'server') {
        return parentNode.serverInfo;
      }
      parentNode = parentNode.parent as ServerNode;
      if (!parentNode) {
        return null;
      }
    }
    return null;
  }

  // get headIcon() {
  //   return this._headIcon;
  // }

  private updateName(name: string) {
    if (this.name !== name) {
      TreeNode.removeTreeNode(this._uid, this.path);
      this.name = name;
      // 更新name后需要重设节点路径索引
      TreeNode.setTreeNode(this._uid, this.path, this);
    }
  }

  private updateDisplayName(name: string) {
    this._displayName = name;
  }

  // private updateURI(uri: URI) {
  //     this.uri = uri;
  // }

  private updateServerTreeNode(serverNode: IServerTreeNode) {
    this.serverTreeNode = serverNode;
  }

  private updateToolTip(tooltip: string) {
    this.tooltip = tooltip;
  }

  updateMetaData(meta: { serverNode?: IServerTreeNode; tooltip?: string; name?: string; displayName?: string }) {
    const { serverNode, tooltip, name, displayName } = meta;
    displayName && this.updateDisplayName(displayName);
    name && this.updateName(name);
    serverNode && this.updateServerTreeNode(serverNode);
    //  uri && this.updateURI(uri);
    tooltip && this.updateToolTip(tooltip);
  }

  dispose() {
    super.dispose();
    this.fileTreeService.removeNodeCacheByPath(this.path);
  }
}

// export class Directory extends CompositeTreeNode {
//   private fileTreeService: IConnectTreeService;
//   private _displayName: string;
//   private _levelType?: LevelType;
//
//   constructor(
//     tree: IConnectTreeService,
//     parent: ICompositeTreeNode | undefined,
//     public uri: URI = new URI(''),
//     name = '',
//     public filestat: FileStat = {children: [], isDirectory: true, uri: '', lastModification: 0},
//     public tooltip: string,
//     id?: number,
//   ) {
//     super(tree as ITree, parent, undefined, {name}, {disableCache: true});
//     if (!parent) {
//       // 根节点默认展开节点
//       this.setExpanded();
//     }
//     this.fileTreeService = tree;
//     this._uid = id || this._uid;
//     this._levelType = 'directory'
//     TreeNode.setTreeNode(this._uid, this.path, this);
//   }
//
//   get displayName() {
//     return this._displayName || this.name;
//   }
//
//   get levelType(): LevelType {
//     return this._levelType;
//   }
//
//   private updateName(name: string) {
//     if (this.name !== name) {
//       TreeNode.removeTreeNode(this._uid, this.path);
//       this.name = name;
//       // 更新name后需要重设节点路径索引
//       TreeNode.setTreeNode(this._uid, this.path, this);
//     }
//   }
//
//   private updateDisplayName(name: string) {
//     this._displayName = name;
//   }
//
//   private updateURI(uri: URI) {
//     this.uri = uri;
//   }
//
//   private updateFileStat(filestat: FileStat) {
//     this.filestat = filestat;
//   }
//
//   private updateToolTip(tooltip: string) {
//     this.tooltip = tooltip;
//   }
//
//   updateMetaData(meta: { fileStat?: FileStat; tooltip?: string; name?: string; displayName?: string; uri?: URI }) {
//     const {fileStat, tooltip, name, displayName, uri} = meta;
//     displayName && this.updateDisplayName(displayName);
//     name && this.updateName(name);
//     fileStat && this.updateFileStat(fileStat);
//     uri && this.updateURI(uri);
//     tooltip && this.updateToolTip(tooltip);
//   }
//
//   dispose() {
//     super.dispose();
//     this.fileTreeService.removeNodeCacheByPath(this.path);
//   }
// }
//
// export class File extends TreeNode {
//   private fileTreeService: IConnectTreeService;
//   private _displayName: string;
//   private _levelType?: LevelType;
//
//   constructor(
//     tree: IConnectTreeService,
//     parent: CompositeTreeNode | undefined,
//     public uri: URI = new URI(''),
//     name = '',
//     public filestat: FileStat = {children: [], isDirectory: false, uri: '', lastModification: 0},
//     public tooltip: string,
//     id?: number,
//     public info?: ServerInfo
//   ) {
//     super(tree as ITree, parent, undefined, {name}, {disableCache: true});
//     this.fileTreeService = tree;
//     this._uid = id || this._uid;
//     this._levelType = 'file'
//     TreeNode.setTreeNode(this._uid, this.path, this);
//   }
//
//   get displayName() {
//     return this._displayName || this.name;
//   }
//
//   get levelType(): LevelType {
//     return this._levelType;
//   }
//
//
//   private updateName(name: string) {
//     if (this.name !== name) {
//       TreeNode.removeTreeNode(this._uid, this.path);
//       this.name = name;
//       // 更新name后需要重设节点路径索引
//       TreeNode.setTreeNode(this._uid, this.path, this);
//     }
//   }
//
//   private updateDisplayName(name: string) {
//     this._displayName = name;
//   }
//
//   private updateURI(uri: URI) {
//     this.uri = uri;
//   }
//
//   private updateFileStat(filestat: FileStat) {
//     this.filestat = filestat;
//   }
//
//   private updateToolTip(tooltip: string) {
//     this.tooltip = tooltip;
//   }
//
//   updateMetaData(meta: { fileStat?: FileStat; tooltip?: string; name?: string; displayName?: string; uri?: URI }) {
//     const {fileStat, tooltip, name, displayName, uri} = meta;
//     displayName && this.updateDisplayName(displayName);
//     name && this.updateName(name);
//     fileStat && this.updateFileStat(fileStat);
//     uri && this.updateURI(uri);
//     tooltip && this.updateToolTip(tooltip);
//   }
//
//   dispose() {
//     super.dispose();
//     this.fileTreeService.removeNodeCacheByPath(this.path);
//   }
// }

export type AllServerNodeType = ServerNode | ServerEntity; // | Directory | File;
