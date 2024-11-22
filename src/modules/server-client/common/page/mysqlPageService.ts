import { IPageService, PageUtils } from './pageService';

export class MysqlPageService implements IPageService {
  buildSql(sql: string, page?: number | undefined, pageSize?: number | undefined): string {
    const { start, pageSize: limit } = PageUtils.buildPage(page, pageSize);
    const paginationSql = `LIMIT ${start},${limit}`;
    if (sql.match(/\blimit\b/i)) {
      return sql.replace(/\blimit\b.+/gi, paginationSql);
    }

    return `${sql} ${paginationSql}`;
  }
  buildTable(table: string, page?: number, pageSize?: number): string {
    const { start, pageSize: limit } = PageUtils.buildPage(page, pageSize);
    return `SELECT * FROM ${table} LIMIT ${start},${limit}`;
  }
}
