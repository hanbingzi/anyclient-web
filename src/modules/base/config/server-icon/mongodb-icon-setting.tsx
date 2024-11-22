import { INodeIcon } from '../server-icon.config';
import { Mongodb } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';


export const MongodbIconSetting: INodeIcon = {
  icon: <Mongodb />,
  iconPath: ICON_RESOURCE_PATH.Mongodb,
  children: {},
};
