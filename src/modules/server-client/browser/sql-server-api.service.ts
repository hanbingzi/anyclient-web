import { Autowired, Injectable } from '@opensumi/di';
import {
  CompositeKeyParam,
  CreateColumnParam,
  CreateTableParam,
  IBaseSqlService,
  IColumnMeta,
  IConnectInfo,
  IDbDetail,
  IDMService,
  IDMServiceToken,
  IJdbcServiceClientPath,
  IMssqlService,
  IMssqlServiceToken,
  IMysqlService,
  IMysqlServiceToken,
  IOracleService,
  IOracleServiceToken,
  IPostgresService,
  IPostgresServiceToken,
  IPrimaryMeta,
  IQueryResult,
  IRunSqlResult,
  ISqlServiceApi,
  ITableDataResult,
  ITableMeta,
  IVFTSPInfo,
  QueryResultError,
  SortColumnParam,
  UpdateColumnParam,
  UpdateCompositeKeyParam,
  UpdateParam,
} from '../common';
import { ConnectQuery, ServerInfo } from '../../local-store-db/common';
import { IPage } from '../../components/pagination';
import { AllNodeType, ServerType } from '../../base/types/server-node.types';
import { UnrealizedSqlService } from './services/unrealized-sql.service';
import { DocumentParser } from '../../base/utils/sql-parser-util';
import { BaseSqlDialect } from '../common/dialet/base-sql-dialect';
import { PostgresDialect } from '../common/dialet/postgres-dialect';
import { MysqlDialect } from '../common/dialet/mysql-dialect';
import { OracleDialect } from '../common/dialet/oracle-dialect';
import { DefaultDialect } from '../common/dialet/abstract-default-sql-dialect';
import { IWhereParam } from '../../base/model/sql-param.model';
import { DataInputEnum } from '../../base/types/edit-input.types';
import { MysqlConvert } from '../common/convert/mysql-convert';
import { PostgresConvert } from '../common/convert/postgres-convert';
import { StrKeyObject } from '../../base/model/common.model';
import { OracleUtils } from '../common/utils/oracle-utils';
import { MssqlDialect } from '../common/dialet/mssql-dialect';
import { DMDialect } from '../common/dialet/dm-dialect';
import { JdbcServiceClient } from '../node/jdbc-service-client';
import { MysqlTypeDb } from '../../base/config/server.config';
import { ServerPreferences } from '../../base/config/server-info.config';
import { DB2Dialect } from '../common/dialet/db2-dialect';
import { ClickhouseDialect } from '../common/dialet/clickhouse-dialect';
import { HiveDialect } from '../common/dialet/hive-dialect';
import { isEmpty } from '../../base/utils/object-util';
import { TrinoDialect } from '../common/dialet/trino-dialect';
import { TDEngineDialect } from '../common/dialet/tdengine-dialect';
import { EmptyDialect } from '../common/dialet/empty-dialect';

/**
 * 1.只有runsql和runbatch两个方法需要传schema，因为用户写的sql，有可能不带schema
 * 2.自己组建的sql，为了性能，一律不传schemaø
 */
@Injectable()
export class SqlServerApiService implements ISqlServiceApi {
  @Autowired(IMysqlServiceToken)
  private mysqlService: IMysqlService;

  @Autowired(IPostgresServiceToken)
  private postgresService: IPostgresService;

  @Autowired(IOracleServiceToken)
  private oracleService: IOracleService;

  @Autowired(IMssqlServiceToken)
  private mssqlService: IMssqlService;

  @Autowired(IDMServiceToken)
  private dmService: IDMService;

  @Autowired(IJdbcServiceClientPath)
  private jdbcServiceClient: JdbcServiceClient;

  private unrealizedSqlService = new UnrealizedSqlService();
  private postgresDialect: BaseSqlDialect = new PostgresDialect();
  private mysqlDialect: BaseSqlDialect = new MysqlDialect();
  private oracleDialect: BaseSqlDialect = new OracleDialect();
  private mssqlDialect: BaseSqlDialect = new MssqlDialect();
  private defaultDialect: BaseSqlDialect = new DefaultDialect();
  private dmDialect: BaseSqlDialect = new DMDialect();
  private db2Dialect: BaseSqlDialect = new DB2Dialect();
  private clickHouseDialect: BaseSqlDialect = new ClickhouseDialect();
  private hiveDialect: BaseSqlDialect = new HiveDialect();
  private trinoDialect: BaseSqlDialect = new TrinoDialect();
  private tdEngineDialect: BaseSqlDialect = new TDEngineDialect();
  private emptyDialect: BaseSqlDialect = new EmptyDialect();

  public sqlService(serverType: ServerType): IBaseSqlService {
    switch (serverType) {
      case 'Influxdb':
        break;
      case 'Postgresql':
        return this.postgresService;
      case 'Oracle':
        return this.oracleService;
      case 'Mariadb':
      case 'Mysql':
        return this.mysqlService;
      case 'SQLServer':
        return this.mssqlService;
      case 'DM':
        return this.dmService;
    }
    return this.unrealizedSqlService;
  }

  public getDialect(serverType: ServerType): BaseSqlDialect {
    switch (serverType) {
      case 'Influxdb':
        break;
      case 'Postgresql':
        return this.postgresDialect;
      case 'Mariadb':
      case 'Mysql':
      case 'TiDB':
      case 'OceanBase':
        return this.mysqlDialect;
      case 'Oracle':
        return this.oracleDialect;
      case 'SQLServer':
        return this.mssqlDialect;
      case 'DM':
        return this.dmDialect;
      case 'DB2':
        return this.db2Dialect;
      case 'ClickHouse':
        return this.clickHouseDialect;
      case 'Hive':
        return this.hiveDialect;
      case 'Trino':
        return this.trinoDialect;
      case 'TDEngine':
        return this.tdEngineDialect;
      default:
        return this.emptyDialect;
    }
    return this.defaultDialect;
  }

  public async sqlQuery(connectQuery: ConnectQuery, sql: string, alyColumn = false): Promise<IRunSqlResult> {
    const {
      server: { serverType },
    } = connectQuery;
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.query(connectQuery, sql, alyColumn);
    } else {
      const sqlService = this.sqlService(serverType);
      return sqlService.runSql(connectQuery, sql);
    }
  }

  public async sqlExec(connectQuery: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    const {
      server: { serverType },
    } = connectQuery;
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.exec(connectQuery, sql);
    } else {
      const sqlService = this.sqlService(serverType);
      return sqlService.runSql(connectQuery, sql);
    }
  }

  public async sqlExecBatch(
    connectQuery: ConnectQuery,
    batchSql: string[],
    isTransaction = false,
  ): Promise<IRunSqlResult[]> {
    const {
      server: { serverType },
    } = connectQuery;
    console.log('sqlExecBatch', batchSql);
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.runBatch(connectQuery, batchSql, isTransaction);
    } else {
      const sqlService = this.sqlService(serverType);
      return sqlService.runBatch(connectQuery, batchSql, isTransaction);
    }
  }

  async runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    const serverType = connect.server.serverType!;
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.runSql(connect, sql);
    } else {
      let newSql = sql.replace(/^\s*--.+/gim, '').trim();
      let runSqlResult = await this.sqlQuery(connect, newSql);
      this.adapterFields(serverType, runSqlResult);
      return runSqlResult;
    }
  }

  /**
   * 执行用户选中的sql或者右键选中的sql
   * @param connect
   * @param batchSql
   * @param isTransaction
   */
  async runBatch(connect: ConnectQuery, batchSql: string, isTransaction?: boolean): Promise<IRunSqlResult[]> {
    const serverType = connect.server.serverType!;
    const config = ServerPreferences[serverType];
    //1.去除注释 2.根据sql进行按';'分割
    let sqlList: string[] = DocumentParser.parseBlocks(batchSql);
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.runBatch(connect, sqlList, isTransaction);
    } else {
      let multiRunSqlResult = await this.sqlService(serverType).runBatch(connect, sqlList);
      multiRunSqlResult.forEach((item) => {
        this.adapterFields(serverType, item);
      });
      return multiRunSqlResult;
    }
  }

  /**
   * 以后挪到connect里面中
   * dataTypeID:1043
   * name:"head_img_url"
   * @param serverType
   * @param result
   */
  adapterFields(serverType: ServerType, result: IRunSqlResult) {
    if (!result) return;
    if (!result.isQuery) return;
    if (!result.fields) return;
    console.log('查询的fields', result.fields);
    let columnMetas: IColumnMeta[] = [];
    for (let field of result.fields) {
      //console.log(serverType, 'adapterFields', field);
      switch (serverType) {
        case 'Mysql':
        case 'Mariadb':
          let myColumnType = MysqlConvert.fieldsIdToColumn(field.columnType);
          columnMetas.push({
            name: field.name,
            label: field.label,
            columnType: myColumnType,
            columnLength: field.columnLength,
            dataType: MysqlConvert.fieldToInputType(myColumnType),
          });
          break;
        case 'Postgresql':
          let pColumnType = PostgresConvert.fieldsIdToColumn(field.dataTypeID);
          columnMetas.push({
            name: field.name,
            label: field.label,
            columnType: pColumnType,
            columnDefinition: pColumnType,
            dataType: PostgresConvert.fieldToInputType(pColumnType),
          });
          break;
        case 'Oracle':
          columnMetas.push({
            name: field.name,
            label: field.label,
            columnType: field.dbTypeName,
            columnDefinition: field.dbTypeName,
            dataType: PostgresConvert.fieldToInputType(field.dbTypeName),
          });
          break;
      }
    }
    result.columns = columnMetas;
  }

  async ping(connect: ConnectQuery) {
    const serverType = connect.server.serverType!;
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      return this.jdbcServiceClient.ping(connect);
    } else {
      const result = await this.sqlQuery(connect, this.getDialect(serverType).pingDialect());
      await this.sqlService(serverType).closeConnection(connect);
      return result;
    }
  }

  async closeConnection(connect: ConnectQuery): Promise<boolean> {
    const serverType = connect.server.serverType!;
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc) {
      await this.jdbcServiceClient.closeConnection(connect);
    } else {
      await this.sqlService(serverType!).closeConnection(connect);
    }
    return true;
  }

  async clearJdbcServer(serverId: string) {
    return await this.jdbcServiceClient.clearJdbcServer(serverId);
  }

  /**
   * 加载子菜单
   * @param connect
   */
  async showDatabases(connect: ConnectQuery): Promise<IRunSqlResult<string[]>> {
    const {
      server: { serverType, host, port, database },
    } = connect;

    if (serverType === 'DB2') {
      return { success: true, data: [database] };
    }
    const sql = this.getDialect(serverType!).showDatabases();
    const config = ServerPreferences[serverType];
    if (config.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showDatabases(connect);
    } else {
      const queryResult = await this.sqlQuery(connect, sql);
      if (!queryResult.success) {
        return queryResult;
      }
      let nodes = queryResult.data!.map((value) => {
        if (MysqlTypeDb.includes(serverType)) return value.Database;
        else if (serverType === 'Hive') return value['database_name'];
        else return value.database;
      });
      return { ...queryResult, data: nodes };
    }
  }

  async showDatabaseInfo(server: ServerInfo, dbName: string): Promise<IRunSqlResult<IDbDetail[]>> {
    const serverType = server.serverType!;
    const sql = this.getDialect(serverType).showDatabaseInfo(dbName);
    const queryResult = await this.sqlQuery({ server }, sql);
    return queryResult;
  }

  async showSchemas(connect: ConnectQuery): Promise<IRunSqlResult<string[]>> {
    const { server, db } = connect;
    const serverType = server.serverType!;
    const config = ServerPreferences[serverType];
    const sql = this.getDialect(serverType).showSchemas(db + '');
    if (config.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showSchemas(connect);
    } else {
      const queryResult = await this.sqlQuery({ server, db }, sql);
      if (!queryResult.success) {
        return queryResult;
      }
      let nodes: string[] = [];
      queryResult.data!.map((value) => {
        let schema = value.schema;
        nodes.push(schema);
      });
      return { ...queryResult, data: nodes };
    }
  }

  async showSchemaInfo(connect: ConnectQuery, schema: string): Promise<IRunSqlResult<IDbDetail[]>> {
    const serverType = connect.server.serverType!;
    const sql = this.getDialect(serverType).showSchemaInfo(schema);
    const queryResult = await this.sqlQuery(connect, sql);
    return queryResult;
  }

  async showTables(connect: ConnectQuery): Promise<IRunSqlResult<ITableMeta[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const config = ServerPreferences[serverType];
    if (!db) {
      console.log('showTables error-------------->');
      return { success: false, message: 'no db', data: [] };
    }
    const sql = this.getDialect(serverType).showTables({ server, db: db + '', schema });
    if (config.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showTables(connect);
    } else {
      const queryResult = await this.sqlQuery(connect, sql);
      if (!queryResult.success) {
        return queryResult;
      }
      if (serverType === 'Hive') {
        let nodes: ITableMeta[] = queryResult.data!.map((value) => ({ name: value['tab_name'] }));
        return { ...queryResult, data: nodes };
      } else {
        return queryResult;
      }
    }
  }

  async showColumns(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<IColumnMeta[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const serverPref = ServerPreferences[serverType];
    const sql = this.getDialect(serverType).showColumns({ server, db: db + '', schema }, tableName);
    if(isEmpty(sql) && serverPref.connectUseJdbc){
      return  this.jdbcServiceClient.showColumns(connect,tableName);
    }
    return this.sqlQuery(connect, sql);
  }

  async showMultiTableColumns(connect: ConnectQuery, tables: string[]): Promise<IRunSqlResult<IColumnMeta[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const queryResult = await this.sqlQuery(
      connect,
      this.getDialect(serverType).showMultiTableColumns({ server, db: db + '', schema }, tables),
    );
    console.log('showMultiTableColumns', queryResult);
    return queryResult;
  }

  async showPrimary(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<IPrimaryMeta[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const sql = this.getDialect(serverType).showPrimary({ server, db: db + '', schema }, tableName);
    const serverConfig = ServerPreferences[serverType];
    if (serverConfig.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showPrimary(connect, tableName);
    }
    return this.sqlQuery(connect, sql);
  }

  async showCreateTable(connect: ConnectQuery, table: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    if (([...MysqlTypeDb, 'DM'] as ServerType[]).includes(serverType)) {
      let sql = this.getDialect(serverType).showTableSource({ server, db: db + '', schema }, table);
      const queryResult = await this.sqlQuery(connect, sql);
      const data = queryResult.data;
      if (!queryResult.success) {
        return queryResult;
      }
      let tableCreateSql = '';
      if (data && data[0]) {
        if (MysqlTypeDb.includes(serverType)) {
          tableCreateSql = data[0]['Create Table'];
        } else if (serverType === 'DM') {
          if (data && data[0]) {
            tableCreateSql = data[0]['createTableSql']['data'];
          }
        }
      }
      return { ...queryResult, data: tableCreateSql };
    } else {
      const columnResult = await this.showColumns(connect, table);
      let columns: IColumnMeta[] = columnResult.success ? columnResult.data! : [];
      const tableInfoResult = await this.showTableInfo(connect, table);
      const tableInfo: ITableMeta = tableInfoResult.success ? tableInfoResult.data! : ({ name: table } as ITableMeta);
      const tablePrimaryResult = await this.showPrimary(connect, table);
      const primaryKeys = tablePrimaryResult.success ? tablePrimaryResult.data : [];
      console.log('tableInfo----->', tableInfo);
      const createTableSql = this.getDialect(serverType).buildCreateTableSql(
        { server, db: db + '', schema },
        tableInfo,
        columns,
        primaryKeys,
      );

      return { success: true, data: createTableSql };
    }
    // return QueryResultError.UNREALIZED_ERROR;
  }

  async showViews(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const config = ServerPreferences[serverType];
    const sql = this.getDialect(serverType).showViews(connectInfo);
    if (config.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showViews(connect);
    } else {
      const queryResult = await this.sqlQuery(connect, sql);
      if (!queryResult.success) {
        return queryResult;
      }
      if (serverType === 'Hive') {
        let nodes: IVFTSPInfo[] = queryResult.data!.map((value) => ({ name: value['tab_name'] }));
        return { ...queryResult, data: nodes };
      } else {
        return queryResult;
      }
    }
  }

  async showViewSource(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType).showViewSource(connectInfo, trigger);
    const queryResult = await this.sqlQuery(connect, sql);
    if (queryResult.success && queryResult.data) {
      const { data } = queryResult;
      let createSql = '';
      if (data[0]) {
        if (MysqlTypeDb.includes(serverType)) {
          createSql = data[0]['Create View'];
        } else if (serverType === 'DM') {
          createSql = data[0]['createTableSql']['data'];
        } else {
          createSql = data[0]['ViewDefinition'];
        }
      }
      return { ...queryResult, data: createSql };
    } else {
      return queryResult as IRunSqlResult;
    }
  }

  async showTriggers(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType).showTriggers(connectInfo);
    const queryResult = await this.sqlQuery(connect, sql);
    return queryResult;
    // if (!queryResult.success) {
    //   return queryResult;
    // }
    // let nodes: string[] = queryResult.data.map((value) => {
    //   if (serverType === 'Postgresql') {
    //     return `${value['name']}(${value['tableName']})`;
    //   } else {
    //     return value['name'];
    //   }
    // });
    // return { success: true, data: nodes };
  }

  async showTrigger(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<StrKeyObject[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    if (serverType === 'Postgresql') {
      trigger = trigger.split('(')[0];
    }
    const sql = this.getDialect(serverType).showTrigger(connectInfo, trigger);
    return await this.sqlQuery(connect, sql);
  }

  async showTriggerSource(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    if (serverType === 'Postgresql') {
      trigger = trigger.split('(')[0];
    }
    const sql = this.getDialect(serverType).showTriggerSource(connectInfo, trigger);
    const queryResult = await this.sqlQuery(connect, sql, false);
    if (queryResult.success && queryResult.data) {
      const { data } = queryResult;
      let createSql = '';
      if (serverType === 'Oracle') {
        createSql = OracleUtils.getCreateSql(data);
      } else if (MysqlTypeDb.includes(serverType)) {
        createSql = data[0]['SQL Original Statement'];
      } else if (serverType === 'DM') {
        if (data && data[0]) {
          createSql = data[0]['text']['data'];
        }
      } else {
        createSql = data[0]['createTriggerSql'];
      }
      return { ...queryResult, data: createSql };
    } else {
      return queryResult as IRunSqlResult;
    }
  }

  async showFunctions(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const config = ServerPreferences[serverType];
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showFunctions(connectInfo);
    if (config.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showFunctions(connect);
    } else {
      const queryResult = await this.sqlQuery(connect, sql);
      return queryResult;
    }
  }

  async showFunction(connect: ConnectQuery, functionName: string): Promise<IRunSqlResult<StrKeyObject[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showFunction(connectInfo, functionName);
    return await this.sqlQuery(connect, sql);
  }

  async showFunctionSource(connect: ConnectQuery, functionName: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showFunctionSource(connectInfo, functionName);
    const queryResult: IRunSqlResult<StrKeyObject[]> = await this.sqlQuery(connect, sql);
    let createSql = '';
    if (queryResult.success && queryResult.data) {
      const { data } = queryResult;
      if (serverType === 'Oracle') {
        createSql = OracleUtils.getCreateSql(data);
      } else if (MysqlTypeDb.includes(serverType)) {
        createSql = data[0]['Create Function'];
      } else if (serverType === 'DM') {
        if (data && data[0]) {
          createSql = data[0]['text']['data'];
        }
      } else {
        createSql = data[0]['createFunctionSql'];
      }
      return { ...queryResult, data: createSql };
    } else {
      return queryResult as IRunSqlResult;
    }
  }

  async showSequences(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showSequences(connectInfo);
    return this.sqlQuery(connect, sql);
  }

  async showSequence(connect: ConnectQuery, sequence: string): Promise<IRunSqlResult<StrKeyObject[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showSequence(connectInfo, sequence);
    return this.sqlQuery(connect, sql);
  }

  async showSequenceSource(connect: ConnectQuery, sequence: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showSequenceSource(connectInfo, sequence);
    const queryResult = await this.sqlQuery(connect, sql);
    if (queryResult.success) {
      return { ...queryResult, data: queryResult.data[0]['text'] };
    }
    return queryResult;
  }

  async showProcedures(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    const serverPreference = ServerPreferences[serverType];
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showProcedures(connectInfo);
    if (serverPreference.connectUseJdbc && isEmpty(sql)) {
      return this.jdbcServiceClient.showProcedures(connect);
    } else {
      return this.sqlQuery(connectInfo, sql);
    }
  }

  async showProcedure(connect: ConnectQuery, procedureName: string): Promise<IRunSqlResult<StrKeyObject[]>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showProcedure(connectInfo, procedureName);
    return await this.sqlQuery(connect, sql);
  }

  async showProcedureSource(connect: ConnectQuery, procedureName: string): Promise<IRunSqlResult<string>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType!).showProcedureSource(connectInfo, procedureName);
    const queryResult: IRunSqlResult<StrKeyObject[]> = await this.sqlQuery(connect, sql);
    let createSql = '';
    if (queryResult.success && queryResult.data) {
      const { data } = queryResult;
      if (serverType === 'Oracle') {
        createSql = OracleUtils.getCreateSql(data);
      } else if (MysqlTypeDb.includes(serverType)) {
        createSql = data[0]['Create Procedure'];
      } else if (serverType === 'DM') {
        if (data && data[0]) {
          createSql = data[0]['text']['data'];
        }
      } else {
        createSql = data[0]['createProcedureSql'];
      }

      return { ...queryResult, data: createSql };
    } else {
      return queryResult as IRunSqlResult;
    }
  }

  async showTableInfo(connect: ConnectQuery, table: string): Promise<IRunSqlResult<ITableMeta>> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const sql = this.getDialect(serverType).showTableInfo(connectInfo, table);
    const queryResult = await this.sqlQuery(connect, sql);
    if (queryResult && queryResult.success) {
      const data: ITableMeta =
        queryResult.data && queryResult.data[0] ? queryResult.data[0] : ({ name: table } as ITableMeta);
      return { ...queryResult, data };
    }
    return queryResult;
  }

  async countPrimary(connect: ConnectQuery, tableName: string): Promise<number> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let sql = this.getDialect(serverType).countPrimary(connectInfo, tableName);
    const queryResult = await this.sqlQuery(connect, sql);
    if (!queryResult.success) {
      return 0;
    }
    return queryResult.data[0]['total'];
  }

  /**
   * 没有schema，postgre可能会有错误
   * @param serverInfo
   * @param execSql
   */

  async countTable(connect: ConnectQuery, connectInfo: IConnectInfo, table: string): Promise<number> {
    const serverType = connect.server.serverType!;
    let sql = this.getDialect(serverType!).countTable(connectInfo, table);
    let queryResult: IRunSqlResult = await this.sqlQuery(connect, sql);
    if (queryResult?.success) {
      if ((['TDEngine','Postgresql'] as ServerType[]).includes(serverType) ) {
        return queryResult.data[0]['total'];
      }
      return queryResult.data[0]['TOTAL'];
    }
    return 0;
  }

  async existNode(connect: ConnectQuery, type: AllNodeType, name?: string): Promise<boolean> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    //createNodeType: SqlNodeType, db: string,schema:string, newName: string
    let sql;
    switch (type) {
      //server下面创建db
      case 'server':
      case 'db':
        sql = this.getDialect(serverType).countByDatabase(connectInfo);
        break;
      //以下几种，都时创建表格，
      case 'tables':
      case 'table':
      case 'views':
      case 'view':
        sql = this.getDialect(serverType).countByTable(connectInfo, name!);
        break;
      case 'functions':
      case 'function':
        break;
    }
    const queryResult = await this.sqlQuery(connect, sql);
    if (!queryResult.success) {
      return false;
    }
    return queryResult.data[0]['total'] > 0;
  }

  async dropByType(connect: ConnectQuery, type: AllNodeType, name: string, tableName?: string): Promise<IQueryResult> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let sql: string = '';
    switch (type) {
      case 'db':
      case 'basicDb':
        sql = this.getDialect(serverType).dropDatabase(name);
        delete connect.schema;
        break;
      case 'schema':
      case 'basicSchema':
        sql = this.getDialect(serverType!).dropSchema(name);
        delete connect.schema;
        break;
      case 'table':
      case 'basicTable':
        sql = this.getDialect(serverType!).dropTable(connectInfo, name);
        break;
      case 'view':
      case 'basicView':
        sql = this.getDialect(serverType!).dropView(connectInfo, name);
        break;
      case 'function':
      case 'basicFunction':
        sql = this.getDialect(serverType).dropFunction(connectInfo, name);
        break;
      case 'sequence':
        sql = this.getDialect(serverType).dropSequence(connectInfo, name);
        break;
      case 'procedure':
      case 'basicProcedure':
        sql = this.getDialect(serverType).dropProcedure(connectInfo, name);
        break;
      case 'trigger':
        sql = this.getDialect(serverType).dropTrigger(connectInfo, name, tableName);
        break;
    }
    if (isEmpty(sql)) {
      return QueryResultError.SQL_ERROR;
    }
    console.log('dropByType---------->', sql);
    return this.sqlExec(connect, sql);

    //return Promise.resolve(QueryResultError.UNREALIZED_ERROR);
  }

  async renameByType(
    connect: ConnectQuery,
    type: AllNodeType,
    oldName: string,
    newName: string,
  ): Promise<IQueryResult> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let sql;
    switch (type) {
      case 'db':
        break;
      case 'schema':
        break;
      case 'table':
        sql = this.getDialect(serverType).alterTableToRename(connectInfo, oldName, newName);
        break;
      case 'view':
        break;
      case 'function':
        break;
    }
    if (sql) {
      return await this.sqlExec(connect, sql);
    }
    return QueryResultError.UNREALIZED_ERROR;
  }

  async selectTableData(
    connect: ConnectQuery,
    tableName: string,
    page: IPage,
    filterParams?: IWhereParam[],
  ): Promise<ITableDataResult> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const searchSql = this.getDialect(serverType!).selectTableByPageAndWhere(
      connectInfo,
      tableName,
      page.page,
      page.pageSize,
      filterParams,
    );
    //const pageSql = this.getDialect(serverType!).selectSqlByPage(searchSql, page?.page, page?.pageSize);
    console.log('selectTableData:searchSql:', connect, searchSql);
    const config = ServerPreferences[serverType];
    let queryResult: IRunSqlResult;
    if (config.connectUseJdbc) {
      queryResult = await this.jdbcServiceClient.tableQuery(connect, searchSql, tableName);
    } else {
      queryResult = await this.sqlQuery(connect, searchSql);
    }
    if (!queryResult.success) {
      return queryResult;
    }
    //console.log('selectTableData finish,next count');
    //this.adapterFields(serverType!, queryResult);
    const total = await this.countTable(connect, connectInfo, tableName);
    //console.log('select count finish');
    return {
      ...queryResult,
      table: tableName,
      sql: searchSql,
      //columnList,
      //primaryKeyList,
      //primaryKey,
      database: db + '',
      total,
    };
  }

  async selectViewData(
    connect: ConnectQuery,
    tableName: string,
    page: IPage,
    whereParams?: IWhereParam[],
  ): Promise<ITableDataResult> {
    const { serverType } = connect.server;
    const config = ServerPreferences[serverType];
    let dataResponse: ITableDataResult = await this.selectTableData(connect, tableName, page, whereParams);
    //view 无法查询字段，需要自动适配
    if (!config.connectUseJdbc) {
      this.adapterFields(serverType!, dataResponse);
    }
    return dataResponse;
  }

  async deleteTablesAllData(connect: ConnectQuery, tableNames: string[]): Promise<IRunSqlResult[]> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const batchSql: string[] = [];
    for (const item of tableNames) {
      batchSql.push(this.getDialect(serverType).deleteAllData(connectInfo, item));
    }
    return await this.sqlExecBatch(connect, batchSql, false);
  }

  async deleteTableData(
    connect: ConnectQuery,
    tableName: string,
    primaryKey: string,
    ids: any[],
    primaryType: DataInputEnum,
  ): Promise<IRunSqlResult> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let sql = this.getDialect(serverType).delete(connectInfo, tableName, primaryKey, ids, primaryType);
    const queryResult = await this.sqlExec(connect, sql);
    return queryResult;
  }

  async deleteTableDataByCompositeKey(
    connect: ConnectQuery,
    table: string,
    keys: CompositeKeyParam[],
  ): Promise<IRunSqlResult> {
    const { server, db, schema } = connect;
    //const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let sql = this.getDialect(server.serverType!).deleteByCompositeKey(connectInfo, table, keys);
    return await this.sqlExec(connect, sql);
  }

  async deleteTableDataByCompositeKeys(
    connect: ConnectQuery,
    table: string,
    keys: CompositeKeyParam[][],
  ): Promise<IRunSqlResult[]> {
    const { server, db, schema } = connect;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    let batchSql: string[] = [];
    keys.map((item) => {
      let sql = this.getDialect(server.serverType!).deleteByCompositeKey(connectInfo, table, item);
      batchSql.push(sql);
    });

    return await this.sqlExecBatch(connect, batchSql);
  }

  async updateBatchData(
    connect: ConnectQuery,
    table: string,
    updateDataSet: Set<UpdateParam>,
  ): Promise<IRunSqlResult[]> {
    let batchSql: string[] = [];
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    for (let itemData of updateDataSet) {
      let genSql = this.getDialect(serverType).buildUpdateData(connectInfo, table, itemData);
      batchSql.push(genSql);
    }
    // console.log('runBatch------------------------------batchSql->', batchSql);
    const result = await this.sqlExecBatch(connect, batchSql);
    console.log('runBatch-------------->', batchSql, '-----', result);
    return result;
  }

  async updateBatchDataByCompositeKey(
    connect: ConnectQuery,
    table: string,
    updateDataSet: Set<UpdateCompositeKeyParam>,
  ): Promise<IRunSqlResult[]> {
    let batchSql: string[] = [];
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db as string, schema };
    for (let itemData of updateDataSet) {
      let genSql = this.getDialect(serverType).buildUpdateDataByCompositeKey(connectInfo, table, itemData);
      batchSql.push(genSql);
    }
    return await this.sqlExecBatch(connect, batchSql);
    //console.log('runBatch------------------------------batchSql->', batchSql);
  }

  async createDb(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]> {
    const { server } = connect;
    const serverType = server.serverType!;
    const createDbSql = this.getDialect(serverType!).createDb(param);
    if (createDbSql.length === 0) {
      return [QueryResultError.SQL_ERROR];
    }
    return this.sqlExecBatch(connect, createDbSql, false);
  }

  async alterDb(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]> {
    const { server } = connect;
    const serverType = server.serverType!;
    const editDbSql = this.getDialect(serverType!).alterDb(param);
    console.log('==========>sql-server-api:', editDbSql);
    const result = await this.sqlExecBatch(connect, editDbSql);
    return result;
  }

  async createSchema(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]> {
    const { server } = connect;
    const serverType = server.serverType!;
    const createSchemaSql = this.getDialect(serverType!).createSchema(param);
    const result = await this.sqlExecBatch(connect, createSchemaSql, false);
    return result;
  }

  async alterSchema(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]> {
    const { server } = connect;
    const serverType = server.serverType!;
    const createSchemaSql = this.getDialect(serverType!).alterSchema(param);
    const result = await this.sqlExecBatch(connect, createSchemaSql);
    return result;
  }

  async createTableStructure(connect: ConnectQuery, createTableParam: CreateTableParam): Promise<IRunSqlResult[]> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    const createTableSql = this.getDialect(serverType!).createTable(connectInfo, createTableParam);
    const result = await this.sqlExecBatch(connect, createTableSql);
    console.log('createTableStructure--->', createTableSql);
    return result;
  }

  async updateTableStructure(
    connect: ConnectQuery,
    table: string,
    removeParams: Set<string>,
    updateParams: UpdateColumnParam[],
    createParams: CreateColumnParam[],
    sortParams: SortColumnParam[],
    finalPrimaryParams: string[],
    autoIncrementParam?: UpdateColumnParam,
  ): Promise<IRunSqlResult[]> {
    const { server, db, schema } = connect;
    const serverType = server.serverType!;
    let connectInfo: IConnectInfo = { server, db: db + '', schema };
    console.log(`参数--》${db},${schema},${table}`);
    let batchSql: string[] = [];
    let removeSql = this.getRemoveColumnSql(connect, connectInfo, table, removeParams);
    let updateSql = this.getUpdateColumnSql(connect, connectInfo, table, updateParams);
    let createSql = this.getCreateColumnSql(connect, connectInfo, table, createParams);
    let sortSql = this.getSortColumnSql(connect, connectInfo, table, sortParams);
    let primarySql = await this.getPrimarySql(connect, connectInfo, table, finalPrimaryParams, removeParams);
    let autoIncrementSql = this.getUpdateAutoIncrementSql(connect, connectInfo, table, autoIncrementParam);
    if (removeSql && removeSql.length > 0) {
      batchSql = batchSql.concat(removeSql);
    }
    if (updateSql && updateSql.length > 0) {
      batchSql = batchSql.concat(updateSql);
    }
    if (createSql && createSql.length > 0) {
      batchSql = batchSql.concat(createSql);
    }
    if (sortSql && sortSql.length > 0) {
      batchSql = batchSql.concat(sortSql);
    }
    if (primarySql && primarySql.length > 0) {
      batchSql = batchSql.concat(primarySql);
    }
    if (autoIncrementSql) {
      batchSql.push(autoIncrementSql);
    }
    console.log('updateTableStructure1-------------->', batchSql, '-----');
    if (batchSql.length === 0) {
      return [{ success: true }];
    }
    const result = await this.sqlExecBatch(connect, batchSql.filter(Boolean));
    console.log('updateTableStructure2---end-------------->', result);
    return result;
  }

  getRemoveColumnSql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    removeParams: Set<string>,
  ): string[] {
    if (!removeParams || removeParams.size === 0) {
      return [];
    }
    let batchSql: string[] = [];
    for (let columnName of removeParams) {
      let sql = this.getDialect(connect.server.serverType!).deleteColumn(connectInfo, table, columnName);
      batchSql.push(sql);
    }
    console.log('generatorRemoveColumnSql:', batchSql);
    return batchSql;
  }

  getUpdateColumnSql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    updateParams: UpdateColumnParam[],
  ): string[] {
    if (!updateParams || updateParams.length === 0) {
      return [];
    }
    let batchSql: string[] = [];
    for (let param of updateParams) {
      let sql = this.getDialect(connect.server.serverType!).alterColumnSql(connectInfo, table, param);
      batchSql = batchSql.concat(sql);
    }
    console.log('getUpdateColumnSql:', batchSql);
    return batchSql;
  }

  getUpdateAutoIncrementSql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    updateParam?: UpdateColumnParam,
  ): string {
    if (!updateParam) {
      return '';
    }
    let sql = this.getDialect(connect.server.serverType!).alterAutoIncrementSql(connectInfo, table, updateParam);
    console.log('generatorUpdateAutoIncrementSql:', sql);
    return sql;
  }

  getCreateColumnSql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    createParams: CreateColumnParam[],
  ): string[] {
    if (!createParams || createParams.length === 0) {
      return [];
    }
    let batchSql: string[] = [];
    for (let param of createParams) {
      //放弃操作primary和自增，由后面的代码操作
      let sql = this.getDialect(connect.server.serverType!).createColumn(connectInfo, table, {
        ...param,
      });
      batchSql = batchSql.concat(sql);
    }
    console.log('generatorCreateColumnSql:', batchSql);
    return batchSql;
  }

  getSortColumnSql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    sortParams: SortColumnParam[],
  ): string[] {
    if (!sortParams || sortParams.length === 0) {
      return [];
    }
    let batchSql: string[] = [];
    for (let param of sortParams) {
      let sql = this.getDialect(connect.server.serverType!).alterColumnToSortSql(connectInfo, table, param);
      batchSql.push(sql);
    }
    console.log('getSortColumnSql:', batchSql);
    return batchSql;
  }

  async getPrimarySql(
    connect: ConnectQuery,
    connectInfo: IConnectInfo,
    table: string,
    finalPrimaryKeys: string[],
    removeColumn: Set<string>,
  ): Promise<string[]> {
    let batchSql: string[] = [];
    const existPrimaryKeys = (await this.showPrimary(connect, table)).data!;
    const existPrimaryStr = existPrimaryKeys ? existPrimaryKeys?.map((item) => item.columnName) : [];
    //const isExistPrimary = existPrimaryStr && existPrimaryStr.length > 0;
    console.log(
      'existPrimaryStr',
      existPrimaryKeys,
      existPrimaryStr?.join('-'),
      'finalPrimaryKeys',
      finalPrimaryKeys.join('-'),
    );
    //
    const dealExistPrimaryKeyMetas: IPrimaryMeta[] = [];
    const dealExistPrimaryKeys: string[] = [];
    //remove 删除列的时候，会把字段主键也删除，所以认为不存在

    for (let existPriItem of existPrimaryStr) {
      if (!removeColumn.has(existPriItem)) {
        dealExistPrimaryKeys.push(existPriItem);
      }
    }

    if (dealExistPrimaryKeys && dealExistPrimaryKeys.length > 0) {
      existPrimaryKeys.map((item) => {
        if (dealExistPrimaryKeys.includes(item.columnName)) {
          dealExistPrimaryKeyMetas.push(item);
        }
      });
    }

    //对比条件 与数据库存储的长度不一致，或者变成字符串相比不一致都需要修改
    if (
      dealExistPrimaryKeys.length !== finalPrimaryKeys.length ||
      dealExistPrimaryKeys.join('-') !== finalPrimaryKeys.join('-')
    ) {
      batchSql = this.getDialect(connect.server.serverType!).updatePrimaryKey(
        connectInfo,
        dealExistPrimaryKeyMetas,
        table,
        finalPrimaryKeys,
      );
    }
    console.log('getPrimarySql:', batchSql);
    return batchSql;
  }

  //-----------------------------example sql --------------------------------------------------
  async selectSqlExample(connect: ConnectQuery, tableName: string): Promise<string> {
    const result = await this.showColumns(connect, tableName);
    if (!result.success) return '';
    const columns: IColumnMeta[] = result.data!;
    const columnNames = columns.map((item) => item.name);
    let sql = this.getDialect(connect.server.serverType!).selectExample(tableName, columnNames);
    return sql;
  }

  async insertSqlExample(connect: ConnectQuery, tableName: string): Promise<string> {
    const result = await this.showColumns(connect, tableName);
    if (!result.success) return '';
    const columns: IColumnMeta[] = result.data!;
    let sql = this.getDialect(connect.server.serverType!).insertExample(tableName, columns);
    return sql;
  }

  async updateSqlExample(connect: ConnectQuery, tableName: string): Promise<string> {
    const result = await this.showColumns(connect, tableName);
    if (!result.success) return '';
    const columns: IColumnMeta[] = result.data!;
    let sql = this.getDialect(connect.server.serverType!).updateExample(tableName, columns);
    return sql;
  }

  async deleteSqlExample(connect: ConnectQuery, tableName: string): Promise<string> {
    const result = await this.showPrimary(connect, tableName);
    if (!result.success) return '';
    const primaryMetas: IPrimaryMeta[] = result.data!;
    let sql = this.getDialect(connect.server.serverType!).deleteExample(tableName, primaryMetas);
    return sql;
  }

  //  updatePostgresPrimaryKey(connectInfo: IConnectInfo, isExistKey: boolean, table: string, primaryKeys: string[]): string {
  //   let schema = connectInfo.schema?connectInfo.schema:'public'
  //   console.error('sql语句未实现updatePrimaryKey');
  //   if(isExistKey){
  //     let sql = 'alter table auth.sys_stu drop constraint ';
  //   }
  //   let addPri = `ALTER TABLE ${schema}.${table} ADD CONSTRAINT sys_stu_pkey PRIMARY KEY (${primaryKeys.join(',')}) `
  //   return ``;
  // }
}
