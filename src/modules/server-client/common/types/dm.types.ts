import { IBaseSqlService, ISqlServiceClient } from '../index';

export const IDMServiceToken = Symbol('IDMServiceToken');


export interface IDMService extends IBaseSqlService {}

export const IDMClientServicePath = 'IDMClientServicePath';

export const IDMClientService = Symbol('IDMClientService');

export interface IDMServiceClient extends ISqlServiceClient {}
