import { IBaseSqlService, IQueryResult, IRunSqlResult, QueryResultError } from '../../common';
import { ConnectQuery } from '../../../local-store-db/common';

export class UnrealizedSqlService implements IBaseSqlService {
  async closeConnection(connect: ConnectQuery): Promise<boolean> {
    console.error('closeConnection error');
    return false;
  }

  ping(connect: ConnectQuery): Promise<IQueryResult> {
    return Promise.resolve(QueryResultError.UNREALIZED_ERROR);
  }

  runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    return Promise.resolve(QueryResultError.UNREALIZED_ERROR);
  }

  runBatch(connect: ConnectQuery, batchSql: string[]): Promise<IRunSqlResult[]> {
    return Promise.resolve([]);
  }
}
