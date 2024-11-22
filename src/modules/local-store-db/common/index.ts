import { ConnectQuery, OpenRecentInfo, ProductVersion, ServerCluster, ServerInfo } from './model.define';
import { ServerType } from '../../base/types/server-node.types';

export * from './model.define';

export const IServerServiceToken = Symbol('IServerServiceToken');
export const IClusterServiceToken = Symbol('IClusterServiceToken');
export const IOpenRecentServiceToken = Symbol('IOpenRecentServiceToken');
export const IProductVersionServiceToken = Symbol('IProductVersionServiceToken');
export const IServerDaoPath = 'IServerDaoPath';
export const IServerDaoToken = Symbol('IServerDaoToken');
export const IServerClusterDaoPath = 'IServerClusterDaoPath';
export const IServerClusterDaoToken = Symbol('IServerClusterDaoToken');
export const IOpenRecentDaoPath = 'IOpenRecentDaoPath';
export const IOpenRecentDaoToken = Symbol('IOpenRecentDaoToken');
export const IProductVersionDaoPath = 'IProductVersionDaoPath';
export const IProductVersionDaoToken = Symbol('IProductVersionDaoToken');

export interface IServerService {
  delete(id: string): Promise<boolean>;

  save(serverInfo: ServerInfo): Promise<void>;

  updateById(id: string, serverInfo: Partial<ServerInfo>): Promise<void>;

  countByWhereParam(whereParam: Partial<ServerInfo>): Promise<number>;

  findById(id: string, initPassword?: boolean): Promise<ServerInfo>;

  findConnectById(id: string): Promise<ConnectQuery>;

  findByIds(ids: string[]): Promise<ServerInfo[]>;

  findAll(): Promise<ServerInfo[]>;

  findByType(type: ServerType): Promise<ServerInfo[]>;

  findRecentOpen(): Promise<ServerInfo[]>;

  findByWorkspaceAndServerType(workspace: string, serverType: ServerType[]): Promise<ServerInfo[]>;
}

export interface IClusterService {
  save(serverCluster: ServerCluster): Promise<void>;

  multiSave(serverClusters: ServerCluster[]): Promise<void>;

  updateById(id: string, serverCluster: Partial<ServerCluster>);

  delete(id: string): Promise<void>;

  deleteByIds(ids: string[]): Promise<void>;

  deleteByServerId(serverId: string): Promise<void>;

  countByWhereParam(whereParam: Partial<ServerCluster>): Promise<number>;

  findById(id: string): Promise<ServerCluster>;

  findByServerId(serverId: string): Promise<ServerCluster[]>;

  findByIds(ids: string[]): Promise<ServerCluster[]>;
}

export interface IOpenRecentService {
  addConnectToOpenRecent(serverInfo: ServerInfo): Promise<OpenRecentInfo | null>;

  updateOpenTime(serverId: string, openRecentId?: string);

  autoSort(targetId: string, containerId: string);

  delete(openRecentId: string);

  deleteByServerId(serverId: string);
}

export interface IProductVersionService {

  ignoreVersion(version: string): void;

}

export interface IServerDao {
  /**
   * 测试代码
   * @param dbPath
   */
  testConnect(serverInfo: ServerInfo): Promise<boolean>;

  save(serverInfo: ServerInfo): Promise<void>;

  updateById(id: string, serverInfo: Partial<ServerInfo>);

  delete(id: string): Promise<void>;

  countByWhereParam(whereParam: Partial<ServerInfo>): Promise<number>;

  findById(id: string): Promise<ServerInfo>;

  findByIds(ids: string[]): Promise<ServerInfo[]>;

  findRecentOpen(): Promise<ServerInfo[]>;

  findAll(): Promise<ServerInfo[]>;

  findByType(type: ServerType): Promise<ServerInfo[]>;

  findByWorkspaceAndServerType(serverId: string[], serverType: ServerType[]): Promise<ServerInfo[]>;
}

export interface IServerClusterDao {
  save(serverCluster: ServerCluster): Promise<void>;

  multiSave(serverClusters: ServerCluster[]): Promise<void>;

  updateById(id: string, serverCluster: Partial<ServerCluster>): Promise<void>;

  delete(id: string): Promise<void>;

  deleteByIds(ids: string[]): Promise<void>;

  deleteByServerId(serverId: string): Promise<void>;

  countByWhereParam(whereParam: Partial<ServerCluster>): Promise<number>;

  findById(id: string): Promise<ServerCluster>;

  findByServerId(serverId: string): Promise<ServerCluster[]>;

  findByIds(ids: string[]): Promise<ServerCluster[]>;
}

export interface IOpenRecentDao {
  findById(id: string): Promise<OpenRecentInfo>;

  findByWorkspace(workspace: string): Promise<OpenRecentInfo[]>;

  countByWorkspace(workspace: string): Promise<number>;

  findByWorkspaceAndServerId(workspace: string, serverId: string): Promise<OpenRecentInfo>;

  findBySortNo(workspace: string, sortNo: number): Promise<OpenRecentInfo>;

  findBySortNoRange(workspace: string, maxNo: number, minNo): Promise<OpenRecentInfo[]>;

  setItem(info: OpenRecentInfo): Promise<void>;

  updateById(recentId: string, updateData: Partial<OpenRecentInfo>);

  delete(id: string): Promise<void>;

  deleteByServerId(serverId: string): Promise<void>;
}

export interface IProductVersionDao {

  findByVersion(version: string): Promise<ProductVersion>;

  checkVersionExpire(latestVersion: string): Promise<boolean>;

  save(pv: ProductVersion): Promise<void>;
}
