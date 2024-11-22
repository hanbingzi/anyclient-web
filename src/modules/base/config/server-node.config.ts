import { IServerTreeNode } from '../model/server-tree-node.model';
import { RedisNodeType, ServerType } from '../types/server-node.types';
import { RedisType } from '../types/common-fields.types';

export class ServerNodeConfig {

  public static tablesNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 10,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Tables',
      nodeName: 'Tables',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      nodeType: isJdbc ? 'basicTables' : 'tables',
      db,
      schema,
      sort,
    };
  }

  public static viewsNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 9,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Views',
      nodeName: 'Views',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      nodeType: isJdbc ? 'basicViews' : 'views',
      db,
      schema,
      sort,
    };
  }

  public static functionsNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 7,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Functions',
      nodeName: 'Functions',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      nodeType: isJdbc ? 'basicFunctions' : 'functions',
      db,
      schema,
      sort,
    };
  }

  public static sequencesNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 8,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Sequences',
      nodeName: 'Sequences',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      nodeType: isJdbc ? 'basicSequences' : 'sequences',
      db,
      schema,
      sort,
    };
  }

  public static proceduresNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 7,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Procedures',
      nodeName: 'Procedures',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      nodeType: isJdbc ? 'basicProcedures' : 'procedures',
      db,
      schema,
      sort,
    };
  }

  public static triggersNode(
    server: ServerType,
    db: string,
    schema: string,
    sort: number = 6,
    isJdbc: boolean = false,
  ): IServerTreeNode {
    return {
      displayName: 'Triggers',
      nodeName: 'Triggers',
      serverType: server,
      levelType: 'node',
      nodeStat: 'success',
      // nodeType: isJdbc ? 'basicTriggers' : 'triggers',
      nodeType: 'triggers',
      db,
      schema,
      sort,
    };
  }

  public static convertRedisType(type?: RedisType): RedisNodeType {
    switch (type) {
      case RedisType.hash:
        return 'redisHash';
      case RedisType.list:
        return 'redisList';
      case RedisType.string:
        return 'redisString';
      case RedisType.zset:
        return 'redisZSet';
      case RedisType.set:
        return 'redisSet';
      default:
        return 'redisString';
    }
  }
}
