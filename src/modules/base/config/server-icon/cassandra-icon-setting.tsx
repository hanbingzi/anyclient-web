import { INodeIcon } from '../server-icon.config';
import { Cassandra } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';

export const CassandraIconSetting: INodeIcon = {
  icon: <Cassandra />,
  iconPath: ICON_RESOURCE_PATH.Cassandra,
  children: {},
};
