import { Autowired, Injectable } from '@opensumi/di';
import { IKeyPathInfo, IKeyResult, IQueryResult } from '../../common';
import { ConnectQuery } from '../../../local-store-db/common';
import {
  IEtcdAddPermission,
  IEtcdClientServicePath,
  IEtcdDataInfo,
  IEtcdMember,
  IEtcdServiceClient,
} from '../../common/types/etcd.types';
import { SubNodeType } from '../../../base/types/server-node.types';
import { StrKeyObject } from '../../../base/model/common.model';

@Injectable()
export class EtcdService {
  @Autowired(IEtcdClientServicePath)
  private etcdClientService: IEtcdServiceClient;

  ping(connect: ConnectQuery): Promise<IQueryResult> {
    return this.etcdClientService.ping(connect);
  }

  async closeConnection(connect: ConnectQuery): Promise<boolean> {
    await this.etcdClientService.closeConnection(connect);
    return true;
  }

  async runCommand(connect: ConnectQuery, command: string): Promise<IKeyResult> {
    return null;
  }

  public async showKeys(connect: ConnectQuery, prefix: string = ''): Promise<IQueryResult<IKeyPathInfo[]>> {
    return this.etcdClientService.showKeys(connect, prefix);
  }

  async keyDataInfo(connect: ConnectQuery, key: string): Promise<IQueryResult<IEtcdDataInfo>> {
    return this.etcdClientService.keyData(connect, key);
  }

  async keyValue(connect: ConnectQuery, key: string): Promise<IQueryResult<string>> {
    return this.etcdClientService.keyValue(connect, key);
  }

  async addOrUpdateKeyValue(connect: ConnectQuery, key: string, value: string): Promise<IQueryResult<string>> {
    return this.etcdClientService.addOrUpdateKeyValue(connect, key, value);
  }

  async deleteKeys(connect: ConnectQuery, keys: string[]): Promise<IQueryResult> {
    return this.etcdClientService.deleteKeys(connect, keys);
  }

  async deleteByKeyPrefix(connect: ConnectQuery, keyPrefix: string): Promise<IQueryResult> {
    return this.etcdClientService.deleteByKeyPrefix(connect, keyPrefix);
  }

  async deleteByType(connect: ConnectQuery, type: SubNodeType, key: string): Promise<IQueryResult> {
    switch (type) {
      case 'dic':
        return this.deleteByKeyPrefix(connect, key);
      case 'key':
        return this.deleteKey(connect, key);
      case 'user':
        return this.deleteUser(connect,key)
      case 'role':
        return this.deleteRole(connect,key)
      case 'member':

      case 'lease':
    }
    return null;
  }

  async deleteKey(connect: ConnectQuery, key: string): Promise<IQueryResult<string>> {
    return this.etcdClientService.deleteKey(connect, key);
  }

  async putKeyValue(
    connect: ConnectQuery,
    key: string,
    value: string,
    ttlInSeconds?: number,
  ): Promise<IQueryResult<string>> {
    return this.etcdClientService.putKeyValue(connect, key, value);
  }

  showUsersInfo(connect: ConnectQuery): Promise<IQueryResult<StrKeyObject[]>> {
    return this.etcdClientService.showUsersInfo(connect);
  }

  showUsers(connect: ConnectQuery): Promise<IQueryResult<string[]>> {
    return this.etcdClientService.showUsers(connect);
  }

  deleteUser(connect: ConnectQuery, user: string): Promise<IQueryResult> {
    return this.etcdClientService.deleteUser(connect, user);
  }

  deleteUsers(connect: ConnectQuery, users: string[]): Promise<IQueryResult> {
    return this.etcdClientService.deleteUsers(connect, users);
  }

  addUser(connect: ConnectQuery, user: string, password: string): Promise<IQueryResult> {
    return this.etcdClientService.addUser(connect, user, password);
  }

  userAddRole(connect: ConnectQuery, user: string, roles: string[]): Promise<IQueryResult> {
    return this.etcdClientService.userAddRole(connect, user, roles);
  }

  showRolesInfo(connect: ConnectQuery): Promise<IQueryResult<StrKeyObject[]>> {
    return this.etcdClientService.showRolesInfo(connect);
  }

  showRoles(connect: ConnectQuery): Promise<IQueryResult<string[]>> {
    return this.etcdClientService.showRoles(connect);
  }

  deleteRole(connect: ConnectQuery, role: string): Promise<IQueryResult> {
    return this.etcdClientService.deleteRole(connect, role);
  }

  deleteRoles(connect: ConnectQuery, roles: string[]): Promise<IQueryResult> {
    return this.etcdClientService.deleteRoles(connect, roles);
  }

  addRole(connect: ConnectQuery, role: string): Promise<IQueryResult> {
    return this.etcdClientService.addRole(connect, role);
  }

  roleAddPermission(connect: ConnectQuery, role: string, permissions: IEtcdAddPermission[]): Promise<IQueryResult> {
    return this.etcdClientService.roleAddPermission(connect, role, permissions);
  }

  showCluster(connect: ConnectQuery): Promise<IQueryResult<IEtcdMember[]>> {
    return this.etcdClientService.showCluster(connect);
  }
}
