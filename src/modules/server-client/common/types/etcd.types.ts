import { IKeyPathInfo, IQueryResult } from '../index';
import { ConnectQuery } from '../../../local-store-db/common';
import { StrKeyObject } from '../../../base/model/common.model';

export const IEtcdServiceToken = Symbol('IEtcdServiceToken');

export const IEtcdClientServicePath = 'IEtcdClientServicePath';

export interface IEtcdDataInfo {
  key?: string;
  value?: string;
  create_revision?: string;
  mod_revision?: string;
  version?: string;
  lease?: string;
}

export type EtcdPermission = 'Read' | 'Write' | 'Readwrite';

export interface IEtcdAddPermission {
  key: string;
  permission: EtcdPermission;
}

//{"peerURLs":["http://localhost:2380"],"clientURLs":["http://127.0.0.1:2379"],"ID":"10276657743932975437","name":"default","isLearner":false}],
export interface IEtcdMember {
  peerURLs: string;
  clientURLs: string;
  ID: string;
  name: string;
  isLearner: boolean;
}

export interface IEtcdServiceClient {
  closeConnection(connect: ConnectQuery): Promise<boolean>;

  ping(connect: ConnectQuery): Promise<IQueryResult>;

  showKeys(connect: ConnectQuery, prefix?: string): Promise<IQueryResult<IKeyPathInfo[]>>;

  keyData(connect: ConnectQuery, key: string): Promise<IQueryResult<IEtcdDataInfo>>;

  keyValue(connect: ConnectQuery, key: string): Promise<IQueryResult<string>>;

  addOrUpdateKeyValue(connect: ConnectQuery, key: string, value: string): Promise<IQueryResult<string>>;

  deleteKey(connect: ConnectQuery, keys: string): Promise<IQueryResult>;

  deleteKeys(connect: ConnectQuery, keys: string[]): Promise<IQueryResult>;

  deleteByKeyPrefix(connect: ConnectQuery, keyPrefix: string): Promise<IQueryResult>;

  putKeyValue(connect: ConnectQuery, key: string, value: string, ttlInSeconds?: number): Promise<IQueryResult<string>>;

  showUsersInfo(connect: ConnectQuery): Promise<IQueryResult<StrKeyObject[]>>;

  showUsers(connect: ConnectQuery): Promise<IQueryResult<string[]>>;

  deleteUser(connect: ConnectQuery, user: string): Promise<IQueryResult>;

  deleteUsers(connect: ConnectQuery, users: string[]): Promise<IQueryResult>;

  addUser(connect: ConnectQuery, user: string, password: string): Promise<IQueryResult>;

  userAddRole(connect: ConnectQuery, user: string, roles: string[]): Promise<IQueryResult>;

  showRolesInfo(connect: ConnectQuery): Promise<IQueryResult<StrKeyObject[]>>;

  showRoles(connect: ConnectQuery): Promise<IQueryResult<string[]>>;

  deleteRole(connect: ConnectQuery, role: string): Promise<IQueryResult>;

  deleteRoles(connect: ConnectQuery, roles: string[]): Promise<IQueryResult>;

  addRole(connect: ConnectQuery, user: string): Promise<IQueryResult>;

  roleAddPermission(connect: ConnectQuery, role: string, permissions: IEtcdAddPermission[]): Promise<IQueryResult>;

  showCluster(connect: ConnectQuery): Promise<IQueryResult<IEtcdMember[]>>;
}
