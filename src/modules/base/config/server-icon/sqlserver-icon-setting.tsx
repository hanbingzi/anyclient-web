
import { SQLServer } from '../../../icons/server';
import { Db_base64, SQLServer_base64, SQLServerDb } from '../../../icons/node';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { INodeIcon } from '../server-icon.config';
import { CommonSqlChildren } from './index';

export const SqlserverIconSetting: INodeIcon = {
  icon: <SQLServer />,
  base64: SQLServer_base64,
  iconPath: ICON_RESOURCE_PATH.SQLServer,
  children: {
    ...CommonSqlChildren,
    db: { hasFolderIcon: false, icon: <SQLServerDb />, base64: Db_base64 },
  },
};
