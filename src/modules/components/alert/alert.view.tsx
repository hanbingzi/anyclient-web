import React, { CSSProperties } from 'react';
import styles from './alert.module.less';
import cls from 'classnames';

export interface AlertProps {
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  style?: CSSProperties;
}

export const AlertView = (props: AlertProps) => {
  const { message, type, style } = props;
  const className = cls(
    styles['alert-container'],
    type === 'success' && styles['alert-success'],
    type === 'info' && styles['alert-info'],
    type === 'warning' && styles['alert-warning'],
    type === 'error' && styles['alert-error'],
  );
  return (
    <div className={className} style={{ ...style }}>
      {message}
    </div>
  );
};
