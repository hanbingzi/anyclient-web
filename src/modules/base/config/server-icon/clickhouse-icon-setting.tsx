import { INodeIcon } from '../server-icon.config';
import { ClickHouse } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { CommonSqlChildren } from './index';
import { Clickhouse_base64 } from '../../../icons/node';

export const ClickHouseIconSetting: INodeIcon = {
  icon: <ClickHouse />,
  //iconPath: ICON_RESOURCE_PATH.Cl,
  base64:Clickhouse_base64,
  children: CommonSqlChildren,
};
