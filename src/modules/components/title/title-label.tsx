import React, { ReactNode } from 'react';
import styles from './title-label.module.less';
import cls from 'classnames';

export interface TitleLabelProps {
  icon?: ReactNode;
  title: string;
  size?: 'default' | 'small';
}

export const WindowsTitle = ({ icon, title, size = 'default' }: TitleLabelProps) => {
  return (
    <div className={styles['title-container']}>
      <div className={cls(styles['title-wrap'], size === 'small' && styles['min-title'])}>
        {icon ? <div className={styles['title-icon']}>{icon}</div> : null}
        <div className={styles['title-content']}>{title}</div>
      </div>
    </div>
  );
};
