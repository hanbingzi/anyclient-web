import { IBaseService, IBaseServiceClient, IQueryResult } from '../index';
import { ConnectQuery } from '../../../local-store-db/common';
import { Stat } from 'node-zookeeper-client';

export const IZookeeperServiceToken = Symbol('IZookeeperServiceToken');

export interface IZookeeperService extends IBaseService {
  ping(ConnectQuery: ConnectQuery): Promise<IQueryResult>;

  ping(ConnectQuery: ConnectQuery): Promise<IQueryResult>;

  listChildren(ConnectQuery: ConnectQuery, path: string): Promise<IQueryResult<IZkInfo[]>>;

  create(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult>;

  createWithData(ConnectQuery: ConnectQuery, fullPath: string, data: string);

  setData(ConnectQuery: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult>;

  getData(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult<IZkInfo>>;

  delete(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult>;

  exist(ConnectQuery: ConnectQuery, fullPath: string);

  getInfo(ConnectQuery: ConnectQuery, fullPath: string);
}

export const IZookeeperClientServicePath = 'IZookeeperClientServicePath';

export const IZookeeperClientService = Symbol('IZookeeperClientService');

export interface IZookeeperServiceClient extends IBaseServiceClient {
  ping(ConnectQuery: ConnectQuery): Promise<IQueryResult>;

  listChildren(ConnectQuery: ConnectQuery, path: string): Promise<IQueryResult<IZkInfo[]>>;

  create(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult>;

  createWithData(ConnectQuery: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult>;

  getData(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult<IZkInfo>>;

  setData(ConnectQuery: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult>;

  delete(ConnectQuery: ConnectQuery, fullPath: string): Promise<IQueryResult>;
}

export interface IZkInfo {
  name?: string;
  fullPath?: string;
  data?: string;
  stat?: IZkStat;
}

export class IZkStat {
  ctime?: string;
  mtime?: string;
  version?: number;
  cversion?: number;
  aversion?: number;
  //ephemeralOwner?: string;
  dataLength?: number;
  numChildren?: number;

  constructor(stat?: Stat) {
    //this.ctime = (stat.ctime as any).toString('utf8')
    //this.mtime = (stat.mtime as any).toString('utf8')
    this.version = stat?.version;
    this.cversion = stat?.cversion;
    this.aversion = stat?.aversion;
    this.dataLength = stat?.dataLength;
    this.numChildren = stat?.numChildren;
  }
}
