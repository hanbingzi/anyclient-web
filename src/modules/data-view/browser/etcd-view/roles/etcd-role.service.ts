import { Autowired, Injectable } from '@opensumi/di';
import { ConnectQuery, ServerInfo } from '../../../../local-store-db/common';
import { IBaseState } from '../../../common/data-browser.types';
import { Emitter } from '@opensumi/ide-utils';
import { ITableRow } from '../../../../components/table-editor';
import { EtcdService } from '../../../../server-client/browser/services/etcd-service';
import { IDialogService } from '@opensumi/ide-overlay';
import { EtcdView } from '../etcd-constant';
import { isEmpty } from '../../../../base/utils/object-util';
import { IEtcdAddPermission } from '../../../../server-client/common/types/etcd.types';

@Injectable({ multiple: true })
export class EtcdRoleService {
  @Autowired(EtcdService)
  private etcdService: EtcdService;

  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  private readonly onDataChangeEmitter = new Emitter<ITableRow[]>();

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
    const queryResult = await this.etcdService.showRolesInfo(this.connect);
    if (queryResult.success) {
      const roles = queryResult.data;
      this.onDataChangeEmitter.fire(roles);
      return true;
    } else {
      this.dialogService.error(queryResult.message, ['ok']);
      return false;
    }
  }

  public async getAllRoles(): Promise<string[]> {
    const queryResult = await this.etcdService.showRoles(this.connect);
    if (queryResult.success) {
      return queryResult.data;
    }
    return [];
  }

  public async save(role: string, roles: IEtcdAddPermission[]): Promise<boolean> {
    let errorMessage = '';
    let execSuccess = false;
    if (isEmpty(role)) {
      errorMessage = '角色不能为空';
    } else {
      const addRoleResult = await this.etcdService.addRole(this.connect, role);
      if (addRoleResult.success) {
        execSuccess = true;
        const roleAddPermissionResult = await this.etcdService.roleAddPermission(this.connect, role, roles);
        if (!roleAddPermissionResult.success) {
          execSuccess = false;
          errorMessage = roleAddPermissionResult.message;
        }
      }else{
        errorMessage = addRoleResult.message;
      }
    }
    if(!execSuccess){
      this.dialogService.error(errorMessage, ['ok']);
    }

    return execSuccess;
  }

  public async removeRole(roles: ITableRow[]): Promise<boolean> {
    const rolenames = roles.map((role) => role[EtcdView.Role]);
    const queryResult = await this.etcdService.deleteRoles(this.connect, rolenames);
    if (queryResult.success) {
      return true;
    } else {
      this.dialogService.error(queryResult.message, ['ok']);
      return false;
    }
  }
}
