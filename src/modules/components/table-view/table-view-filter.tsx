import cls from 'classnames';
import styles from './table-view.module.less';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IFilterValue, IListColumn } from './table-view.types';
import { Icon, Select } from '@opensumi/ide-core-browser/lib/components';
import { WhereType } from '../../base/types/sql.types';
import { DataInputEnum } from '../../base/types/edit-input.types';

export interface TableFilterProps {
  columns: IListColumn[];
  filter: Map<string, IFilterValue>;
  setFilter: (filter: Map<string, IFilterValue>) => void;
  dataGridWidth: number;
  columnWidths: number[];
}

export const TableViewFilter = (props: TableFilterProps) => {
  const { columns, dataGridWidth, filter, setFilter, columnWidths } = props;

  //const [filter, setFilter] = useState<Map<string, FilterParam>>(new Map());

  const getFilterType = useCallback(
    (columnKey: string) => {
      const filterType = filter.get(columnKey)?.filterType;
      return filterType ? filterType : '=';
    },
    [filter],
  );

  const getFilterValue = useCallback(
    (columnKey: string) => {
      const filterValue = filter.get(columnKey)?.filterValue;
      return filterValue ? filterValue : '';
    },
    [filter],
  );

  const handleSelect = useCallback(
    (columnKey: string, filterType: WhereType, columnType?: DataInputEnum) => {
      if (filter.has(columnKey)) {
        let filterObj = filter.get(columnKey)!;
        filterObj.filterType = filterType;
        filterObj.columnType = columnType;
      } else {
        filter.set(columnKey, { filterType, columnType });
      }
      setFilter(filter);
    },
    [filter],
  );

  const handleInput = useCallback(
    (columnKey: string, filterValue: string, columnType?: DataInputEnum) => {
      if (filter.has(columnKey)) {
        let filterObj = filter.get(columnKey)!;
        filterObj.filterValue = filterValue;
        filterObj.columnType = columnType;
      } else {
        filter.set(columnKey, { filterValue, columnType });
      }
      setFilter(filter);
    },
    [filter],
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
        >
          <Icon disabled={false} icon={'filter'} className={cls('kt-clickable-icon')} />
        </div>
        {columns.map(({ title, columnKey, dataType }, index) => (
          <div
            key={`${index}-${columnKey}`}
            style={{ width: `${columnWidths[index]}px` }}
            className={cls(styles['cell'], styles['cell-div'], styles['cell-filter'])}
          >
            <Select
              options={['=', 'like', '>', '<', 'in', '<>', 'isNull', 'isEmpty']}
              //options={WhereType}
              showSearch={false}
              value={getFilterType(columnKey)}
              size={'small'}
              style={{ width: '64px', backgroundColor: 'unset' }}
              className={styles['filter-select']}
              onChange={(value) => {
                handleSelect(columnKey, value, dataType);
              }}
              optionStyle={{ paddingLeft: '2px', paddingRight: '2px', textAlign: 'center' }}
            ></Select>

            <input
              className={styles['filter-editor']}
              name={columnKey}
              value={getFilterValue(columnKey)}
              onChange={(event) => {
                handleInput(columnKey, event.target.value, dataType);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
