import React, { ReactNode } from 'react';

export const ResourcePrefixPath = './resources/icons/';
export const ResourceServerPrefixPath = ResourcePrefixPath + 'server/';
export const ResourceNodePrefixPath = ResourcePrefixPath + 'node/';

export namespace ICON_RESOURCE_PATH {
  export const Unknown = ResourceNodePrefixPath + 'file-unknown.svg';
  export const Cassandra = ResourceServerPrefixPath + 'cassandra.svg';
  export const Consul = ResourceServerPrefixPath + 'consul.svg';
  export const Elasticsearch = ResourceServerPrefixPath + 'elastic.svg';
  export const Etcd = ResourceServerPrefixPath + 'etcd.svg';
  export const Eureka = ResourceServerPrefixPath + 'eureka.svg';
  export const Hive = ResourceServerPrefixPath + 'hive.svg';
  export const Influxdb = ResourceServerPrefixPath + 'influxdb.svg';
  export const Kafka = ResourceServerPrefixPath + 'kafka.svg';
  export const Mariadb = ResourceServerPrefixPath + 'mariadb.svg';
  export const Mongodb = ResourceServerPrefixPath + 'mongodb.svg';
  export const Mysql = ResourceServerPrefixPath + 'mysql.svg';
  export const Nacos = ResourceServerPrefixPath + 'nacos.svg';
  export const Neo4j = ResourceServerPrefixPath + 'neo4j.svg';
  export const Oracle = ResourceServerPrefixPath + 'oracle.svg';
  export const Postgresql = ResourceServerPrefixPath + 'postgre.svg';
  export const Redis = ResourceServerPrefixPath + 'redis.svg';
  export const Rocketmq = ResourceServerPrefixPath + 'rocketmq.svg';
  export const Rabbitmq = ResourceServerPrefixPath + 'rabbitmq.svg';
  export const Snowflake = ResourceServerPrefixPath + 'snowflake.svg';

  export const Mqtt = ResourceServerPrefixPath + 'mqtt.svg';
  export const SQLServer = ResourceServerPrefixPath + 'sqlServer.svg';
  export const Sqlite = ResourceServerPrefixPath + 'sqlite.svg';
  export const Zookeeper = ResourceServerPrefixPath + 'zookeeper.svg';
  export const H2 = ResourceServerPrefixPath + 'h2.svg';
  export const DM = ResourceServerPrefixPath + 'dm.svg';
  export const RDJC = ResourceServerPrefixPath + 'rdjc.svg';
  export const OceanBase = ResourceServerPrefixPath + 'oceanbase.svg';
  export const DB2 = ResourceServerPrefixPath + 'db2.svg';
  export const TiDB = ResourceServerPrefixPath + 'tidb.svg';

  export const cacheDb = ResourceNodePrefixPath + 'cache-db.svg';
  export const cacheKey = ResourceNodePrefixPath + 'cache-key.svg';
  export const cacheNode = ResourceNodePrefixPath + 'folder.svg';
  export const db = ResourceNodePrefixPath + 'db.svg';
  //export const function= ResourceNodePrefixPath + 'functions.svg';
  export const _function = ResourceNodePrefixPath + 'function.svg';
  export const table = ResourceNodePrefixPath + 'table.svg';
  export const tableView = ResourceNodePrefixPath + 'table-view.svg';
  export const sequenceView = ResourceNodePrefixPath + 'sequence-view.svg';
  export const tableViews = ResourceNodePrefixPath + 'table-view.svg';
  export const tables = ResourceNodePrefixPath + 'tables.svg';
}
