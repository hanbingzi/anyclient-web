import { Autowired, Injectable } from '@opensumi/di';
import { IMysqlClientServicePath, IMysqlService, IMysqlServiceClient, ISqlServiceClient } from '../../common';
import { AbstractSqlService } from './abstract-sql-service';

@Injectable()
export class MysqlService extends AbstractSqlService implements IMysqlService {
  @Autowired(IMysqlClientServicePath)
  private mysqlClientService: IMysqlServiceClient;

  public getClientService(): ISqlServiceClient {
    return this.mysqlClientService;
  }
}
