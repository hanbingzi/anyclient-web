import { INodeIcon } from '../server-icon.config';
import { TiDB } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';
import { TiDB_base64 } from '../../../icons/node';


export const TiDBIconSetting: INodeIcon = {
  icon: <TiDB />,
  iconPath: ICON_RESOURCE_PATH.TiDB,
  base64:TiDB_base64,
  children: CommonSqlChildren,
};
