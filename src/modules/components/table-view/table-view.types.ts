import { CSSProperties, ReactNode } from 'react';
import { PaginationProps } from '../pagination/pagination.types';
import { FixedSizeGrid } from 'react-window';
import { WhereType } from '../../base/types/sql.types';
import { DataInputEnum } from '../../base/types/edit-input.types';
import { ISortColumn } from '../../components/table-editor';
import { IWhereParam } from '../../base/model/sql-param.model';

export interface IListColumn {
  //表格表头中文名或英文名
  title: string;
  //从data里面取数据的key
  columnKey: string;
  width?: number;
  dataType?: DataInputEnum; //'string' | 'number' | 'date' | 'time' | 'datetime' | 'year' | 'timestamp'
  //本列数据是否允许为空，默认YES
}

export interface ITableRow {
  [key: string | number]: any;
}

export interface IOptionView {
  location: 'start' | 'end' | 'afterSearch';
  view: ReactNode;
}

export interface TableViewProps {
  tableWidth: number;
  tableHeight: number;
  columns: IListColumn[];
  /**
   * 传入的数据类型
   * 数据[1,2,3]
   * 对象[{'a':1,'b':2},{'a':3,'b':3}]
   */
  dataType: 'Array' | 'Object';
  data: string[] | ITableRow[];

  style?: CSSProperties;
  cellStyle?: CSSProperties;
  //是否展示分页
  pagination?: false | PaginationProps;
  option?: boolean;
  optionArgs?: DataOptionBase;
  optionView?: IOptionView;
  isLoading?: boolean;
  /**
   * 点击表格，是否展示详情
   */
  showDetail?: boolean;
  /**
   * 详情预设高度，
   * 默认100的高度
   */
  detailHeight?: number;
  //删除的数据直接作用于后端，无法撤回
  onRefresh?: () => Promise<boolean>;
  onFilter?: (filterData: IWhereParam[]) => void;
  onFilterClose?: () => void;
  onFilterOpen?: () => void;
  onClick?: (cellData: any) => void;
  onRowClick?: (rowData: any) => void;

  //设置排序的列，如果传入undefined，就代表取消本列的排序
  sort?: (sortColumn: ISortColumn | undefined) => void;

  emptyTitle?: string;
}

export interface DataOptionBase {
  search?: boolean;
  refresh?: boolean;
  filter?: boolean;
  enableFilterSearch?: boolean;
}

export interface DataOptionProps extends DataOptionBase {
  optionView?: IOptionView;
  setSearchWord: (word: string) => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  onFilterSearch?: () => void;
}

export interface TableViewBodyProps {
  width: number;
  height: number;
  data: string[] | ITableRow[];
  //触发表格编辑模式
  dataGridWidth: number;
  rowCount: number;
  emptyTitle?: string;
  onClickDataOutSide: () => void;
  //onScroll?: ((props: GridOnScrollProps) => any) | undefined;
  onScroll: (scrollLeft: number) => void;
  bodyGridRef: React.RefObject<FixedSizeGrid>;
  renderRow: ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: CSSProperties }) => any;
}

export interface ICellBase {
  rowIndex: number; //循环标记使用
  columnIndex: number; //循环标记使用
  style?: React.CSSProperties;
  data?: string | number | undefined;
  width: number;
  isSelected?: boolean;

  isEditor?: boolean;
  searchWord?: string;
}

export interface CellProps extends ICellBase {
  // onClick?: (ev: React.MouseEvent, rowIndex: number, columnIndex: number) => void;
  onDoubleClick?: (ev: React.MouseEvent, rowIndex: number, columnIndex: number) => void;
  onClick?: (ev: React.MouseEvent, rowIndex: number, columnIndex: number) => void;
  onMouseDown?: (ev: React.MouseEvent, rowIndex: number, columnIndex: number) => void;
  onMouseOver?: (ev: React.MouseEvent, rowIndex: number, columnIndex: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  //当前编辑的数值，用于缓存提交
}

export interface CellDataProps {
  searchWord?: string;
  width: number;
  data?: string | number | undefined;
}

export interface IFilterValue {
  columnType?: DataInputEnum;
  filterValue?: string;
  filterType?: WhereType;
}
