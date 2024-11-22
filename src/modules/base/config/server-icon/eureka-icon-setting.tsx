import { INodeIcon } from '../server-icon.config';
import { Eureka } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';


export const EurekaIconSetting: INodeIcon = {
  icon: <Eureka />,
  iconPath: ICON_RESOURCE_PATH.Eureka,
  children: {},
};
