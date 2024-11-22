import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { TableViewContribution } from './data-browser.contribute';
import { DataBrowserResourceProvider } from './data-browser.provider';
import { RedisViewService } from './redis-view/redis-view.service';
import { TableViewService } from './table-view/table-view.service';
import { ViewViewService } from './view-view/view-view.service';
import { TopicViewService } from './kafka-view/topic-view.service';
import { MpsqlDbEditService } from './sql-db-edit/mpsql-db-edit.service';
import { TableEditService } from './table-edit/table-edit.service';
import { EtcdUserService } from './etcd-view/users/etcd-user.service';
import { EtcdRoleService } from './etcd-view/roles/etcd-role.service';
import { EtcdClusterService } from './etcd-view/cluster/etcd-cluster.service';
// import {JSONRedisViewProvider} from "./redis-view/provider/json-redis-view.provider";
// import {JsonRedisEditorService} from "./redis-view/provider/json-redis-editor.service";

@Injectable()
export class DataViewBrowserModule extends BrowserModule {
  providers: Provider[] = [
    TableViewContribution,
    RedisViewService,
    TableViewService,
    ViewViewService,
    TopicViewService,
    MpsqlDbEditService,
    TableEditService,
    EtcdUserService,
    EtcdRoleService,
    EtcdClusterService,
    {
      token: DataBrowserResourceProvider,
      useClass: DataBrowserResourceProvider,
    },
    // , {
    //   token: JSONRedisViewProviderToken,
    //   useClass: JSONRedisViewProvider,
    // },    {
    //   token: JsonRedisEditorServiceToken,
    //   useClass: JsonRedisEditorService
    // }
  ];
}
