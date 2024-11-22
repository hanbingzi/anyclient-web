import { CellDataProps, CellProps } from './table-view.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import styles from './table-view.module.less';
import { isEmpty } from '../../base/utils/object-util';

export const Cell = (props: CellProps) => {
  const { rowIndex, columnIndex, data, style, searchWord, width, isSelected, isEditor, onDoubleClick, onClick } = props;

  const handleDoubleClick = (ev: React.MouseEvent) => {
    if (onDoubleClick) onDoubleClick(ev, rowIndex!, columnIndex!);
  };

  const handleClick = (ev: React.MouseEvent) => {
    if (onClick) onClick(ev, rowIndex!, columnIndex!);
  };

  const renderCellContent = () => {
    if (isEditor) {
      //console.log('cell --- isEditor,进入编辑态')
      return <DataEditor width={width} data={data} />;
    } else {
      return <ValueViewer searchWord={searchWord} data={data} width={width} />;
    }
  };

  const classNames = cls(styles['cell'], styles['cell-div'], isSelected && styles['selected']);
  return (
    <div
      className={classNames}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      style={{ ...style, width: `${width}px` }}
    >
      {renderCellContent()}
    </div>
  );
};

export function ValueViewer({ data, searchWord, width }: CellDataProps) {
  if (!searchWord || isEmpty(data)) {
    return (
      <span className={styles['value-viewer']} style={{ width: `${width}px` }} title={data + ''}>
        {data + ''}
      </span>
    );
  } else {
    //const reg = new RegExp(searchWord,"ig")
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
}

export function DataEditor({ data }: CellDataProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return <input className={styles['data-editor']} defaultValue={data || ''} />;
}
