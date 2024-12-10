import { Injectable } from '@opensumi/di';
import { IQueryResult } from '../common';
import { AbstractDefaultClient } from './base-client';
import { IDMServiceClient } from '../common';

@Injectable()
export class DMServiceClient extends AbstractDefaultClient implements IDMServiceClient {
  public getErrorResult(error: any): IQueryResult {
    return {
      success: false,
      message: error.message ? error.message : error.stack ? error.stack : '',
      code: error.code ? error.code : 0,
    }; //sql: error.sql,
  }
}
