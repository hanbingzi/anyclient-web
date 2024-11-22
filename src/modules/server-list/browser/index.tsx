import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { ServerListContribution } from './server-list.contribution';
import { ServerTreeService } from './server-tree.service';
import { ServerInfoResourceProvider } from './serverInfo/server-info-resource.provider';
import { ServerInfoService } from './serverInfo/server-info.service';
import { ISelectWorkspaceService, SelectWorkspaceService } from './select-workspace/select-workspace.service';

@Injectable()
export class ServerTreeModule extends BrowserModule {
  providers: Provider[] = [
    ServerListContribution,
    {
      token: ServerTreeService,
      useClass: ServerTreeService,
    },
    {
      token: ServerInfoResourceProvider,
      useClass: ServerInfoResourceProvider,
    },
    {
      token: ServerInfoService,
      useClass: ServerInfoService,
    },
    {
      token: ISelectWorkspaceService,
      useClass: SelectWorkspaceService,
    },
  ];
}
