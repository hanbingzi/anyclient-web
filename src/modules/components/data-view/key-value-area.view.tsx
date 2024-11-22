import React, { CSSProperties, ReactNode, useCallback } from 'react';
import styles from './index.module.less';
import cls from 'classnames';

export interface KeyValueAreaProps {
  title?: string;
  name: string;
  value: string;
  style?: CSSProperties;
  // size?: 'default' | 'large' | 'small';
  onChange?: (value: string) => void;
  bordered?: boolean;
  height?: number;
  icon?: ReactNode;
}

export const KeyValueArea = (props: KeyValueAreaProps) => {
  const { style, name, value, bordered = true, height = 500, icon, onChange } = props;

  const handleContentChange = useCallback(
    (event) => {
      if (onChange) onChange(event.target.value);
    },
    [onChange],
  );
  return (
    <div className={styles['area-view-container']} style={{ ...style }}>
      <div className={styles['label-wrap']}>
        {icon ? <div className={styles['label-icon']}>{icon}</div> : null}
        <div className={styles['label-content']}>{name}</div>
      </div>
      <div className={styles['area-wrap']} style={{ height: height }}>
        <textarea
          className={cls(styles['area-content'], { [styles['area-content-border']]: bordered })}
          value={value}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};
