import { BrowserModule } from '@opensumi/ide-core-browser';
import { Injectable, Provider } from '@opensumi/di';
import { ServerManagerContribution } from './server-manager.contribution';
import { IServerEditService } from '../common';
import { ServerEditService } from './server-edit.service';

@Injectable()
export class ServerManagerModule extends BrowserModule {
  providers: Provider[] = [
    ServerManagerContribution,

    {
      token: IServerEditService,
      useClass: ServerEditService,
    },
  ];
}
