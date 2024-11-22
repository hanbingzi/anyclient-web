import { Autowired, Injectable } from '@opensumi/di';
import { IClusterService, IServerClusterDao, IServerClusterDaoPath, ServerCluster } from '../common';

@Injectable()
export class ClusterService implements IClusterService {
  @Autowired(IServerClusterDaoPath)
  protected readonly clusterDao: IServerClusterDao;

  multiSave(serverClusters: ServerCluster[]): Promise<void> {
    return this.clusterDao.multiSave(serverClusters);
  }

  save(serverCluster: ServerCluster): Promise<void> {
    return this.clusterDao.save(serverCluster);
  }

  delete(id: string): Promise<void> {
    return this.clusterDao.delete(id);
  }

  deleteByIds(ids: string[]): Promise<void> {
    return this.clusterDao.deleteByIds(ids);
  }

  deleteByServerId(serverId: string): Promise<void> {
    return this.clusterDao.deleteByServerId(serverId);
  }

  countByWhereParam(whereParam: Partial<ServerCluster>): Promise<number> {
    return this.clusterDao.countByWhereParam(whereParam);
  }

  findById(id: string): Promise<ServerCluster> {
    return this.clusterDao.findById(id);
  }

  findByIds(ids: string[]): Promise<ServerCluster[]> {
    return this.clusterDao.findByIds(ids);
  }

  findByServerId(serverId: string): Promise<ServerCluster[]> {
    return this.clusterDao.findByServerId(serverId);
  }

  updateById(id: string, serverCluster: Partial<ServerCluster>): Promise<void> {
    return this.clusterDao.updateById(id, serverCluster);
  }
}
