import { Oracle } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Oracle_base64, Orcl_Db_base64, OrclDb } from '../../../icons/node';
import React from 'react';
import { INodeIcon } from '../server-icon.config';
import { CommonSqlChildren } from './index';


export const OracleIconSetting: INodeIcon = {
  icon: <Oracle />,
  iconPath: ICON_RESOURCE_PATH.Oracle,
  base64: Oracle_base64,
  children: { ...CommonSqlChildren, orclDb: { hasFolderIcon: false, icon: <OrclDb />, base64: Orcl_Db_base64 } },
};
