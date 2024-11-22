import { IQueryResult, IRunSqlResult } from './query-result.types';
import { ConnectQuery } from '../../../local-store-db/common';
import { IBaseService, IBaseServiceClient, IKeyInfoResult, IKeyResult, KeyValueType, SearchKeyParam } from '../index';
import { AllNodeType } from '../../../base/types/server-node.types';
import { RedisInputType, RedisType } from '../../../base/types/common-fields.types';

export const IRedisServiceToken = Symbol('IRedisServiceToken');

/**
 * redis db详细信息
 */
export class RedisDbNode {
  public displayName: string;
  public name: string;
  public db: number;
  public size: number;

  constructor(_db: number, _size: number) {
    this.name = `DB${_db}`;
    this.db = _db;
    this.size = _size;
    if (this.size != 0) {
      this.displayName = `DB${this.db} (${this.size})`;
    } else {
      this.displayName = `DB${this.db}`;
    }
  }

  public updateSize(size: number) {
    this.size = size;
  }
}

export interface IRedisKeyInfo {
  name: string;
  type?: RedisType;
}

export interface IRedisKeyPathInfo extends IRedisKeyInfo {
  count?: number;
  isKey: boolean;
  fullPath?: string;
  child?: Map<string, IRedisKeyPathInfo>;
}

export interface IRedisUpdateParam {
  oldKey?: string;
  newKey?: string;
  newValue: string;
  newScore?: number;
}

export interface IRedisService extends IBaseService {
  runCommand(connect: ConnectQuery, command: string): Promise<IKeyResult>;

  ping(connect: ConnectQuery): Promise<IQueryResult>;

  showDatabases(connect: ConnectQuery): Promise<IQueryResult<RedisDbNode[]>>;

  showDatabaseSubKey(connect: ConnectQuery, pattern?: string): Promise<Map<string, IRedisKeyPathInfo> | null>;

  showFolderSubKey(connect: ConnectQuery, nodeValue: string): Promise<Map<string, IRedisKeyPathInfo> | null>;

  deleteByType(connect: ConnectQuery, type: AllNodeType, name: string): Promise<IRunSqlResult>;

  /**
   * 查看redis key 详细信息
   * @param connect
   * @param keyName
   */
  keyInfo(connect: ConnectQuery, keyName: string): Promise<IQueryResult<IKeyInfoResult>>;

  /**
   * 一个活在过去的人
   * @param connect
   * @param keyName
   */
  keyTtl(connect: ConnectQuery, keyName: string): Promise<IQueryResult<number>>;

  /**
   * 如何才能摆脱梦境
   * @param connect
   * @param keyName
   */
  keyType(connect: ConnectQuery, keyName: string): Promise<IQueryResult<string>>;

  /**
   * 查询redis key内容
   * @param connect
   * @param keyName
   * @param keyType
   */
  keyData(connect: ConnectQuery, keyName: string, keyType: string): Promise<IQueryResult<KeyValueType>>;

  /**
   * 修改key 名称
   * @param connect
   * @param keyName
   * @param newName
   */
  keyRename(connect: ConnectQuery, keyName: string, newName: string): Promise<IQueryResult>;

  /**
   * 设置key过期时间
   * @param connect
   * @param keyName
   * @param expire
   */
  keyExpire(connect: ConnectQuery, keyName: string, expire: number);

  /**
   * 设置key的值
   * @param connect
   * @param keyName
   * @param newValue
   * @param ttl
   */
  keySet(connect: ConnectQuery, keyName: string, newValue: string, ttl?: number);

  keySetForBuffer(connect: ConnectQuery, keyName: string, newValue: Buffer);

  /**
   * 删除key里面的值，
   * @param connect
   * @param keyName
   * @param content
   */
  deleteKeyData(connect: ConnectQuery, keyName: string, content: string[]): Promise<IQueryResult>;

  updateKeyData(connect: ConnectQuery, keyName: string, updateParams: IRedisUpdateParam[]): Promise<IQueryResult>;

  setKeyData(
    connect: ConnectQuery,
    keyName: string,
    keyType: RedisInputType,
    addParams: IRedisUpdateParam[],
    ttl?: number,
  );

  addKeyData(connect: ConnectQuery, keyName: string, updateParams: IRedisUpdateParam[]): Promise<IQueryResult>;
}

export const IRedisClientServicePath = 'IRedisClientServicePath';

export const IRedisClientService = Symbol('IRedisClientService');

export interface IRedisServiceClient extends IBaseServiceClient {
  runCommand(connect: ConnectQuery, command: string): Promise<IKeyResult>;

  runBatchCommand(connect: ConnectQuery, commands: string[]): Promise<IKeyResult[]>;

  ping(connect: ConnectQuery): Promise<IQueryResult>;

  //------database-----------
  showDatabases(connect: ConnectQuery): Promise<IQueryResult<RedisDbNode[]>>;

  //------key------------
  scanKeys(connect: ConnectQuery, searchKeyParam: SearchKeyParam): Promise<IRedisKeyInfo[]>;

  clusterScanKeys(connect: ConnectQuery, searchKeyParam: SearchKeyParam): Promise<IRedisKeyInfo[]>;

  delete(connect: ConnectQuery, key: string): Promise<IQueryResult>;

  deleteByFolder(connect: ConnectQuery, folder: string): Promise<IQueryResult>;

  /**
   * 查看key的详细信息，类型，有效期
   * @param connect
   * @param keyName
   */
  keyInfo(connect: ConnectQuery, keyName: string): Promise<IQueryResult<IKeyInfoResult>>;

  keyTtl(connect: ConnectQuery, keyName: string): Promise<IQueryResult<number>>;

  /**
   * 如何才能摆脱梦境
   * @param connect
   * @param keyName
   */
  keyType(connect: ConnectQuery, keyName: string): Promise<IQueryResult<string>>;

  /**
   * 查询key 的数据
   * @param connect
   * @param keyName
   */
  keyData(connect: ConnectQuery, keyName: string): Promise<IQueryResult<KeyValueType>>;

  /**
   * 设置key过期时间
   * @param connect
   * @param keyName
   * @param expire
   */
  keyExpire(connect: ConnectQuery, keyName: string, expire: number): Promise<IQueryResult>;

  /**
   * 修改key名称
   * @param connect
   * @param keyName
   * @param newName
   */
  keyRename(connect: ConnectQuery, keyName: string, newName: string): Promise<IQueryResult>;

  /**
   * 修改key 值
   * @param connect
   * @param keyName
   * @param newValue
   * @param ttl
   */
  keySet(connect: ConnectQuery, keyName: string, newValue: string, ttl?: number): Promise<IQueryResult>;

  keySetForBuffer(connect: ConnectQuery, keyName: string, newValue: string): Promise<IQueryResult>;

  deleteKeyData(connect: ConnectQuery, keyName: string, content: string[]): Promise<IQueryResult>;

  /**
   * 修改值
   * @param connect
   * @param keyName
   * @param updateParams
   */
  updateKeyData(connect: ConnectQuery, keyName: string, updateParams: IRedisUpdateParam[]): Promise<IQueryResult>;

  setKeyData(
    connect: ConnectQuery,
    keyName: string,
    keyType: RedisInputType,
    addParams: IRedisUpdateParam[],
    ttl?: number,
  );

  addKeyData(connect: ConnectQuery, keyName: string, updateParams: IRedisUpdateParam[]): Promise<IQueryResult>;
}
