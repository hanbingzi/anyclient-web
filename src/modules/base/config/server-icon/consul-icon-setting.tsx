import { INodeIcon } from '../server-icon.config';
import { Consul } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';


export const ConsulIconSetting: INodeIcon = {
  icon: <Consul />,
  iconPath: ICON_RESOURCE_PATH.Consul,
  children: {},
};
