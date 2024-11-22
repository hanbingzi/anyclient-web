import { CSSProperties } from 'react';
import { PaginationProps } from '../pagination/pagination.types';
import { FixedSizeGrid } from 'react-window';
import { WhereType } from '../../base/types/sql.types';
import { IWhereParam } from '../../base/model/sql-param.model';

export interface ITableRow {
  [key: string | number]: any;
}

export interface ListViewProps {
  tableWidth: number;
  dataWidth?: number;
  tableHeight: number;
  //columns: IListColumn[];
  columnKey?: string;
  dataType: 'Array' | 'Object';
  data: string[] | ITableRow[];

  style?: CSSProperties;
  //是否展示分页
  pagination?: false | PaginationProps;
  option?: boolean;
  optionArgs?: DataOptionBase;
  isLoading?: boolean;
  //删除的数据直接作用于后端，无法撤回
  onRefresh?: () => Promise<boolean>;
  onFilter?: (filterData: IWhereParam) => void;
  onFilterClose?: () => void;
  onFilterOpen?: () => void;
}

export interface DataOptionBase {
  search?: boolean;
  refresh?: boolean;
  filter?: boolean;
  enableFilterSearch?: boolean;
}

export interface DataOptionProps extends DataOptionBase {
  setSearchWord: (word: string) => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  onFilterSearch?: () => void;
}

export interface ListViewBodyProps {
  width: number;
  height: number;
  data: string[] | ITableRow[];
  //触发表格编辑模式
  dataGridWidth: number;
  rowCount: number;
  onClickDataOutSide: () => void;
  //onScroll?: ((props: GridOnScrollProps) => any) | undefined;
  // onScroll: (scrollLeft: number) => void;
  bodyGridRef: React.RefObject<FixedSizeGrid>;
  renderRow: ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: CSSProperties }) => any;
}

export interface RowProps {
  rowIndex: number; //循环标记使用
  data?: string | number | undefined;
  width: number;
  searchWord?: string;
}

export interface IFilterValue {
  filterValue?: string;
  filterType?: WhereType;
}
