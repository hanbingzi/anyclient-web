import { Autowired, Injectable } from '@opensumi/di';
import { IOracleClientServicePath, IOracleService, IOracleServiceClient, ISqlServiceClient } from '../../common';
import { AbstractSqlService } from './abstract-sql-service';
import { ConnectQuery } from '../../../local-store-db/common';

@Injectable()
export class OracleService extends AbstractSqlService implements IOracleService {
  @Autowired(IOracleClientServicePath)
  private OracleClientService: IOracleServiceClient;

  public getClientService(): ISqlServiceClient {
    return this.OracleClientService;
  }
}
