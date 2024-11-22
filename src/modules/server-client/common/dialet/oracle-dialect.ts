import { CreateColumnParam, CreateTableParam, UpdateColumnParam, UpdateTableParam } from '../types/sql-param.types';
import { isNotEmpty } from '../../../base/utils/object-util';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IColumnMeta, IConnectInfo, IOracleDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IPageService, PageUtils } from '../page/pageService';
import { OraclePageService } from '../page/oraclePageSerivce';
import { ServerType } from '../../../base/types/server-node.types';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';
import { SqlDealUtils } from '../utils/sql-deal-utils';
import { OracleUtils } from '../utils/oracle-utils';
import { IWhereParam } from '../../../base/model/sql-param.model';

export class OracleDialect extends AbstractDefaultSqlDialect {

  private PROCEDURE = 'PROCEDURE';
  private SEQUENCE = 'SEQUENCE';
  private FUNCTION = 'FUNCTION';
  private TRIGGER = 'TRIGGER';

  public getServerType(): ServerType {
    return 'Oracle';
  }


  public getFullName(dbinfo: IConnectInfo, name: string): string {
    return `"${dbinfo.db}"."${name}"`;
  }

  /*--------------------切换database，schema，-------------*/

  pingDialect(): string {
    return 'SELECT 1 FROM DUAL';
  }

  useDataBase(database: string): string {
    return `ALTER SESSION SET CURRENT_SCHEMA = ${database}`;
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
    return `SELECT t.table_name AS "name", c.comments AS "comment"
            FROM all_tables t
                   LEFT JOIN all_tab_comments c ON t.owner = c.owner AND t.table_name = c.table_name
            WHERE t.owner = '${connectInfo.db}'`;
  }

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string {
    return `SELECT table_name AS "name", comments AS "comment"
            FROM ALL_TAB_COMMENTS
            WHERE OWNER = '${connectInfo.db}'
              and TABLE_NAME = '${tableName}'`;
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
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
                   c.TABLE_NAME                                        AS "tableName"
            FROM all_tab_columns c
                   LEFT JOIN (SELECT cons.constraint_type, cc.column_name, cc.table_name
                              FROM all_constraints cons
                                     left join all_cons_columns cc on cc.constraint_name = cons.constraint_name
                              where cons.OWNER = '${connectInfo.db}'
                                AND cons.TABLE_NAME = '${table}'
                                AND cons.constraint_type = 'P') p
                             on p.COLUMN_NAME = c.COLUMN_name
                   LEFT JOIN
                 ALL_COL_COMMENTS com
                 ON c.OWNER = com.OWNER AND c.TABLE_NAME = com.TABLE_NAME AND c.COLUMN_NAME = com.COLUMN_NAME
            WHERE c.owner = '${connectInfo.db}'
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
    return `SELECT TEXT AS "ViewDefinition" FROM ALL_VIEWS
      WHERE OWNER='${connectInfo.db}' AND VIEW_NAME = '${view}'`;
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
    return ``;
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

  public selectTableByPage(connectInfo: IConnectInfo, table: string, page?: number, pageSize?: number): string {
    const pageInfo = PageUtils.buildPage(page, pageSize);
    //return `SELECT * FROM ${this.getFullName(connectInfo, table)} LIMIT ${pageSize} OFFSET ${pageInfo.start}`;
    const tableName = this.getFullName(connectInfo,table);
    return `SELECT ${tableName}.*,ROWID "CLIENTBIZ_ROWID" FROM ${tableName} OFFSET ${pageInfo.start} ROWS FETCH NEXT ${pageInfo.pageSize} ROWS ONLY`
  }

  public selectTableByPageAndWhere(
    connectInfo: IConnectInfo,
    table: string,
    page?: number,
    pageSize?: number,
    filterParams?: IWhereParam[],
  ): string {
    const {server:{version}} = connectInfo;
    const pageInfo = PageUtils.buildPage(page, pageSize);
    const whereSql = this.buildWhere(filterParams);
    const tableName = this.getFullName(connectInfo,table);
    // @formatter:off
    if(version && version==='11g'){
      return `SELECT * FROM (SELECT "CLIENTBIZ_TABLE".*, ROWNUM "CLIENTBIZ_ROWNUM" FROM (SELECT ${tableName}.*,ROWID "CLIENTBIZ_ROWID" FROM ${tableName} ${whereSql}) "CLIENTBIZ_TABLE" WHERE ROWNUM <= ${pageInfo.end}) WHERE "CLIENTBIZ_ROWNUM" > ${pageInfo.start}`
    }
    return `SELECT ${tableName}.*,ROWID "CLIENTBIZ_ROWID" FROM ${tableName} ${whereSql} OFFSET ${pageInfo.start} ROWS FETCH NEXT ${pageInfo.pageSize} ROWS ONLY`
    // @formatter:off
  }

  /*--------------------count-------------*/

  countByTable(connectInfo: IConnectInfo, table: string): string {
    //@formatter:off
    return ` SELECT COUNT(*) AS "total"
             FROM all_tables t
             WHERE t.owner = '${connectInfo.db}'
               AND t.table_name='${table}'`;
    //@formatter:on
  }


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

  createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    const { table, columns, primaryKeys } = tableParam;
    let columnSql: string[] = [];
    let commentSql: string[] = [];
    let sql: string[] = [];
    let fullTableName = this.getFullName(connectInfo, tableParam.table);
    for (let column of columns) {
      const { columnName, columnType, notNull, columnLength, columnScale, defaultValue, comment, autoIncrement } =
        column;
      const fullColumnType = OracleUtils.getColumnDefinition(columnType, columnLength, columnScale);
      columnLength ? `${columnType}(${columnLength})` : columnType;
      const nullAbleDef = notNull ? ' NOT NULL' : '';
      const defaultValueDef = isNotEmpty(defaultValue) ? ` DEFAULT '${defaultValue}'` : '';
      columnSql.push(
        `\t${columnName}  ${autoIncrement ? autoIncrement : fullColumnType + defaultValueDef + nullAbleDef}`,
      );
      if (comment) {
        //@formatter:off
        commentSql.push(`COMMENT ON COLUMN ${fullTableName}.${columnName} IS '${comment}'`);
        //@formatter:on
      }
    }
    let primaryKeySql = '';
    if (primaryKeys) {
      if (primaryKeys.length === 1) {
        primaryKeySql = `\tPRIMARY KEY(${primaryKeys[0]})`;
      } else if (primaryKeys.length > 1) {
        primaryKeySql = `\tCONSTRAINT PK_${table} KEY(${primaryKeys.join(',')})`;
      }
    }
    //@formatter:off
    sql.push(
      `CREATE TABLE ${fullTableName}(
${columnSql.join(',\n')}${primaryKeySql ? ',' : ''}
${primaryKeySql}
)`,
    );
    //@formatter:on
    if (commentSql.length > 0) {
      sql = sql.concat(commentSql);
    }
    console.log('oracle final sql:', sql);
    return sql;
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam) {
    const fullTableName = this.getFullName(connectInfo, table);
    let { columnName, columnType, columnLength, columnScale, defaultValue, comment, notNull } = createColumnParam;
    const fullColumnType = OracleUtils.getColumnDefinition(columnType, columnLength, columnScale);
    let multiSql: string[] = [];
    // @formatter:off
    multiSql.push(`ALTER TABLE ${fullTableName} ADD ${columnName} ${fullColumnType}`); //${defaultDefine}${comment}`;
    if (defaultValue) {
      defaultValue = defaultValue === ColumnEditDefaultSelect.EmptyString ? '' : defaultValue;
      multiSql.push(`ALTER TABLE ${fullTableName} MODIFY (${columnName} DEFAULT ${defaultValue})`);
    }
    if (notNull) {
      multiSql.push(`ALTER TABLE ${fullTableName} MODIFY(${columnName} NOT NULL)`);
    }
    if (comment) {
      multiSql.push(`COMMENT ON COLUMN  ${fullTableName}.${columnName} IS '${comment}'`);
    }
    // @formatter:on
    //设置not null
    return multiSql;
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

  alterColumn(connectInfo: IConnectInfo, table: string, column: string, type: string, comment: string, nullable: string): string {
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
    let columnDef = columnName;
    const columnTypeDef = newColumnType ? newColumnType : columnType;

    if (newColumnName && columnName != newColumnName) {
      columnDef = newColumnName;
      // @formatter:off
      multiSql.push(`ALTER TABLE ${fullTable} RENAME COLUMN ${columnName} TO ${newColumnName}`);
      // @formatter:on
    }
    if (newColumnType || newColumnLength || newColumnScale) {
      let columnTypeLengthDef = '';
      columnTypeLengthDef = OracleUtils.getColumnDefinition(
        columnTypeDef,
        newColumnLength ? newColumnLength : columnLength,
        newColumnScale ? newColumnScale : columnScale,
      );
      multiSql.push(`ALTER TABLE ${fullTable} MODIFY (${columnDef} ${columnTypeLengthDef})`);
    }
    if (newNotNull || newNotNull === false) {
      const notNullDef = newNotNull ? 'NOT NULL' : 'NULL';
      multiSql.push(`ALTER TABLE ${fullTable} MODIFY (${columnDef} ${notNullDef})`);
    }
    const judgeDefault = this.judgeDefaultValue(defaultValue, newDefaultValue);
    if (judgeDefault === 'SetNull') {
      multiSql.push(`ALTER TABLE ${table} MODIFY (${columnDef} DEFAULT NULL)`);
    } else if (judgeDefault === 'SetEmpty') {
      //设置默认值为空字符串
      multiSql.push(`ALTER TABLE ${table} MODIFY (${columnDef} DEFAULT '')`);
    } else if (judgeDefault === 'SetValue') {
      //前面的修改会删除默认值，所以此处要从新设置默认值
      multiSql.push(`ALTER TABLE ${fullTable} MODIFY (${columnDef} DEFAULT ${newDefaultValue})`);
    }
    //newComment 可能为空字符串，
    if (newComment !== undefined && newComment !== comment) {
      multiSql.push(`COMMENT ON COLUMN ${fullTable}.${columnDef} IS '${newComment}'`);
    }
    return multiSql;
  }

  alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string) {
    //@formatter:off
    const sql = `alter table ${oldName} rename ${newName}`;
    // @formatter:on
    return sql;
  }

  /*--------------------update-------------*/

  updatePrimaryKey(connectInfo: IConnectInfo, existPrimaryKeys: IPrimaryMeta[], table: string, addPrimaryKeys: string[]) {
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
      const constraintDef = constraintName ? `CONSTRAINT ${constraintName}` : '';
      buildSql.push(`ALTER TABLE ${fullTableName} ADD ${constraintDef} PRIMARY KEY (${addPrimaryKeys.join(',')})`);
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
    let columnSql: string[] = [];
    let commentSql: string[] = [];
    let fullTableName = this.getFullName(connectInfo, table.name!);
    for (let column of columns) {
      const { name, columnType, nullable, columnLength, columnScale, defaultValue, comment, key } = column;
      let fullColumnType = OracleUtils.getColumnDefinition(columnType, columnLength, columnScale);
      const nullAbleDef = nullable === 'NO' ? ' NOT NULL' : '';
      const defaultValueDef = isNotEmpty(defaultValue) ? ` DEFAULT ${defaultValue}` : '';
      columnSql.push(`\t"${name}" ${fullColumnType}${defaultValueDef}${nullAbleDef}`);
      //KEY === 'PRIMARY KEY' && primaryKeys.push(NAME);
      if (comment) {
        //@formatter:off
        //fullTableName之前已经加过双引号，此处不用添加了
        commentSql.push(`COMMENT ON COLUMN ${fullTableName}."${name}" IS '${SqlDealUtils.escapeString(comment)}';`);
        //@formatter:on
      }
    }
    let primaryKeySql = '';
    if (primaryKeys && primaryKeys.length) {
      primaryKeySql = `\tCONSTRAINT "${primaryKeys[0].constraint}" PRIMARY KEY(${primaryKeys
        .map((item) => `"${item.columnName}"`)
        .join(',')})`;
    }
    //@formatter:off
    let sql = `CREATE TABLE ${fullTableName} (
${columnSql.join(',\n')}${primaryKeySql ? ',' : ''}
${primaryKeySql}
);\n`;
    if (table.comment) {
      commentSql.unshift(`COMMENT ON TABLE ${fullTableName} IS '${SqlDealUtils.escapeString(table.comment)}';`);
    }
    //@formatter:on
    if (commentSql.length > 0) {
      sql = sql + commentSql.join('\n');
    }
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
