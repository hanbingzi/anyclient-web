import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { CodelensCommandContribution } from './codelens-command.contribution';
import { IDbCacheNodeServiceToken } from '../common';
import { DbCacheNodeService } from './db-cache-node.service';

@Injectable()
export class CodelensCommandModule extends BrowserModule {
  providers: Provider[] = [
    CodelensCommandContribution,
    {
      token: IDbCacheNodeServiceToken,
      useClass: DbCacheNodeService,
    },
  ];
}
