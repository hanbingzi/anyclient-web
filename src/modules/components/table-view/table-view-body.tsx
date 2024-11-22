import React, { useCallback } from 'react';
import { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { TableViewBodyProps } from './table-view.types';
import { ClickOutside, Scrollbars, ScrollbarsVirtualList } from '@opensumi/ide-components';
import cls from 'classnames';
import styles from './table-view.module.less';
import { DEFAULT_CELL_FIXED_LEFT_WIDTH, DEFAULT_TABLE_REST_WIDTH } from './table-view';

//拷贝的opensumi，到时候恢复

export const TableViewBody = (props: TableViewBodyProps) => {
  const {
    width,
    height,
    dataGridWidth,
    rowCount,
    emptyTitle = '空数据',
    onClickDataOutSide,
    onScroll,
    bodyGridRef,
    renderRow,
  } = props;

  const InnerElementType = React.forwardRef((props, ref) => {
    const { style, ...rest } = props as any;
    return (
      <ClickOutside style={{ width: dataGridWidth + 'px' }} onOutsideClick={onClickDataOutSide}>
        <div
          ref={ref!}
          style={{
            ...style,
            height: `${parseFloat(style.height)}px`,
            width: dataGridWidth + 'px',
          }}
          {...rest}
          className={style['data-grid-container']}
        ></div>
      </ClickOutside>
    );
  });

  const handleEmptyScroll = useCallback(
    (ev: any) => {
      const { target } = ev;
      onScroll(target.scrollLeft);
    },
    [onScroll],
  );

  const handleFixedSizeGrid = useCallback(
    (props: GridOnScrollProps) => {
      onScroll(props.scrollLeft);
    },
    [onScroll],
  );

  if (rowCount === 0) {
    return (
      <Scrollbars style={{ width: width + 'px', height: height + 'px' }} onScroll={(ev) => handleEmptyScroll(ev)}>
        <div className={cls(styles['data-grid-container'])} style={{ width: `${dataGridWidth}px` }}>
          <div className={styles['row-data']} style={{ width: dataGridWidth - DEFAULT_TABLE_REST_WIDTH + 'px' }}>
            <div
              className={cls(styles.cell, styles['read-only'], styles['row-handle'], styles['cell-fixed-left'])}
              style={{ left: '0px' }}
            >
              1
            </div>
            <div
              className={styles['row-empty']}
              style={{ width: dataGridWidth - DEFAULT_TABLE_REST_WIDTH - DEFAULT_CELL_FIXED_LEFT_WIDTH + 'px' }}
            >
              {emptyTitle}
            </div>
          </div>
        </div>
      </Scrollbars>
    );
  }

  return (
    <FixedSizeGrid
      height={height} //需要展示的内容高度，
      width={width}
      columnCount={1}
      columnWidth={width}
      rowCount={rowCount}
      rowHeight={22}
      onScroll={handleFixedSizeGrid}
      outerElementType={ScrollbarsVirtualList}
      innerElementType={InnerElementType}
      ref={bodyGridRef}
    >
      {renderRow}
    </FixedSizeGrid>
  );
};
