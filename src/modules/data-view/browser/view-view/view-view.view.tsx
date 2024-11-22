import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DataOptionBase, ITableColumn, ITableRow, TableEditor } from '../../../components/table-editor';
import { IPage } from '../../../components/pagination';
import { DisposableCollection, useInjectable } from '@opensumi/ide-core-browser';
import { ViewViewService } from './view-view.service';
import { ProgressBar } from '@opensumi/ide-core-browser/lib/components/progressbar';
import { IBaseState } from '../../common/data-browser.types';
import { IWhereParam } from '../../../base/model/sql-param.model';

/**
 * table view 展示
 * @param props
 * @constructor
 */
export const ViewViewView = (props: IBaseState) => {
  const { viewState } = props;
  const { width, height } = viewState;

  const [option, setOption] = useState<DataOptionBase>();
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [tableColumn, setTableColumn] = useState<ITableColumn[]>([]);
  const [page, setPage] = useState<IPage>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const viewViewService = useInjectable<ViewViewService>(ViewViewService);
  const disposableRef: RefObject<DisposableCollection> = useRef(new DisposableCollection());

  useEffect(() => {
    viewViewService.init(props);
    ensureIsReady();
  }, []);

  const ensureIsReady = useCallback(async () => {
    await viewViewService.whenReady;
    setIsLoading(false);
  }, [viewViewService]);

  useEffect(() => {
    disposableRef.current?.push(
      viewViewService.onOptionChange((option) => {
        setOption(option);
      }),
    );
    disposableRef.current?.push(
      viewViewService.onTableDataChange((data) => {
        setTableData(data);
      }),
    );
    disposableRef.current?.push(
      viewViewService.onTableColumnChange((column) => {
        setTableColumn(column);
      }),
    );
    disposableRef.current?.push(
      viewViewService.onPageChange((page) => {
        setPage(page);
      }),
    );
    disposableRef.current?.push(
      viewViewService.onDataLoadingChange((loading) => {
        setDataLoading(loading);
      }),
    );
    return () => {
      disposableRef.current?.dispose();
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setDataLoading(true);
    return await viewViewService.refresh();
  }, [viewViewService]);

  const onPageChange = useCallback(
    async (page: number, pageSize: number) => {
      setDataLoading(true);
      await viewViewService.loadDataByPage(page, pageSize);
    },
    [page, viewViewService],
  );

  const handleFilter = useCallback(
    async (filters: IWhereParam[]) => {
      await viewViewService.filter(filters);
    },
    [viewViewService],
  );

  const handleFilterClose = useCallback(() => {
    viewViewService.setFilterSetting(false);
  }, [viewViewService]);

  const handleFilterOpen = useCallback(() => {
    viewViewService.setFilterSetting(true);
  }, [viewViewService]);

  return (
    <div>
      {isLoading ? (
        <ProgressBar loading />
      ) : (
        <TableEditor
          columns={tableColumn}
          data={tableData}
          tableHeight={height}
          tableWidth={width - 5}
          showTitleTypeIcon={true}
          isLoading={dataLoading}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
          onFilterClose={handleFilterClose}
          onFilterOpen={handleFilterOpen}
          pagination={{ ...page, onChange: onPageChange }}
          option={true}
          optionArgs={option}
          immediateRemove={false}
        />
      )}
    </div>
  );
};
