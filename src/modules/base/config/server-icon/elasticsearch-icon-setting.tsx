import { INodeIcon } from '../server-icon.config';

import { Elasticsearch } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';

export const ElasticsearchIconSetting:INodeIcon ={
  icon: <Elasticsearch />,
  iconPath: ICON_RESOURCE_PATH.Elasticsearch,
  children: {},
}

