import { IBaseSqlService, IRunSqlResult, ISqlServiceClient } from '../index';
import { ConnectQuery } from '../../../local-store-db/common';
import { SimpleName } from './common.types';

export const IMssqlServiceToken = Symbol('IMssqlServiceToken');

export interface IMssqlService extends IBaseSqlService {
}

export const IMssqlClientServicePath = 'IMssqlClientServicePath';

export const IMssqlClientService = Symbol('IMssqlClientService');

export interface IMssqlServiceClient extends ISqlServiceClient {}




