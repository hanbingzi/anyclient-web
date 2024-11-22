import { INodeIcon } from '../server-icon.config';
import { DB2 } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';
import { DB2_base64 } from '../../../icons/node';

export const DB2IconSetting: INodeIcon = {
  icon: <DB2 />,
  iconPath: ICON_RESOURCE_PATH.DB2,
  base64: DB2_base64,
  children: CommonSqlChildren,
};
