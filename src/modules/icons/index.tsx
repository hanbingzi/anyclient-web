import React, { CSSProperties, ReactNode } from 'react';
import styles from './index.module.less';
import cls from 'classnames';

export interface IconSvgParam {
  icon: ReactNode;
  disabled?: boolean;
  size?: 'large' | 'default' | 'small';
  style?: CSSProperties;
  //是否显示阴影
  shadow?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export const IconSvg = (param: IconSvgParam) => {
  const { icon, disabled = false, size = 'default', shadow = true, style, onClick } = param;

  return (
    <div
      className={cls(
        styles['icon-container'],
        size === 'large' && styles['icon-large'],
        size === 'default' && styles['icon-default'],
        size === 'small' && styles['icon-small'],
        disabled ? styles['icon-disabled'] : shadow ? styles['icon-active'] : null,
      )}
      onClick={onClick}
      style={style}
    >
      {icon}
    </div>
  );
};
