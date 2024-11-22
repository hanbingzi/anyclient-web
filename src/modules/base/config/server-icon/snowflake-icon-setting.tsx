import { INodeIcon } from '../server-icon.config';

import { Snowflake } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';

export const SnowflakeIconSetting: INodeIcon = {
  icon: <Snowflake />,
  iconPath: ICON_RESOURCE_PATH.Snowflake,
  children: {},
};
