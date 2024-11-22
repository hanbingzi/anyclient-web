import { IPageService } from './pageService';

export class EsPageService implements IPageService {
  buildSql(sql: string, page?: number | undefined, pageSize?: number | undefined): string {
    throw new Error('Method not implemented.');
  }
  buildTable(table: string, page?: number | undefined, pageSize?: number | undefined): string {
    throw new Error('Method not implemented.');
  }

  protected buildPageSql(sql: string, start: number, limit: number): string {
    // return EsRequest.build(sql, body => {
    //     body.from = start;
    //     body.size = limit;
    // })
    return '';
  }
}
