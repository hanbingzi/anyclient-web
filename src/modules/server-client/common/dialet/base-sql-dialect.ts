import {
  CompositeKeyParam,
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  SortColumnParam,
  UpdateColumnParam,
  UpdateCompositeKeyParam,
  UpdateParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { IColumnMeta, IConnectInfo, IDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IWhereParam } from '../../../base/model/sql-param.model';
import { DataInputEnum } from '../../../base/types/edit-input.types';

export interface BaseSqlDialect {
  /*-----服务器操作-------------------------*/
  pingDialect(database?: string | number): string;

  useDataBase(database: string | number): string;

  useSchema(schema?: string): string;

  /*--------show-------------------------*/

  showIndex(connectInfo: IConnectInfo, table: string): string;

  showDatabases(): string;

  showDatabaseInfo(db: string): string;

  showSchemas(db?: string): string;

  showSchemaInfo(schema: string): string;

  showTables(connectInfo: IConnectInfo): string;

  showColumns(connectInfo: IConnectInfo, table: string): string;

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string;

  showViews(connectInfo: IConnectInfo): string;

  showViewSource(connectInfo: IConnectInfo, table: string): string;

  showUsers(): string;

  showPrimary(connectInfo: IConnectInfo, table: string): string;

  showTriggers(connectInfo: IConnectInfo): string;

  showTrigger(connectInfo: IConnectInfo, trigger: string): string;

  showTriggerSource(connectInfo: IConnectInfo, trigger: string): string;

  showProcedures(connectInfo: IConnectInfo): string;

  showProcedure(connectInfo: IConnectInfo, procedure: string): string;

  showProcedureSource(connectInfo: IConnectInfo, name: string): string;

  showFunctions(connectInfo: IConnectInfo): string;

  showFunction(connectInfo: IConnectInfo, _function: string): string;

  showFunctionSource(connectInfo: IConnectInfo, name: string): string;

  showSequences(connectInfo: IConnectInfo): string;

  showSequence(connectInfo: IConnectInfo, sequence: string): string;

  showSequenceSource(connectInfo: IConnectInfo, sequence: string): string;

  showTriggerSource(connectInfo: IConnectInfo, name: string): string;

  showTableSource(connectInfo: IConnectInfo, table: string): string;

  showVariableList(): string;

  showStatusList(): string;

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string;

  /*-----------select-------------------------*/
  selectSql(connectInfo: IConnectInfo, table: string): string;

  buildWhere(whereParams?: IWhereParam[]): string;

  // selectSqlByPage(sql: string, page?: number, pageSize?: number): string;

  selectTableByPage(connectInfo: IConnectInfo, table: string, page?: number, pageSize?: number): string;

  selectTableByPageAndWhere(
    connectInfo: IConnectInfo,
    table: string,
    page?: number,
    pageSize?: number,
    filterParams?: IWhereParam[],
  ): string;

  /*------create-------------------------*/
  createDb(param: IDbDetail): string[];

  createSchema(param: IDbDetail): string[];

  createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[];

  createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam): string[];

  createUser(): string;

  createDatabase(database: string): string;

  createIndex(createIndexParam: CreateIndexParam): string;

  /*-----------drop-------------------------*/

  dropDatabase(database: string): string;

  dropSchema(schema: string): string;

  dropTable(connectInfo: IConnectInfo, table: string): string;

  dropView(connectInfo: IConnectInfo, view: string): string;

  dropFunction(connectInfo: IConnectInfo, name: string): string;

  dropSequence(connectInfo: IConnectInfo, name: string): string;

  dropProcedure(connectInfo: IConnectInfo, name: string): string;

  dropTrigger(connectInfo: IConnectInfo, name: string, tableName?: string): string;

  dropIndex(table: string, indexName: string): string;

  dropTriggerTemplate(name: string): string;

  /*-----------rename-------------------------*/

  /*-----------count-------------------------*/

  countTable(connectInfo: IConnectInfo, table: string): string;

  countBySql(sql: string): string;

  countPrimary(connectInfo: IConnectInfo, table: string): string;

  //查询当前库是否存在
  countByDatabase(connectInfo: IConnectInfo): string;

  //查询当前表是否存在
  countByTable(connectInfo: IConnectInfo, table: string): string;

  /*-----------alter-------------------------*/

  alterDb(param: IDbDetail): string[];

  alterSchema(param: IDbDetail): string[];

  alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string;

  alterColumn(
    connectInfo: IConnectInfo,
    table: string,
    column: string,
    type: string,
    comment: string,
    nullable: string,
  ): string;

  alterColumnSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string[];

  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string;

  alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string): string;

  alterColumnToSortSql(connectInfo: IConnectInfo, table: string, sortColumnParam: SortColumnParam): string;

  /*-----------update-------------------------*/
  updatePrimaryKey(
    connectInfo: IConnectInfo,
    existPrimaryKeys: IPrimaryMeta[],
    table: string,
    primaryKeys?: string[],
  ): string[];

  /*-----------delete-----------------------*/
  deleteAllData(connectInfo: IConnectInfo, table: string): string;

  //删除表格数据
  delete(
    connectInfo: IConnectInfo,
    table: string,
    primaryKey: string,
    ids: number[] | string[],
    primaryType: DataInputEnum,
  ): string;

  deleteByCompositeKey(connectInfo: IConnectInfo, table: string, compositePrimaryKeys: CompositeKeyParam[]): string;

  deleteColumn(connectInfo: IConnectInfo, table: string, columnName: string): string;

  /*-----------build-------------------------*/

  buildUpdateData(connectInfo: IConnectInfo, table: string, updateData: UpdateParam,isTemplate?:boolean): string;

  buildUpdateDataByCompositeKey(connectInfo: IConnectInfo, table: string, updateData: UpdateCompositeKeyParam): string;

  buildCreateTableSql(
    connectInfo: IConnectInfo,
    tableInfo: ITableMeta,
    columns: IColumnMeta[],
    primaryKeys?: IPrimaryMeta[],
  ): string;

  /*-----------example-------------------------*/

  selectExample(tableName: string, columns: string[]): string;

  insertExample(tableName: string, columns: IColumnMeta[]): string;

  updateExample(tableName: string, columns: IColumnMeta[]): string;

  deleteExample(tableName: string, primary: IPrimaryMeta[]): string;

  /*-----------template-------------------------*/

  tableTemplate(): string;

  viewTemplate(): string;

  procedureTemplate(): string;

  triggerTemplate(): string;

  functionTemplate(): string;

  truncateDatabase(connectInfo: IConnectInfo): string;
}
