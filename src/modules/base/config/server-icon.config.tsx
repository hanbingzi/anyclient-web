import { ReactNode } from 'react';
import { AllNodeType, ServerType, SubNodeType } from '../types/server-node.types';
import { OracleIconSetting } from './server-icon/oracle-icon-setting';
import { MariadbIconSetting } from './server-icon/mariadb-icon-setting';
import { PostgresqlIconSetting } from './server-icon/postgresql-icon-setting';
import { SqlserverIconSetting } from './server-icon/sqlserver-icon-setting';
import { SqliteIconSetting } from './server-icon/sqlite-icon-setting';
import { DMIconSetting } from './server-icon/dm-icon-setting';
import { TiDBIconSetting } from './server-icon/tidb-icon-setting';
import { CouchbaseIconSetting } from './server-icon/couchbase-icon-setting';
import { CassandraIconSetting } from './server-icon/cassandra-icon-setting';
import { ConsulIconSetting } from './server-icon/consul-icon-setting';
import { ElasticsearchIconSetting } from './server-icon/elasticsearch-icon-setting';
import { EtcdIconSetting } from './server-icon/etcd-icon-setting';
import { EurekaIconSetting } from './server-icon/eureka-icon-setting';
import { InfluxdbIconSetting } from './server-icon/influxdb-icon-setting';
import { PrometheusIconSetting } from './server-icon/prometheus-icon-setting';
import { TDEngineIconSetting } from './server-icon/tdengine-icon-setting';
import { MongodbIconSetting } from './server-icon/mongodb-icon-setting';
import { RedisIconSetting } from './server-icon/redis-icon-setting';
import { KafkaIconSetting } from './server-icon/kafka-icon-setting';
import { RabbitmqIconSetting } from './server-icon/rabbitmq-icon-setting';
import { RocketmqIconSetting } from './server-icon/rocketmq-icon-setting';
import { MosquittoIconSetting } from './server-icon/mosquitto-icon-setting';
import { SnowflakeIconSetting } from './server-icon/snowflake-icon-setting';
import { EmqxIconSetting } from './server-icon/emqx-icon-setting';
import { ZookeeperIconSetting } from './server-icon/zookeeper-icon-setting';
import { NacosIconSetting } from './server-icon/nacos-icon-setting';
import { DB2IconSetting } from './server-icon/db2-icon-setting';
import { RDJCIconSetting } from './server-icon/rdjc-icon-setting';
import { H2IconSetting } from './server-icon/h2-icon-setting';
import { HiveIconSetting } from './server-icon/hive-icon-setting';
import { TeradataIconSetting } from './server-icon/teradata-icon-setting';
import { FileMakerIconSetting } from './server-icon/filemaker-icon-setting';
import { SAPHANAIconSetting } from './server-icon/saphana-icon-setting';
import { FirebirdIconSetting } from './server-icon/firebird-icon-setting';
import { SparkSQLIconSetting } from './server-icon/sparksql-icon-setting';
import { RedshiftIconSetting } from './server-icon/redshift-icon-setting';
import { InformixIconSetting } from './server-icon/informix-icon-setting';
import { ClickHouseIconSetting } from './server-icon/clickhouse-icon-setting';
import { FlinkIconSetting } from './server-icon/flink-icon-setting';
import { ImpalaIconSetting } from './server-icon/impala-icon-setting';
import { PrestoIconSetting } from './server-icon/presto-icon-setting';
import { VerticaIconSetting } from './server-icon/vertica-icon-setting';
import { GreenplumIconSetting } from './server-icon/greenplum-icon-setting';
import { DerbyIconSetting } from './server-icon/derby-icon-setting';
import { TrinoIconSetting } from './server-icon/trino-icon-setting';
import { DuckDBIconSetting } from './server-icon/duckdb-icon-setting';
import { HBaseIconSetting } from './server-icon/hbase-icon-setting';
import { Neo4jIconSetting } from './server-icon/neo4j-icon-setting';
import { OceanBaseIconSetting } from './server-icon/oceanbase-icon-setting';
import { MysqlIconSetting } from './server-icon/mysql-icon-setting';
import { DefaultIcon } from './server-icon';

export interface INodeIcon {
  hasFolderIcon?: boolean;
  icon?: ReactNode;
  openIcon?: ReactNode;
  closeIcon?: ReactNode;
  iconPath?: string;
  name?: string;
  base64?: string;
  children?: INodeChild;
}

export type INodeChild = {
  [key in SubNodeType]?: INodeIcon;
};

//
export const ServerIcon: Record<ServerType, INodeIcon> = {
  CommonSql: MysqlIconSetting,
  Mariadb: MariadbIconSetting,
  Mysql: MysqlIconSetting,
  Postgresql: PostgresqlIconSetting,
  Oracle: OracleIconSetting,
  Sqlite: SqliteIconSetting,
  SQLServer: SqlserverIconSetting,
  DM: DMIconSetting,
  TiDB: TiDBIconSetting,
  OceanBase: OceanBaseIconSetting,
  Cassandra: CassandraIconSetting,
  Consul: ConsulIconSetting,
  Elasticsearch: ElasticsearchIconSetting,
  Etcd: EtcdIconSetting,
  Eureka: EurekaIconSetting,
  Influxdb: InfluxdbIconSetting,
  TDEngine: TDEngineIconSetting,
  Prometheus: PrometheusIconSetting,
  Mongodb: MongodbIconSetting,
  Redis: RedisIconSetting,
  Kafka: KafkaIconSetting,
  Rabbitmq: RabbitmqIconSetting,
  Rocketmq: RocketmqIconSetting,
  Mosquitto: MosquittoIconSetting,
  Emqx: EmqxIconSetting,
  Snowflake: SnowflakeIconSetting,
  Zookeeper: ZookeeperIconSetting,
  Nacos: NacosIconSetting,
  //jdbc Connection Types
  DB2: DB2IconSetting,
  RDJC: RDJCIconSetting,
  H2: H2IconSetting,
  Hive: HiveIconSetting,
  FileMaker: FileMakerIconSetting,
  Teradata: TeradataIconSetting,
  SAP_HANA: SAPHANAIconSetting,
  Firebird: FirebirdIconSetting,
  Spark_SQL: SparkSQLIconSetting,
  Redshift: RedshiftIconSetting,
  Informix: InformixIconSetting,
  ClickHouse: ClickHouseIconSetting,
  Impala: ImpalaIconSetting,
  Flink: FlinkIconSetting,
  Presto: PrestoIconSetting,
  Vertica: VerticaIconSetting,
  Greenplum: GreenplumIconSetting,
  Derby: DerbyIconSetting,
  Trino: TrinoIconSetting,
  DuckDB: DuckDBIconSetting,
  //jdbc connection other
  HBase: HBaseIconSetting,
  Neo4j: Neo4jIconSetting,
  Couchbase: CouchbaseIconSetting,
};

export class ServerIconFinder {
  public static getServerIcon(
    server: ServerType,
    nodeType?: AllNodeType,
    isFolder?: boolean,
    isOpen?: boolean,
  ): ReactNode {
    //console.log("server:",server,";nodeType:",nodeType,";isFolder:",isFolder,";isOpen:",isOpen)
    if (!server) {
      return null;
    }
    if (nodeType && nodeType !== 'server') {
      if (!ServerIcon[server] || !ServerIcon[server].children || !ServerIcon[server].children![nodeType]) {
        //没有配置图标的情况
        return DefaultIcon.icon;
      }
      if (isFolder && ServerIcon[server]!.children![nodeType]?.hasFolderIcon) {
        //图标配置目录图标的情况
        if (isOpen) {
          return ServerIcon[server]!.children![nodeType]!.openIcon;
        } else {
          return ServerIcon[server]!.children![nodeType]!.closeIcon;
        }
      }
      return ServerIcon[server]!.children![nodeType]!.icon;
    } else {
      return ServerIcon[server].icon;
    }
  }

  public static getServerIconPath(server: ServerType, nodeType?: AllNodeType): string {
    if (nodeType && nodeType !== 'server') {
      if (
        !ServerIcon[server] ||
        !ServerIcon[server].children ||
        !ServerIcon[server].children![nodeType] ||
        !ServerIcon[server].children![nodeType]?.iconPath
      ) {
        return DefaultIcon.iconPath!;
      }
      return ServerIcon[server].children![nodeType]!.iconPath!;
    }

    return ServerIcon[server].iconPath!;
  }

  public static getServerIconBase64(server: ServerType, nodeType?: AllNodeType): string {
    if (nodeType && nodeType !== 'server') {
      if (
        !ServerIcon[server] ||
        !ServerIcon[server].children ||
        !ServerIcon[server].children![nodeType] ||
        !ServerIcon[server].children![nodeType as SubNodeType]?.base64
      ) {
        return DefaultIcon.iconPath!;
      }
      return ServerIcon[server].children![nodeType as SubNodeType]!.base64!;
    }

    return ServerIcon[server].base64!;
  }
}
