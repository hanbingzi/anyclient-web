import { AllNodeType, FileSuffixType, ServerClass, ServerType } from '../types/server-node.types';
import { ServerPreferences } from './server-info.config';

export interface IServerClass {
  displayName: ServerClass | 'All' | 'Other' | string;
  servers: ServerType[];
}

/**
 * 服务添加的时候的查看列表-只展示当前支持的和下一步准备支持的
 */

/**
 * 数据查询时的分类列表
 * 后台处理逻辑的分类
 */
export const ServerTypeClass: { [key in ServerClass]: ServerType[] } = {
  //export  namespace ServerTypeClass{
  Relational: [
    'Mysql',
    'Postgresql',
    'Mariadb',
    'Oracle',
    'Sqlite',
    'SQLServer',
    'DM',
    'Snowflake',
    'DB2',
    'RDJC',
    'H2',
    'Hive',
    'FileMaker',
    'Teradata',
    'SAP_HANA',
    'Firebird',
    'Redshift',
    'Informix',
    'ClickHouse',
    'Impala',
    'Presto',
    'Vertica',
    'Greenplum',
    'Derby',
    'Trino',
    'DuckDB',
    'Snowflake',
  ],
  RelationalNewSql: ['TiDB', 'OceanBase'],
  KeyValue: ['Redis', 'Etcd'],
  TimeSeries: ['Influxdb', 'TDEngine', 'Prometheus'],
  MQ: ['Kafka', 'Emqx', 'Mosquitto', 'Rabbitmq'], //'Rabbitmq', 'Rocketmq',
  Register: ['Zookeeper', 'Consul', 'Eureka'],
  SearchEngine: ['Elasticsearch'],
  Document: ['Mongodb'],
  WideColumn: ['Cassandra'],
  //prettier-ignore

  Other: ['HBase', 'Neo4j', 'Couchbase'],
};

export const FullImplSql: ServerType[] = [
  'Mysql',
  'Postgresql',
  'Mariadb',
  'Oracle',
  'Sqlite',
  'SQLServer',
  'DM',
  'TiDB',
  'OceanBase',
];
export const BasicImplSql: ServerType[] = [
  'DB2',
  'RDJC',
  'H2',
  'Hive',
  'FileMaker',
  'Teradata',
  'SAP_HANA',
  'Firebird',
  'Redshift',
  'Informix',
  'ClickHouse',
  'Impala',
  'Presto',
  'Vertica',
  'Greenplum',
  'Derby',
  'Trino',
  'DuckDB',
  'Snowflake',
  'TDEngine'
];

export const AllServerType: ServerType[] = [
  ...ServerTypeClass.Relational,
  ...ServerTypeClass.RelationalNewSql,
  ...ServerTypeClass.KeyValue,
  ...ServerTypeClass.Document,
  ...ServerTypeClass.MQ,
  ...ServerTypeClass.TimeSeries,
  ...ServerTypeClass.SearchEngine,
  ...ServerTypeClass.Register,
  ...ServerTypeClass.WideColumn,
  ...ServerTypeClass.Other,
];
//mysql为基础研发的数据库
export const MysqlTypeDb: ServerType[] = ['Mysql', 'Mariadb', 'TiDB', 'OceanBase'];
export const PGTypeDb: ServerType[] = ['Postgresql'];

export namespace ServerClassNamespace {
  export const Relational: ServerType[] = ServerTypeClass.Relational;
  export const RelationalNewSql: ServerType[] = ServerTypeClass.RelationalNewSql;
  export const KeyValue: ServerType[] = ServerTypeClass.KeyValue;
  export const TimeSeries: ServerType[] = ServerTypeClass.TimeSeries;
  export const MQ: ServerType[] = ServerTypeClass.MQ;
  export const Register: ServerType[] = ServerTypeClass.Register;
  export const SearchEngine: ServerType[] = ServerTypeClass.SearchEngine;
  export const Document: ServerType[] = ServerTypeClass.Document;
  export const WideColumn: ServerType[] = ServerTypeClass.WideColumn;
  export const Other: ServerType[] = ServerTypeClass.Other;
  export const AllRelational: ServerType[] = [...ServerTypeClass.Relational, ...ServerTypeClass.RelationalNewSql];
  export const SqlModeServer: ServerType[] = [
    ...ServerTypeClass.Relational,
    ...ServerTypeClass.RelationalNewSql,
    'TDEngine',
  ];
}

//用来列表展示的
export const ServerTypeClassInfo: IServerClass[] = [
  {
    displayName: 'All',
    servers: AllServerType.filter((key) => ServerPreferences[key].isSupport),
  },
  {
    displayName: 'Relational',
    servers: [...ServerTypeClass.Relational].filter((key) => ServerPreferences[key].isSupport),
  },
  {
    displayName: 'Relational NewSql',
    servers: ServerTypeClass.RelationalNewSql,
  },
  { displayName: 'KeyValue', servers: ServerTypeClass.KeyValue },
  { displayName: 'Document', servers: ServerTypeClass.Document },
  { displayName: 'MQ', servers: ServerTypeClass.MQ }, //'Rabbitmq', 'Rocketmq',
  { displayName: 'TimeSeries', servers: ServerTypeClass.TimeSeries },
  { displayName: 'SearchEngine', servers: ServerTypeClass.SearchEngine },
  { displayName: 'Register', servers: ['Etcd', ...ServerTypeClass.Register] },
  { displayName: 'Wide Column', servers: ServerTypeClass.WideColumn },
  { displayName: 'Other', servers: ServerTypeClass.Other },
];

export const ServerFileSuffix: { [key in FileSuffixType]: ServerType[] } = {
  sql: [...ServerClassNamespace.SqlModeServer],
  json: ['Etcd'],
  es: ['Elasticsearch'],
  redis: ['Redis'],
};

export const ServerHasDb: ServerType[] = AllServerType.filter((key) => ServerPreferences[key].hasDatabaseNode);
export const ServerHasSchema: ServerType[] = AllServerType.filter((key) => ServerPreferences[key].hasSchemaNode);

export const getServerFileSuffix = (serverType: ServerType): FileSuffixType => {
  if (ServerFileSuffix.sql.includes(serverType)) {
    return 'sql';
  } else if (ServerFileSuffix.json.includes(serverType)) {
    return 'json';
  } else if (ServerFileSuffix.es.includes(serverType)) {
    return 'es';
  } else if (ServerFileSuffix.redis.includes(serverType)) {
    return 'redis';
  } else {
    throw new Error('server.config - getServerFileSuffix type error');
  }
};
export const getServerSubType = (server: ServerType): AllNodeType => {
  if (server === 'Oracle') {
    return 'orclDb';
  }
  if (server === 'Redis') {
    return 'redisDb';
  }
  return 'db';
};
