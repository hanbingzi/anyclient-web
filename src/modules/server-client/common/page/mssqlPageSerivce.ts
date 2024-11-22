import { IPageService, PageUtils } from './pageService';

export class MssqlPageService implements IPageService {
  buildSql(sql: string, page?: number, pageSize?: number): string {
    const { start, end } = PageUtils.buildPage(page, pageSize);
    return `SELECT *
            FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum, *
                  FROM (${sql}) AS Data) AS PagedData
            WHERE RowNum > ${start}
              AND RowNum <= ${end}`;
  }

  buildTable(table: string, page?: number, pageSize?: number): string {
    const { start, end, pageSize: count } = PageUtils.buildPage(page, pageSize);
    return ``;
  }
}
