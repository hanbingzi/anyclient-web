import { INodeIcon } from '../server-icon.config';
import { TDEngine } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { Db_base64, TDEngine_base64, TimeDb } from '../../../icons/node';
import { CommonSqlChildren } from './index';

export const TDEngineIconSetting: INodeIcon = {
  icon: <TDEngine />,
  iconPath: ICON_RESOURCE_PATH.OceanBase,
  base64: TDEngine_base64,
  children: { ...CommonSqlChildren, basicDb: { hasFolderIcon: false, icon: <TimeDb />, base64: Db_base64 } },
};
