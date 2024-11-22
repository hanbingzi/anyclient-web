import { INodeIcon } from '../server-icon.config';
import { DM } from '../../../icons/server';
import { Db_base64, DM_base64, UserDB } from '../../../icons/node';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';

export const DMIconSetting: INodeIcon = {
  icon: <DM />,
  base64: DM_base64,
  iconPath: ICON_RESOURCE_PATH.DM,
  children: {
    ...CommonSqlChildren,
    db: { hasFolderIcon: false, icon: <UserDB />, base64: Db_base64 },
  },
};
