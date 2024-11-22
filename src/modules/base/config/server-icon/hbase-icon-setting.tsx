import { INodeIcon } from '../server-icon.config';

import { HBase } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Postgres_base64 } from '../../../icons/node';
import React from 'react';

export const HBaseIconSetting: INodeIcon = {
  icon: <HBase />,
  iconPath: ICON_RESOURCE_PATH.Postgresql,
  base64: Postgres_base64,
};
