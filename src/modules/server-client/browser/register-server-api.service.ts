import { Autowired, Injectable } from '@opensumi/di';
import { IDialogService } from '@opensumi/ide-overlay';
import {
  IKeyInfoResult,
  IMysqlService,
  IMysqlServiceToken,
  IQueryResult,
  KeyValueType,
  QueryResultError,
} from '../../server-client/common';
import { ConnectQuery } from '../../local-store-db/common';

@Injectable()
export class RegisterServerApiService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  @Autowired(IMysqlServiceToken)
  private mysqlService: IMysqlService;

  async getKeyInfo(serverInfo: ConnectQuery, keyName: string): Promise<IQueryResult> {
    let result: IQueryResult = QueryResultError.UNREALIZED_ERROR;
    switch (serverInfo.server.serverType) {
      case 'Zookeeper':
        break;
      case 'Eureka':
        break;
      case 'Etcd':
        break;
    }
    return result;
  }

  async getKeyData(
    connect: ConnectQuery,

    keyName: string,
  ): Promise<IQueryResult<KeyValueType>> {
    let result: IQueryResult = QueryResultError.UNREALIZED_ERROR;
    const { server } = connect;
    switch (server.serverType) {
      case 'Zookeeper':
        break;
      case 'Eureka':
        break;
      case 'Etcd':
        break;
    }
    return result;
  }

  async saveKeyData(connect: ConnectQuery, keyName: string, newData: string): Promise<IQueryResult<KeyValueType>> {
    let result: IQueryResult = QueryResultError.UNREALIZED_ERROR;
    switch (connect.server.serverType) {
      case 'Zookeeper':
        break;
      case 'Eureka':
        break;
      case 'Etcd':
        break;
    }
    return result;
  }
}
