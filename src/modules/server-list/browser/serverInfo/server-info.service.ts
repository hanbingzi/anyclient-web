import { Autowired, Injectable } from '@opensumi/di';
import { Emitter, Event, URI } from '@opensumi/ide-core-browser';
import { ServerInfo } from '../../../local-store-db/common/model.define';
import { ServerTreeNodeUtils } from '../../../base/model/server-tree-node.model';
import { CommonServerApiService } from '../../../server-client/browser/common-server-api.service';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { ConnectTreeModelService } from '../../../open-recent/browser/services/connect-tree-model.service';
import {
  IOpenRecentDao,
  IOpenRecentDaoPath,
  IOpenRecentService,
  IOpenRecentServiceToken,
} from '../../../local-store-db/common';
//import {RecentExplorerContainerId} from "../../../explorer/browser/explorer.contribution";
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import { ICommonServerApiToken, IRunSqlResult } from '../../../server-client/common';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { IMessageService } from '@opensumi/ide-overlay';
import { ISelectWorkspaceService } from '../select-workspace/select-workspace.service';
import { IDbCacheNodeServiceToken } from '../../../codelens-command/common';
import { DbCacheNodeService } from '../../../codelens-command/browser/db-cache-node.service';
import { getServerFileSuffix } from '../../../base/config/server.config';

@Injectable()
export class ServerInfoService {
  @Autowired(ConnectTreeModelService)
  private readonly fileTreeModelService: ConnectTreeModelService;

  @Autowired(ICommonServerApiToken)
  protected readonly commonServerApiService: CommonServerApiService;

  @Autowired(IMainLayoutService)
  private readonly mainLayoutService: IMainLayoutService;

  @Autowired(IOpenRecentServiceToken)
  private readonly openRecentService: IOpenRecentService;

  @Autowired(IOpenRecentDaoPath)
  protected readonly openRecentDao: IOpenRecentDao;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IMessageService)
  protected readonly messages: IMessageService;

  @Autowired(ISelectWorkspaceService)
  protected readonly selectWorkspaceService: ISelectWorkspaceService;

  @Autowired(IDbCacheNodeServiceToken)
  private readonly dbCacheNodeService: DbCacheNodeService;

  private readonly _onLoadingChange: Emitter<boolean> = new Emitter<boolean>();

  private readonly _onConnectChange: Emitter<IRunSqlResult> = new Emitter<IRunSqlResult>();

  get onLoadingChange(): Event<boolean> {
    return this._onLoadingChange.event;
  }

  get onConnectChange(): Event<IRunSqlResult> {
    return this._onConnectChange.event;
  }

  async connectServer(server: ServerInfo) {
    const rootUri = new URI(this.workspaceService.workspace?.uri);
    if (!rootUri || !rootUri.path || rootUri.path.toString() === '/') {
      this.selectWorkspaceService.open();
      return null;
    }
    this._onLoadingChange.fire(true);
    //部分数据库要求连接必须有默认database，比如db2
    const result = await this.commonServerApiService.testConnect({ server, db: server.database });
    if (result.success) {
      const openRecent = await this.openRecentService.addConnectToOpenRecent(server);
      if (openRecent) {
        server.sortNo = openRecent.sortNo;
        const serverTreeNode = ServerTreeNodeUtils.convertServer(server, openRecent, 'success');
        await this.fileTreeModelService.addServerNode(undefined, serverTreeNode);
        //点亮最近打开
        const recentExplorerContainer = this.mainLayoutService.getTabbarHandler(EXPLORER_CONTAINER_ID)!;
        if (!recentExplorerContainer.isActivated()) {
          recentExplorerContainer.activate();
        }
      }
    }
    this._onLoadingChange.fire(false);
    this._onConnectChange.fire(result);
    //清空存储的服务列表缓存，以便能在选择下拉框选中服务
    const prefix = getServerFileSuffix(server.serverType!);
    this.dbCacheNodeService.refreshWorkspaceCacheServer(prefix);
  }
}
