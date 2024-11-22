import { ConnectQuery, ServerInfo } from '../../local-store-db/common/model.define';
import { IQueryResult, IRunSqlResult } from './types/query-result.types';
import { IPage } from '../../components/pagination';
import {
  CompositeKeyParam,
  CreateColumnParam,
  CreateTableParam,
  SortColumnParam,
  UpdateColumnParam,
  UpdateCompositeKeyParam,
  UpdateParam,
} from './types/sql-param.types';
import { AllNodeType } from '../../base/types/server-node.types';
import { IDbDetail } from './types/common.types';
import { IColumnMeta, IPrimaryMeta, ITableMeta, IVFTSPInfo } from './types/sql-meta.types';
import { IWhereParam } from '../../base/model/sql-param.model';
import { DataInputEnum } from '../../base/types/edit-input.types';
import { StrKeyObject } from '../../base/model/common.model';

export * from './types/common.types';
export * from './types/mysql.types';
export * from './types/redis.types';
export * from './types/postgres.types';
export * from './types/oracle.types';
export * from './types/mssql.types';
export * from './types/dm.types';
export * from './types/zookeeper.types';
export * from './types/kafka.types';
export * from './types/sql-meta.types';
export * from './types/sql-param.types';
export * from './types/query-result.types';

export const ICommonServerApiToken = Symbol('ICommonServerApiToken');
export const IRegisterServerApiToken = Symbol('IRegisterServerApiToken');
export const ISqlServerApiToken = Symbol('ISqlServerApiToken');
export const IJdbcServerApiToken = Symbol('IJdbcServerApiToken');

export const IJdbcServiceClientToken = Symbol('IJdbcServiceClientToken');
export const IJdbcServiceClientPath = 'IJdbcServiceClientPath';

export interface IBaseService {
  /**
   * 关闭服务链接
   * @param connect
   */
  closeConnection?(connect: ConnectQuery): Promise<boolean>;

  //closeServerConnection?(serverId: string): Promise<void>;
}

export interface IBaseSqlService extends IBaseService {
  runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult>;

  runBatch(connect: ConnectQuery, batchSql: string[], isTransaction?: boolean): Promise<IRunSqlResult[]>;
}

export interface ISqlServiceApi {
  closeConnection(server: ServerInfo): Promise<boolean>;

  ping(connect: ConnectQuery): Promise<IQueryResult>;

  runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult>;

  runBatch(connect: ConnectQuery, batchSql: string, isTransaction?: boolean): Promise<IRunSqlResult[]>;

  showDatabases(connect: ConnectQuery): Promise<IRunSqlResult<string[]>>;

  showDatabaseInfo(server: ServerInfo, dbName: string): Promise<IRunSqlResult<IDbDetail[]>>;

  showSchemas(connect: ConnectQuery): Promise<IRunSqlResult<string[]>>;

  showSchemaInfo(connect: ConnectQuery, schema: string): Promise<IRunSqlResult<IDbDetail[]>>;

  showTables(connect: ConnectQuery): Promise<IRunSqlResult<ITableMeta[]>>;

  showTableInfo(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<ITableMeta>>;

  showViews(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>>;

  showViewSource(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<string>>;

  showTriggers(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>>;

  showTrigger(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<StrKeyObject[]>>;

  showTriggerSource(connect: ConnectQuery, trigger: string): Promise<IRunSqlResult<string>>;

  showFunctions(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>>;

  showFunction(connect: ConnectQuery, functionName: string): Promise<IRunSqlResult<StrKeyObject[]>>;

  showFunctionSource(connect: ConnectQuery, functionName: string): Promise<IRunSqlResult<string>>;

  showSequences(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>>;

  showSequence(connect: ConnectQuery, sequence: string): Promise<IRunSqlResult<StrKeyObject[]>>;

  showProcedures(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>>;

  showProcedure(connect: ConnectQuery, functionName: string): Promise<IRunSqlResult<StrKeyObject[]>>;

  showProcedureSource(connect: ConnectQuery, procedureName: string): Promise<IRunSqlResult<string>>;

  showCreateTable(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<string>>;

  showColumns(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<IColumnMeta[]>>;

  showMultiTableColumns(connect: ConnectQuery, tableNames: string[]): Promise<IRunSqlResult<IColumnMeta[]>>;

  showPrimary(connect: ConnectQuery, tableName: string): Promise<IRunSqlResult<IPrimaryMeta[]>>;

  //

  /**
   * 重命名
   * @param connect
   * @param type
   * @param oldName
   * @param newName
   */
  renameByType(connect: ConnectQuery, type: AllNodeType, oldName: string, newName: string): Promise<IRunSqlResult>;

  /**
   * 删除左侧树节点
   * @param connect
   * @param type
   * @param name
   */
  dropByType(connect: ConnectQuery, type: AllNodeType, name: string): Promise<IRunSqlResult>;

  /**
   *
   * @param connect
   * @param tableNames
   */
  deleteTablesAllData(connect: ConnectQuery, tableNames: string[]): Promise<IRunSqlResult[]>;

  existNode(connect: ConnectQuery, type: AllNodeType, name?: string): Promise<boolean>;

  selectTableData(
    connect: ConnectQuery,
    tableName: string,
    page: IPage,
    whereParams?: IWhereParam[],
  ): Promise<IRunSqlResult>;

  selectViewData(
    connect: ConnectQuery,
    tableName: string,
    page: IPage,
    whereParams?: IWhereParam[],
  ): Promise<IRunSqlResult>;

  deleteTableData(
    connect: ConnectQuery,
    tableName: string,
    primaryKey: string,
    ids: any[],
    primaryType: DataInputEnum,
  ): Promise<IRunSqlResult>;

  deleteTableDataByCompositeKey(
    connect: ConnectQuery,
    tableName: string,
    keys: CompositeKeyParam[],
  ): Promise<IRunSqlResult>;

  deleteTableDataByCompositeKeys(
    connect: ConnectQuery,
    tableName: string,
    keys: CompositeKeyParam[][],
  ): Promise<IRunSqlResult[]>;

  updateBatchData(connect: ConnectQuery, table: string, updateDataSet: Set<UpdateParam>): Promise<IRunSqlResult[]>;

  updateBatchDataByCompositeKey(
    connect: ConnectQuery,
    table: string,
    updateData: Set<UpdateCompositeKeyParam>,
  ): Promise<IRunSqlResult[]>;

  createDb(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]>;

  createSchema(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]>;

  alterDb(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]>;

  alterSchema(connect: ConnectQuery, param: IDbDetail): Promise<IRunSqlResult[]>;

  createTableStructure(connect: ConnectQuery, createTableParam: CreateTableParam): Promise<IRunSqlResult[]>;

  updateTableStructure(
    connect: ConnectQuery,
    table: string,
    removeParams: Set<string>,
    updateParams: UpdateColumnParam[],
    createParams: CreateColumnParam[],
    sortParams: SortColumnParam[],
    primaryParams: string[],
    autoIncrementParam: UpdateColumnParam,
  ): Promise<IRunSqlResult[]>;

  selectSqlExample(connect: ConnectQuery, tableName: string): Promise<string>;

  insertSqlExample(connect: ConnectQuery, tableName: string): Promise<string>;

  updateSqlExample(connect: ConnectQuery, tableName: string): Promise<string>;

  deleteSqlExample(connect: ConnectQuery, tableName: string, primary: IPrimaryMeta[]): Promise<string>;
}

export interface IBaseServiceClient {
  closeConnection(connect: ConnectQuery): Promise<boolean>;

  closeServerAllConnections?(connect: ConnectQuery): Promise<boolean>;
}

export interface ISqlServiceClient extends IBaseServiceClient {
  // query<T = any>(connectionOption: ConnectionToolsOption, sql: string): Promise<ISqlQueryResult<T>>;

  runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult>;

  runBatch(connect: ConnectQuery, batchSql: string[], isTransaction?: boolean): Promise<IRunSqlResult[]>;
}

export interface IJdbcSqlServiceClient extends ISqlServiceClient {
  query(connect: ConnectQuery, sql: string, alyColumn?: boolean): Promise<IRunSqlResult>;

  exec(connect: ConnectQuery, sql: string): Promise<IRunSqlResult>;
}

//生成sql时，数据是否加单引号
