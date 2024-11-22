export interface IPage {
  //当前页码
  page?: number;

  //当前页多少条
  pageCount?: number;

  //总共多少条
  total?: number;

  //每页默认多少条
  pageSize?: number;
}

export interface PaginationProps extends IPage {
  pageSizeOptions?: number[];
  //显示3页条目还是显示5页条目
  showLessItems?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}
