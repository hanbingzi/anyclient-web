import { Autowired, Injectable } from '@opensumi/di';
import { ConnectQuery, ServerInfo } from '../../../../local-store-db/common';
import { IBaseState } from '../../../common/data-browser.types';
import { Emitter } from '@opensumi/ide-utils';
import { ITableRow } from '../../../../components/table-editor';
import { EtcdService } from '../../../../server-client/browser/services/etcd-service';
import { IDialogService } from '@opensumi/ide-overlay';
import { EtcdView } from '../etcd-constant';
import { isEmpty } from '../../../../base/utils/object-util';

@Injectable({ multiple: true })
export class EtcdUserService {
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
    const queryResult = await this.etcdService.showUsersInfo(this.connect);
    if (queryResult.success) {
      const users = queryResult.data;
      this.onDataChangeEmitter.fire(users);
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

  public async save(user: string, password: string, roles: string[]): Promise<boolean> {
    let errorMessage = '';
    let execSuccess = false;
    if (isEmpty(user)) {
      errorMessage = '用户不能为空';
    } else {
      const addUserResult = await this.etcdService.addUser(this.connect, user, password);
      if (addUserResult.success) {
        execSuccess = true;
        const userAddRoleResult = await this.etcdService.userAddRole(this.connect, user, roles);
        if (!userAddRoleResult.success) {
          execSuccess = false;
          errorMessage = userAddRoleResult.message;
        }
      }else{
        errorMessage = addUserResult.message;
      }
    }
    if(!execSuccess){
      this.dialogService.error(errorMessage, ['ok']);
    }

    return execSuccess;
  }

  public async removeUser(users: ITableRow[]): Promise<boolean> {
    const usernames = users.map((user) => user[EtcdView.User]);
    const queryResult = await this.etcdService.deleteUsers(this.connect, usernames);
    if (queryResult.success) {
      return true;
    } else {
      this.dialogService.error(queryResult.message, ['ok']);
      return false;
    }
  }
}
