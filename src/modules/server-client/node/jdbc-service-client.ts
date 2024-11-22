import { ConnectQuery } from 'modules/local-store-db/common';
import {
  IColumnMeta,
  IJdbcSqlServiceClient,
  IPrimaryMeta,
  IQueryResult,
  IRunSqlResult,
  ITableMeta,
  IVFTSPInfo,
} from '../common';
import { Autowired, Injectable } from '@opensumi/di';
import { JavaHttpRequest } from './java-http-request';
import { SqlUtils } from '../../base/utils/sql-utils';

@Injectable()
export class JdbcServiceClient implements IJdbcSqlServiceClient {
  @Autowired(JavaHttpRequest)
  private javaHttpRequest: JavaHttpRequest;

  async closeConnection(connect: ConnectQuery): Promise<boolean> {
    await this.javaHttpRequest.httpPost('closeConnect', connect);
    return true;
  }

  async closeAllConnection(connect: ConnectQuery): Promise<boolean> {
    await this.javaHttpRequest.httpPost('closeAllConnect');
    return true;
  }


  async clearJdbcServer(serverId:string){
    await this.javaHttpRequest.httpPost('clearServer/'+serverId);
    return true;
  }

  // async closeServerAllConnections(connect: ConnectQuery): Promise<boolean> {
  //   await this.javaHttpRequest.httpPost(connect, 'closeConnect');
  //   return true;
  // }

  async ping(connect: ConnectQuery): Promise<IQueryResult> {
    return await this.javaHttpRequest.httpPost('testConnect', connect);
  }

  async runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    const isQuery = SqlUtils.isQuery(sql);
    if (isQuery) {
      //runsql 因为查询出来的结果要进行页面展示，所有需要分析column信息
      return this.query(connect, sql, true);
    } else {
      return this.exec(connect, sql);
    }
  }

  async runBatch(connect: ConnectQuery, batchSql: string[], isTransaction?: boolean): Promise<IRunSqlResult[]> {
    const result = await this.javaHttpRequest.sqlPost(connect, 'runBatch', {
      batchSql: batchSql,
      isTransaction,
      alyColumn: true,
    });
    if (result.success) {
      return result.data;
    } else {
      return [result];
    }
  }

  tableQuery(connect: ConnectQuery, sql: string, table: string): Promise<IRunSqlResult<any, any>> {
    return this.javaHttpRequest.sqlPost(connect, 'tableQuery', { sql, table });
  }

  query(connect: ConnectQuery, sql: string, alyColumn: boolean = false): Promise<IRunSqlResult<any, any>> {
    return this.javaHttpRequest.sqlPost(connect, 'query', { sql, alyColumn });
  }

  exec(connect: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    return this.javaHttpRequest.sqlPost(connect, 'exec', { sql });
  }

 async showDatabases(connect: ConnectQuery): Promise<IRunSqlResult<string[]>> {

    return this.javaHttpRequest.sqlPost(connect, 'showDatabases');
  }

  showSchemas(connect: ConnectQuery): Promise<IRunSqlResult<string[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showSchemas');
  }

  showTables(connect: ConnectQuery): Promise<IRunSqlResult<ITableMeta[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showTables');
  }

  showViews(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showViews');
  }

  showFunctions(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showFunctions');
  }

  showProcedures(connect: ConnectQuery): Promise<IRunSqlResult<IVFTSPInfo[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showProcedures');
  }

  showColumns(connect: ConnectQuery, table: string): Promise<IRunSqlResult<IColumnMeta[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showColumns',table);
  }
  showPrimary(connect: ConnectQuery, table: string): Promise<IRunSqlResult<IPrimaryMeta[]>> {
    return this.javaHttpRequest.sqlPost(connect, 'showPrimary',table);
  }
}
