import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import {
  IClusterServiceToken,
  IOpenRecentDaoPath,
  IOpenRecentServiceToken, IProductVersionDaoPath, IProductVersionServiceToken,
  IServerClusterDaoPath,
  IServerDaoPath,
  IServerServiceToken,
} from '../common';
import { OpenRecentService } from './open-recent.service';
import { ServerService } from './server.service';
import { ClusterService } from './cluster.service';
import { ProductVersionService } from './product-version.service';

@Injectable()
export class LocalDbBrowserModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IServerServiceToken,
      useClass: ServerService,
    },
    {
      token: IClusterServiceToken,
      useClass: ClusterService,
    },
    {
      token: IOpenRecentServiceToken,
      useClass: OpenRecentService,
    },
    {
      token:IProductVersionServiceToken,
      useClass:ProductVersionService
    }
  ];
  backServices = [
    {
      servicePath: IServerDaoPath,
      //token: IServerDaoToken,
    },
    {
      servicePath: IServerClusterDaoPath,
      //token: IServerDaoToken,
    },
    {
      servicePath: IOpenRecentDaoPath,
    },
    {
      servicePath: IProductVersionDaoPath
    }
  ];
}
