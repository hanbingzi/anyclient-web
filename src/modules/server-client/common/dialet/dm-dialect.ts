import { CreateColumnParam, CreateTableParam, UpdateColumnParam, UpdateTableParam } from '../types/sql-param.types';
import { isEmpty, isNotEmpty, isNotNull } from '../../../base/utils/object-util';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { DefaultSetType, IColumnMeta, IConnectInfo, IOracleDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IPageService } from '../page/pageService';
import { ServerType } from '../../../base/types/server-node.types';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';
import { SqlDealUtils } from '../utils/sql-deal-utils';
import { OracleUtils } from '../utils/oracle-utils';
import { PostgresPageService } from '../page/postgrePageService';
import { MysqlUtils } from '../utils/mysql-utils';
import { DMUtils } from '../utils/dm-utils';

export class DMDialect extends AbstractDefaultSqlDialect {
  //达梦数据库分页和Postgres用法一样
  private pageService: IPageService = new PostgresPageService();
  private PROCEDURE = 'PROC';
  private SEQUENCE = 'SEQUENCE';
  private FUNCTION = 'PROC';
  private TRIGGER = 'TRIG';

  public getServerType(): ServerType {
    return 'DM';
  }

  public getPageService(): IPageService {
    return this.pageService;
  }

  public getFullName(dbinfo: IConnectInfo, name: string): string {
    return `"${dbinfo.db}"."${name}"`;
  }

  /*--------------------切换database，schema，-------------*/

  pingDialect(): string {
    return 'SELECT 1 FROM DUAL';
  }

  useDataBase(database: string): string {
    throw new Error('dm useDataBase not allow');
  }

  /*--------------------show-------------*/

  showDatabases(): string {
    return 'SELECT username AS "database" FROM all_users';
  }

  showDatabaseInfo(db: string): string {
    // @formatter:off
    return '';
    // @formatter:on
  }

  showIndex(connectInfo: IConnectInfo, table: string): string {
    return ``;
  }

  showTables(connectInfo: IConnectInfo): string {
    return `SELECT T.TABLE_NAME "name", C.COMMENTS "comment"
            FROM ALL_TABLES T
                   LEFT JOIN ALL_TAB_COMMENTS C ON T.TABLE_NAME = C.TABLE_NAME and T.OWNER = C.OWNER
            WHERE T.OWNER = '${connectInfo.db}'`;
  }

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string {
    return `SELECT T.TABLE_NAME "name", C.COMMENTS "comment"
            FROM ALL_TABLES T
                   LEFT JOIN ALL_TAB_COMMENTS C ON T.TABLE_NAME = C.TABLE_NAME and T.OWNER = C.OWNER
            WHERE T.OWNER = '${connectInfo.db}'
              AND T.TABLE_NAME = '${tableName}'`;
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
    const {db} = connectInfo;

    return `SELECT c.column_name                                       AS "name",
                   CASE
                     WHEN c.data_type LIKE 'TIMESTAMP%' THEN
                       REGEXP_REPLACE(c.data_type, '\\([1-9]\\)', '')
                     ELSE
                       c.data_type
                     END                                               AS "columnType",
                   CASE
                     WHEN c.data_type IN ('CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2') THEN
                       c.data_type || '(' || c.char_length ||
                       CASE
                         WHEN c.char_used = 'C' THEN ' CHAR'
                         WHEN c.char_used = 'B' THEN ' BYTE'
                         ELSE ''
                         END || ')'
                     WHEN c.data_type = 'NUMBER' THEN
                       c.data_type ||
                       CASE
                         WHEN c.data_precision IS NOT NULL AND c.data_scale IS NOT NULL THEN
                           '(' || c.data_precision || ',' || c.data_scale || ')'
                         WHEN c.data_precision IS NOT NULL THEN
                           '(' || c.data_precision || ')'
                         ELSE
                           ''
                         END
                     ELSE
                       c.data_type
                     END                                               AS "columnDefinition",
                   CASE
                     WHEN c.data_type IN ('CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2') THEN
                       c.char_length || ''
                     WHEN c.data_type = 'NUMBER' AND c.data_precision IS NOT NULL THEN
                       c.data_precision || ''
                     WHEN c.data_type LIKE 'TIMESTAMP(%)' THEN
                       SUBSTR(c.data_type, INSTR(c.data_type, '(') + 1,
                              INSTR(c.data_type, ')') - INSTR(c.data_type, '(') - 1)
                     ELSE
                       ''
                     END                                               AS "columnLength",
                   CASE
                     WHEN c.data_type = 'NUMBER' AND c.data_scale IS NOT NULL THEN
                       c.data_scale || ''
                     ELSE
                       ''
                     END                                               AS "columnScale",
                   CASE WHEN c.nullable = 'N' THEN 'NO' ELSE 'YES' END AS "nullable",
                   p.constraint_type                                   AS "key",
                   c.DATA_DEFAULT                                      AS "defaultValue",
                   com.COMMENTS                                        AS "comment",
                   c.TABLE_NAME                                        AS "tableName",
                   sc.info2											                       AS "autoIncrement",
                   sc.info2	                                           AS "isAutoIncrement"
            FROM all_tab_columns c
                   LEFT JOIN (SELECT cons.constraint_type, cc.column_name, cc.table_name
                              FROM all_constraints cons
                                     left join all_cons_columns cc on cc.constraint_name = cons.constraint_name
                              where cons.OWNER = '${db}'
                                AND cons.TABLE_NAME = '${table}'
                                AND cons.constraint_type = 'P') p
                             on p.COLUMN_NAME = c.COLUMN_name
                 LEFT JOIN ALL_COL_COMMENTS com ON c.OWNER = com.OWNER AND c.TABLE_NAME = com.TABLE_NAME AND c.COLUMN_NAME = com.COLUMN_NAME
                 LEFT JOIN dba_objects ob ON ob.object_name = '${table}' AND ob.owner = '${db}'
                 LEFT JOIN SYSCOLUMNS sc ON sc.id = ob.object_id AND sc.NAME=c.column_name
            WHERE c.owner = '${db}'
              AND c.table_name = '${table}'
            ORDER BY c.table_name, c.column_id`;
  }

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {
    const tableString = tables.map((table) => `'${table}'`).join(', ');
    return `SELECT c.column_name                                       AS "name",
                   CASE
                     WHEN c.data_type LIKE 'TIMESTAMP(%)' THEN
                       'TIMESTAMP'
                     ELSE
                       c.data_type
                     END                                               AS "columnType",
                   CASE
                     WHEN c.data_type IN ('CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2') THEN
                       c.data_type || '(' || c.char_length ||
                       CASE
                         WHEN c.char_used = 'C' THEN ' CHAR'
                         WHEN c.char_used = 'B' THEN ' BYTE'
                         ELSE ''
                         END || ')'
                     WHEN c.data_type = 'NUMBER' THEN
                       c.data_type ||
                       CASE
                         WHEN c.data_precision IS NOT NULL AND c.data_scale IS NOT NULL THEN
                           '(' || c.data_precision || ',' || c.data_scale || ')'
                         WHEN c.data_precision IS NOT NULL THEN
                           '(' || c.data_precision || ')'
                         ELSE
                           ''
                         END
                     ELSE
                       c.data_type
                     END                                               AS "columnDefinition",
                   CASE
                     WHEN c.data_type IN ('CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2') THEN
                       c.char_length || ''
                     WHEN c.data_type = 'NUMBER' AND c.data_precision IS NOT NULL THEN
                       c.data_precision || ''
                     ELSE
                       ''
                     END                                               AS "columnLength",
                   CASE
                     WHEN c.data_type = 'NUMBER' AND c.data_scale IS NOT NULL THEN
                       c.data_scale || ''
                     WHEN c.data_type LIKE 'TIMESTAMP(%)' THEN
                       SUBSTR(c.data_type, INSTR(c.data_type, '(') + 1,
                              INSTR(c.data_type, ')') - INSTR(c.data_type, '(') - 1)
                     ELSE
                       ''
                     END                                               AS "columnScale",
                   CASE WHEN c.nullable = 'N' THEN 'NO' ELSE 'YES' END AS "nullable",
                   c.DATA_DEFAULT                                      AS "defaultValue",
                   com.COMMENTS                                        AS "comment",
                   c.TABLE_NAME                                        AS "tableName"
            FROM all_tab_columns c
                   LEFT JOIN
                 ALL_COL_COMMENTS com
                 ON c.OWNER = com.OWNER AND c.TABLE_NAME = com.TABLE_NAME AND c.COLUMN_NAME = com.COLUMN_NAME
            WHERE c.owner = 'ORACLE'
              AND c.table_name in (${tableString})
            ORDER BY c.table_name, c.column_id`;
  }

  showViews(connectInfo: IConnectInfo): string {
    return `SELECT VIEW_NAME AS "name"
            FROM all_views
            where OWNER = '${connectInfo.db}'`;
  }

  showViewSource(connectInfo: IConnectInfo, view: string): string {
    return `SELECT DBMS_METADATA.GET_DDL('VIEW', '${view}', USER) as "createTableSql" FROM DUAL;`;
  }

  showUsers(): string {
    //@formatter:off
    return `SELECT concat(user, '@', host) user FROM mysql.user`;
    //@formatter:on
  }

  showPrimary(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `SELECT cc.column_name AS "columnName",
                   cc.table_name  AS "tableName",
                   cc.position    AS "ordinal",
                   cc.constraint_name AS "constraint"
            FROM all_constraints cons
                   left join all_cons_columns cc on cc.constraint_name = cons.constraint_name
            where cons.OWNER = '${connectInfo.db}'
              AND cons.TABLE_NAME = '${table}'
              AND cons.constraint_type = 'P'`;
    //@formatter:on
  }

  showSource(type: string, owner: string, name: string) {
    //@formatter:off
    return `SELECT TEXT AS "text" FROM ALL_SOURCE WHERE type = '${type}' AND name = '${name}' AND OWNER='${owner}' ORDER BY line ASC`;
    //@formatter:on
  }

  showTriggers(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT TRIGGER_NAME AS "name" FROM all_triggers WHERE owner = '${connectInfo.db}'`;
    //@formatter:on
  }

  showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    //@formatter:off
    return `SELECT * FROM all_triggers WHERE owner = '${connectInfo.db}'`;
    //@formatter:on
  }

  showTriggerSource(connectInfo: IConnectInfo, trigger: string): string {
    return this.showSource(this.TRIGGER, connectInfo.db!, trigger);
  }

  showProcedures(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT OBJECT_NAME AS "name" FROM ALL_PROCEDURES WHERE object_type = 'PROCEDURE' AND OWNER='${connectInfo.db}'`;
    //@formatter:on
  }

  showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    //@formatter:off
    return `SELECT * FROM ALL_PROCEDURES WHERE object_type = 'PROCEDURE' AND OWNER='${connectInfo.db}' AND OBJECT_NAME='${procedure}'`;
    //@formatter:on
  }

  showProcedureSource(connectInfo: IConnectInfo, procedure: string): string {
    //@formatter:off
    return this.showSource(this.PROCEDURE, connectInfo.db!, procedure);
    //@formatter:on
  }

  showFunctions(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT OBJECT_NAME "name" FROM all_objects WHERE object_type = 'FUNCTION' AND OWNER = '${connectInfo.db}'`;
    //@formatter:on
  }

  showFunction(connectInfo: IConnectInfo, functionName: string): string {
    //@formatter:off
    return `SELECT * FROM all_objects WHERE object_type = 'FUNCTION' AND OWNER = '${connectInfo.db}' AND OBJECT_NAME='${functionName}'`;
    //@formatter:on
  }

  showFunctionSource(connectInfo: IConnectInfo, functionName: string): string {
    return this.showSource(this.FUNCTION, connectInfo.db!, functionName);
  }

  showSequences(connectInfo: IConnectInfo): string {
    //@formatter:off
    return `SELECT SEQUENCE_NAME AS "name" FROM ALL_SEQUENCES WHERE SEQUENCE_OWNER = '${connectInfo.db}'`;
    //@formatter:on
  }

  public showSequence(connectInfo: IConnectInfo, sequence: string): string {
    //@formatter:off
    return `SELECT * FROM ALL_SEQUENCES WHERE SEQUENCE_OWNER = '${connectInfo.db}' AND SEQUENCE_NAME='${sequence}'`;
    //@formatter:on
  }

  public showSequenceSource(connectInfo: IConnectInfo, sequence: string): string {
    //@formatter:off
    return `SELECT 'CREATE SEQUENCE '||sequence_name||
                   '\n\tSTART WITH '||to_char(min_value)||
                   '\n\tINCREMENT BY '||to_char(increment_by)||
                   '\n\tMINVALUE '||to_char(min_value)||
                   '\n\tMAXVALUE '||to_char(max_value)||
                   '\n\tCYCLE'||CASE WHEN cycle_flag = 'Y' THEN ' ' ELSE ' NO' END||
                   '\n\tCACHE '||to_char(cache_size)||';' AS "text"
            FROM ALL_SEQUENCES
            WHERE sequence_name = '${sequence}' AND SEQUENCE_OWNER='${connectInfo.db}'`;

    //@formatter:on
  }

  showTableSource(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return `SELECT DBMS_METADATA.GET_DDL('TABLE', '${table}', USER) as "createTableSql" FROM DUAL;`;
    //@formatter:on
  }

  showVariableList(): string {
    return '';
  }

  showStatusList(): string {
    return '';
  }

  showProcessList(): string {
    return '';
  }

  /*--------------------select-------------*/

  /*--------------------count-------------*/

  /*--------------------create-------------*/

  //CREATE DATABASE  RUNOOB DEFAULT CHARSET utf8 COLLATE utf8_general_ci';
  createDb(param: IOracleDbDetail) {
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

  public generateAlterDefaultValue(change: {
    db: string;
    table: string;
    columnName: string;
    columnType: string;
    oldDefault?: string;
    newDefault?: string;
  }): string {
    const {  db, table, columnName, columnType, oldDefault, newDefault } = change;
    const judgeDefault = this.judgeDefaultValue(oldDefault, newDefault);
    const fullTableName = `${db}.${table}`;
    let sql :string= ''
    if (judgeDefault === 'SetNull') {
      sql = `ALTER TABLE ${fullTableName} MODIFY COLUMN ${columnName} ${columnType} DROP DEFAULT`;
    } else if (judgeDefault === 'SetEmpty') {
      sql = `ALTER TABLE ${fullTableName} MODIFY COLUMN ${columnName} ${columnType} DEFAULT ''`;
    } else if (judgeDefault === 'SetValue') {
      const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
      //还的判断选择的类型
      const convertNewValue =
        simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? newDefault : `'${newDefault}'`;
      sql = `ALTER TABLE ${fullTableName} MODIFY COLUMN ${columnName} ${columnType} DEFAULT ${convertNewValue}`;
    }
    return sql


  }


  generateCreateColumnDefinition(column: CreateColumnParam): string {
    const { columnName, columnType, columnLength, columnScale, comment, notNull, defaultValue,autoIncrement } = column;
    let columnTypeDefine = DMUtils.getColumnDefinition(columnType, columnLength, columnScale);
    let def = `${columnName} ${columnTypeDefine}`;

   if (isNotEmpty(defaultValue)) {
      if (ColumnEditDefaultSelect.EmptyString === defaultValue) {
        def += ` DEFAULT ''`;
      } else {
        def += ` DEFAULT `+SqlDealUtils.getDefaultValue(this.getServerType(),columnType,defaultValue);
      }
    }

    if (notNull) {
      def += ' NOT NULL';
    }
    if (autoIncrement && autoIncrement === 'IDENTITY') {
      def += ` IDENTITY(1,1)`;
    }
    if (column.comment) {
      def += ` COMMENT '${column.comment}'`;
    }
    return def;
  }

  createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    const { table, columns, primaryKeys } = tableParam;
    const columnsSql: string[] = [];
    let fullTableName = this.getFullName(connectInfo, table);
    for (let column of columns) {
      columnsSql.push(this.generateCreateColumnDefinition(column));
    }
    if(primaryKeys && primaryKeys.length>0){
      columnsSql.push(`PRIMARY KEY (${primaryKeys.join(',')})`);
    }
    let sql = `CREATE TABLE ${fullTableName} (${columnsSql.join(',\n\t')})`;
    return [sql];
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam) {
    const fullTableName = this.getFullName(connectInfo, table);

    const {columnName,comment} = createColumnParam;
    const batchCreateSql:string[] = [];
    //@formatter:off
    const columnAddDef = `ALTER TABLE ${fullTableName} ADD `+this.generateCreateColumnDefinition({...createColumnParam,comment:null});
    // @formatter:on
    batchCreateSql.push(columnAddDef);
    if (isNotEmpty(comment)) {
      batchCreateSql.push(`COMMENT ON COLUMN ${fullTableName}.${columnName} IS '${comment}'`);
    }
    return batchCreateSql;
  }

  createUser(): string {
    return `CREATE USER 'username'@'%' IDENTIFIED BY 'password';`;
  }

  /*--------------------drop-------------*/

  /*--------------------alter-------------*/

  //ALTER DATABASE test DEFAULT CHARACTER SET utf8mb4
  alterDb(param: IOracleDbDetail): string[] {
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

  alterColumn(
    connectInfo: IConnectInfo,
    table: string,
    column: string,
    type: string,
    comment: string,
    nullable: string,
  ): string {
    const defaultDefine = nullable == 'YES' ? '' : ' NOT NULL';
    comment = comment ? ` comment '${comment}'` : '';
    //@formatter:off
    return `ALTER TABLE\n\t${table} CHANGE ${column} ${column} ${type}${defaultDefine}${comment};`;
    // @formatter:on
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
    let multiSql: string[] = [];
    let fullTable = this.getFullName(connectInfo, table);
    let columnNameDef = columnName;
    const columnTypeDef = newColumnType ? newColumnType : columnType;
    const columnLengthDef = newColumnLength ? newColumnLength : columnLength;
    const columnScaleDef = newColumnScale ? newColumnScale : columnScale;
    if (newColumnName && columnName !== newColumnName) {
      columnNameDef = newColumnName;
      // @formatter:off
      multiSql.push(`ALTER TABLE ${fullTable} RENAME COLUMN ${columnName} TO ${newColumnName}`);
      // @formatter:on
    }
    if (newColumnType || newColumnLength || newColumnScale || (newNotNull !== undefined && newNotNull !== notNull) || newDefaultValue) {
      let columnTypeDefine = DMUtils.getColumnDefinition(columnTypeDef, columnLengthDef, columnScaleDef);
      const defaultSet = this.judgeDefaultValue(defaultValue, newDefaultValue);
      let sqlDef = `${columnNameDef} ${columnTypeDefine}`;
      //default value 修改
      if (defaultSet) {
        if (defaultSet === 'SetNull') {
          sqlDef += ` DEFAULT NULL`;
        } else if (defaultSet === 'SetEmpty') {
          sqlDef += ` DEFAULT ''`;
        } else if (defaultSet === 'SetValue') {
          sqlDef += ` DEFAULT ` + SqlDealUtils.getDefaultValue(this.getServerType(), columnType, newDefaultValue);
        }
      }
      // let notNullDef: boolean = false;
      if (newNotNull !== undefined && newNotNull !== notNull) {
        if (newNotNull === true) {
          sqlDef += ' NOT NULL';
        } else {
          sqlDef += ' NULL';
        }
      }
      if (newAutoIncrement && newAutoIncrement === 'IDENTITY') {
        sqlDef += ` IDENTITY(1,1)`;
      }
      multiSql.push(`ALTER TABLE ${fullTable} MODIFY ( ${sqlDef})`);
    }
    //newComment 可能为空字符串，
    if (newComment !== undefined && newComment !== comment) {
      multiSql.push(`COMMENT ON COLUMN ${fullTable}.${columnNameDef} IS '${newComment}'`);
    }
    return multiSql;
  }

  alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string) {
    //@formatter:off
    return `alter table ${oldName} rename to ${newName}`;
    // @formatter:on
  }

  /*--------------------update-------------*/

  updatePrimaryKey(
    connectInfo: IConnectInfo,
    existPrimaryKeys: IPrimaryMeta[],
    table: string,
    addPrimaryKeys: string[],
  ) {
    //1.原来没有，只添加新的key
    //2.原来有，需要全部删除，然后添加新的key
    //1.原来没有，只添加新的key
    //2.原来有，需要全部删除，然后添加新的key
    const fullTableName = this.getFullName(connectInfo, table);
    const buildSql: string[] = [];
    let constraintName = '';
    //@formatter:off
    if (existPrimaryKeys.length > 0) {
      let primaryKey = existPrimaryKeys[0];
      constraintName = primaryKey.constraint!;
      buildSql.push(`ALTER TABLE ${fullTableName} DROP CONSTRAINT ${constraintName}`);
    }
    if (addPrimaryKeys.length > 0) {
     //const constraintDef = constraintName ? `CONSTRAINT ${constraintName}` : '';
      buildSql.push(`ALTER TABLE ${fullTableName} ADD PRIMARY KEY (${addPrimaryKeys.join(',')})`);
    }
    return buildSql;
    // @formatter:on
  }

  /*--------------------delete--------------------*/

  //ALTER TABLE  `user` DROP column name

  /*--------------------build---------------------*/

  buildCreateTableSql(
    connectInfo: IConnectInfo,
    table: ITableMeta,
    columns: IColumnMeta[],
    primaryKeys?: IPrimaryMeta[],
  ): string {
    let fullTableName = this.getFullName(connectInfo, table.name!);
    // for (let column of columns) {
    //   const { name, columnType, nullable, columnLength, columnScale, defaultValue, comment, key } = column;
    // }
    let sql = `CREATE TABLE ${fullTableName} (\n`;
    return sql;
  }

  /*-----------example-------------------------*/
  selectExample(tableName: string, columns: string[]): string {
    //@formatter:off
    let sql = `SELECT * FROM (
    SELECT ${columns.join(',')}, ROWNUM AS rn FROM ${tableName}
    )
WHERE rn BETWEEN 0 AND 10;`;
    //@formatter:on
    return sql;
  }

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
}
