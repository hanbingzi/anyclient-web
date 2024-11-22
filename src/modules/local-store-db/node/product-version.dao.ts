import { Injectable } from '@opensumi/di';
import { IProductVersionDao, ProductVersion } from '../common';
import { isEmpty } from '../../base/utils/object-util';
import BaseDao from './base.dao';
import { uuid } from '@opensumi/ide-utils';
import { AppConstants } from '../../../common/constants';

@Injectable()
export class ProductVersionDao extends BaseDao<ProductVersion> implements IProductVersionDao {
  get collection(): string {
    return 'productVersion';
  }

  get primaryKey(): string {
    return 'versionId';
  }

  async checkVersionExpire(latestVersion: string): Promise<boolean> {
    const currentVersion = AppConstants.Version;
    if (latestVersion === currentVersion) {
      return false;
    }
    const findPv = await this.findByVersion(latestVersion);
    //根据version能够查询到，说明此版本忽略更新，因为只存储用户忽略的版本更新的数据
    if (findPv) {
      return false;
    }
    //对比版本是否需要更新 （旧的 1.1.2） 和新的（1.2.3）就需要更新
    const latestVersionSplit = latestVersion.split('.');
    const currentVersionSplit = currentVersion.split('.');
    if (Number.parseInt(latestVersionSplit[0]) > Number.parseInt(currentVersionSplit[0])) {
      return true;
    } else if (Number.parseInt(latestVersionSplit[1]) > Number.parseInt(currentVersionSplit[1])) {
      return true;
    }
    //1.小版本不提示更新 2.小版本可能带字符串
    // else if (Number.parseInt(latestVersionSplit[2]) > Number.parseInt(currentVersionSplit[2])) {
    //   return true;
    // }
    return false;
  }

  async findByVersion(version: string) {
    return this._findOneByWhereParam({ version });
  }

  async save(productVersion: ProductVersion): Promise<void> {
    if (isEmpty(productVersion.versionId)) {
      productVersion.versionId = uuid();
    }
    this.insert(productVersion);
  }
}
