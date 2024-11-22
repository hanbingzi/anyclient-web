import React from 'react';

import { INodeIcon } from '../server-icon.config';
import { Trino } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Trino_base64 } from '../../../icons/node';
import { CommonSqlChildren } from './index';

export const TrinoIconSetting: INodeIcon = {
  icon: <Trino />,
  iconPath: ICON_RESOURCE_PATH.Postgresql,
  base64: Trino_base64,
  children: CommonSqlChildren,
};
