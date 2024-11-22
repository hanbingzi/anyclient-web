import {
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  SortColumnParam,
  UpdateColumnParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { isEmpty, isNotEmpty, isNotNull } from '../../../base/utils/object-util';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IConnectInfo, IMysqlDbDetail, IPrimaryMeta } from '../../common';
import { MysqlAutoIncrementType } from '../fields/mysql-fields';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';
import { IPageService, PageUtils } from '../page/pageService';
import { MysqlPageService } from '../page/mysqlPageService';
import { ServerType } from '../../../base/types/server-node.types';
import { MysqlUtils } from '../utils/mysql-utils';
import { IWhereParam } from '../../../base/model/sql-param.model';
import { SqlDealUtils } from '../utils/sql-deal-utils';

export class MysqlDialect extends AbstractDefaultSqlDialect {
  //private pageService: IPageService = new MysqlPageService();

  getServerType(): ServerType {
    return 'Mysql';
  }

  public getFullName(connectInfo: IConnectInfo, name: string): string {
    return `\`${connectInfo.db}\`.\`${name}\``;
  }

  /*--------------------切换database，schema，-------------*/

  pingDialect(database?: string): string {
    if (!database) {
      // mysql not using connection poll, so need ping connnection active.
      return 'select 1';
    }
    return `use \`${database}\``;
  }

  useDataBase(database: string): string {
    return `use \`${database}\``;
  }

  /*--------------------show-------------*/

  showDatabases(): string {
    return 'SHOW DATABASES';
  }

  showDatabaseInfo(db: string): string {
    // @formatter:off
    return `SELECT SCHEMA_NAME 'schema', DEFAULT_CHARACTER_SET_NAME 'charset',DEFAULT_COLLATION_NAME 'collate'
            FROM information_schema.SCHEMATA
            WHERE SCHEMA_NAME = '${db}'`;
    // @formatter:on
  }

  showIndex(connectInfo: IConnectInfo, table: string): string {
    return `SELECT column_name, index_name, non_unique, index_type
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE table_schema = '${connectInfo.db}'
              and table_name = '${table}';`;
  }

  showTables(connectInfo: IConnectInfo): string {
    return `SELECT table_comment \`comment\`,
                   TABLE_NAME as \`name\`,
                   TABLE_ROWS    \`rows\`,
                   auto_increment,
                   \`row_format\`,
                   data_length,
                   index_length
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = '${connectInfo.db}'
              and TABLE_TYPE <> 'VIEW'
            order by table_name;`;
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
    return `SELECT COLUMN_NAME    AS name,
                   DATA_TYPE      AS columnType,
                   COLUMN_TYPE    AS columnDefinition,
                   CASE
                     WHEN DATA_TYPE IN ('char', 'varchar', 'binary', 'varbinary') THEN CHARACTER_MAXIMUM_LENGTH
                     WHEN DATA_TYPE IN ('decimal', 'numeric') THEN NUMERIC_PRECISION
                     WHEN DATA_TYPE = 'bit' THEN NUMERIC_PRECISION
                     WHEN DATA_TYPE IN ('time', 'datetime', 'timestamp') AND DATETIME_PRECISION > 0
                       THEN DATETIME_PRECISION
                     ELSE NULL
                     END          AS columnLength,
                   CASE
                     WHEN DATA_TYPE IN ('decimal', 'numeric') THEN NUMERIC_SCALE
                     ELSE NULL
                     END          AS columnScale,
                   COLUMN_COMMENT AS comment,
                   COLUMN_KEY     AS \`key\`,
                   IS_NULLABLE    AS nullable,
                   COLUMN_DEFAULT AS defaultValue,
                   EXTRA          AS autoIncrement
            FROM information_schema.columns
            WHERE table_schema = '${connectInfo.db}'
              AND table_name = '${table}'
            ORDER BY ORDINAL_POSITION`;
  }

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {
    const tableNames: string[] = tables.map((item) => `\'${item}\'`);
    //columnLength 影响查询速度，暂时无用，所以去掉
    return `SELECT COLUMN_NAME    AS name,
                   DATA_TYPE      AS columnType,
                   COLUMN_TYPE    AS columnDefinition,
                   COLUMN_COMMENT AS comment,
                   COLUMN_KEY     AS \`key\`,
                   IS_NULLABLE    AS nullable,
                   COLUMN_DEFAULT AS defaultValue,
                   EXTRA          AS autoIncrement
            FROM information_schema.columns
            WHERE table_schema = '${connectInfo.db}'
              AND table_name IN (${tableNames.join(',')})
            ORDER BY ORDINAL_POSITION;`;
  }

  showViews(connectInfo: IConnectInfo): string {
    return `SELECT TABLE_NAME name
            FROM information_schema.VIEWS
            WHERE TABLE_SCHEMA = '${connectInfo.db}'`;
  }

  showUsers(): string {
    //@formatter:off
    let sql = `SELECT concat(user, '@', host) user FROM mysql.user;`;
    //@formatter:on
    return sql;
  }

  showPrimary(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `select TABLE_NAME       tableName,
                   COLUMN_NAME      columnName,
                   ORDINAL_POSITION ordinal
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE CONSTRAINT_NAME = 'PRIMARY'
              AND CONSTRAINT_SCHEMA = '${connectInfo.db}'
              AND TABLE_NAME = '${table}'
            order by ORDINAL_POSITION asc`;
    //@formatter:on
  }

  showViewSource(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `SHOW CREATE VIEW  \`${connectInfo.db}\`.\`${table}\``;
    //@formatter:on
  }

  showTriggers(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT TRIGGER_NAME name
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = '${connectInfo.db}'`;
    //@formatter:on
  }

  showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    //@formatter:off
    return `SELECT *
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = '${connectInfo.db}'
              AND TRIGGER_NAME='${trigger}'`;
    //@formatter:on
  }

  showTriggerSource(connectInfo: IConnectInfo, name: string): string {
    //@formatter:off
    return `SHOW CREATE TRIGGER \`${connectInfo.db}\`.\`${name}\``;
    //@formatter:on
  }

  showFunctions(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT ROUTINE_NAME name
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.db}'
              and ROUTINE_TYPE = 'FUNCTION'`;
    //@formatter:on
  }

  showFunction(connectInfo: IConnectInfo, _function: string): string {
    //@formatter:off
    return `SELECT *
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.db}'
              AND ROUTINE_TYPE = 'FUNCTION'
              AND ROUTINE_NAME = '${_function}'`;
    //@formatter:on
  }

  showFunctionSource(connectInfo: IConnectInfo, name: string): string {
    //@formatter:off
    return `SHOW CREATE FUNCTION \`${connectInfo.db}\`.\`${name}\``;
    //@formatter:on
  }

  showProcedures(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT ROUTINE_NAME name
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.db}'
              and ROUTINE_TYPE = 'PROCEDURE'`;
    //@formatter:on
  }

  showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    //@formatter:off
    return `SELECT *
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.db}'
              AND ROUTINE_TYPE = 'PROCEDURE'
              AND ROUTINE_NAME='${procedure}'`;
    //@formatter:on
  }

  showProcedureSource(connectInfo: IConnectInfo, name: string): string {
    //@formatter:off
    return `SHOW CREATE PROCEDURE \`${connectInfo.db}\`.\`${name}\``;
    //@formatter:on
  }

  showTableSource(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `SHOW CREATE TABLE \`${connectInfo.db}\`.\`${table}\``;
    //@formatter:on
  }

  showVariableList(): string {
    return 'show global VARIABLES';
  }

  showStatusList(): string {
    return 'show global status';
  }

  showProcessList(): string {
    return 'show processlist';
  }

  /*--------------------select-------------*/
  public selectTableByPage(connectInfo: IConnectInfo, table: string, page?: number, pageSize?: number): string {
    const pageInfo = PageUtils.buildPage(page, pageSize);
    return `SELECT * FROM ${this.getFullName(connectInfo, table)} LIMIT ${pageInfo.start},${pageSize}`;
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
    return `SELECT * FROM ${this.getFullName(connectInfo, table)} ${whereSql} LIMIT ${pageInfo.start},${pageSize}`;
    // @formatter:off
  }

  /*--------------------count-------------*/

  countByDatabase(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT count(*) total
            FROM \`information_schema\`.\`SCHEMATA\`
            WHERE SCHEMA_NAME = \'${connectInfo.db}\'`;
    //@formatter:on
  }

  countByTable(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `SELECT count(*) total
            FROM \`information_schema\`.\`TABLES\`
            WHERE TABLE_SCHEMA = \'${connectInfo.db}\'
              AND TABLE_NAME = \'${table}\'`;
    //@formatter:on
  }

  countPrimary(connectInfo: IConnectInfo, table: string) {
    //@formatter:off
    return `SELECT COUNT(*) total
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE CONSTRAINT_NAME = 'PRIMARY'
              AND CONSTRAINT_SCHEMA = '${connectInfo.db}'
              AND TABLE_NAME = '${table}';`;
    //@formatter:on
  }

  /*--------------------create-------------*/

  //CREATE DATABASE  RUNOOB DEFAULT CHARSET utf8 COLLATE utf8_general_ci';
  createDb(param: IMysqlDbDetail) {
    const { schema, charset, collate } = param;
    let defaultSet = '';
    if (charset) {
      defaultSet = `CHARSET ${charset} `;
      if (collate) {
        defaultSet = defaultSet + `COLLATE ${collate}`;
      }
    }
    let sql = `CREATE DATABASE ${schema} ${defaultSet}`;
    return [sql];
  }

  generateColumnDefinition(column: CreateColumnParam): string {
    const { columnName, columnType, columnLength, columnScale, comment, autoIncrement, defaultValue, notNull } = column;
    let fullColumnTypeDefine = MysqlUtils.getColumnDefinition(columnType, columnLength, columnScale);
    let def = `\`${columnName}\` ${fullColumnTypeDefine}`;

    if (notNull) {
      def += ' NOT NULL';
    }else{
      def += ' NULL';
    }
    if (isNotNull(defaultValue)) {
      if (ColumnEditDefaultSelect.EmptyString === defaultValue || isEmpty(defaultValue)) {
        def += ` DEFAULT ''`;
      } else {
        def += ` DEFAULT ${defaultValue}`;
      }
    }

    if (autoIncrement) {
      def += ' AUTO_INCREMENT PRIMARY KEY';
    }

    if (comment) {
      def += ` COMMENT '${comment}'`;
    }

    return def;
  }

  createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    const { table, columns, primaryKeys, engine = 'InnoDB', charset = 'utf8' } = tableParam;
    const columnDefineArray: string[] = [];
    for (let i = 0; i < columns.length; i++) {
      // const { columnName, columnType, columnLength, columnScale, notNull, defaultValue, comment, autoIncrement } =
      //   columns[i];
      // let fullColumnTypeDefine = MysqlUtils.getColumnDefinition(columnType, columnLength, columnScale);
      // let notNullDefine = notNull ? 'NOT NULL' : '';
      // let defaultValueDefine = defaultValue ? `DEFAULT ${defaultValue}` : '';
      // let autoIncrementDefine = autoIncrement ? 'AUTO_INCREMENT' : '';
      // let commentDefine = comment ? `COMMENT \'${comment}\'` : '';
      // let commaDefine = !primaryKeyDefine && i === columns.length - 1 ? '' : ',';
      // columnDefine =
      //   columnDefine +
      //   `\`${columnName}\` ${fullColumnTypeDefine} ${notNullDefine} ${defaultValueDefine} ${commentDefine} ${autoIncrementDefine}${commaDefine}\n\t`;
      columnDefineArray.push(this.generateColumnDefinition(columns[i]));
    }
    if (primaryKeys && primaryKeys.length > 0) {
      columnDefineArray.push(`PRIMARY KEY (${primaryKeys.join(',')})`);
    }
    let columnDefine = columnDefineArray.join(',\n\t');
    //@formatter:off
    let createSql = `CREATE TABLE \`${connectInfo.db}\`.\`${table}\`(\n\t${columnDefine})ENGINE=${engine} DEFAULT CHARSET=${charset}`;
    //@formatter:on

    return [createSql];
  }

  createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam) {
    //autoIncrement 设置为false原因：
    const columnDef = this.generateColumnDefinition({...createColumnParam});
    //@formatter:off
    return [`ALTER TABLE ${table} ADD ${columnDef}`];
    // @formatter:on
  }

  createUser(): string {
    return `CREATE USER 'username'@'%' IDENTIFIED BY 'password';`;
  }

  createDatabase(database: string): string {
    return `create database \`${database}\` default character set = 'utf8mb4' `;
  }

  createIndex(createIndexParam: CreateIndexParam): string {
    //@formatter:off
    return `ALTER TABLE ${createIndexParam.table}
      ADD ${createIndexParam.type} (${createIndexParam.column})`;
    // @formatter:on
  }

  /*--------------------drop-------------*/

  dropIndex(table: string, indexName: string): string {
    //@formatter:off
    return `ALTER TABLE ${table} DROP INDEX ${indexName}`;
    // @formatter:on
  }

  dropTriggerTemplate(name: string): string {
    return `DROP TRIGGER IF EXISTS ${name}`;
  }

  /*--------------------alter-------------*/

  //ALTER DATABASE test DEFAULT CHARACTER SET utf8mb4
  alterDb(param: IMysqlDbDetail): string[] {
    const { schema, charset, collate } = param;
    let defaultSet = '';
    if (charset) {
      defaultSet = `DEFAULT CHARACTER SET ${charset} `;
      if (collate) {
        defaultSet = defaultSet + `COLLATE ${collate}`;
      }
    }
    let sql = `ALTER DATABASE ${schema} ${defaultSet}`;
    return [sql];
  }

  alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string {
    const { table, newTableName, comment, newComment } = update;
    let sql = '';
    if (newComment && newComment != comment) {
      //@formatter:off
      sql = `ALTER TABLE ${table} COMMENT = '${newComment}';`;
    }
    if (newTableName && table != newTableName) {
      sql += `ALTER TABLE ${table} RENAME TO ${newTableName};`;
    }
    // @formatter:on
    return sql;
  }



  alterColumnSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string[] {
    let {
      columnName,
      newColumnName,
      columnType,
      newColumnType,
      columnLength,
      newColumnLength,
      columnScale,
      newColumnScale,
      notNull,
      newNotNull,
      autoIncrement,
      newAutoIncrement,
      defaultValue,
      newDefaultValue,
      comment,
      newComment,
    } = updateColumnParam;
    const buildSql: string[] = [];
    let commentDef = newComment ? newComment : comment ? comment : '';
    const columnNameDef = newColumnName ? newColumnName : columnName;
    if (newColumnType || newColumnLength || newColumnScale || newComment || (newNotNull !==undefined && newNotNull !== notNull)) {
      let notNullDef :boolean= false;
      if (newNotNull === true || (isEmpty(newNotNull) && notNull === true)) {
        notNullDef = true;
      }
      const columnTypeDef = newColumnType ? newColumnType : columnType;
      const columnLengthDef = newColumnLength ? newColumnLength : columnLength;
      const columnScaleDef = newColumnScale ? newColumnScale : columnScale;
      // const fullColumnTypeDef = MysqlUtils.getColumnDefinition(columnTypeDef, columnLengthDef, columnScaleDef);
      const alterColumnTypeDef = this.generateColumnDefinition({
        columnName: columnNameDef,
        columnType: columnTypeDef,
        columnLength: columnLengthDef,
        columnScale: columnScaleDef,
        notNull:notNullDef,
        comment:commentDef
      });
      buildSql.push(
        `ALTER TABLE ${table} CHANGE ${columnName} ${alterColumnTypeDef} `,
      );
    }
    //@formatter:off
    const judgeDefault = this.judgeDefaultValue(defaultValue, newDefaultValue);
    if (judgeDefault === 'SetNull') {
      buildSql.push(`ALTER TABLE ${table} ALTER COLUMN ${columnNameDef} DROP DEFAULT`);
    } else if (judgeDefault === 'SetEmpty') {
      buildSql.push(`ALTER TABLE ${table} ALTER COLUMN ${columnNameDef} SET DEFAULT ''`);
    } else if (judgeDefault === 'SetValue') {
      const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
      //还的判断选择的类型
      const convertNewValue =
        simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? newDefaultValue : `'${newDefaultValue}'`;
      buildSql.push(`ALTER TABLE ${table} ALTER COLUMN ${columnNameDef} SET DEFAULT ${convertNewValue}`);
    }
    //@formatter:on
    return buildSql;
  }

  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string {
    let {
      columnName,
      newColumnName,
      columnType,
      newColumnType,
      columnLength,
      newColumnLength,
      notNull,
      newNotNull,
      autoIncrement,
      newAutoIncrement,
      defaultValue,
      newDefaultValue,
      comment,
      newComment,
    } = updateColumnParam;
    let commentDef = newComment ? `COMMENT '${newComment}'` : comment ? `COMMENT '${comment}'` : '';
    const newColumnName1 = newColumnName ? newColumnName : columnName;
    const columnType1 = newColumnType ? newColumnType : columnType;
    const fullColumnType = newColumnLength
      ? `${columnType1}(${newColumnLength})`
      : columnLength
      ? `${columnType1}(${columnLength})`
      : columnType1;
    let buildSql: string = '';
    //@formatter:off
    if (
      (autoIncrement === MysqlAutoIncrementType.AutoIncrement ||
        newAutoIncrement === MysqlAutoIncrementType.AutoIncrement) &&
      autoIncrement !== newAutoIncrement
    ) {
      //直接对比不等于对比不出来，因为可能 ''和undefined
      if (newAutoIncrement) {
        buildSql = `ALTER TABLE ${table} MODIFY ${newColumnName1} ${fullColumnType} auto_increment ${commentDef}`; //AUTOINCREMENT 不需要指定字段长度
      } else {
        buildSql = `ALTER TABLE ${table} MODIFY ${newColumnName1} ${fullColumnType} ${commentDef}`;
      }
    }
    //@formatter:on
    return buildSql;
  }

  //alter table sys_user modify username varchar(100) after sex;alter table sys_user modify username varchar(100) first;
  alterColumnToSortSql(connectInfo: IConnectInfo, table: string, sortColumnParam: SortColumnParam) {
    let { beforeKey, columnName, columnType, columnLength } = sortColumnParam;
    const fullColumnType = columnLength ? `${columnType}(${columnLength})` : columnType;
    const sortDefine = beforeKey ? ` AFTER  ${beforeKey}` : ' FIRST';
    //@formatter:off
    return `ALTER TABLE ${table} MODIFY ${columnName} ${fullColumnType} ${sortDefine}`;
    // @formatter:on
  }

  alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string) {
    //@formatter:off
    const sql = `alter table ${oldName} rename ${newName}`;
    // @formatter:on
    return sql;
  }

  /*--------------------update-------------*/

  updatePrimaryKey(connectInfo: IConnectInfo, existPrimaryKeys: IPrimaryMeta[], table: string, primaryKeys: string[]) {
    //1.原来没有，只添加新的key
    //2.原来有，需要全部删除，然后添加新的key
    const dropSql = existPrimaryKeys.length > 0 ? 'drop primary key' : '';
    const addSql = primaryKeys.length > 0 ? `add primary key(${primaryKeys.join(',')})` : '';
    //@formatter:off
    return [`ALTER TABLE ${this.getFullName(connectInfo, table)} ${dropSql} ${dropSql && addSql ? ',' : ''} ${addSql}`];
    // @formatter:on
  }

  /*--------------------delete--------------------*/

  /*--------------------build---------------------*/

  /*-----------example-------------------------*/

  /*--------------------template---------------*/

  tableTemplate(): string {
    //@formatter:off
    return `CREATE TABLE [name](
        id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
        create_time DATETIME COMMENT 'create time',
        update_time DATETIME COMMENT 'update time',
        [column] varchar(255) comment ''
        ) default charset utf8 comment '';`;
    //@formatter:on
  }

  viewTemplate(): string {
    return `CREATE VIEW [name]
AS
(SELECT * FROM ...);`;
  }

  procedureTemplate(): string {
    return `CREATE PROCEDURE [name]()
BEGIN

END;`;
  }

  triggerTemplate(): string {
    //@formatter:off
    return `CREATE TRIGGER [name]
[BEFORE/AFTER] [INSERT/UPDATE/DELETE]
ON [table]
FOR EACH ROW BEGIN

END;`;
    //@formatter:on
  }

  functionTemplate(): string {
    //@formatter:off
    return `CREATE FUNCTION [name]() RETURNS [TYPE]
BEGIN
    return [value];
END;`;
    //@formatter:on
  }

  truncateDatabase(connectInfo: IConnectInfo): string {
    return `SELECT Concat('TRUNCATE TABLE \`', table_schema, '\`.\`', TABLE_NAME, '\`;') trun
            FROM INFORMATION_SCHEMA.TABLES
            WHERE table_schema = '${connectInfo.db}'
              AND TABLE_TYPE <> 'VIEW';`;
  }
}
