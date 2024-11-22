import { Autowired, Injectable } from '@opensumi/di';
import { IMssqlClientServicePath, IMssqlService, IMssqlServiceClient, ISqlServiceClient } from '../../common';
import { AbstractSqlService } from './abstract-sql-service';
import { MssqlDialect } from '../../common/dialet/mssql-dialect';

@Injectable()
export class MssqlService extends AbstractSqlService implements IMssqlService {


  @Autowired(IMssqlClientServicePath)
  private mssqlServiceClient: IMssqlServiceClient;

  public getClientService(): ISqlServiceClient {
    return this.mssqlServiceClient;
  }




}
