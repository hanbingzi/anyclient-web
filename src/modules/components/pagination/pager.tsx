import React from 'react';
import cls from 'classnames';
import styles from './pagination.module.less';

export interface PagerProps {
  page: number;
  active: boolean;
  handlePager: (page: number) => void;
}

export const Pager = (props: PagerProps) => {
  const { page, active, handlePager } = props;

  return (
    <div
      className={cls(styles['opt-item'], active ? styles['opt-item-disabled'] : styles['opt-item-active'])}
      onClick={() => {
        handlePager(page);
      }}
    >
      {page}
    </div>
  );
};
