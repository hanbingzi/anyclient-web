import { Injectable } from '@opensumi/di';
import { IOracleServiceClient, IQueryResult } from '../common';
import { AbstractDefaultClient } from './base-client';

@Injectable()
export class OracleServiceClient extends AbstractDefaultClient implements IOracleServiceClient {
  public getErrorResult(error: any): IQueryResult {
    return {
      success: false,
      message: error.message ? error.message : error.stack ? error.stack : '',
      code: error.code ? error.code : 0,
    }; //sql: error.sql,
  }
}
