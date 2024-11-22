import { Autowired, Injectable } from '@opensumi/di';
import {
  IKeyResult,
  IQueryResult,
  IRedisClientServicePath,
  IRedisKeyPathInfo,
  IRedisService,
  IRedisServiceClient,
  IRedisUpdateParam,
  RedisDbNode,
  SearchKeyParam,
} from '../../common';
import { AllNodeType } from '../../../base/types/server-node.types';
import { DocumentParser } from '../../../base/utils/sql-parser-util';
import { ConnectQuery } from '../../../local-store-db/common';
import { RedisInputType, RedisType } from '../../../base/types/common-fields.types';
import { DataUtil } from '../../../base/utils/data-util';
import { RedisResultEnum } from '../../common/fields/redis-fields';
import { isEmpty } from '../../../base/utils/object-util';

@Injectable()
export class RedisService implements IRedisService {
  @Autowired(IRedisClientServicePath)
  private redisClientService: IRedisServiceClient;

  ping(connect: ConnectQuery): Promise<IQueryResult> {
    return this.redisClientService.ping(connect);
  }

  async closeConnection(connect: ConnectQuery): Promise<boolean> {
    this.redisClientService.closeConnection(connect);
    return true;
  }

  async runCommand(connect: ConnectQuery, command: string): Promise<IKeyResult> {
    //DocumentParser.parseBlocks(batchSql);
    //console.log('redis-service : runCommand----->', connect, command)
    const result = await this.redisClientService.runCommand(connect, command);
    if (result.success && result.valueType === RedisResultEnum.string && result.data) {
      result.data = DataUtil.xToBuffer(result.data);
    }
    return result;
  }

  async runBatchCommand(connect: ConnectQuery, batchCommand: string): Promise<IKeyResult[]> {
    let commandList: string[] = DocumentParser.parseBlocks(batchCommand);
    const result = await this.redisClientService.runBatchCommand(connect, commandList);
    return result;
  }

  //
  async showDatabases(connect: ConnectQuery): Promise<IQueryResult<RedisDbNode[]>> {
    const {
      server: { host, port },
    } = connect;
    let queryResult = await this.redisClientService.showDatabases(connect);
    if (!queryResult.success) {
      if (!queryResult.message) {
        queryResult.message = `Could not connect to ${host}:${port} `;
      }
    }
    return queryResult;
  }

  async showDatabaseSubKey(connect: ConnectQuery, pattern: string): Promise<Map<string, IRedisKeyPathInfo> | null> {
    console.log('showDatabaseSubKey');
    let searchOption: SearchKeyParam = {
      //db: Number(connect.db!),
      count: 50000,
      match: isEmpty(pattern) ? '*' : pattern,
    };
    //console.log('showDatabaseSubKey:', searchOption)
    return this.scanKeys(connect, searchOption);
  }

  //parentTreeNode.nodeValue
  async showFolderSubKey(connect: ConnectQuery, nodeValue: string): Promise<Map<string, IRedisKeyPathInfo> | null> {
    let searchOption: SearchKeyParam = {
      //db: connect.db as number,
      count: 50000,
      match: `${nodeValue}*`,
    };
    return await this.scanKeys(connect, searchOption, nodeValue);
  }

  async scanKeys(
    connect: ConnectQuery,
    searchOption: SearchKeyParam,
    parentKeyPrefix?: string,
  ): Promise<Map<string, IRedisKeyPathInfo> | null> {
    //目前没有处理分页
    let searchResult;
    const {connectionType} = connect.server;
    if(connectionType==='Cluster'){
      searchResult =  await this.redisClientService.clusterScanKeys(connect, searchOption);
    }else{
      searchResult =  await this.redisClientService.scanKeys(connect, searchOption);
    }

    //console.log('redis->readkey-->', searchOption, parentKeyPrefix)
    if (!searchResult || searchResult.length === 0) {
      return null;
    }
    //let existKeys = new Map<string, number>();
    let keyMap = new Map<string, IRedisKeyPathInfo>();
    let prefixLen = 0;
    if (parentKeyPrefix) {
      prefixLen = parentKeyPrefix.length;
    }
    //pre:aa:bb
    //因为redis无法按目录逐级查询，一次性把key目录计算好，都加在出来
    searchResult.forEach((keyInfo) => {
      const { name, type } = keyInfo;
      let key: string[];
      if (parentKeyPrefix) {
        let subKey = name.slice(prefixLen + 1);
        key = subKey.split(':');
      } else {
        key = name.split(':');
      }
      if (key.length === 1) {
        keyMap.set(name, { name: name, isKey: true, type, fullPath: name });
      } else {
        let child = keyMap;
        for (let i = 0; i < key.length; i++) {
          let isKey = i + 1 === key.length;
          let keyName = isKey ? name : key[i];
          if (isKey) {
            child.set(name, { name: name, isKey: true, fullPath: name, type });
          } else if (child.has(keyName)) {
            let keyInfo = child.get(keyName)!;
            keyInfo.count = keyInfo.count! + 1;
            child = keyInfo.child!;
          } else {
            let fullPath = isKey ? name : name.substring(0, name.indexOf(keyName) + keyName.length);
            let subChild = new Map();
            child.set(keyName, {
              name: keyName,
              count: 1,
              isKey: false,
              fullPath,
              child: subChild,
            });
            child = subChild;
          }
        }
      }
    });
    return keyMap;
    // let treeNodes: IServerTreeNode[] = []
    // this.processKey(keyMap, treeNodes, searchOption.db)
    //return {success: true, data: treeNodes};
  }

  async deleteByType(connect: ConnectQuery, type: AllNodeType, name: string): Promise<IQueryResult> {
    // console.log('delete param',type,name)
    if (type === 'redisFolder') {
      return this.redisClientService.deleteByFolder(connect, name);
    } else {
      return this.redisClientService.delete(connect, name);
    }
    return { success: false, message: 'inner code error' };
  }

  async keyInfo(connect: ConnectQuery, keyName: string) {
    return await this.redisClientService.keyInfo(connect, keyName);
  }

  async keyType(connect: ConnectQuery, keyName: string) {
    return await this.redisClientService.keyType(connect, keyName);
  }

  async keyTtl(connect: ConnectQuery, keyName: string) {
    return await this.redisClientService.keyTtl(connect, keyName);
  }

  async keyData(connect: ConnectQuery, keyName: string, keyType: string) {
    const result = await this.redisClientService.keyData(connect, keyName);
    if (result.success && keyType === RedisType.string) {
      result.data = DataUtil.xToBuffer(result.data);
      //console.log('xToBuffer-->', result.data)
    }
    return result;
  }

  async keyRename(connect: ConnectQuery, keyName: string, newName: string) {
    return await this.redisClientService.keyRename(connect, keyName, newName);
  }

  async keyExpire(connect: ConnectQuery, keyName: string, expire: number) {
    return await this.redisClientService.keyExpire(connect, keyName, expire);
  }

  async keySet(connect: ConnectQuery, keyName: string, newValue: string, ttl?: number) {
    return await this.redisClientService.keySet(connect, keyName, newValue, ttl);
  }

  async keySetForBuffer(connect: ConnectQuery, keyName: string, newValue: Buffer) {
    //console.log('转换后的：', newValue)
    const hex = DataUtil.bufToHex(newValue);
    return await this.redisClientService.keySetForBuffer(connect, keyName, hex);
  }

  async deleteKeyData(connect: ConnectQuery, keyName: string, content: string[]): Promise<IQueryResult> {
    return await this.redisClientService.deleteKeyData(connect, keyName, content);
  }

  async updateKeyData(
    connect: ConnectQuery,
    keyName: string,
    updateParams: IRedisUpdateParam[],
  ): Promise<IQueryResult> {
    return await this.redisClientService.updateKeyData(connect, keyName, updateParams);
  }

  async setKeyData(
    connect: ConnectQuery,
    keyName: string,
    keyType: RedisInputType,
    addParams: IRedisUpdateParam[],
    ttl?: number,
  ) {
    return await this.redisClientService.setKeyData(connect, keyName, keyType, addParams, ttl);
  }

  async addKeyData(connect: ConnectQuery, keyName: string, updateParams: IRedisUpdateParam[]): Promise<IQueryResult> {
    return await this.redisClientService.addKeyData(connect, keyName, updateParams);
  }
}
