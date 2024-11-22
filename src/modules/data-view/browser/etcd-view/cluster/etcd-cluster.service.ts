import { Autowired, Injectable } from '@opensumi/di';
import { ConnectQuery, ServerInfo } from '../../../../local-store-db/common';
import { IBaseState } from '../../../common/data-browser.types';
import { Emitter } from '@opensumi/ide-utils';
import { ITableRow } from '../../../../components/table-editor';
import { EtcdService } from '../../../../server-client/browser/services/etcd-service';
import { IDialogService } from '@opensumi/ide-overlay';
import { IEtcdMember } from '../../../../server-client/common/types/etcd.types';

@Injectable({ multiple: true })
export class EtcdClusterService {
  @Autowired(EtcdService)
  private etcdService: EtcdService;

  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  private readonly onDataChangeEmitter = new Emitter<IEtcdMember[]>();

  private server: ServerInfo;
  public _whenReady: Promise<void>;

  get onDataChange() {
    return this.onDataChangeEmitter.event;
  }

  public serverId: string;

  public init(tableState: IBaseState) {
    const { serverId, server, nodeName } = tableState;
    this.serverId = serverId!;
    this.server = server!;
    this._whenReady = this.resolveWorkspaceData();
  }

  get whenReady() {
    return this._whenReady;
  }

  get connect(): ConnectQuery {
    return { server: this.server };
  }

  async resolveWorkspaceData() {
    await this.reloadData();
  }

  public async reloadData(): Promise<boolean> {
    const queryResult = await this.etcdService.showCluster(this.connect);
    if (queryResult.success) {
      const members = queryResult.data;
      this.onDataChangeEmitter.fire(members);
      return true;
    } else {
      this.dialogService.error(queryResult.message, ['ok']);
      return false;
    }
  }
}
