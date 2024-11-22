import { startServer } from './start-server';
import { ExpressFileServerModule } from '@opensumi/ide-express-file-server/lib/node';
import { CommonNodeModules } from './common-modules';
import {ToDoNodeModule} from "../modules/todo/node";
import {LocalDbNodeModule} from "../modules/local-store-db/node";
import {ServerClientNodeModule} from "../modules/server-client/node";
import { AppAdminNodeModule } from '../modules/admin/node';

startServer({
  modules: [
    ...CommonNodeModules,
    ExpressFileServerModule,
    //附加clientbiz开发
    ToDoNodeModule,
    LocalDbNodeModule,
    ServerClientNodeModule,
    AppAdminNodeModule,
  ],
});
