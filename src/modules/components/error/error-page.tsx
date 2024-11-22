import React from 'react';
import styles from './error-page.module.less';
import { Error } from '../../icons/common';
import { Button } from '@opensumi/ide-components';

export interface ErrorPageParam {
  message?: string;
  onRefresh?: () => void;
}

export function ErrorPage({ message, onRefresh }: ErrorPageParam) {
  return (
    <div className={styles['error-container']}>
      <div className={styles['title']}>
        <Error />
        <h2>{message}</h2>
      </div>
      <div className={styles['option']}>{onRefresh ? <Button onClick={onRefresh}>刷新</Button> : null}</div>
    </div>
  );
}
