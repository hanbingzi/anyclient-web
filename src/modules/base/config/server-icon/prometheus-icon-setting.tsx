import { INodeIcon } from '../server-icon.config';

import { Prometheus } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';

export const PrometheusIconSetting:INodeIcon ={
  icon: <Prometheus />,
  iconPath: ICON_RESOURCE_PATH.OceanBase,
  children: {},
}
