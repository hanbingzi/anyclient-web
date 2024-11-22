import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { AdminContribution } from './admin.contribution';
import { IAdminClientServicePath, IAdminServiceToken, IJdbcStartServicePath } from '../common';
import { AdminService } from './admin.service';

@Injectable()
export class AppAdminModule extends BrowserModule {
  //
  providers: Provider[] = [
    AdminContribution,
    {
      token: IAdminServiceToken,
      useClass: AdminService,
    },
  ];
  backServices = [
    { servicePath: IAdminClientServicePath },
    { servicePath: IJdbcStartServicePath }
  ];
}
