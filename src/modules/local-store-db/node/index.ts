//https://www.liuzhanwu.cn/29819.html sqlite3操作

import { Injectable, Provider } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';
import {
  IServerDaoToken,
  IServerDaoPath,
  IOpenRecentDaoToken,
  IOpenRecentDaoPath,
  IServerClusterDaoToken,
  IServerClusterDaoPath, IProductVersionDaoToken, IProductVersionDaoPath,
} from '../common';
import { ServerDao } from './server.dao';
import { OpenRecentDao } from './open-recent.dao';
import { ServerClusterDao } from './server-cluster.dao';
import { ProductVersionDao } from './product-version.dao';

@Injectable()
export class LocalDbNodeModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IServerDaoToken,
      useClass: ServerDao,
    },
    {
      token: IServerClusterDaoToken,
      useClass: ServerClusterDao,
    },
    {
      token: IOpenRecentDaoToken,
      useClass: OpenRecentDao,
    },
    {
      token: IProductVersionDaoToken,
      useClass: ProductVersionDao,
    },
  ];

  backServices = [
    {
      servicePath: IServerDaoPath,
      token: IServerDaoToken,
    },
    {
      servicePath: IServerClusterDaoPath,
      token: IServerClusterDaoToken,
    },
    {
      servicePath: IOpenRecentDaoPath,
      token: IOpenRecentDaoToken,
    },
    {
      servicePath: IProductVersionDaoPath,
      token: IProductVersionDaoToken,
    },
  ];
}
