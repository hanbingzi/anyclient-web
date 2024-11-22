import { INodeIcon } from '../server-icon.config';

import { Hive } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';
import { Hive_base64 } from '../../../icons/node';

export const HiveIconSetting: INodeIcon = {
  icon: <Hive />,
  iconPath: ICON_RESOURCE_PATH.Hive,
  base64: Hive_base64,
  children: CommonSqlChildren,
};
