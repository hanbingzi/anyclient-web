import { IRunSqlResult, ISqlServiceClient } from '../../common';
import { ConnectQuery } from '../../../local-store-db/common';

export abstract class AbstractSqlService {
  public abstract getClientService(): ISqlServiceClient;

  public runSql(connect: ConnectQuery, sql: string): Promise<IRunSqlResult> {
    return this.getClientService().runSql(connect, sql);
  }

  public runBatch(connect: ConnectQuery, batchSql: string[], isTransaction: boolean = true): Promise<IRunSqlResult[]> {
    return this.getClientService().runBatch(connect, batchSql, isTransaction);
  }

  public closeConnection(ConnectQuery: ConnectQuery) {
    return this.getClientService().closeConnection(ConnectQuery);
  }


}
