import { INodeIcon } from '../server-icon.config';
import Rabbitmq from '../../../icons/server/rabbitmq';
import { ICON_RESOURCE_PATH } from '../../icon';
import { Group, Group_base64, Topic, Topic_base64 } from '../../../icons/node';
import React from 'react';


export const RabbitmqIconSetting: INodeIcon = {
  icon: <Rabbitmq />,
  iconPath: ICON_RESOURCE_PATH.Rabbitmq,
  children: {
    topic: {
      hasFolderIcon: false,
      icon: <Topic />,
      base64: Topic_base64,
    },
    groups: {
      hasFolderIcon: false,
      icon: <Group />,
    },
    group: {
      hasFolderIcon: false,
      icon: <Group />,
      base64: Group_base64,
    },
  },
};
