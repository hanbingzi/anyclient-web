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
import { BaseSqlDialect } from './base-sql-dialect';
import { DefaultSetType, IColumnMeta, IConnectInfo, IDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IWhereParam } from '../../../base/model/sql-param.model';
import { ServerType } from '../../../base/types/server-node.types';
import { SqlDealUtils } from '../utils/sql-deal-utils';
import { isNotEmpty, isNotNull } from '../../../base/utils/object-util';
import { DataInputEnum } from '../../../base/types/edit-input.types';
import { IPageService, PageUtils } from '../page/pageService';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';

export abstract class AbstractDefaultSqlDialect implements BaseSqlDialect {
  abstract getServerType(): ServerType;

  abstract getFullName(connectInfo: IConnectInfo, table: string): string;

  // abstract getPageService(): IPageService; //AbstractPageService;

  /*-----------crud-------------------------*/

  /*--------------------select-------------*/

  // public selectSqlByPage(sql: string, page?: number, pageSize?: number): string {
  //   return this.getPageService().buildSql(sql, page, pageSize);
  // }

  public selectTableByPage(connectInfo: IConnectInfo, table: string, page?: number, pageSize?: number): string {
    const pageInfo = PageUtils.buildPage(page, pageSize);
    return `SELECT * FROM ${this.getFullName(connectInfo, table)} LIMIT ${pageSize} OFFSET ${pageInfo.start}`;
  }

  public selectTableByPageAndWhere(
    connectInfo: IConnectInfo,
    table: string,
    page?: number,
    pageSize?: number,
    filterParams?: IWhereParam[],
  ): string {
    const pageInfo = PageUtils.buildPage(page, pageSize);
    const whereSql = this.buildWhere(filterParams);
    // @formatter:off
    return `SELECT * FROM ${this.getFullName(connectInfo, table)} ${whereSql} LIMIT ${pageSize} OFFSET ${pageInfo.start}`;
    // @formatter:off
  }

  selectSql(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off
    return `SELECT * FROM ${this.getFullName(connectInfo, table)}`;
    // @formatter:on
  }

  buildWhere(filterParams?: IWhereParam[]): string {
    // @formatter:off
    //let sql = `SELECT * FROM ${this.getFullName(connectInfo, table)} `;
    if (filterParams && filterParams.length > 0) {
      const whereSql: string[] = [];
      filterParams.map((filter) => {
        let fragmentSql = SqlDealUtils.generateWhereSql(filter, this.getServerType());
        if (fragmentSql) {
          whereSql.push(fragmentSql);
        }
      });
      if (whereSql.length > 0) {
        return 'WHERE ' + whereSql.join('\nAND');
      }
    }
    // @formatter:on
    return '';
  }

  //---------------------------delete--------------------------------------------
  //删除表格数据

  deleteAllData(connectInfo: IConnectInfo, table: string) {
    // @formatter:off
    return `DELETE FROM ${this.getFullName(connectInfo, table)}`;
    // @formatter:on
  }

  delete(
    connectInfo: IConnectInfo,
    table: string,
    primaryKey: string,
    ids: number[] | string[],
    primaryType: DataInputEnum,
  ) {
    // @formatter:off
    let sql = `DELETE FROM ${this.getFullName(connectInfo, table)} WHERE ${primaryKey}`;
    // @formatter:on
    if (ids.length === 1) {
      sql = sql + `=${ids[0]}`;
    } else {
      sql = sql + ` IN (${ids.join(',')})`;
    }
    return sql;
  }

  deleteByCompositeKey(connectInfo: IConnectInfo, table: string, compositePrimaryKeys: CompositeKeyParam[]): string {
    // @formatter:off
    let sql = `DELETE FROM ${this.getFullName(connectInfo, table)} WHERE `;
    let whereSqls: string[] = [];
    // @formatter:on
    compositePrimaryKeys.map((item) => {
      let whereSql = SqlDealUtils.generateWhereSql({
        columnKey: item.primaryKey,
        columnType: item.valueType,
        whereValue: item.primaryValue,
        whereType: '=',
      });
      whereSqls.push(whereSql);
    });
    sql = sql + whereSqls.join(' and ');
    return sql;
  }

  //---------------------------build--------------------------------------------
  buildUpdateData(connectInfo: IConnectInfo, table: string, updateData: UpdateParam,isTemplate=false): string {
    if (!updateData || !updateData.updateData || updateData.updateData.size === 0) {
      return '';
    }
    let sql = '';
    //@formatter:off
    let { updateData: rowValue, id, idName, idType } = updateData;
    if (id) {
      sql = `UPDATE ${this.getFullName(connectInfo, table)} SET `;
      let index = 0;
      for (let item of rowValue) {
        const { columnName: columnKey, valueType: columnType, newValue: setValue } = item;
        if (index !== 0) {
          sql = sql + ',';
        }
        sql = sql + SqlDealUtils.generateSetSql({ columnKey, columnType, setValue }, this.getServerType());
        index++;
      }
      sql =
        sql +
        `WHERE ${updateData.idName}=${SqlDealUtils.generateWhereSql(
          { columnKey: idName, columnType: idType!, whereType: '=', whereValue: id },
          this.getServerType(),
        )}`;
    } else {
      let columns: string[] = [];
      let values: string[] = [];
      for (let item of rowValue) {
        if (isNotNull(item.newValue) || isTemplate) {
          columns.push(`${item.columnName}`);
          values.push(SqlDealUtils.getSetValue(item.valueType, item.newValue, this.getServerType()));
        }
      }
      sql = `INSERT INTO ${this.getFullName(connectInfo, table)}(${columns.join(',')}) VALUES(${values.join(',')}) `;
      // @formatter:on
    }
    return sql;
  }

  buildUpdateDataByCompositeKey(connectInfo: IConnectInfo, table: string, updateData: UpdateCompositeKeyParam): string {
    if (!updateData || !updateData.updateData || updateData.updateData.size === 0) {
      return '';
    }
    console.log('buildUpdateDataByCompositeKey:', updateData);
    let sql = '';
    let rowValue = updateData.updateData;
    if (updateData.keys && updateData.keys.length > 0) {
      // @formatter:off
      sql = `UPDATE ${this.getFullName(connectInfo, table)} SET `;
      // @formatter:on
      let setValueSql: string[] = [];
      for (let item of rowValue) {
        let setSql = SqlDealUtils.generateSetSql(
          {
            columnKey: item.columnName,
            columnType: item.valueType,
            setValue: item.newValue,
          },
          this.getServerType(),
        );
        setValueSql.push(setSql);
      }
      sql = sql + setValueSql.join(',');
      let whereSqls: string[] = [];
      // @formatter:on
      updateData.keys.map((item) => {
        let whereSql = SqlDealUtils.generateWhereSql({
          columnKey: item.primaryKey,
          columnType: item.valueType,
          whereValue: item.primaryValue,
          whereType: '=',
        });
        whereSqls.push(whereSql);
      });
      sql = sql + 'WHERE ' + whereSqls.join('AND ');
    } else {
      let columns: string[] = [];
      let values: string[] = [];
      for (let item of rowValue) {
        if (isNotNull(item.newValue)) {
          columns.push(`${item.columnName}`);
          values.push(SqlDealUtils.getSetValue(item.valueType, item.newValue, this.getServerType()));
        }
      }
      // @formatter:off
      sql = `INSERT INTO ${this.getFullName(connectInfo, table)}(${columns.join(', ')}) VALUES (${values.join(', ')}) `;
      // @formatter:on
    }
    console.log('buildUpdateDataByCompositeKey--sql:', sql);
    return sql;
  }

  /**---column delete add sort ---*/

  deleteColumn(connectInfo: IConnectInfo, table: string, columnName: string) {
    const fullTable = this.getFullName(connectInfo, table);
    return `ALTER TABLE ${fullTable} DROP COLUMN ${columnName}`;
  }

  judgeDefaultValue(defaultValue: string, newDefaultValue: string): DefaultSetType {
    //''代表用户删除了次表格的所有内容，所以设置为空
    if (
      (newDefaultValue === ColumnEditDefaultSelect.NULL || newDefaultValue === 'null' || newDefaultValue === '') &&
      isNotNull(defaultValue)
    ) {
      return 'SetNull';
    } else if (newDefaultValue === ColumnEditDefaultSelect.EmptyString && isNotEmpty(defaultValue)) {
      //设置默认值为空字符串
      return 'SetEmpty';
    } else if (isNotNull(newDefaultValue)) {
      //前面的修改会删除默认值，所以此处要从新设置默认值
      return 'SetValue';
    } else {
      return '';
    }
  }

  /*--------------------drop-------------*/

  dropTable(connectInfo: IConnectInfo, table: string): string {
    const fullTableName = this.getFullName(connectInfo, table);
    return `DROP TABLE ${fullTableName}`;
  }

  dropView(connectInfo: IConnectInfo, table: string): string {
    const fullTableName = this.getFullName(connectInfo, table);
    return `DROP VIEW  ${fullTableName}`;
  }

  dropFunction(connectInfo: IConnectInfo, name: string): string {
    const fullName = this.getFullName(connectInfo, name);
    return `DROP FUNCTION  ${fullName}`;
  }

  dropSequence(connectInfo: IConnectInfo, name: string): string {
    const fullName = this.getFullName(connectInfo, name);
    return `DROP SEQUENCE  ${fullName}`;
  }

  dropProcedure(connectInfo: IConnectInfo, name: string): string {
    const fullName = this.getFullName(connectInfo, name);
    return `DROP PROCEDURE  ${fullName}`;
  }

  dropTrigger(connectInfo: IConnectInfo, name: string, tableName?: string): string {
    const fullName = this.getFullName(connectInfo, name);
    return `DROP TRIGGER  ${fullName}`;
  }

  /*--------------------count-------------*/

  countTable(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off
    return `SELECT count(*) AS TOTAL FROM ${this.getFullName(connectInfo, table)}`;
    // @formatter:on
  }

  countBySql(sql: string): string {
    // @formatter:off
    return `SELECT count(*) as total FROM \(${sql}\) as count_table`;
    // @formatter:on
  }

  /*-----------example-------------------------*/
  selectExample(tableName: string, columns: string[]): string {
     return `SELECT ${columns.join(',')} FROM ${tableName} LIMIT 1000`;
  }

  insertExample(tableName: string, columnMetas: IColumnMeta[]): string {
    let columns: string[] = [];
    let values: string[] = [];
    for (let item of columnMetas) {
      const { name: columnName, columnType } = item;

      const defaultValue = SqlDealUtils.generateMockColumnValue(
        columnName,
        SqlDealUtils.convertFieldsToInputType(this.getServerType(), columnType),
        this.getServerType(),
      );
      columns.push(`${columnName}`);
      values.push(defaultValue);
    }
    // @formatter:off
    let sql = `INSERT INTO ${tableName}(${columns.join(', ')}) VALUES (${values.join(', ')});`;
    // @formatter:on
    return sql;
  }

  updateExample(table: string, columns: IColumnMeta[]): string {
    // @formatter:off
    const updateSql = `UPDATE ${table} SET `;
    // @formatter:on
    let setValueSql: string[] = [];
    let whereSqls: string[] = [];
    for (let item of columns) {
      const { name: columnName, columnType } = item;
      console.log('', item.columnType, SqlDealUtils.convertFieldsToInputType(this.getServerType(), item.columnType));
      const inputType = SqlDealUtils.convertFieldsToInputType(this.getServerType(), columnType);
      const isPri = SqlDealUtils.judgeColumnIsPrimary(item);
      if (isPri) {
        let itemWhereSql = `${columnName}=:${columnName}`;
        whereSqls.push(itemWhereSql);
      } else {
        let itemSetSql = `${columnName}=${SqlDealUtils.generateMockColumnValue(
          columnName,
          inputType,
          this.getServerType(),
        )} `;
        setValueSql.push(itemSetSql);
      }
    }
    //sql = sql + setValueSql.join(',')
    const sql = `${updateSql} ${setValueSql.join(',')} WHERE ${whereSqls.join(' AND ')};`;
    return sql;
  }

  deleteExample(tableName: string, primary: IPrimaryMeta[]): string {
    let whereSql: string[] = [];
    for (let item of primary) {
      const { columnName } = item;
      let itemSetSql = `${columnName}=:${columnName} `;
      whereSql.push(itemSetSql);
    }
    // @formatter:off
    let sql = `DELETE FROM ${tableName} WHERE ${whereSql.join(' AND')};`;
    // @formatter:on
    return sql;
  }

  /*--------------------切换database，schema，-------------*/
  public pingDialect(database?: string | number): string {
    return 'select 1';
  }

  public useDataBase(database: string | number): string {
    console.error('DefaultDialect-sql语句未实现->useDataBase');
    return ``;
  }

  public useSchema(schema: string): string {
    console.error('DefaultDialect-sql语句未实现->useSchema');
    return ``;
  }

  /*--------------------show-------------*/

  public showIndex(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->showIndex');
    return ``;
  }

  public showDatabases(): string {
    console.error('DefaultDialect-sql语句未实现->showDatabaseInfo');
    return '';
  }

  public showDatabaseInfo(db: string): string {
    console.error('DefaultDialect-sql语句未实现->showDatabaseInfo');
    return ``;
  }

  public showSchemas(db?: string): string {
    console.error('DefaultDialect-sql语句未实现->showSchemas');
    return ``;
  }

  public showSchemaInfo(schema: string): string {
    console.error('DefaultDialect-sql语句未实现->showSchemaInfo');
    return ``;
  }

  public showTables(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showTables');
    return ``;
  }

  public showColumns(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->showColumns');
    return ``;
  }

  public showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {
    console.error('DefaultDialect-sql语句未实现->showMultiTableColumns');
    return ``;
  }

  public showViews(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showViews');
    return ``;
  }

  public showUsers(): string {
    console.error('DefaultDialect-sql语句未实现->showUsers');
    return ``;
  }

  public showPrimary(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->showPrimary');
    return ``;
  }

  public showTriggers(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showTriggers');
    return ``;
  }

  public showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    console.error('DefaultDialect-sql语句未实现->showTrigger');
    return ``;
  }

  public showTriggerSource(connectInfo: IConnectInfo, trigger: string): string {
    console.error('DefaultDialect-sql语句未实现->showTriggerSource');
    return ``;
  }

  public showProcedures(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showProcedures');
    return ``;
  }

  public showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    console.error('DefaultDialect-sql语句未实现->showProcedure');
    return ``;
  }

  public showProcedureSource(connectInfo: IConnectInfo, name: string): string {
    console.error('DefaultDialect-sql语句未实现->showProcedureSource');
    return ``;
  }

  public showFunctions(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showFunctions');
    return ``;
  }

  public showFunction(connectInfo: IConnectInfo, _function: string): string {
    console.error('DefaultDialect-sql语句未实现->showFunction');
    return ``;
  }

  public showFunctionSource(connectInfo: IConnectInfo, name: string): string {
    console.error('DefaultDialect-sql语句未实现->showFunctionSource');
    return ``;
  }

  public showSequences(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->showSequences');
    return ``;
  }

  public showSequence(connectInfo: IConnectInfo, sequence: string): string {
    console.error('DefaultDialect-sql语句未实现->showSequence');
    return ``;
  }

  public showSequenceSource(connectInfo: IConnectInfo, sequence: string): string {
    console.error('DefaultDialect-sql语句未实现->showSequenceSource');
    return ``;
  }

  public showViewSource(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->showViewSource');
    return ``;
  }

  public showTableSource(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->showTableSource');
    return ``;
  }

  public showVariableList(): string {
    console.error('DefaultDialect-sql语句未实现->showVariableList');
    return ``;
  }

  public showStatusList(): string {
    console.error('DefaultDialect-sql语句未实现->showStatusList');
    return ``;
  }

  public showTableInfo(connectInfo: IConnectInfo, tableName: string): string {
    console.error('DefaultDialect-sql语句未实现->showTableInfo');
    return ``;
  }

  /*--------------------select-------------*/
  //
  // public selectByPage(sql: string, page?: number, pageSize?: number): string {
  //   console.error('DefaultDialect-sql语句未实现->selectByPage');
  //   return '';
  // }



  /*--------------------count-------------*/

  public countPrimary(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->countPrimary');
    return ``;
  }

  public countByDatabase(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->countByDatabase');
    return ``;
  }

  //查询当前表是否存在
  public countByTable(connectInfo: IConnectInfo, table: string): string {
    console.error('DefaultDialect-sql语句未实现->countByTable');
    return ``;
  }

  /*--------------------create-------------*/

  public createDb(param: IConnectInfo): string[] {
    console.error('DefaultDialect-sql语句未实现->createDb');
    return [];
  }

  createSchema(param: IConnectInfo): string[] {
    console.error('DefaultDialect-sql语句未实现->createSchema');
    return [];
  }

  public createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    console.error('DefaultDialect-sql语句未实现->createTable');
    return [];
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam): string[] {
    console.error('DefaultDialect-sql语句未实现->createColumn');
    return [];
  }

  public createUser(): string {
    console.error('DefaultDialect-sql语句未实现->createUser');
    return ``;
  }

  public createDatabase(database: string): string {
    console.error('DefaultDialect-sql语句未实现->createDatabase');
    return ``;
  }

  public createIndex(createIndexParam: CreateIndexParam): string {
    //console.log('DefaultDialect-sql语句未实现->createIndex');
    return ``;
  }

  /*--------------------drop-------------*/

  dropDatabase(database: string): string {
    return `DROP DATABASE ${database}`;
  }


  public dropSchema(schema: string): string {
    return `DROP SCHEMA ${schema}`;
  }

  dropIndex(table: string, indexName: string): string {
    console.error('DefaultDialect-sql语句未实现->dropIndex');
    return ``;
  }

  dropTriggerTemplate(name: string): string {
    return `DROP TRIGGER IF EXISTS ${name}`;
  }

  /*--------------------alter-------------*/
  alterDb(param: IConnectInfo): string[] {
    console.error('DefaultDialect-sql语句未实现->alertDb');
    return [];
  }

  alterSchema(param: IDbDetail): string[] {
    console.error('DefaultDialect-sql语句未实现->alterSchema');
    return [];
  }

  public alterColumn(
    connectInfo: IConnectInfo,
    table: string,
    column: string,
    type: string,
    comment: string,
    nullable: string,
  ): string {
    console.error('DefaultDialect-sql语句未实现->alterColumn');
    return ``;
  }

  alterColumnSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string[] {
    console.error('DefaultDialect-sql语句未实现->alterColumnSql');
    return [];
  }

  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string {
    console.error('DefaultDialect-sql语句未实现->alterAutoIncrementSql');
    return '';
  }

  public alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string {
    console.error('DefaultDialect-sql语句未实现->alterTable');
    return ``;
  }

  public alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string): string {
    return `RENAME TABLE ${oldName} TO ${newName}`;
  }

  public alterColumnToSortSql(connectInfo: IConnectInfo, table: string, sortColumnParam: SortColumnParam): string {
    console.error('DefaultDialect-sql语句未实现->alterColumnToSortSql');
    return ``;
  }

  /*--------------------update-------------*/

  public updatePrimaryKey(
    connectInfo: IConnectInfo,
    existPrimaryKeys: IPrimaryMeta[],
    table: string,
    primaryKeys?: string[],
  ): string[] {
    console.error('DefaultDialect-sql语句未实现->updatePrimaryKey');
    return [];
  }

  /*--------------------build---------------------*/
  public buildCreateTableSql(
    connectInfo: IConnectInfo,
    table: ITableMeta,
    columns: IColumnMeta[],
    primaryKeys?: IPrimaryMeta[],
  ): string {
    console.error('DefaultDialect-sql语句未实现->buildCreateTableSql');
    return ``;
  }

  /*--------------------template---------------*/

  public tableTemplate(): string {
    console.error('DefaultDialect-sql语句未实现->tableTemplate');
    return ``;
  }

  public viewTemplate(): string {
    console.error('DefaultDialect-sql语句未实现->viewTemplate');
    return ``;
  }

  public procedureTemplate(): string {
    console.error('DefaultDialect-sql语句未实现->procedureTemplate');
    return ``;
  }

  public triggerTemplate(): string {
    console.error('DefaultDialect-sql语句未实现->triggerTemplate');
    return ``;
  }

  public functionTemplate(): string {
    console.error('DefaultDialect-sql语句未实现->functionTemplate');
    return ``;
  }

  public truncateDatabase(connectInfo: IConnectInfo): string {
    console.error('DefaultDialect-sql语句未实现->truncateDatabase');
    return ``;
  }
}

export class DefaultDialect extends AbstractDefaultSqlDialect {


  getServerType(): ServerType {
    throw new Error('DefaultDialect getServerType未实现');
  }

  getFullName(dbinfo: IConnectInfo, tableName: string): string {
    // throw new Error('DefaultDialect getFullName未实现');
    return tableName;
  }
}
