import { RowProps } from './list-view.types';
import React from 'react';
import cls from 'classnames';
import styles from './list-view.module.less';

export const Row = (props: RowProps) => {
  const { rowIndex, data, searchWord, width } = props;

  if (!searchWord || !data) {
    return (
      <span className={styles['value-viewer']} style={{ width: `${width}px` }} title={data + ''}>
        {data}
      </span>
    );
  } else {
    const arr = String(data).split(searchWord);
    return (
      <span className={styles['value-viewer']} style={{ width: `${width}px` }}>
        {arr.map((str, index) => (
          <span key={index}>
            {str}
            {index === arr.length - 1 ? null : <span className={styles['value-mark']}>{searchWord}</span>}
          </span>
        ))}
      </span>
    );
  }
};
