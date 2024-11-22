import cls from 'classnames';
import styles from './list-view.module.less';
import React, { useCallback } from 'react';
import { IFilterValue } from './list-view.types';
import { Select } from '@opensumi/ide-core-browser/lib/components';
import { WhereType } from '../../base/types/sql.types';

export interface TableFilterProps {
  columnKey?: string;
  filter: IFilterValue;
  dataGridWidth: number;
  setFilter: (filter: IFilterValue) => void;
}

export const ListFilter = (props: TableFilterProps) => {
  const { columnKey, dataGridWidth, filter, setFilter } = props;

  const getFilterType = useCallback(() => {
    const filterType = filter?.filterType;
    return filterType ? filterType : '=';
  }, [filter]);

  const getFilterValue = useCallback(() => {
    const filterValue = filter?.filterValue;
    return filterValue ? filterValue : '';
  }, [filter]);

  const handleSelect = useCallback(
    (filterType: WhereType) => {
      setFilter({ ...filter, filterType });
    },
    [filter],
  );

  const handleInput = useCallback(
    (filterValue: string) => {
      setFilter({ ...filter, filterValue });
    },
    [filter],
  );

  return (
    <div className={cls(styles['data-grid-container'])} style={{ width: `${dataGridWidth}px` }}>
      <div className={cls(styles['row'])}>
        <Select
          options={['=', 'like', '>', '<', 'in', '<>', 'isNull', 'isEmpty']}
          //options={WhereType}
          showSearch={false}
          value={getFilterType()}
          size={'small'}
          style={{ width: '64px', backgroundColor: 'unset' }}
          className={styles['filter-select']}
          onChange={(value) => {
            handleSelect(value);
          }}
          optionStyle={{ paddingLeft: '2px', paddingRight: '2px', textAlign: 'center' }}
        ></Select>

        <input
          className={styles['filter-editor']}
          name={columnKey}
          value={getFilterValue()}
          onChange={(event) => {
            handleInput(event.target.value);
          }}
        />
      </div>
    </div>
  );
};
