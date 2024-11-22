import React, { useCallback, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import styles from './table-view.module.less';
import cls from 'classnames';
import '../table-editor/resize_able.less';
import { IListColumn } from './table-view.types';
import { DEFAULT_CELL_FIXED_LEFT_WIDTH, DEFAULT_COLUMN_WIDTH } from './table-view';
import { VscTriangleDown, VscTriangleUp } from 'react-icons/vsc';
import { ISortColumn } from '../table-editor';

export interface TableHeaderProps {
  columns: IListColumn[];
  sortColumn?: ISortColumn;
  // tableHeight:number;
  handleColumnWidth: (setting: number[], dataGridWidth: number) => void;
  onDragLineStart: (left: number) => void;
  onDragLineStop: () => void;
  onDragLine: (left: number) => void;
  sort: (column: string) => void;
}

export const TableViewHeader = (props: TableHeaderProps) => {
  const { columns, sortColumn, handleColumnWidth, onDragLine, onDragLineStart, onDragLineStop, sort } = props;
  const [dataGridWidth, setDataGridWidth] = useState(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  useEffect(() => {
    if (!columnWidths || columnWidths.length === 0) {
      //console.log('set column width------>')
      let _columnWidths: number[] = [];
      columns.forEach((item) => {
        if (item.width) {
          _columnWidths?.push(item.width);
        } else {
          _columnWidths.push(DEFAULT_COLUMN_WIDTH);
        }
      });
      setColumnWidths(_columnWidths);
      let _dataGridWidth = calcDataGridWidth(_columnWidths);
      setDataGridWidth(_dataGridWidth);
      handleColumnWidth(_columnWidths, _dataGridWidth);
    }
  }, [columns]);

  const calcDataGridWidth = useCallback((_columnWidths: number[]): number => {
    let _dataGridWidth = DEFAULT_CELL_FIXED_LEFT_WIDTH; // 初始宽度包含操作列
    _columnWidths?.forEach((item) => {
      _dataGridWidth += item;
    });
    return _dataGridWidth + 30;
  }, []);

  const caleDragLineLeft = useCallback((_columnWidths: number[], columnIndex: number): number => {
    let caleColumnWidths = _columnWidths.slice(0, columnIndex + 1);
    return caleColumnWidths?.reduce(
      (total, currentValue, index) => (total += currentValue),
      DEFAULT_CELL_FIXED_LEFT_WIDTH,
    );
  }, []);

  const onResize = (index: number, { node, size, handle }: ResizeCallbackData) => {
    // 计算效率还可以再提高
    let cloneColumnWidths = [...columnWidths];
    cloneColumnWidths[index] = size.width;
    let _dataGridWidth = calcDataGridWidth(cloneColumnWidths);
    setDataGridWidth(_dataGridWidth);
    setColumnWidths(cloneColumnWidths);
    let dragLineLeft = caleDragLineLeft(cloneColumnWidths, index);
    onDragLine(dragLineLeft);
  };

  const onResizeStart = (index: number) => {
    let dragLineLeft = caleDragLineLeft(columnWidths, index);
    onDragLineStart(dragLineLeft);
  };

  const onResizeStop = () => {
    handleColumnWidth(columnWidths, dataGridWidth);
    onDragLineStop();
  };

  const handleSort = (column: string) => {
    sort(column);
  };

  const renderSortIcon = useCallback(
    (column: string) => {
      let sortCls;
      let upCls;
      let downCls;
      if (sortColumn && sortColumn.column === column) {
        const { orderBy } = sortColumn;
        sortCls = cls(styles['cell-sort-icon'], styles['sort-icon-show']);
        upCls = cls(styles['cell-sort-icon-up'], { [styles['on-sort']]: orderBy === 'desc' });
        downCls = cls(styles['cell-sort-icon-down'], { [styles['on-sort']]: orderBy === 'asc' });
      } else {
        sortCls = styles['cell-sort-icon'];
        upCls = styles['cell-sort-icon-up'];
        downCls = styles['cell-sort-icon-down'];
      }
      return (
        <div className={sortCls} onClick={() => handleSort(column)}>
          <span className={upCls}>
            <VscTriangleUp />
          </span>
          <span className={downCls}>
            <VscTriangleDown />
          </span>
        </div>
      );
    },
    [sortColumn],
  );

  return (
    <div className={cls(styles['data-grid-container'])} style={{ width: `${dataGridWidth}px` }}>
      <div className={cls(styles['row-data'])}>
        <div
          className={cls(
            styles.cell,
            styles['read-only'],
            styles['row-handle'],
            styles['cell-fixed-left'],
            styles['cell-title'],
          )}
          style={{ left: '0px' }}
        ></div>
        {columns.map(({ title, columnKey }, index) => (
          <Resizable
            key={`resize-${index}`}
            width={columnWidths[index]}
            height={0}
            onResize={(ev, data) => onResize(index, data)}
            onResizeStart={() => onResizeStart(index)}
            onResizeStop={() => onResizeStop()}
          >
            <div
              key={`${index}-${columnKey}`}
              style={{ width: `${columnWidths[index]}px` }}
              className={cls(styles.cell, styles['read-only'], styles['cell-title'])}
              title={title}
            >
              {title}
              {renderSortIcon(columnKey)}
            </div>
          </Resizable>
        ))}
      </div>
    </div>
  );
};
