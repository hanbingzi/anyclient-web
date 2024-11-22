import { ServerType } from '../types/server-node.types';
import { MysqlPreference } from './server-info/mysql-info';
import { MariadbPreference } from './server-info/mariadb-info';
import { SqlserverPreference } from './server-info/sqlserver-info';
import { OraclePreference } from './server-info/oracle-info';
import { PostgresPreference } from './server-info/postgresql-info';
import { DMPreference } from './server-info/dm-info';
import { SnowflakePreference } from './server-info/snowflake-info';
import { TiDBPreference } from './server-info/tidb-info';
import { OceanBasePreference } from './server-info/oceanbase-info';
import { SqlitePreference } from './server-info/sqlite-info';
import { RedisPreference } from './server-info/redis-info';
import { CassandraPreference } from './server-info/cassandra-info';
import { ElasticsearchPreference } from './server-info/elasticsearch-info';
import { EtcdPreference } from './server-info/etcd-info';
import { EurekaPreference } from './server-info/eureka-info';
import { ConsulPreference } from './server-info/consul-info';
import { MongodbPreference } from './server-info/mongodb-info';
import { NacosPreference } from './server-info/nacos-info';
import { KafkaPreference } from './server-info/kafka-info';
import { EmqxPreference } from './server-info/emqx-info';
import { MosquittoPreference } from './server-info/mosquitto-info';
import { RocketmqPreference } from './server-info/rocketmq-info';
import { RabbitmqPreference } from './server-info/rabbitmq-info';
import { ZookeeperPreference } from './server-info/zookeeper-info';
import { InfluxdbPreference } from './server-info/influxdb-info';
import { ImpalaPreference } from './server-info/impala-info';
import { FlinkPreference } from './server-info/flink-info';
import { ClickHousePreference } from './server-info/clickhouse-info';
import { PrestoPreference } from './server-info/presto-info';
import { VerticaPreference } from './server-info/vertica-info';
import { InformixPreference } from './server-info/informix-info';
import { GreenplumPreference } from './server-info/greenplum-info';
import { RedshiftPreference } from './server-info/redshift-info';
import { DerbyPreference } from './server-info/derby-info';
import { SparkSQLPreference } from './server-info/sparksql-info';
import { TrinoPreference } from './server-info/trino-info';
import { FirebirdPreference } from './server-info/firebird-info';
import { DuckDBPreference } from './server-info/duckdb-info';
import { SAPHANAPreference } from './server-info/saphana-info';
import { HBasePreference } from './server-info/hbase-info';
import { TDEnginePreference } from './server-info/tdengine-info';
import { PrometheusPreference } from './server-info/prometheus-info';
import { DB2Preference } from './server-info/db2-info';
import { RDJCPreference } from './server-info/rdjc-info';
import { HivePreference } from './server-info/hive-info';
import { FileMakerPreference } from './server-info/filemaker-info';
import { H2Preference } from './server-info/h2-info';
import { TeradataPreference } from './server-info/teradata-info';
import { Neo4jPreference } from './server-info/neo4j-info';
import { CouchbasePreference } from './server-info/couchbase-info';
import { CommonSqlPreference } from './server-info/common-sql-info';

export interface IServerPreference {
  name: ServerType;
  displayName?: string;
  isSupport: boolean;
  nextSupport?: boolean;
  //icon: NodeIcon;
  defaultUser?: string;
  defaultPort?: number;
  versions?: string[];
  //新建服务的是否，version必须选择
  versionForce?:boolean;
  //使用jdbc数据库连接，其他的功能，如:sql处理都使用,jdbc连接更有优势，如更优秀的数据库连接池管理
  connectUseJdbc?: boolean;
  hasDatabaseNode?:boolean;
  hasSchemaNode?:boolean;
  hasViewNode?:boolean;
  hasFunctionNode?:boolean;
  hasProcedureNode?:boolean;
  hasSequenceNode?:boolean;
  hasTriggerNode?:boolean;
  hasRoleNode?:boolean;
  hasVariableNode?:boolean;

  // hasShowDatabaseSql?: boolean;
  // hasShowSchemaSql?: boolean;
  // hasShowTableSql?:boolean;
  // hasShowViewSql?:boolean;
  //下面是具体功能是否实现
  //showColumn SQL实现，采用sql查询column的信息，查询出来的更准确，否则jdbc连接类型只能使用jdbc 默认自带的
   hasShowColumnSql?: boolean;
  //是否具有showFunction的Sql，因为jdbc已经内置了查询function的方法，所有不需要使用sql查询
  // hasShowFunctionSql?: boolean;
  //是否具有showProcedure的Sql
  // hasShowProcedureSql?: boolean;
}

export const ServerPreferences: Record<ServerType, IServerPreference> = {
  CommonSql:CommonSqlPreference,
  Mysql: MysqlPreference,
  Mariadb: MariadbPreference,
  SQLServer: SqlserverPreference,
  Oracle: OraclePreference,
  Postgresql: PostgresPreference,
  DM: DMPreference,
  Snowflake: SnowflakePreference,
  TiDB: TiDBPreference,
  OceanBase: OceanBasePreference,
  Sqlite: SqlitePreference,
  Redis: RedisPreference,
  Cassandra: CassandraPreference,
  Elasticsearch: ElasticsearchPreference,
  Etcd: EtcdPreference,
  Eureka: EurekaPreference,
  Consul: ConsulPreference,
  Mongodb: MongodbPreference,
  Nacos: NacosPreference,
  Kafka: KafkaPreference,
  Emqx: EmqxPreference,
  Mosquitto: MosquittoPreference,
  Rocketmq: RocketmqPreference,
  Rabbitmq: RabbitmqPreference,
  Zookeeper: ZookeeperPreference,
  Influxdb: InfluxdbPreference,
  TDEngine: TDEnginePreference,
  Prometheus: PrometheusPreference,
  // JDBC TYPE SERVER
  DB2: DB2Preference,
  RDJC: RDJCPreference,
  H2: H2Preference,
  Hive: HivePreference,
  FileMaker: FileMakerPreference,
  Teradata: TeradataPreference,
  SAP_HANA: SAPHANAPreference,
  Firebird: FirebirdPreference,
  Spark_SQL: SparkSQLPreference,
  Redshift: RedshiftPreference,
  Informix: InformixPreference,
  ClickHouse: ClickHousePreference,
  Impala: ImpalaPreference,
  Flink: FlinkPreference,
  Presto: PrestoPreference,
  Vertica: VerticaPreference,
  Greenplum: GreenplumPreference,
  Derby: DerbyPreference,
  Trino: TrinoPreference,
  DuckDB: DuckDBPreference,
  HBase: HBasePreference,
  Neo4j: Neo4jPreference,
  Couchbase: CouchbasePreference,
};
