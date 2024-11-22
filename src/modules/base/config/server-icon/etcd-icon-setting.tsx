import { INodeIcon } from '../server-icon.config';
import { Etcd } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import {
  Auth, CacheDb,
  Cluster, Cluster_base64,
  Data, File_key1_base64, File_key2_base64,
  FileKey1,
  Folder,
  Folder_base64,
  FolderOpened,
  Member,
  RedisDb_base64,
  Roles, Roles_base64,
  Users, Users_base64,
} from '../../../icons/node';

export const EtcdIconSetting: INodeIcon = {
  icon: <Etcd />,
  iconPath: ICON_RESOURCE_PATH.Etcd,
  children: {
    data: { hasFolderIcon: false, icon: <CacheDb />, base64: RedisDb_base64 },
    cluster: { hasFolderIcon: false, icon: <Cluster />, base64: Cluster_base64 },
    auth: { hasFolderIcon: false, icon: <Auth />, base64: RedisDb_base64 },
    dic: {
      hasFolderIcon: true,
      icon: <Folder />,
      openIcon: <FolderOpened />,
      closeIcon: <Folder />,
      base64: Folder_base64,
    },
    key: { hasFolderIcon: false, icon: <FileKey1 />, base64: File_key1_base64 },
    users: { hasFolderIcon: false, icon: <Users />, base64: Users_base64 },
    roles: { hasFolderIcon: false, icon: <Roles />, base64: Roles_base64 },
    member: { hasFolderIcon: false, icon: <Member />, base64: RedisDb_base64 },
  },
};
