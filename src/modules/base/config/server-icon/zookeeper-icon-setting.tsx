import { INodeIcon } from '../server-icon.config';
import { Zookeeper } from '../../../icons/server';
import { ICON_RESOURCE_PATH } from '../../icon';
import { ZkNode, ZkNode_base64, Zookeeper_base64 } from '../../../icons/node';
import React from 'react';


export const ZookeeperIconSetting: INodeIcon = {
  icon: <Zookeeper />,
  iconPath: ICON_RESOURCE_PATH.Zookeeper,
  base64: Zookeeper_base64,
  children: {
    zkNode: { hasFolderIcon: false, icon: <ZkNode />, base64: ZkNode_base64 },
  },
};
