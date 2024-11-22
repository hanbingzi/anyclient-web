import React from 'react';
import { Icon } from '@opensumi/ide-components';

import styles from './navigation.module.less';
import { IBreadCrumbPart } from '../../common/navigation.types';
import { ServerIconFinder } from '../../../base/config/server-icon.config';

export const NavigationBar = ({ parts }: { parts: IBreadCrumbPart[] }) => {
  if (!parts) {
    return null;
  }
  return parts.length === 0 ? null : (
    <div className={styles.navigation_container}>
      {parts.map((p, i) => (
        <React.Fragment key={i + '-crumb:' + p.name}>
          {i > 0 && <Icon icon={'right'} size='small' className={styles.navigation_icon} />}
          <NavigationItem part={p} />
        </React.Fragment>
      ))}
    </div>
  );
};
export const NavigationItem = React.memo(({ part }: { part: IBreadCrumbPart }) => {
  let icon = ServerIconFinder.getServerIcon(part.serverType!, part.nodeType);
  return (
    <span className={styles['navigation-part']}>
      <span className={styles.icon}>{icon} </span>
      <span>{part.name}</span>
    </span>
  );
});

NavigationItem.displayName = 'data-navigation-item';
