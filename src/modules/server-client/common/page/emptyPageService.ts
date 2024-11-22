import { IPageService, PageUtils } from './pageService';

export class EmptyPageService implements IPageService {
  buildSql(sql: string, page?: number | undefined, pageSize?: number | undefined): string {
    const { start, pageSize: limit } = PageUtils.buildPage(page, pageSize);
   return sql;
  }

  buildTable(table: string, page?: number | undefined, pageSize?: number | undefined): string {
    return table;
  }
}
