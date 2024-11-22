import {
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  UpdateColumnParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IColumnMeta, IConnectInfo, IPostgresDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { isNotEmpty, isNotNull } from '../../../base/utils/object-util';
import { IPageService } from '../page/pageService';
import { PostgresPageService } from '../page/postgrePageService';
import { ServerType } from '../../../base/types/server-node.types';
import { ColumnEditDefaultSelect } from '../../../base/types/sql.types';
import { PostgresUtils } from '../utils/postgresql-utils';
import { SqlDealUtils } from '../utils/sql-deal-utils';

export class PostgresDialect extends AbstractDefaultSqlDialect {
  private pageService: IPageService = new PostgresPageService();

  getServerType(): ServerType {
    return 'Postgresql';
  }

  getPageService() {
    return this.pageService;
  }

  public getDefaultSchema(schema?: string): string {
    return schema ? schema : 'public';
  }

  public getFullName(connectInfo: IConnectInfo, name: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `"${schema}"."${name}"`;
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
    return `SELECT indexname index_name, indexdef
            FROM pg_indexes
            WHERE schemaname = '${connectInfo.schema}'
              and tablename = '${table}'`;
  }

  showDatabases() {
    return `SELECT datname AS "database"
            FROM pg_database
            WHERE datistemplate = false`;
  }

  showTemplate() {
    return `select datname "name"
            from pg_database`;
  }

  showDatabaseInfo(db: string): string {
    // @formatter:off
    return `select  t1.datname as database,
                    t1.datcollate as collate,
                    t1.datctype as datctype,
                    t1.datistemplate as istemplate,
                    t1.datallowconn as allowconn,
                    t1.datconnlimit as connlimit,
                    t2.spcname as tablespace,
                    t3.rolname as owner,
                    pg_encoding_to_char(t1.encoding)  as encoding,
                    shobj_description(t1.oid, 'pg_database') as comment
            from pg_database t1
              left join pg_tablespace t2
            on t1.dattablespace=t2.oid
              left join pg_authid t3
            on t1.datdba=t3.oid
            where t1.datname='${db}'`;
    // @formatter:on
  }

  showSchemas(): string {
    return `select catalog_name "Database", schema_name "schema"
            from information_schema.schemata where schema_name not in ('information_schema', 'pg_toast', 'pg_catalog')`;
  }

  showSchemaInfo(schema: string): string {
    return `SELECT s.schema_name          AS "schema",
                   obj_description(n.oid) AS "comment",
                   schema_owner           AS "owner"
            FROM information_schema.schemata AS s
                   JOIN pg_namespace AS n ON s.schema_name = n.nspname
            where s.schema_name = '${schema}'`;
  }

  showTablespace(): string {
    return 'select spcname as name from pg_tablespace';
  }

  showTables(connectInfo: IConnectInfo): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    // @formatter:off
    return `  SELECT t.table_name "name", pg_catalog.obj_description(pgc.oid, 'pg_class') "comment"
              FROM information_schema.tables t
                     JOIN pg_catalog.pg_class pgc ON t.table_name = pgc.relname
                     JOIN pg_catalog.pg_namespace pgn ON pgn.oid = pgc.relnamespace and pgn.nspname = t.table_schema
              WHERE t.table_type = 'BASE TABLE'
                AND t.table_schema = '${schema}'
              order by t.table_name;`;
    // @formatter:on
  }

  showColumns(connectInfo: IConnectInfo, table: string): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    const view = table.split('.')[1];
    return `SELECT c.COLUMN_NAME                           AS "name",
                   CASE
                     WHEN c.data_type = 'ARRAY' THEN
                       'text[]'
                     ELSE
                       c.udt_name
                     END                                   AS "columnType",
                   CASE
                     -- 需要长度信息的类型
                     WHEN c.udt_name IN ('varchar', 'bpchar', 'varbit', 'bit') THEN
                       c.udt_name || '(' || COALESCE(c.character_maximum_length::text, 'MAX') || ')'
                     -- 需要精度和小数位的类型
                     WHEN c.udt_name = 'numeric' THEN
                       c.udt_name || '(' || COALESCE(c.numeric_precision::text, 'MAX') || ',' ||
                       COALESCE(c.numeric_scale::text, '0') || ')'
                     -- 时间类型可能需要精度信息
                     WHEN c.udt_name IN ('timetz', 'timestamptz', 'time', 'timestamp') THEN
                       c.udt_name || '(' || COALESCE(c.datetime_precision::text, '6') || ')'
                     -- 数组类型
                     WHEN c.data_type = 'ARRAY' THEN
                       'text[]'
                     -- 其他类型直接用udt_name表示
                     ELSE
                       c.udt_name
                     END                                   AS "columnDefinition",
                   CASE
                     -- 需要精度和小数位的类型
                     WHEN c.udt_name = 'numeric' THEN
                       c.numeric_precision
                     -- 时间类型可能需要精度信息
                     WHEN c.udt_name IN ('timetz', 'timestamptz', 'time', 'timestamp') THEN
                       c.datetime_precision
                     -- 其他类型直接用udt_name表示
                     ELSE
                       c.character_maximum_length
                     END                                   AS "columnLength",
                   CASE
                     WHEN c.numeric_scale = 0 THEN NULL
                     ELSE c.numeric_scale
                     END                                   AS "columnScale",
                   c.IS_NULLABLE                           AS "nullable",
                   c.COLUMN_DEFAULT                        AS "defaultValue",
                   col_description(pa.attrelid, pa.attnum) AS "comment",
                   tc.constraint_type                      AS "key"
            FROM information_schema.columns c
                   left join information_schema.constraint_column_usage ccu
                             on c.COLUMN_NAME = ccu.column_name and c.table_name = ccu.table_name and
                                ccu.table_catalog = c.TABLE_CATALOG
                               and c.table_schema = ccu.table_schema
                   left join information_schema.table_constraints tc
                             on tc.constraint_name = ccu.constraint_name and tc.table_schema = ccu.table_schema
                               and tc.table_catalog = c.TABLE_CATALOG and tc.table_name = c.table_name
                   left join pg_namespace pn on pn.nspname = c.TABLE_SCHEMA
                   left join pg_class pc on pc.relname = c.table_name AND pc.relnamespace = pn.oid
                   left join pg_attribute pa on pa.attrelid = pc.oid AND pa.attname = c.COLUMN_NAME
            WHERE c.TABLE_SCHEMA = '${schema}'
              AND c.table_name = '${view ? view : table}'
            ORDER BY ORDINAL_POSITION`;
  }

  showMultiTableColumns(connectInfo: IConnectInfo, tables: string[]): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    const queryTables: string[] = [];
    tables.forEach((value) => queryTables.push(`'${value}'`));
    // @formatter:off
    return `SELECT c.COLUMN_NAME                           AS "name",
                   c.udt_name                              AS "columnType",
                   CASE
                     -- 需要长度信息的类型
                     WHEN c.udt_name IN ('varchar', 'bpchar', 'varbit', 'bit') THEN
                       c.udt_name || '(' || COALESCE(c.character_maximum_length::text, 'MAX') || ')'
                     -- 需要精度和小数位的类型
                     WHEN c.udt_name = 'numeric' THEN
                       c.udt_name || '(' || COALESCE(c.numeric_precision::text, 'MAX') || ',' ||
                       COALESCE(c.numeric_scale::text, '0') || ')'
                     -- 时间类型可能需要精度信息
                     WHEN c.udt_name IN ('timetz', 'timestamptz', 'time', 'timestamp') THEN
                       c.udt_name || '(' || COALESCE(c.datetime_precision::text, '6') || ')'
                     -- 数组类型
                     WHEN c.data_type = 'ARRAY' THEN
                       'text[]'
                     -- 其他类型直接用udt_name表示
                     ELSE
                       c.udt_name
                     END                                   AS "columnDefinition",
                   CHARACTER_MAXIMUM_LENGTH                AS "columnLength",
                   IS_NULLABLE                             AS "nullable",
                   COLUMN_DEFAULT                          AS "defaultValue",
                   col_description(pa.attrelid, pa.attnum) AS "comment",
                   tc.constraint_type                      AS "key"
            FROM information_schema.columns c
                   left join information_schema.constraint_column_usage ccu
                             on c.COLUMN_NAME = ccu.column_name and c.table_name = ccu.table_name and
                                ccu.table_catalog = c.TABLE_CATALOG
                               and c.table_schema = ccu.table_schema
                   left join information_schema.table_constraints tc
                             on tc.constraint_name = ccu.constraint_name and tc.table_schema = ccu.table_schema
                               and tc.table_catalog = c.TABLE_CATALOG and tc.table_name = c.table_name
                   left join pg_namespace pn on pn.nspname = c.TABLE_SCHEMA
                   left join pg_class pc on pc.relname = c.table_name AND pc.relnamespace = pn.oid
                   left join pg_attribute pa on pa.attrelid = pc.oid AND pa.attname = c.COLUMN_NAME
            WHERE c.TABLE_SCHEMA = '${schema}'
              AND c.table_name IN (${queryTables.join(',')})
            ORDER BY ORDINAL_POSITION;`;
    // @formatter:on
  }

  showViews(connectInfo: IConnectInfo): string {
    return `select table_name "name"
            from information_schema.tables
            where table_schema = '${connectInfo.schema}'
              and table_type = 'VIEW'
            order by name`;
  }

  showUsers(): string {
    return `SELECT usename "user"
            from pg_user `;
  }

  showRoles(): string {
    return `select rolname
            from pg_roles`;
  }

  public showPrimary(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT c.COLUMN_NAME "columnName",
                   c.table_name  "tableName",
                   c.udt_name    "columnType",
                   c.ordinal_position "ordinal",
                   tc.constraint_name "constraint"
            FROM information_schema.columns c
                   left join information_schema.constraint_column_usage ccu
                             on c.COLUMN_NAME = ccu.column_name and c.table_name = ccu.table_name and
                                ccu.table_catalog = c.TABLE_CATALOG
                               and c.table_schema = ccu.table_schema
                   left join information_schema.table_constraints tc
                             on tc.constraint_name = ccu.constraint_name and tc.table_schema = ccu.table_schema
                               and tc.table_catalog = c.TABLE_CATALOG and tc.table_name = c.table_name
            WHERE c.TABLE_SCHEMA = '${schema}'
              AND c.table_name = '${table}'
              AND tc.constraint_type = 'PRIMARY KEY'`;
    // @formatter:on
  }

  showTriggers(connectInfo: IConnectInfo): string {
    return `SELECT TRIGGER_NAME "name", event_object_table "tableName"
            FROM information_schema.TRIGGERS
            WHERE trigger_schema = '${connectInfo.schema}'`;
  }

  showTrigger(connectInfo: IConnectInfo, trigger: string): string {
    return `SELECT *
            FROM information_schema.TRIGGERS
            WHERE trigger_schema = '${connectInfo.schema}'
              AND TRIGGER_NAME = '${trigger}'
    `;
  }

  showTriggerSource(connectInfo: IConnectInfo, name: string): string {
    // @formatter:off
    return `select pg_get_triggerdef(oid) "createTriggerSql", '${connectInfo.schema}.${name}' "Trigger"
            from pg_trigger
            where tgname = '${name}'`;
    // @formatter:on
  }

  showProcedures(connectInfo: IConnectInfo): string {
    return `SELECT ROUTINE_NAME "name"
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.schema}'
              and ROUTINE_TYPE = 'PROCEDURE'`;
  }

  showProcedure(connectInfo: IConnectInfo, procedure: string): string {
    return `SELECT *
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.schema}'
              and ROUTINE_TYPE = 'PROCEDURE'
              AND ROUTINE_NAME = '${procedure}'`;
  }

  showProcedureSource(connectInfo: IConnectInfo, name: string): string {
    return `select pg_get_functiondef('${connectInfo.schema}.${name}' :: regproc) "createProcedureSql",'${name}' "Procedure";`;
  }

  showFunctions(connectInfo: IConnectInfo): string {
    return `SELECT ROUTINE_NAME "name"
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.schema}'
              and ROUTINE_TYPE = 'FUNCTION'`;
  }

  showFunction(connectInfo: IConnectInfo, functionName: string): string {
    return `SELECT *
            FROM information_schema.routines
            WHERE ROUTINE_SCHEMA = '${connectInfo.schema}'
              and ROUTINE_TYPE = 'FUNCTION'
              AND ROUTINE_NAME = '${functionName}'`;
  }

  showFunctionSource(connectInfo: IConnectInfo, name: string): string {
    return `select pg_get_functiondef('${connectInfo.schema}.${name}' :: regproc) "createFunctionSql",'${name}' "Function";`;
  }

  showSequences(connectInfo: IConnectInfo): string {
    const schema = this.getDefaultSchema(connectInfo.schema);
    return `SELECT sequencename AS "name"
            FROM pg_sequences
            where schemaname = '${schema}'`;
  }

  showSequence(connectInfo: IConnectInfo, sequence: string): string {
    return `SELECT *
            FROM pg_sequences
            where schemaname = '${connectInfo.schema}'
              and sequencename = '${sequence}'`;
  }

  showSequenceSource(connectInfo: IConnectInfo, sequence: string): string {
    // @formatter:off
    return `SELECT 'CREATE SEQUENCE ' || quote_ident(schemaname) || '.' || quote_ident(sequencename) ||
         '\n\tINCREMENT BY ' || increment_by::text ||
         '\n\tSTART WITH ' || start_value::text ||
         '\n\tMINVALUE ' || min_value::text ||
         '\n\tMAXVALUE ' || max_value::text ||
         '\n\tCACHE ' || cache_size::text ||
         '\n\t' || CASE WHEN cycle THEN 'CYCLE' ELSE 'NO CYCLE' END
   AS "text"
  FROM pg_sequences where schemaname='${connectInfo.schema}' and sequencename='${sequence}'`;
    // @formatter:on
  }

  showViewSource(connectInfo: IConnectInfo, table: string): string {
    // @formatter:off
    return `SELECT CONCAT('CREATE VIEW ', table_name, '\nAS\n(', regexp_replace(view_definition, ';$', ''),
                          ')') "ViewDefinition",
                   table_name,
                   view_definition
            from information_schema.views
            where table_schema = '${connectInfo.schema}'
              and table_name = '${table}';`;
    // @formatter:on
  }

  showProcessList(): string {
    // @formatter:off
    return `SELECT a.pid         AS "Id",
                   a.usename     AS "User",
                   a.client_addr AS "Host",
                   a.client_port AS "Port",
                   datname       AS "db",
                   query         AS "Command",
                   l.mode        AS "State",
                   query_start   AS "Time",
                   CASE
                     WHEN c.relname IS NOT NULL THEN 'Locked Object: ' || c.relname
                     ELSE 'Locked Transaction: ' || l.virtualtransaction
                     END         AS "Info"
            FROM pg_stat_activity a
                   LEFT JOIN pg_locks l ON a.pid = l.pid
                   LEFT JOIN pg_class c ON l.relation = c.oid
            ORDER BY a.pid ASC,
                     c.relname ASC`;
    // @formatter:on
  }

  showVariableList(): string {
    return 'SHOW ALL';
  }

  showStatusList(): string {
    // @formatter:off
    return `SELECT 'db_numbackends'                  AS db,
                   pg_stat_get_db_numbackends(datid) AS status
            FROM pg_stat_database
            WHERE datname = current_database()
            UNION ALL
            SELECT 'db_xact_commit',
                   pg_stat_get_db_xact_commit(datid)
            FROM pg_stat_database
            WHERE datname = current_database()
            UNION ALL
            SELECT 'db_xact_rollback',
                   pg_stat_get_db_xact_rollback(datid)
            FROM pg_stat_database
            WHERE datname = current_database()
            UNION ALL
            SELECT 'db_blocks_fetched',
                   pg_stat_get_db_blocks_fetched(datid)
            FROM pg_stat_database
            WHERE datname = current_database()
            UNION ALL
            SELECT 'db_blocks_hit',
                   pg_stat_get_db_blocks_hit(datid)
            FROM pg_stat_database
            WHERE datname = current_database()`;
    // @formatter:on
  }

  showTableInfo(connectInfo: IConnectInfo, tableName: string): string {
    let schema = this.getDefaultSchema(connectInfo.schema);
    let sql = `select pc.relname     as name,
                      pd.description as "comment"
               from pg_class pc
                      LEFT JOIN pg_namespace pn on pn.oid = pc.relnamespace
                      join pg_catalog.pg_description pd on pc.oid = pd.objoid
               where pn.nspname = '${schema}'
                 and pc.relname = '${tableName}'
                 and pd.objsubid = 0`;
    return sql;
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
    let schema = this.getDefaultSchema(connectInfo.schema);
    let sql = `select count(*) total
               from pg_tables
               where schemaname = '${schema}'
                 and tablename = '${table}'`;
    return sql;
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
    const { database, owner, template, encoding, collate, charset, tablespace, connlimit, istemplate } = param;
    const batchSql: string[] = [];
    let createSql = `CREATE DATABASE ${database} `;
    let defineSql = '';
    if (owner) defineSql = `OWNER = ${owner} `;
    if (template) defineSql = defineSql + `TEMPLATE = ${template} `;
    if (encoding) defineSql = defineSql + `ENCODING = '${encoding}' `;
    if (collate) defineSql = defineSql + `LC_COLLATE = '${collate}' `;
    if (charset) defineSql = defineSql + `LC_CTYPE = '${charset}' `;
    if (tablespace) defineSql = defineSql + `TABLESPACE = ${tablespace} `;
    if (connlimit) defineSql = defineSql + `CONNECTION LIMIT = ${connlimit} `;
    if (istemplate) defineSql = defineSql + `IS_TEMPLATE = ${istemplate} `;
    if (defineSql.length > 0) {
      batchSql.push(createSql + 'WITH ' + defineSql);
    } else {
      batchSql.push(createSql);
    }
    return batchSql;
  }

  createSchema(param: IPostgresDbDetail): string[] {
    const { schema, owner, comment } = param;
    const batchSql: string[] = [];
    const defineOwnerSql = owner ? `AUTHORIZATION ${owner}` : '';
    batchSql.push(`CREATE SCHEMA ${schema} ${defineOwnerSql}`);
    comment && batchSql.push(`COMMENT ON SCHEMA ${schema} IS '${comment}'`);
    return batchSql;
  }

  public generateAddColumnSQL(){

  }
 public generateAddCommentSQL(params:{schema:string,table:string,columnName:string,comment:string}){
    const {schema,table,columnName,comment} = params;
   let fullTableName = `${schema}.${table}`;
  return `COMMENT ON COLUMN  ${fullTableName}.${columnName} IS '${comment}'`
  }
 public generateSetDefaultValueSQL(){

  }

  public createTable(connectInfo: IConnectInfo, tableParam: CreateTableParam): string[] {
    const { table, columns, primaryKeys } = tableParam;
    let schema = this.getDefaultSchema(connectInfo.schema);
    let columnSql: string[] = [];
    let commentSql: string[] = [];
    let fullTableName = `${schema}.${table}`;
    for (let column of columns) {
      const { columnName, columnType, notNull, columnLength, defaultValue, comment, autoIncrement } = column;
      const fullColumnType = columnLength ? `${columnType}(${columnLength})` : columnType;
      const nullAbleDef = notNull ? ' NOT NULL' : '';
      const defaultValueDef = isNotEmpty(defaultValue) ? ` DEFAULT '${defaultValue}'` : '';
      columnSql.push(
        `\t${columnName}  ${autoIncrement ? autoIncrement : fullColumnType + nullAbleDef + defaultValueDef}`,
      );
      if (comment) {
        //@formatter:off
        commentSql.push(this.generateAddCommentSQL({schema,table,columnName,comment}));
        //@formatter:on
      }
    }
    let primaryKeySql = '';
    if (primaryKeys && primaryKeys.length > 0) {
      primaryKeySql = `\tPRIMARY KEY(${primaryKeys.join(',')})`;
    }
    //@formatter:off
    let sql = `CREATE TABLE ${fullTableName}(
${columnSql.join(',\n')}${primaryKeySql ? ',' : ''}
${primaryKeySql}
);\n`;

    //@formatter:on
    if (commentSql.length > 0) {
      sql = sql + commentSql.join('\n');
    }
    return [sql];
  }

  public createColumn(connectInfo: IConnectInfo, table: string, createColumnParam: CreateColumnParam) {
    const schema = this.getDefaultSchema(connectInfo.schema);
    const fullTableName = `${schema}.${table}`;
    let { columnName, columnType, columnLength, columnScale, defaultValue, comment, notNull, autoIncrement } =
      createColumnParam;
    const fullColumnType = PostgresUtils.getColumnDefinition(columnType, columnLength, columnScale);
    const nullAbleDef = notNull ? ' NOT NULL' : '';
    let multiSql: string[] = [];
    // @formatter:off
    multiSql.push(
      `ALTER TABLE ${fullTableName} ADD ${columnName} ${autoIncrement ? autoIncrement : fullColumnType} ${nullAbleDef}`,
    ); //${defaultDefine}${comment}`;
    if (defaultValue) {
      defaultValue = defaultValue === ColumnEditDefaultSelect.EmptyString ? '' : defaultValue;
      const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
      //还的判断选择的类型
      const convertNewValue =
        simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? defaultValue : `'${defaultValue}'`;
      multiSql.push(`ALTER TABLE ${fullTableName} ALTER COLUMN ${columnName} SET DEFAULT ${convertNewValue}`);
    }
    if (notNull) {
      multiSql.push(`ALTER TABLE ${fullTableName} ALTER COLUMN ${columnName} SET NOT NULL`);
    }
    if (comment) {
      multiSql.push(this.generateAddCommentSQL({schema,table,columnName,comment}));
    }
    // @formatter:on
    //设置not null
    return multiSql;
  }

  createUser(): string {
    return `CREATE USER [name] WITH PASSWORD 'password'`;
  }

  createDatabase(database: string): string {
    return `create database "${database}"`;
  }

  createIndex(createIndexParam: CreateIndexParam): string {
    const indexType = createIndexParam.indexType || 'btree';
    return `CREATE INDEX ${createIndexParam.column}_${new Date().getTime()}_ index ON ${
      createIndexParam.table
    } USING ${indexType} (${createIndexParam.column});`;
  }

  /*--------------------drop-------------*/

  dropTrigger(connectInfo: IConnectInfo, name: string, tableName: string): string {
    //const parts = name.split('(');
    //const triggerName = parts[0]; // "AA"
    // const tableName = parts[1].replace(')', ''); // "TAB"
    return `DROP TRIGGER ${name} ON ${tableName}`;
  }

  dropIndex(table: string, indexName: string): string {
    return `DROP INDEX ${indexName}`;
  }

  /*--------------------alter-------------*/

  alterDb(param: IPostgresDbDetail): string[] {
    //console.log('alterDb:',param)
    const { olddatabase, database, owner, connlimit, comment } = param;
    const batchSql: string[] = [];
    if (olddatabase) batchSql.push(`ALTER DATABASE ${olddatabase} RENAME TO ${database}`);
    if (owner) batchSql.push(`ALTER DATABASE ${database} OWNER TO ${owner}`);
    if (isNotNull(connlimit)) batchSql.push(`ALTER DATABASE ${database} WITH CONNECTION LIMIT = ${connlimit}`);
    if (isNotNull(comment)) {
      batchSql.push(`COMMENT ON DATABASE ${database} IS '${comment}'`);
    }
    return batchSql;
  }

  /**
   * ALTER SCHEMA auth1 RENAME TO auth12;
   * ALTER SCHEMA auth12 OWNER TO pg_monitor;
   * COMMENT ON SCHEMA auth12 IS '1';
   * oldSchema:有：说明需要更改
   */
  alterSchema(param: IPostgresDbDetail): string[] {
    const { oldschema, schema, owner, comment } = param;
    const batchSql: string[] = [];
    if (oldschema) {
      batchSql.push(`ALTER SCHEMA ${oldschema} RENAME TO ${schema}`);
    }
    if (owner) {
      batchSql.push(`ALTER SCHEMA ${schema} OWNER TO ${owner}`);
    }
    if (isNotNull(comment)) {
      batchSql.push(`COMMENT ON SCHEMA ${schema} IS '${comment}'`);
    }

    return batchSql;
  }

  alterColumn(
    connectInfo: IConnectInfo,
    table: string,
    column: string,
    type: string,
    comment: string,
    nullable: string,
  ): string {
    comment = comment ? ` comment '${comment}'` : '';
    return `ALTER TABLE ${table} ALTER COLUMN ${column} TYPE ${type};
    ALTER TABLE ${table} ALTER RENAME COLUMN ${column} TO [newColumnName];`;
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
    } = updateColumnParam;
    let multiSql: string[] = [];
    const schema = this.getDefaultSchema(connectInfo.schema)
    let fullTable = this.getFullName(connectInfo, table);
    let columnDef = columnName;

    if (newColumnName && columnName != newColumnName) {
      columnDef = newColumnName;
      multiSql.push(`ALTER TABLE ${fullTable} RENAME COLUMN ${columnName} TO ${newColumnName}`);
    }
    if (newColumnType || newColumnLength || newColumnScale) {
      const columnTypeDef = newColumnType ? newColumnType : columnType;
      const columnLengthDef = newColumnLength ? newColumnLength : columnLength;
      const columnScaleDef = newColumnScale ? newColumnScale : columnScale;
      const columnTypeLengthDef = PostgresUtils.getColumnDefinition(columnTypeDef, columnLengthDef, columnScaleDef);
      multiSql.push(`ALTER TABLE ${fullTable} ALTER COLUMN ${columnDef} TYPE ${columnTypeLengthDef}`);
    }
    if (newNotNull || newNotNull === false) {
      const notNullDef = newNotNull ? 'SET NOT NULL' : 'DROP NOT NULL';
      multiSql.push(`ALTER TABLE ${fullTable} ALTER COLUMN ${columnDef} ${notNullDef}`);
    }
    const judgeDefault = this.judgeDefaultValue(defaultValue, newDefaultValue);
    // @formatter:off
    if (judgeDefault === 'SetNull') {
      multiSql.push(`ALTER TABLE ${fullTable} ALTER COLUMN ${columnDef} DROP DEFAULT`);
    } else if (judgeDefault === 'SetEmpty') {
      //设置默认值为空字符串
      multiSql.push(`ALTER TABLE ${fullTable} ALTER COLUMN ${columnDef} SET DEFAULT ''`);
    } else if (judgeDefault === 'SetValue') {
      const simpleType = SqlDealUtils.convertFieldsToSimpleType(this.getServerType(), columnType);
      //还的判断选择的类型
      const convertNewValue =
        simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' ? newDefaultValue : `'${newDefaultValue}'`;
      //前面的修改会删除默认值，所以此处要从新设置默认值
      multiSql.push(`ALTER TABLE ${fullTable} ALTER COLUMN SET DEFAULT ${convertNewValue}`);
    }
    if (newComment !== undefined && newComment !== comment) {
      multiSql.push(this.generateAddCommentSQL({schema,table,columnName:columnDef,comment:newComment}))
      //multiSql.push(`COMMENT ON COLUMN ${fullTable}.${columnDef} IS '${newComment}'`);
    }

    // @formatter:on
    return multiSql;
  }

  //暂时用不到
  alterAutoIncrementSql(connectInfo: IConnectInfo, table: string, updateColumnParam: UpdateColumnParam): string {
    //
    return '';
  }

  alterTable(connectInfo: IConnectInfo, update: UpdateTableParam): string {
    const { table, newTableName, comment, newComment } = update;
    let sql = '';
    if (newComment && newComment != comment) {
      sql = `COMMENT ON TABLE ${table} IS '${newComment}';`;
    }
    if (newTableName && table != newTableName) {
      sql += `ALTER TABLE ${table} RENAME TO ${newTableName};`;
    }
    return sql;
  }

  public alterTableToRename(connectInfo: IConnectInfo, oldName: string, newName: string): string {
    let schema = this.getDefaultSchema(connectInfo.schema);
    return `ALTER TABLE IF EXISTS ${schema}.${oldName} RENAME TO ${newName}`;
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
      buildSql.push(`ALTER TABLE ${schema}.${table} DROP CONSTRAINT ${primaryKey.constraint}`);
    }
    if (primaryKeys.length > 0) {
      buildSql.push(`ALTER TABLE ${schema}.${table} ADD PRIMARY KEY (${primaryKeys.join(',')})`);
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
    let columnSql: string[] = [];
    let commentSql: string[] = [];
    //let primaryKeys: string[] = [];
    let fullTableName = this.getFullName(connectInfo, table.name!);
    for (let column of columns) {
      const { name, columnType, columnDefinition, nullable, columnLength, columnScale, defaultValue, comment, key } =
        column;
      const nullAbleDef = nullable === 'NO' ? ' NOT NULL' : '';
      const defaultValueDef = isNotEmpty(defaultValue) ? ` DEFAULT ${defaultValue}` : '';
      columnSql.push(`\t"${name}" ${columnDefinition}${nullAbleDef}${defaultValueDef}`);
      if (comment) {
        //@formatter:off
        commentSql.push(`COMMENT ON COLUMN ${fullTableName}.${name} IS '${comment}';`);
        //@formatter:on
      }
    }
    let primaryKeySql = '';
    if (primaryKeys && primaryKeys.length > 0) {
      primaryKeySql = `\tPRIMARY KEY(${primaryKeys.map((item) => item.columnName).join(',')})`;
    }
    //@formatter:off
    let sql = `CREATE TABLE ${fullTableName} (
${columnSql.join(',\n')}${primaryKeySql ? ',' : ''}
${primaryKeySql}
);\n`;
    if (table.comment) {
      commentSql.unshift(`COMMENT ON TABLE ${fullTableName} IS '${table.comment}';`);
    }
    //@formatter:on
    if (commentSql.length > 0) {
      sql = sql + commentSql.join('\n');
    }
    return sql;
  }

  /*-----------example-------------------------*/

  /*--------------------template---------------*/

  tableTemplate(): string {
    // @formatter:off
    return `CREATE TABLE [name]
    (
        id SERIAL NOT NULL primary key,
        create_time DATE,
        update_time DATE,
        [column] varchar(255)
    );
    COMMENT ON TABLE [table] IS '[comment'];
    COMMENT ON COLUMN [table].[column] IS '[comment]';`;
    // @formatter:on
  }

  addColumnTemplate(table: string): string {
    // @formatter:off
    return `ALTER TABLE ${table} ADD COLUMN [column] [type];`;
    // @formatter:on
  }

  viewTemplate(): string {
    // @formatter:off
    return `CREATE VIEW [name]
AS
(SELECT * FROM ...);`;
    // @formatter:on
  }

  procedureTemplate(): string {
    // @formatter:off
    return `CREATE PROCEDURE [name]()
LANGUAGE SQL
as $$
[content]
$$`;
    // @formatter:on
  }

  triggerTemplate(): string {
    // @formatter:off
    return `CREATE FUNCTION [tri_fun]() RETURNS TRIGGER AS
$body$
BEGIN
    RETURN [value];
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER [name]
[BEFORE/AFTER/INSTEAD OF] [INSERT/UPDATE/DELETE]
ON [table]
FOR EACH ROW
EXECUTE PROCEDURE [tri_fun]();`;
    // @formatter:on
  }

  functionTemplate(): string {
    // @formatter:off
    return `CREATE FUNCTION [name]()
RETURNS [type] AS $$
BEGIN
    return [type];
END;
$$ LANGUAGE plpgsql;`;
    // @formatter:on
  }

  dropTriggerTemplate(name: string) {
    return `DROP TRIGGER ${name} on [table_name]`;
  }

  truncateDatabase(connectInfo: IConnectInfo): string {
    return `SELECT Concat('TRUNCATE TABLE "', TABLE_NAME, '";') trun
            FROM INFORMATION_SCHEMA.TABLES
            WHERE table_schema = '${connectInfo.schema}'
              AND table_type = 'BASE TABLE';`;
  }
}
