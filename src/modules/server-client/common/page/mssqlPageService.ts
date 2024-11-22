import { IPageService, PageUtils } from './pageService';

export class MssqlPageService implements IPageService {
  buildSql(sql: string, page?: number | undefined, pageSize?: number | undefined): string {
    throw new Error('Method not implemented.');
  }
  buildTable(table: string, page?: number | undefined, pageSize?: number | undefined): string {
    throw new Error('Method not implemented.');
  }
}
