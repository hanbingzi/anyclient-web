import React from 'react';
import { Mysql } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Mysql_base64 } from '../../../icons/node';
import { INodeIcon } from '../server-icon.config';
import { CommonSqlChildren } from './index';

export const MysqlIconSetting: INodeIcon = {
  icon: <Mysql />,
  iconPath: ICON_RESOURCE_PATH.Mysql,
  base64: Mysql_base64,
  children: CommonSqlChildren,
};
