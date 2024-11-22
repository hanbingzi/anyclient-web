import { Injectable, Provider } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';
import {
  IAdminClientServicePath,
  IAdminClientServiceToken,
  IJdbcStartServicePath,
  IJdbcStartServiceToken,
} from '../common';
import { AdminClientService } from './admin-client.service';
import { JdbcStartService } from './jdbc-start.service';

@Injectable()
export class AppAdminNodeModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IAdminClientServiceToken,
      useClass: AdminClientService,
    },
    {
      token: IJdbcStartServiceToken,
      useClass: JdbcStartService,
    },
  ];
  backServices = [
    {
      servicePath: IAdminClientServicePath,
      token: IAdminClientServiceToken,
    },
    {
      servicePath: IJdbcStartServicePath,
      token: IJdbcStartServiceToken,
    },
  ];
}
