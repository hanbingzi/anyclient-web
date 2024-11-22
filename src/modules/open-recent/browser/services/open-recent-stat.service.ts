import { Autowired, Injectable } from '@opensumi/di';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { Emitter, Event } from '@opensumi/ide-core-browser';
import { DisposableCollection } from '@opensumi/ide-utils';
import { ServerInfo } from '../../../local-store-db/common/model.define';
import { IOpenRecentService, IOpenRecentServiceToken } from '../../../local-store-db/common';
import { IOpenRecentStatService } from '../../common';

export interface ConnectEmitterInfo {
  server: ServerInfo;
  option: 'open' | 'close';
}

@Injectable()
export class OpenRecentStatService implements IOpenRecentStatService {
  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IOpenRecentServiceToken)
  private readonly openRecentService: IOpenRecentService;

  private serverConnections = new Map<string, ServerInfo>();

  private toDispose: DisposableCollection = new DisposableCollection();

  private readonly connectChangeEmitter = new Emitter<ConnectEmitterInfo>();

  /**
   * 监听此方法，当新的连接打开后，进行页面更改
   */
  get onConnectChange(): Event<ConnectEmitterInfo> {
    return this.connectChangeEmitter.event;
  }

  async init() {
    this.toDispose.push(
      this.workspaceService.onWorkspaceChanged(() => {
        //工作空间发生变化时，要刷新当前队列
        this.serverConnections.clear();
        this.toDispose.dispose();
      }),
    );
    // this.toDispose.push(this.connectTreeAPI.onConnectChange((serverId) => {
    //  //console.log('打开了一个连接-->', serverId)
    //     if (!this.serverConnections.has(serverId)) {
    //       this.serverConnections.add(serverId)
    //     }
    //   })
    //)
  }

  pushOpenConnect(serverInfo: ServerInfo, openRecentId?: string) {
    if (!serverInfo) return;
    if (!this.serverConnections.has(serverInfo.serverId!)) {
      this.serverConnections.set(serverInfo.serverId!, serverInfo);
      this.connectChangeEmitter.fire({ server: serverInfo, option: 'open' });
    }
    //更改打开时间
    this.openRecentService.updateOpenTime(serverInfo.serverId!, openRecentId);
  }

  pushCloseConnect(serverInfo: ServerInfo) {
    if (serverInfo) {
      if (this.serverConnections.has(serverInfo.serverId!)) {
        this.serverConnections.delete(serverInfo.serverId!);
        this.connectChangeEmitter.fire({ server: serverInfo, option: 'close' });
      }
    }
  }

  isConnect(serverId: string): boolean {
    if (!serverId) {
      return false;
    }
    if (this.serverConnections.has(serverId)) {
      return true;
    }
    return false;
  }
}
