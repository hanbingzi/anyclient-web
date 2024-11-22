import { IBaseSqlService, ISqlServiceClient } from '../index';
import { IDbDetail } from './common.types';

export const IOracleServiceToken = Symbol('IOracleServiceToken');

export interface IOracleDbDetail extends IDbDetail {
  collate?: string;
}

export interface IOracleService extends IBaseSqlService {}

export const IOracleClientServicePath = 'IOracleClientServicePath';

export const IOracleClientService = Symbol('IOracleClientService');

export interface IOracleServiceClient extends ISqlServiceClient {}
