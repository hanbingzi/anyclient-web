import { Autowired, Injectable } from '@opensumi/di';
import { IDMClientServicePath, IDMService, IDMServiceClient, ISqlServiceClient } from '../../common';
import { AbstractSqlService } from './abstract-sql-service';

@Injectable()
export class DMService extends AbstractSqlService implements IDMService {
  @Autowired(IDMClientServicePath)
  private DMClientService: IDMServiceClient;

  public getClientService(): ISqlServiceClient {
    return this.DMClientService;
  }
}
