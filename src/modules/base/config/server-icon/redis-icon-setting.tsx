import { INodeIcon } from '../server-icon.config';
import { Redis } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import {
  CacheDb,
  CacheKey,
  Folder,
  FolderOpened,
  Redis_base64,
  RedisDb_base64,
  RedisHash_base64,
  RedisKey_base64,
  RedisList_base64,
  RedisSet_base64,
  RedisString_base64,
  RedisZSet_base64,
} from '../../../icons/node';
import { HashIcon, ListIcon, SetIcon, StringIcon, ZSetIcon } from '../../../icons/font';
import React from 'react';


export const RedisIconSetting: INodeIcon = {
  icon: <Redis />,
  iconPath: ICON_RESOURCE_PATH.Redis,
  base64: Redis_base64,
  children: {
    redisDb: { hasFolderIcon: false, icon: <CacheDb />, base64: RedisDb_base64 },
    redisFolder: {
      hasFolderIcon: true,
      icon: <Folder />,
      openIcon: <FolderOpened />,
      closeIcon: <Folder />,
    },
    // redisKey: {
    //   hasFolderIcon: false,
    //   icon: <CacheKey />,
    //   iconPath: ICON_RESOURCE_PATH.cacheKey,
    //   base64: RedisKey_base64,
    // },
    redisHash: { hasFolderIcon: false, icon: <HashIcon />, base64: RedisHash_base64 },
    redisList: { hasFolderIcon: false, icon: <ListIcon />, base64: RedisList_base64 },
    redisString: { hasFolderIcon: false, icon: <StringIcon />, base64: RedisString_base64 },
    redisZSet: { hasFolderIcon: false, icon: <ZSetIcon />, base64: RedisZSet_base64 },
    redisSet: { hasFolderIcon: false, icon: <SetIcon />, base64: RedisSet_base64 },
  },
};
