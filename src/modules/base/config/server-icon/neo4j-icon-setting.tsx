import { INodeIcon } from '../server-icon.config';
import { Neo4j } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';


export const Neo4jIconSetting:INodeIcon ={
  icon: <Neo4j />,
  iconPath: ICON_RESOURCE_PATH.Neo4j,
  children: {},
}
