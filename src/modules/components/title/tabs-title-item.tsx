import React, { ReactNode } from 'react';
import styles from './tabs-title-item.module.less';

export interface TabsTitleItemProps {
  title: string;
  fixWidth?: number;
  icon?: ReactNode;
}

export const TabsTitleItem = ({ title, fixWidth, icon }: TabsTitleItemProps) => {
  return (
    <div className={styles['title-cell']} style={{ width: fixWidth ? fixWidth : undefined }}>
      {icon ? <div className={styles['title-icon']}>{icon}</div> : null}
      <div className={styles['title-content']}>{title}</div>
    </div>
  );
};
