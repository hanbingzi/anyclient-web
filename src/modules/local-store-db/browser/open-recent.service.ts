import { Autowired, Injectable } from '@opensumi/di';
import { IOpenRecentDao, IOpenRecentDaoPath, IOpenRecentService, IServerDao, IServerDaoPath } from '../common';
import { OpenRecentInfo, ServerInfo } from '../common/model.define';
import { URI } from '@opensumi/ide-core-browser';
import { uuid } from '@opensumi/ide-core-common';
import { DateUtil } from '../../base/utils/date-util';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { IMessageService } from '@opensumi/ide-overlay';

@Injectable()
export class OpenRecentService implements IOpenRecentService {

  @Autowired(IOpenRecentDaoPath)
  protected readonly openRecentDao: IOpenRecentDao;

  @Autowired(IServerDaoPath)
  protected readonly serverDao: IServerDao;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  @Autowired(IMessageService)
  protected readonly messages: IMessageService;

  /**
   * 从 服务列表，点击连接后，调用此方法
   */
  async addConnectToOpenRecent(serverInfo: ServerInfo): Promise<OpenRecentInfo | null> {
    const rootUri = new URI(this.workspaceService.workspace?.uri);
    if (!rootUri || !rootUri.path || rootUri.path.toString() === '/') {
      await this.messages.error(`请先选择一个工作空间，在打开服务。`);
      return null;
    }
    const workspace = rootUri.path.toString();
    let currentExistSize = await this.openRecentDao.countByWorkspace(workspace);
    //测试是否能够联通，能够联通，添加

    const currentDate = new Date();
    const recentId = uuid();
    const recentInfo: OpenRecentInfo = {
      recentId,
      serverId: serverInfo.serverId!,
      workspace,
      openTime: DateUtil.getDateString(currentDate),
      sortNo: currentExistSize + 1,
    };
    await this.openRecentDao.setItem(recentInfo);
    return recentInfo;
  }

  /**
   * 当连接被打开时，记录打开的时间
   * @param openRecentId
   * @param serverId
   */
  async updateOpenTime(serverId: string, openRecentId?: string) {
    const currentDate = new Date();
    let dateStr = DateUtil.getDateString(currentDate);
    this.serverDao.updateById(serverId, { lastOpenTime: dateStr });

    if (!openRecentId) {
      const rootUri = new URI(this.workspaceService.workspace?.uri);
      const workspace = rootUri.path.toString();
      const openRecent = await this.openRecentDao.findByWorkspaceAndServerId(workspace, serverId);
      if (openRecent && openRecent.recentId) {
        openRecentId = openRecent.recentId;
      }
    }
    if (openRecentId) {
      this.openRecentDao.updateById(openRecentId, { openTime: dateStr });
    }
  }

  async delete(openRecentId: string) {
    await this.openRecentDao.delete(openRecentId);
  }

  async deleteByServerId(serverId: string) {
    await this.openRecentDao.delete(serverId);
  }

  /**
   *
   * @param dragId 移动的目标id
   * @param containerId 移动目标最后停留的节点容器
   * 所有的sortno都是按照逐步+1的顺序从1开始往上排列的
   */
  async autoSort(dragId: string, containerId: string) {
    let drag: OpenRecentInfo = await this.openRecentDao.findById(dragId);
    let container: OpenRecentInfo = await this.openRecentDao.findById(containerId);
    if (!drag || !container) {
      return;
    }
    let workspace = drag.workspace;
    let diff: number = drag.sortNo - container.sortNo;
    if (diff === 1) {
      //node只是往下拖了一个，排序不发生变化
      return;
    }
    if (diff === 2) {
      //往下拖了两个
      let replace = await this.openRecentDao.findBySortNo(workspace!, drag.sortNo - 1);
      await this.openRecentDao.updateById(replace.recentId!, { sortNo: drag.sortNo });
      await this.openRecentDao.updateById(drag.recentId!, { sortNo: drag.sortNo - 1 });
      return;
    }
    if (diff === -1) {
      //node往上拖一个
      await this.openRecentDao.updateById(drag.recentId, { sortNo: container.sortNo });
      await this.openRecentDao.updateById(container.recentId, { sortNo: drag.sortNo });
      return;
    }
    if (drag.sortNo > container.sortNo) {
      //往下拉多个
      let centers = await this.openRecentDao.findBySortNoRange(workspace, drag.sortNo, container.sortNo);
      centers.forEach((item) => {
        this.openRecentDao.updateById(item.recentId, { sortNo: item.sortNo + 1 });
      });
      //查询大于container的排序，全部加1，
      await this.openRecentDao.updateById(drag.recentId, { sortNo: container.sortNo + 1 });
    } else {
      //往上拉多个
      let centers = await this.openRecentDao.findBySortNoRange(workspace, container.sortNo, drag.sortNo);
      centers.forEach((item) => {
        this.openRecentDao.updateById(item.recentId, { sortNo: item.sortNo - 1 });
      });
      await this.openRecentDao.updateById(drag.recentId, { sortNo: container.sortNo });
      await this.openRecentDao.updateById(container.recentId, { sortNo: container.sortNo - 1 });
    }
  }

  // async updateSortByRecentId(recentId: string, date: Date) {
  //   this.openRecentDao.updateById(recentId, {openTime:, sortNo: date.getTime()})
  // }
}
