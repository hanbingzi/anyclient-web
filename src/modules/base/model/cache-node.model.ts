import { AllNodeType, ServerType } from '../types/server-node.types';
import { ServerInfo } from '../../local-store-db/common';
import { ServerIconFinder } from '../config/server-icon.config';

export class BaseNode {
  name: string;
  value: string | number;
  description?: string;
  serverType: ServerType;
  nodeType: AllNodeType;
  /**
   * 是否已经将children缓存，children已经被缓存了，但仍然可能为空，比如有的库下一张表都没有
   * 使用children判断是否缓存过存在问题，比如本来下面就没有表，
   * 如果使用children判断，读取表期间，会每次都去数据库查询库下面的表
   */
  private cache: boolean;
  private _children?: Map<string | AllNodeType, BaseNode> | null;

  constructor(
    name: string,
    value: string,
    description: string | undefined,
    serverType: ServerType,
    nodeType: AllNodeType,
  ) {
    this.name = name;
    this.value = value;
    this.description = description;
    this.serverType = serverType;
    this.nodeType = nodeType;
    this._children = new Map();
  }

  public setChildren(children?: BaseNode[]) {
    if (children && children.length > 0) {
      children.map((item) => {
        this._children?.set(item.name, item);
      });
    }
    this.cache = true;
  }

  public addChildren(name: string, node: BaseNode) {
    this._children?.set(name, node);
    if (!this.cache) {
      this.cache = true;
    }
  }

  public getChildrenFlat(): BaseNode[] {
    let childrenFlat: BaseNode[] = [];
    if (this._children) {
      this._children.forEach((value, key) => {
        childrenFlat.push(value);
      });
    }
    return childrenFlat;
  }

  public clearChildren() {
    this._children = null;
    this.cache = false;
  }

  public get children() {
    return this._children;
  }

  public get isCache() {
    return this.cache;
  }
}

export class ServerNode extends BaseNode {
  serverInfo: ServerInfo;
  iconBase64: string;

  constructor(serverInfo: ServerInfo) {
    super(serverInfo.serverName!, serverInfo.serverName!, serverInfo.serverName!, serverInfo.serverType!, 'server');
    this.serverInfo = serverInfo;
    this.iconBase64 = ServerIconFinder.getServerIconBase64(serverInfo.serverType!, 'server');
  }
}

export class DbNode extends BaseNode {
  iconBase64: string;
  serverType: ServerType;

  constructor(name: string, value: string, description: string, serverType: ServerType, nodeType: AllNodeType) {
    super(name, value, description, serverType, nodeType);
    this.serverType = serverType;
    this.iconBase64 = ServerIconFinder.getServerIconBase64(serverType, nodeType);
  }
}

/**
 * 今天心烦意燥，写不进去代码
 */
export interface IClearParam {
  serverType: ServerType;
  serverName: string;
  dbName?: string;
}
