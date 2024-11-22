import { Postgresql } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Postgres_base64 } from '../../../icons/node';
import React from 'react';
import { INodeIcon } from '../server-icon.config';
import { CommonSqlChildren } from './index';


export const PostgresqlIconSetting: INodeIcon = {
  icon: <Postgresql />,
  iconPath: ICON_RESOURCE_PATH.Postgresql,
  base64: Postgres_base64,
  children: CommonSqlChildren,
};
