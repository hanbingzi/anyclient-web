import { Injectable } from '@opensumi/di';
import { IQueryResult } from '../common';
import { AbstractDefaultClient } from './base-client';
import { IPostgresServiceClient } from '../common';

@Injectable()
export class PostgresServiceClient extends AbstractDefaultClient implements IPostgresServiceClient {

  public getErrorResult(error: any): IQueryResult {
    return {
      success: false,
      message: error?.message ? error?.message : '',
      code: error?.code ? error?.code : '',
    }; //sql: error.sql,
  }
}
