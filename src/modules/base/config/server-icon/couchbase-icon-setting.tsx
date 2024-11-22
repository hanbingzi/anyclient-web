import { INodeIcon } from '../server-icon.config';
import { Couchbase } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { Postgres_base64 } from '../../../icons/node';

export const CouchbaseIconSetting: INodeIcon = {
  icon: <Couchbase />,
  iconPath: ICON_RESOURCE_PATH.Postgresql,
  base64: Postgres_base64,
};
