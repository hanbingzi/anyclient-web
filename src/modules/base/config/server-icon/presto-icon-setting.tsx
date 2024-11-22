import React from 'react';

import { INodeIcon } from '../server-icon.config';
import { Presto } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Presto_base64 } from '../../../icons/node';
import { CommonSqlChildren } from './index';

export const PrestoIconSetting: INodeIcon = {
  icon: <Presto />,
  iconPath: ICON_RESOURCE_PATH.Postgresql,
  base64: Presto_base64,
  children: CommonSqlChildren,
};
