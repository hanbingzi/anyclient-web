import { INodeIcon } from '../server-icon.config';

import { Nacos } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';

export const NacosIconSetting:INodeIcon ={
  icon: <Nacos />,
  iconPath: ICON_RESOURCE_PATH.Nacos,
  children: {},
}
