import { INodeIcon } from '../server-icon.config';
import { Influxdb } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';


export const InfluxdbIconSetting: INodeIcon = {
  icon: <Influxdb />,
  iconPath: ICON_RESOURCE_PATH.Influxdb,
  children: {},
};
