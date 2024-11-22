import {
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  UpdateColumnParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IColumnMeta, IConnectInfo, IPostgresDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IPageService } from '../page/pageService';
import { PostgresPageService } from '../page/postgrePageService';
import { ServerType } from '../../../base/types/server-node.types';
import { EmptyPageService } from '../page/emptyPageService';

export class ClickhouseDialect extends AbstractDefaultSqlDialect {
  private pageService: IPageService = new EmptyPageService();

  getServerType(): ServerType {
    return 'ClickHouse';
  }

  getPageService() {
    return this.pageService;
  }

  // public getDefaultSchema(schema?: string): string {
  //   return schema ? schema : 'public';
  // }

  public getFullName(connectInfo: IConnectInfo, name: string): string {
    return name;
  }

  /*--------------------切换database，schema，-------------*/

  public useDataBase(database: string | number): string {
    return ``;
  }

  public useSchema(schema: string): string {
    return `set search_path to ${schema}`;
  }

  /*--------------------show-------------*/

  showIndex(connectInfo: IConnectInfo, table: string): string {
    return '';
  }

  showDatabases() {
    return '';
  }

  showTemplate() {}

  showDatabaseInfo(db: string): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  showSchemas(): string {
    return ``;
  }

  showSchemaInfo(schema: string): string {
    return ``;
  }

  showTablespace(): string {
    return ``;
  }

  showTables(connectInfo: IConnectInfo): string {
    // @formatter:off
    // @formatter:on
    return ``;
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
    return ``;
  }

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {

    const queryTables: string[] = [];
    tables.forEach((value) => queryTables.push(`'${value}'`));
    // @formatter:off
    // @formatter:on
    return ``;
  }

  showViews(connectInfo: IConnectInfo): string {
    return ``;
  }

  showUsers(): string {
    return ``;
  }

  showRoles(): string {
    return ``;
  }

  public showPrimary(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off


    // @formatter:on
    return ``;
  }

  showTriggers(connectInfo: IConnectInfo): string {
    return ``;
  }

  showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    return ``;
  }

  showTriggerSource(connectInfo: IConnectInfo, name: string): string {
    return ``;
    // @formatter:off
    // @formatter:on
  }

  showProcedures(connectInfo: IConnectInfo): string {
    return ``;
  }

  showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    return ``;
  }

  showProcedureSource(connectInfo: IConnectInfo, name: string): string {
    return ``;
  }

  showFunctions(connectInfo: IConnectInfo): string {
    return ``;
  }

  showFunction(connectInfo: IConnectInfo, functionName: string): string {
    return ``;
  }

  showFunctionSource(connectInfo: IConnectInfo, name: string): string {
    return ``;
  }

  showSequences(connectInfo: IConnectInfo): string {
    return ``;
  }

  showSequence(connectInfo: IConnectInfo, sequence: string): string {
    return ``;
  }

  showSequenceSource(connectInfo: IConnectInfo, sequence: string): string {
    return ``;
    // @formatter:off
    // @formatter:on
  }

  showViewSource(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  showProcessList(): string {
    // @formatter:off
    // @formatter:on
    return ``;
  }

  showVariableList(): string {
    return ``;
  }

  showStatusList(): string {
    // @formatter:off
    // @formatter:on
    return ``;
  }

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string {

    return ``;
  }

  /*--------------------select-------------*/
  public selectSql(connectInfo: IConnectInfo, table: string): string {
    console.error('sql语句未实现selectSql');
    return ``;
  }

  /*--------------------count-------------*/

  public countPrimary(connectInfo: IConnectInfo, table: string): string {
    console.error('sql语句未实现countPrimary');
    return ``;
  }

  public countByDatabase(connectInfo: IConnectInfo): string {
    console.error('sql语句未实现countByDatabase');
    return ``;
  }

  //查询当前表是否存在
  public countByTable(connectInfo: IConnectInfo, table: string): string {

    return ``;
  }

  /*--------------------create-------------*/
  /**
   * // CREATE DATABASE a
   *     // WITH
   *     // OWNER = postgres
   *     // TEMPLATE = template0
   *     // ENCODING = 'UTF8'
   *     // LC_COLLATE = 'en_US.utf8'
   *     // LC_CTYPE = 'en_US.utf8'
   *     // TABLESPACE = pg_default
   *     // CONNECTION LIMIT = -1
   *     // IS_TEMPLATE = True;
   * @param param
   */
  createDb(param: IPostgresDbDetail): string[] {
    return [``];
  }

  createSchema(param: IPostgresDbDetail): string[] {
    return [``];
  }

  public createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    //@formatter:on
    // if (commentSql.length > 0) {
    //   sql = sql + commentSql.join('\n');
    // }
    // return [sql];
    return [``];
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam): string[] {
    return [``];
  }

  createUser(): string {
    return ``;
  }

  createDatabase(database: string): string {
    return ``;
  }

  createIndex(createIndexParam: CreateIndexParam): string {
    return ``;
  }

  /*--------------------drop-------------*/

  dropDatabase(database: string): string {
    return ``;
  }

  dropSchema(schema: string): string {
    return ``;
  }

  dropTrigger(connectInfo: IConnectInfo, name: string): string {
    return ``;
  }

  dropIndex(table: string, indexName: string): string {
    return ``;
  }

  /*--------------------alter-------------*/

  alterDb(param: IPostgresDbDetail): string[] {
    //console.log('alterDb:',param)
    return [``];
  }

  /**
   * ALTER SCHEMA auth1 RENAME TO auth12;
   * ALTER SCHEMA auth12 OWNER TO pg_monitor;
   * COMMENT ON SCHEMA auth12 IS '1';
   * oldSchema:有：说明需要更改
   */
  alterSchema(param: IPostgresDbDetail): string[] {
    return [``];
  }

  alterColumn(connectInfo: IConnectInfo, table: string, column: string, type: string, comment: string, nullable: string): string {
    return ``;
  }

  alterColumnSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string[] {
    // @formatter:on
    return [``];
  }

  //暂时用不到
  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string {
    //
    return '';
  }

  alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string {
    return ``;
  }

  public alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string): string {
    return ``;
  }

  /*--------------------update-------------*/

  // public updatePrimaryKey(connectInfo: IConnectInfo, isExistKey: boolean, table: string, primaryKeys: string[]): string {
  //   let schema = connectInfo.schema?connectInfo.schema:'public'
  //   console.error('sql语句未实现updatePrimaryKey');
  //   if(isExistKey){
  //     let sql = 'alter table auth.sys_stu drop constraint ';
  //   }
  //   let addPri = `ALTER TABLE ${schema}.${table} ADD CONSTRAINT sys_stu_pkey PRIMARY KEY (${primaryKeys.join(',')}) `
  //   return ``;
  // }

  /*--------------------update-------------*/

  updatePrimaryKey(connectInfo: IConnectInfo, existPrimaryKeys: IPrimaryMeta[], table: string, primaryKeys: string[]): string[] {
    //1.原来没有，只添加新的key
    //2.原来有，需要全部删除，然后添加新的key

    // @formatter:on
    return [``];
  }

  /*--------------------delete--------------------*/

  /*--------------------build---------------------*/

  buildPageSql(connectInfo: IConnectInfo, table: string, pageSize: number): string {
    return ``;
  }

  buildCreateTableSql(
    connectInfo: IConnectInfo,
    table: ITableMeta,
    columns: IColumnMeta[],
    primaryKeys?: IPrimaryMeta[],
  ): string {
    let columnSql: string[] = [];
    let commentSql: string[] = [];
    //let primaryKeys: string[] = [];

    return ``;
  }

  /*-----------example-------------------------*/

  /*--------------------template---------------*/

  tableTemplate(): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  addColumnTemplate(table: string): string {
    // @formatter:off
    // @formatter:on
    return ``;
  }

  viewTemplate(): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  procedureTemplate(): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  triggerTemplate(): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  functionTemplate(): string {
    // @formatter:off

    // @formatter:on
    return ``;
  }

  dropTriggerTemplate(name: string): string {
    return ``;
  }

  truncateDatabase(connectInfo: IConnectInfo): string {
    return ``;
  }
}
