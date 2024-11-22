import { IPageService, PageUtils } from './pageService';

export class OraclePageService implements IPageService {
  buildSql(sql: string, page?: number, pageSize?: number): string {
    const { start, end } = PageUtils.buildPage(page, pageSize);

    return `SELECT *
            FROM (SELECT rownum AS rn, t.*
                  FROM (${sql}) t
                  WHERE rownum < ${end})
            WHERE rn >= ${start}`;
  }

  buildTable(table: string, page?: number, pageSize?: number): string {
    const { start, end, pageSize: count } = PageUtils.buildPage(page, pageSize);
    return `SELECT T.*,ROWID "CLIENT_BIZ_ROWID" FROM ${table} OFFSET ${start} ROWS FETCH NEXT ${count} ROWS ONLY`;
  }
}
