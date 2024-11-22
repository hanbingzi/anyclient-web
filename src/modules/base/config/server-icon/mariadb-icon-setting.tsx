import { Mariadb } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Mariadb_base64 } from '../../../icons/node';
import React from 'react';
import { INodeIcon } from '../server-icon.config';
import { CommonSqlChildren } from './index';

export const MariadbIconSetting: INodeIcon = {
  icon: <Mariadb />,
  iconPath: ICON_RESOURCE_PATH.Mysql,
  base64: Mariadb_base64,
  children: CommonSqlChildren,
};
