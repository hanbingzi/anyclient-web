import {
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  UpdateColumnParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IColumnMeta, IConnectInfo, IPostgresDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IPageService, PageUtils } from '../page/pageService';
import { ServerType } from '../../../base/types/server-node.types';
import { MssqlPageService } from '../page/mssqlPageSerivce';
import { IWhereParam } from '../../../base/model/sql-param.model';
import { isEmpty, isNotEmpty, isNotNull } from '../../../base/utils/object-util';
import { MysqlUtils } from '../utils/mysql-utils';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';
import { SqlDealUtils } from '../utils/sql-deal-utils';

export class MssqlDialect extends AbstractDefaultSqlDialect {
  private pageService: IPageService = new MssqlPageService();

  getServerType(): ServerType {
    return 'SQLServer';
  }

  getPageService(): IPageService {
    return this.pageService;
  }

  public getDefaultSchema(schema?: string): string {
    return schema ? schema : 'dbo';
  }

  public getFullName(connectInfo: IConnectInfo, name: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `[${schema}].[${name}]`;
  }

  public useDataBase(database: string | number): string {
    return ``;
  }

  public useSchema(schema: string): string {
    return ``;
  }

  /*--------------------show-------------*/

  showIndex(connectInfo: IConnectInfo, table: string): string {
    return ``;
  }

  showDatabases() {
    return `SELECT name as 'database'
            FROM sys.databases
            WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')`;
  }

  showTemplate() {
    return ``;
  }

  showDatabaseInfo(db: string): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  showSchemas(): string {
    return ` SELECT name as 'schema'
             FROM sys.schemas
             WHERE schema_id not in (3, 4)
               and schema_id < 16383`;
  }

  showSchemaInfo(schema: string): string {
    return ``;
  }

  showTablespace(): string {
    return ``;
  }

  showTables(connectInfo: IConnectInfo): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `SELECT t.name AS 'name',ep.value AS 'comment'
            FROM sys.tables t
                   LEFT JOIN
                 sys.extended_properties ep ON ep.major_id = t.object_id AND ep.minor_id = 0 AND ep.class = 1
            WHERE t.schema_id = SCHEMA_ID('${schema}')
            ORDER BY t.name`;
    // @formatter:on
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off
    return `SELECT c.name AS 'name', t.name AS 'columnType',
            CASE
              WHEN t.name IN ('nvarchar', 'nchar', 'varchar', 'char', 'varbinary', 'binary') THEN t.name + '(' + CASE WHEN c.max_length = -1 THEN 'MAX' ELSE CAST(c.max_length AS VARCHAR(10)) END +')'
              WHEN t.name IN ('numeric', 'decimal') THEN t.name + '(' + CAST(c.precision AS VARCHAR(10)) + ',' + CAST(c.scale AS VARCHAR(10)) + ')'
              ELSE t.name
            END AS 'columnDefinition',
            CASE
              WHEN t.name IN ('nvarchar', 'nchar', 'varchar', 'char', 'varbinary', 'binary') THEN c.max_length
              WHEN t.name IN ('numeric', 'decimal') THEN c.precision
              WHEN t.name IN ('time', 'datetime2', 'datetimeoffset') THEN c.scale
              ELSE NULL
            END AS 'columnLength',
            CASE
              WHEN t.name IN ('numeric', 'decimal') THEN c.scale
              ELSE NULL
            END AS 'columnScale',
            ep.value AS 'comment',
            c.is_nullable AS 'nullable',
            dc.definition AS 'defaultValue',
            CASE
              WHEN pk.name IS NOT NULL THEN 1 ELSE 0
            END AS 'isPrimary',
            c.is_identity AS autoIncrement,
            c.is_identity AS isAutoIncrement,
            ISNULL(idc.seed_value, 0) AS identitySeed,
            ISNULL(idc.increment_value, 0) AS identityIncrement
            FROM sys.columns c
                   INNER JOIN
                 sys.types t ON c.user_type_id = t.user_type_id
                   INNER JOIN
                 sys.tables tbl ON c.object_id = tbl.object_id
                   LEFT JOIN
                 sys.default_constraints dc ON c.default_object_id = dc.object_id
                   LEFT JOIN
                 sys.extended_properties ep ON c.object_id = ep.major_id AND c.column_id = ep.minor_id AND ep.class = 1
                   LEFT JOIN
                 sys.index_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                   LEFT JOIN
                 sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
                   LEFT JOIN
                 sys.key_constraints pk ON i.object_id = pk.parent_object_id AND i.index_id = pk.unique_index_id
                  LEFT JOIN
                 sys.identity_columns idc ON c.object_id = idc.object_id AND c.column_id = idc.column_id
            WHERE tbl.name = '${table}'
              AND SCHEMA_NAME(tbl.schema_id) = '${connectInfo.schema}'`;
    // @formatter:on
  }

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {
    const schema = connectInfo.schema ? connectInfo.schema : 'public';
    const queryTables: string[] = [];
    tables.forEach((value) => queryTables.push(`'${value}'`));
    // @formatter:off
    return ``;
    // @formatter:on
  }

  showViews(connectInfo: IConnectInfo): string {
    return ``;
  }

  showUsers(): string {
    return ``;
  }

  showRoles(): string {
    return `select rolname
            from pg_roles`;
  }

  public showPrimary(connectInfo: IConnectInfo, table: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `SELECT
    KU.table_name AS tableName,
    COLUMN_NAME AS columnName,
    KU.ORDINAL_POSITION AS ordinal,
    KU.CONSTRAINT_NAME AS "constraint"
FROM
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC
    INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
        ON TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME
WHERE
    TC.CONSTRAINT_TYPE = 'PRIMARY KEY'
    AND KU.table_schema='${schema}'
    AND KU.table_name = '${table}';`;
    // @formatter:on
  }

  showTriggers(connectInfo: IConnectInfo): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT t.name ,OBJECT_NAME(t.parent_id) AS tableName FROM sys.triggers t WHERE OBJECT_SCHEMA_NAME(t.parent_id) = '${schema}'; `;
  }

  showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT
    OBJECT_SCHEMA_NAME(t.parent_id) AS SchemaName,
    OBJECT_NAME(t.parent_id) AS TableName,
    t.*
    FROM sys.triggers t
    WHERE OBJECT_SCHEMA_NAME(t.parent_id) = '${schema}'; `;
  }

  showTriggerSource(connectInfo: IConnectInfo, name: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `SELECT
      m.definition AS createTriggerSql
      FROM sys.triggers t
      JOIN sys.sql_modules m ON t.object_id = m.object_id
      WHERE t.name = '${name}'
      AND OBJECT_SCHEMA_NAME(t.parent_id) = '${schema}';`;
    // @formatter:on
  }

  showProcedures(connectInfo: IConnectInfo): string {
    return `SELECT name
            FROM sys.objects
            WHERE type_desc = 'SQL_STORED_PROCEDURE'
              AND schema_id = SCHEMA_ID('${connectInfo.schema}')`;
  }

  showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    return `SELECT *
            FROM sys.objects
            WHERE type_desc = 'SQL_STORED_PROCEDURE'
              AND schema_id = SCHEMA_ID('${connectInfo.schema}')
              and name = '${procedure}'`;
  }

  showProcedureSource(connectInfo: IConnectInfo, name: string): string {
    return `SELECT definition as 'createProcedureSql'
            FROM sys.sql_modules
            WHERE object_id = OBJECT_ID('${connectInfo.schema}.${name}')`;
  }

  showFunctions(connectInfo: IConnectInfo): string {
    return `SELECT name
            FROM sys.objects
            WHERE type_desc in ('SQL_SCALAR_FUNCTION', 'SQL_INLINE_TABLE_VALUED_FUNCTION', 'SQL_TABLE_VALUED_FUNCTION')
              AND schema_id = SCHEMA_ID('${connectInfo.schema}')`;
  }

  showFunction(connectInfo: IConnectInfo, functionName: string): string {
    return `SELECT *
            FROM sys.objects
            WHERE type_desc in ('SQL_SCALAR_FUNCTION', 'SQL_INLINE_TABLE_VALUED_FUNCTION', 'SQL_TABLE_VALUED_FUNCTION')
              AND schema_id = SCHEMA_ID('${connectInfo.schema}')
              and name = '${functionName}'`;
  }

  showFunctionSource(connectInfo: IConnectInfo, name: string): string {
    return `SELECT definition as 'createFunctionSql'
            FROM sys.sql_modules
            WHERE object_id = OBJECT_ID('${connectInfo.schema}.${name}')`;
  }

  showSequences(connectInfo: IConnectInfo): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT name FROM sys.sequences WHERE schema_id = SCHEMA_ID('${schema}');`;
  }

  showSequence(connectInfo: IConnectInfo, sequence: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT * FROM sys.sequences WHERE schema_id = SCHEMA_ID('${schema}') and name='${sequence}';`;
  }

  showSequenceSource(connectInfo: IConnectInfo, sequence: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `select 'CREATE SEQUENCE ' + t1.name +
'\n\t START WITH ' + CAST(t1.start_value AS VARCHAR(20)) +
'\n\t INCREMENT BY ' + CAST(t1.increment AS VARCHAR(20)) +
CASE WHEN t1.is_cycling = 1 THEN ' \n\tCYCLE' ELSE '' END +
CASE WHEN t1.is_cached = 0 THEN ' \n\tNO CACHE' WHEN t1.is_cached = 1 AND t1.cache_size IS NOT NULL THEN ' \n\tCACHE ' + CAST(t1.cache_size AS VARCHAR(10)) ELSE '' END +
CASE WHEN t1.minimum_value IS NOT NULL THEN ' \n\tMINVALUE ' + CAST(t1.minimum_value AS VARCHAR(20)) ELSE '' END +
CASE WHEN t1.maximum_value IS NOT NULL THEN ' \n\tMAXVALUE ' + CAST(t1.maximum_value AS VARCHAR(20)) ELSE '' END +
';' as text  FROM
    sys.sequences t1 WHERE schema_id = SCHEMA_ID('${schema}') and name='${sequence}';`;
    // @formatter:on
  }

  showViewSource(connectInfo: IConnectInfo, view: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `SELECT
    m.definition AS 'ViewDefinition'
FROM sys.views v
JOIN sys.sql_modules m ON v.object_id = m.object_id
WHERE v.name = '${view}'
    AND SCHEMA_NAME(v.schema_id) = '${schema}'; `;
    // @formatter:on
  }

  showProcessList(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  showVariableList(): string {
    return ``;
  }

  showStatusList(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string {
    let schema = connectInfo.schema ? connectInfo.schema : 'public';
    return ``;
  }

  /*--------------------select-------------*/
  public selectSql(connectInfo: IConnectInfo, table: string): string {
    console.error('sql语句未实现selectSql');
    return ``;
  }

  selectExample(tableName: string, columns: string[]): string {
    let sql = `SELECT TOP 100 ${columns.join(',')}
               FROM ${tableName};`;
    return sql;
  }

  public selectTableByPage(connectInfo: IConnectInfo, table: string, page?: number, pageSize?: number): string {
    const pageInfo = PageUtils.buildPage(page, pageSize);
    const fullName = this.getFullName(connectInfo, table);
    if (page === 1) {
      return `SELECT TOP ${pageSize} * FROM ${fullName}`;
    }
    return `SELECT *, 0 AS _BIZ_ORDER_F_ FROM ${fullName} ORDER BY _BIZ_ORDER_F_ OFFSET ${pageInfo.start} ROWS FETCH NEXT ${pageInfo.pageSize} ROWS ONLY`;
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
    const fullName = this.getFullName(connectInfo, table);
    // @formatter:off
    if (page === 1) {
      return `SELECT TOP ${pageSize} * FROM ${fullName} ${whereSql}`;
    }
    return `SELECT *, 0 AS _BIZ_ORDER_F_ FROM ${fullName} ${whereSql} ORDER BY _BIZ_ORDER_F_ OFFSET ${pageInfo.start} ROWS FETCH NEXT ${pageInfo.pageSize} ROWS ONLY`;
    // @formatter:off
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
    let schema = connectInfo.schema ? connectInfo.schema : 'public';
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
    const { schema, owner, comment } = param;
    return [``];
  }

  generateColumnDefinition(column: CreateColumnParam): string {
    //console.log('generateColumnDefinition->', column);
    const { columnName, columnType, columnLength, columnScale, comment, autoIncrement, defaultValue, notNull } = column;
    let columnTypeDefine = MysqlUtils.getColumnDefinition(columnType, columnLength, columnScale);
    let def = `[${columnName}] ${columnTypeDefine}`;
    if (notNull) {
      def += ' NOT NULL';
    } else {
      def += ' NULL';
    }
    if (isNotNull(defaultValue)) {
      if (ColumnEditDefaultSelect.EmptyString === defaultValue || isEmpty(defaultValue)) {
        def += ` DEFAULT ''`;
      } else {
        const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
        //还的判断选择的类型
        const convertNewValue =
          simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? defaultValue : `'${defaultValue}'`;
        def += ` DEFAULT ${convertNewValue}`;
      }
    }
    if (autoIncrement && autoIncrement==='IDENTITY') {
      def += ` IDENTITY(1,1)`;
    }
    return def;
  }

  public generateColumnComment(
    schema: string,
    table: string,
    columnName: string,
    comment: string,
    deleteOldComment: boolean = false,
  ): string[] {
    const buildSql: string[] = [];
    if (deleteOldComment) {
      buildSql.push(`EXEC sys.sp_dropextendedproperty @name = N'MS_Description',
             @level0type = N'SCHEMA', @level0name = N'${schema}',
             @level1type = N'TABLE', @level1name = N'${table}',
             @level2type = N'COLUMN', @level2name = N'${columnName}'`);
    }
    buildSql.push(`EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'${comment}',
             @level0type = N'SCHEMA', @level0name = N'${schema}',
             @level1type = N'TABLE', @level1name = N'${table}',
             @level2type = N'COLUMN', @level2name = N'${columnName}'`);
    return buildSql;
  }
  public generateAlterDefaultValue(change: {

    schema: string;
    table: string;
    columnName: string;
    columnType: string;
    oldDefault?: string;
    newDefault?: string;
  }): string[] {
    const {  schema, table, columnName, columnType, oldDefault, newDefault } = change;
    const statements: string[] = [];
    const judgeDefault = this.judgeDefaultValue(oldDefault, newDefault);
    const dropDefaultValueSql = `IF EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_column_id = c.column_id AND dc.parent_object_id = c.object_id
    WHERE c.object_id = OBJECT_ID('${schema}.${table}')
    AND c.name = '${columnName}'
)
BEGIN
    DECLARE @constraintName NVARCHAR(128);
    SELECT @constraintName = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_column_id = c.column_id AND dc.parent_object_id = c.object_id
    WHERE c.object_id = OBJECT_ID('${schema}.${table}')
    AND c.name = '${columnName}';

    EXEC('ALTER TABLE ${schema}.${table} DROP CONSTRAINT ' + @constraintName);
END`
    if (judgeDefault === 'SetNull') {
      statements.push(dropDefaultValueSql);
    } else if (judgeDefault === 'SetEmpty') {
      statements.push(dropDefaultValueSql);
      statements.push(
        `ALTER TABLE [${schema}].[${table}] ADD CONSTRAINT DF_${table}_${columnName} DEFAULT '' FOR [${columnName}];`,
      );
    } else if (judgeDefault === 'SetValue') {
      const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
      //还的判断选择的类型
      const convertNewValue =
        simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? newDefault : `'${newDefault}'`;
      statements.push(dropDefaultValueSql);
      statements.push(
        `ALTER TABLE [${schema}].[${table}] ADD CONSTRAINT DF_${table}_${columnName} DEFAULT ${convertNewValue} FOR [${columnName}];`,
      );
    }
    return statements;
  }

  public createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    const { table, columns, primaryKeys } = tableParam;
    const schema = this.getDefaultSchema(connectInfo.schema);
    const primaryKeyDefine = primaryKeys && primaryKeys.length > 0 ? `PRIMARY KEY (${primaryKeys.join(',')})` : '';
    const commentDefineArray: string[] = [];
    const columnDefineArray: string[] = [];
    for (let i = 0; i < columns.length; i++) {
      const { columnName, comment } = columns[i];
      // let fullColumnTypeDefine = MssqlUtils.getColumnDefinition(columnType, columnLength, columnScale);
      // let notNullDefine = notNull ? 'NOT NULL' : '';
      // let defaultValueDefine = defaultValue ? `DEFAULT ${defaultValue}` : '';
      // let autoIncrementDefine = autoIncrement ? 'IDENTITY(1,1)' : '';
      // columnDefineArray.push(
      //   `[${columnName}] ${fullColumnTypeDefine} ${notNullDefine} ${defaultValueDefine} ${autoIncrementDefine}`,
      // );
      columnDefineArray.push(this.generateColumnDefinition(columns[i]));
      if (isNotEmpty(comment)) {
        commentDefineArray.push(...this.generateColumnComment(schema, table, columnName, comment));
      }
    }
    if (isNotEmpty(primaryKeyDefine)) {
      columnDefineArray.push(primaryKeyDefine);
    }
    const columnDefine = columnDefineArray.join(',\n');
    //@formatter:off
    let createSql = `CREATE TABLE [${schema}].[${table}](\n${columnDefine})`;
    //@formatter:on
    return [createSql, ...commentDefineArray];
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam) {
    const schema = this.getDefaultSchema(connectInfo.schema);
    const columnDef = this.generateColumnDefinition(createColumnParam);
    const batchSql: string[] = [`ALTER TABLE ${table} ADD ${columnDef}`];
    if (createColumnParam.comment) {
      batchSql.push(
        ...this.generateColumnComment(schema, table, createColumnParam.columnName, createColumnParam.comment),
      );
    }
    //@formatter:off
    return batchSql;
    //@formatter:on
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

  // dropTrigger(connectInfo: IConnectInfo, name: string,tableName:string): string {
  //   return `DROP TRIGGER ${this.getFullName(connectInfo,name)}`;
  // }

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
    const { oldschema, schema, owner, comment } = param;
    return [``];
  }

  alterColumn(
    connectInfo: IConnectInfo,
    table: string,
    column: string,
    type: string,
    comment: string,
    nullable: string,
  ): string {
    return ``;
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
      defaultValue = '',
      newDefaultValue,
      comment = '',
      newComment,
      autoIncrement,
      newAutoIncrement
    } = updateColumnParam;
    const schema = this.getDefaultSchema(connectInfo.schema);
    let buildSql: string[] = [];
    if (isNotEmpty(newColumnName) && newColumnName !== columnName) {
      buildSql.push(`EXEC sp_rename '[${schema}].[${table}].[${columnName}]', '${newColumnName}', 'COLUMN';`);
    }
    const columnNameDef = newColumnName ? newColumnName : columnName;
    const columnTypeDef = newColumnType ? newColumnType : columnType;
    if (newColumnType || newColumnLength || newColumnScale || (newNotNull !== undefined && newNotNull !== notNull)) {
      let notNullDef: boolean = false;
      if (newNotNull === true || (isEmpty(newNotNull) && notNull === true)) {
        notNullDef = true;
      }

      const columnLengthDef = newColumnLength ? newColumnLength : columnLength;
      const columnScaleDef = newColumnScale ? newColumnScale : columnScale;
      //const autoIncrementDef=newAutoIncrement?newAutoIncrement:autoIncrement;
      //const fullColumnTypeDef = MysqlUtils.getColumnDefinition(columnTypeDef, columnLengthDef, columnScaleDef);
      const alterColumnTypeDef = this.generateColumnDefinition({
        columnName: columnNameDef,
        columnType: columnTypeDef,
        columnLength: columnLengthDef,
        columnScale: columnScaleDef,
        notNull: notNullDef,
        //autoIncrement:isNotEmpty(newAutoIncrement)
      });
      buildSql.push(`ALTER TABLE [${schema}].[${table}] ALTER COLUMN ${alterColumnTypeDef} `);
    }
    const alterDefaultValueSql = this.generateAlterDefaultValue({

      schema,
      table,
      columnName: columnNameDef,
      columnType: columnTypeDef,
      oldDefault: defaultValue,
      newDefault: newDefaultValue,
    });
    if (alterDefaultValueSql.length > 0) {
      buildSql.push(...alterDefaultValueSql);
    }
    if (isNotEmpty(newComment) && newComment !== comment) {
      console.log('------->newComment');
      buildSql = buildSql.concat(
        this.generateColumnComment(schema, table, columnNameDef, newComment, isNotNull(comment)),
      );
    }
    return buildSql;
  }

  //暂时用不到
  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string {
    //
    return '';
  }

  alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string {
    const { table, newTableName, comment, newComment } = update;
    let sql = '';

    return sql;
  }

  public alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string): string {
    let schema = connectInfo.schema ? connectInfo.schema : 'public';
    return `EXEC sp_rename '${schema}.${oldName}', '${newName}';`;
  }

  /*--------------------update-------------*/

  /*--------------------update-------------*/

  updatePrimaryKey(
    connectInfo: IConnectInfo,
    existPrimaryKeys: IPrimaryMeta[],
    table: string,
    primaryKeys: string[],
  ): string[] {
    //1.原来没有，只添加新的key
    //2.原来有，需要全部删除，然后添加新的key
    let schema = this.getDefaultSchema(connectInfo.schema);
    const buildSql: string[] = [];
    //@formatter:off
    if (existPrimaryKeys.length > 0) {
      let primaryKey = existPrimaryKeys[0];
      buildSql.push(`ALTER TABLE ${schema}.${table} DROP CONSTRAINT [${primaryKey.constraint}]`);
    }
    if (primaryKeys.length > 0) {
      buildSql.push(
        `ALTER TABLE ${schema}.${table} ADD PRIMARY KEY (${primaryKeys.map((item) => `[${item}]`).join(', ')})`,
      );
    }
    return buildSql;
    // @formatter:on
  }

  /*--------------------delete--------------------*/

  /*--------------------build---------------------*/

  buildPageSql(connectInfo: IConnectInfo, table: string, pageSize: number): string {
    return `SELECT *
            FROM ${table} LIMIT ${pageSize};`;
  }

  buildCreateTableSql(
    connectInfo: IConnectInfo,
    table: ITableMeta,
    columns: IColumnMeta[],
    primaryKeys?: IPrimaryMeta[],
  ): string {
    const schemaName = this.getDefaultSchema(connectInfo.schema);
    let sql = `CREATE TABLE ${schemaName}.${table.name} (\n`;
    // 添加列定义
    sql += columns
      .map((column) => {
        let columnDef = `\t${column.name} ${column.columnType}`;
        // 添加长度、精度和小数位数
        if (isNotEmpty(column.columnScale) && column.columnScale !== 0) {
          columnDef += `(${column.columnLength},${column.columnScale})`;
        } else if (isNotEmpty(column.columnLength) && column.columnLength !== 0) {
          columnDef += `(${column.columnLength})`;
        }
        // 添加可空性
        columnDef += column.nullable ? ' NULL' : ' NOT NULL';
        // 添加默认值
        if (column.defaultValue !== null) {
          columnDef += ` DEFAULT ${column.defaultValue}`;
        }
        // 添加自增属性
        if (column.autoIncrement) {
          columnDef += ` IDENTITY(${column.identitySeed || 1},${column.identityIncrement || 1})`;
        }
        return columnDef;
      })
      .join(',\n');
    // 添加主键约束
    if (primaryKeys && primaryKeys.length > 0) {
      sql += `,\n\tCONSTRAINT ${primaryKeys[0].constraint} PRIMARY KEY (${primaryKeys
        .map((item) => item.columnName)
        .join(', ')})`;
    }
    sql += '\n);\n';

    // 添加外键约束
    // if (foreignKeys && foreignKeys.length > 0) {
    //   foreignKeys.forEach(fk => {
    //     sql += `\nALTER TABLE ${schemaName}.${tableName} ADD CONSTRAINT ${fk.name} ` +
    //       `FOREIGN KEY (${fk.columns.join(', ')}) ` +
    //       `REFERENCES ${fk.referencedTable} (${fk.referencedColumns.join(', ')});\n`;
    //   });
    // }
    return sql;
  }

  /*-----------example-------------------------*/

  /*--------------------template---------------*/

  addColumnTemplate(table: string): string {
    // @formatter:off
    return `ALTER TABLE ${table} ADD COLUMN [column] [type];`;
    // @formatter:on
  }

  viewTemplate(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  procedureTemplate(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  triggerTemplate(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  functionTemplate(): string {
    // @formatter:off
    return ``;
    // @formatter:on
  }

  dropTriggerTemplate(name: string) {
    return ``;
  }

  truncateDatabase(connectInfo: IConnectInfo): string {
    return ``;
  }
}
