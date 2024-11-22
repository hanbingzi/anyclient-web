import { Autowired, Injectable } from '@opensumi/di';
import {
  IQueryResult,
  IZkInfo,
  IZookeeperClientServicePath,
  IZookeeperService,
  IZookeeperServiceClient,
} from '../../common';
import { ConnectQuery } from '../../../local-store-db/common';

@Injectable()
export class ZookeeperService implements IZookeeperService {
  @Autowired(IZookeeperClientServicePath)
  private zookeeperClientService: IZookeeperServiceClient;

  ping(connect: ConnectQuery): Promise<IQueryResult> {
    return this.zookeeperClientService.ping(connect);
  }

  closeConnection(connect: ConnectQuery) {
    return this.zookeeperClientService.closeConnection(connect);
  }


  async createWithData(connect: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult> {
    return await this.zookeeperClientService.createWithData(connect, fullPath, data);
  }

  async create(connect: ConnectQuery, fullPath: string): Promise<IQueryResult> {
    return await this.zookeeperClientService.create(connect, fullPath);
  }

  exist(connect: ConnectQuery, fullPath: string) {}

  async getData(connect: ConnectQuery, fullPath: string): Promise<IQueryResult<IZkInfo>> {
    return await this.zookeeperClientService.getData(connect, fullPath);
  }

  getInfo(connect: ConnectQuery, fullPath: string) {}

  async listChildren(connect: ConnectQuery, fullPath: string): Promise<IQueryResult<IZkInfo[]>> {
    return await this.zookeeperClientService.listChildren(connect, fullPath);
  }

  async delete(connect: ConnectQuery, fullPath: string): Promise<IQueryResult> {
    return await this.zookeeperClientService.delete(connect, fullPath);
  }

  async setData(connect: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult> {
    return await this.zookeeperClientService.setData(connect, fullPath, data);
  }
}
