import { Injectable } from '@opensumi/di';
import { IOpenRecentDao } from '../common';
import { OpenRecentInfo } from '../common/model.define';
import BaseDao from './base.dao';

/**
 *
 */
@Injectable()
export class OpenRecentDao extends BaseDao<OpenRecentInfo> implements IOpenRecentDao {
  get collection(): string {
    return 'openRecent';
  }

  get primaryKey(): string {
    return 'recentId';
  }

  /**
   * 新增和修改
   * @param workspacePath
   * @param item
   * @param serverRecentInfo
   */
  async setItem(info: OpenRecentInfo) {
    const countParam: Partial<OpenRecentInfo> = { workspace: info.workspace, serverId: info.serverId };
    const exist = await this._findOneByWhereParam(countParam);
    if (exist) {
      const updateData: Partial<OpenRecentInfo> = { openTime: info.openTime };
      this._updateById(exist.recentId, updateData);
    } else {
      this.insert(info);
    }
  }

  async updateById(recentId: string, updateData: OpenRecentInfo) {
    this._updateById(recentId, updateData);
  }

  // updateById(db: Database.Database, info: ServerRecentInfo) {
  //     let updateSql = `update ${this.table}
  //                      set sort_no=@sortNo,
  //                          open_time=@openTime
  //                      where server_id = @serverId`;
  //     let update = db.prepare(updateSql);
  //     let result = update.run(info);
  //
  // }

  // save(db: Database.Database, info: ServerRecentInfo) {
  //     let insertSql = `insert into ${this.table}(server_id, sort_no, open_time)
  //                      values (@serverId, @sortNo, @openTime)`
  //     let insert = db.prepare(insertSql);
  //     let result = insert.run(info);
  //
  // }

  /**
   * 删除
   * @param workspacePath
   * @param item
   * @param serverRecentInfo
   */
  async delete(id: string) {
    await this._deleteById(id);
  }
  async deleteByServerId(serverId: string) {
    await this._delete({ serverId });
  }

  async findById(id: string): Promise<OpenRecentInfo> {
    return this._findById(id);
  }

  async findBySortNo(workspace: string, sortNo: number): Promise<OpenRecentInfo> {
    return this._findOneByWhereParam({ sortNo: sortNo, workspace });
  }

  async findByWorkspace(workspace: string): Promise<OpenRecentInfo[]> {
    const findParam: Partial<OpenRecentInfo> = { workspace };
    return this._findByWhereParam(findParam);
  }

  async countByWorkspace(workspace: string): Promise<number> {
    const findParam: Partial<OpenRecentInfo> = { workspace };
    return this._countByWhereParam(findParam);
  }

  async findByWorkspaceAndServerId(workspace: string, serverId: string): Promise<OpenRecentInfo> {
    const findParam: Partial<OpenRecentInfo> = { workspace, serverId };
    return this._findOneByWhereParam(findParam);
  }

  async findBySortNoRange(workspace: string, maxNo: number, minNo): Promise<OpenRecentInfo[]> {
    const query = { ...this.collectionParam, workspace, sortNo: { $gt: minNo, $lt: maxNo } };
    return this._findByWhereParam(query);
  }
}
