import { INodeIcon } from '../server-icon.config';
import { OceanBase } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';
import { OceanBase_base64 } from '../../../icons/node';


export const OceanBaseIconSetting: INodeIcon = {
  icon: <OceanBase />,
  iconPath: ICON_RESOURCE_PATH.OceanBase,
  base64:OceanBase_base64,
  children: CommonSqlChildren,
};
