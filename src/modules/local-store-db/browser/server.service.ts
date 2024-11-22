import {
  ConnectQuery,
  IClusterService,
  IClusterServiceToken,
  IOpenRecentDao,
  IOpenRecentDaoPath,
  IServerDao,
  IServerDaoPath,
  IServerService,
  ServerInfo,
} from '../common';
import { Autowired, Injectable } from '@opensumi/di';
import { ClusterType, ServerType } from '../../base/types/server-node.types';
import { PasswordStore } from './password-store';

@Injectable()
export class ServerService implements IServerService {
  @Autowired(IServerDaoPath)
  protected readonly serverDao: IServerDao;

  @Autowired(IClusterServiceToken)
  protected readonly clusterService: IClusterService;

  @Autowired(IOpenRecentDaoPath)
  protected readonly openRecentDao: IOpenRecentDao;

  async save(serverInfo: ServerInfo) {
    await this.serverDao.save(serverInfo);
  }

  async updateById(id: string, serverInfo: Partial<ServerInfo>) {
    await this.serverDao.updateById(id, serverInfo);
  }

  async delete(id: string) {
    await this.serverDao.delete(id);
    return true;
  }

  async countByWhereParam(whereParam: Partial<ServerInfo>): Promise<number> {
    return this.serverDao.countByWhereParam(whereParam);
  }

  async findById(id: string, initPassword: boolean = false): Promise<ServerInfo> {
    const server = await this.serverDao.findById(id);
    if(initPassword && !server.rememberMe){
      server.password = PasswordStore.getPassword(server.serverId);
    }
    return server
  }

  async findByIds(ids: string[]): Promise<ServerInfo[]> {
    return this.serverDao.findByIds(ids);
  }

  async findRecentOpen(): Promise<ServerInfo[]> {
    return this.serverDao.findRecentOpen();
  }

  async findConnectById(id: string): Promise<ConnectQuery> {
    const server = await this.findById(id);
    if (server.connectionType && ClusterType.includes(server.connectionType)) {
      const cluster = await this.clusterService.findByServerId(id);
      return { server, cluster };
    }
    return { server };
  }

  async findAll(): Promise<ServerInfo[]> {
    return this.serverDao.findAll();
  }

  async findByType(type: ServerType): Promise<ServerInfo[]> {
    return this.serverDao.findByType(type);
  }

  async findByWorkspaceAndServerType(workspace: string, serverType: ServerType[]): Promise<ServerInfo[]> {
    const openRecentList = await this.openRecentDao.findByWorkspace(workspace);
    const serverIds: string[] = openRecentList.map((item) => item.serverId);
    return this.serverDao.findByWorkspaceAndServerType(serverIds, serverType);
  }
}
