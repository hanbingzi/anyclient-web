import React, { CSSProperties } from 'react';
import { Input } from '@opensumi/ide-components';
import styles from './index.module.less';
import cls from 'classnames';

/**
 * 展示集中简单的数据类型
 */
export interface KeyValueListProps {
  title?: string;
  value: { [key: string]: any };
  style?: CSSProperties;
  lineStyle?: CSSProperties;
  size?: 'default' | 'large' | 'small';
}

export const KeyValueList = (props: KeyValueListProps) => {
  const { style, value, lineStyle, size = 'default' } = props;
  return (
    <div className={styles['input-view-container']} style={{ ...style }}>
      {Object.keys(value).map((key, index) => {
        return (
          <div
            className={cls(
              styles['line'],
              size === 'default' && styles['line-default'],
              size === 'small' && styles['line-small'],
            )}
            style={{ ...lineStyle }}
            key={key}
          >
            <div className={styles['label-wrap']}>{key}</div>
            <div className={styles['input-wrap']}>
              <Input readOnly={true} value={value[key]} size={size} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
