import { IBaseSqlService, IBaseServiceClient, ISqlServiceClient, IRunSqlResult } from './../index';
import { ConnectQuery } from '../../../local-store-db/common';
import { IDbDetail, SimpleName } from './common.types';

export const IPostgresServiceToken = Symbol('IPostgresServiceToken');

export interface IPostgresDbDetail extends IDbDetail {
  olddatabase?: string;
  oldschema?: string;
  database?: string;
  comment?: string;
  owner?: string;
  encoding?: string;
  datctype?: string;
  template?: string;
  tablespace?: string;
  collate?: string;
  connlimit?: number;
  istemplate?: boolean;
}

export interface IPostgresRole {
  rolname?: string;
}

export interface IPostgresService extends IBaseSqlService {

  showRoles(connect: ConnectQuery): Promise<IRunSqlResult<IPostgresRole[]>>;

  showTablespace(connect: ConnectQuery): Promise<IRunSqlResult<SimpleName[]>>;

  showTemplate(connect: ConnectQuery): Promise<IRunSqlResult<SimpleName[]>>;
}

export const IPostgresClientServicePath = 'IPostgresClientServicePath';

export const IPostgresClientService = Symbol('IPostgresClientService');

export interface IPostgresServiceClient extends ISqlServiceClient {}

export type PostgresEncoding =
  | 'UTF8'
  | 'GBK'
  | 'BIG5'
  | 'EUC_CN'
  | 'EUC_JP'
  | 'EUC_JIS_2004'
  | 'EUC_KR'
  | 'EUC_TW'
  | 'GB18030'
  | 'ISO_8859_5'
  | 'ISO_8859_6'
  | 'ISO_8859_7'
  | 'ISO_8859_8'
  | 'JOHAB'
  | 'KOI8R'
  | 'KOI8U'
  | 'LATIN1'
  | 'LATIN2'
  | 'LATIN3'
  | 'LATIN4'
  | 'LATIN5'
  | 'LATIN6'
  | 'LATIN7'
  | 'LATIN8'
  | 'LATIN9'
  | 'LATIN10'
  | 'MULE_INTERNAL'
  | 'SJIS'
  | 'SHIFT_JIS_2004'
  | 'SQL_ASCII'
  | 'UHC'
  | 'WIN866'
  | 'WIN874'
  | 'WIN1250'
  | 'WIN1251'
  | 'WIN1252'
  | 'WIN1253'
  | 'WIN1254'
  | 'WIN1255'
  | 'WIN1256'
  | 'WIN1257'
  | 'WIN1258';
export type PostgresCharset = 'en_US.utf8' | 'POSIX' | 'C';

export const PostgresEncodingArray: PostgresEncoding[] = [
  'UTF8',
  'GBK',
  'BIG5',
  'EUC_CN',
  'EUC_JP',
  'EUC_JIS_2004',
  'EUC_KR',
  'EUC_TW',
  'GB18030',
  'ISO_8859_5',
  'ISO_8859_6',
  'ISO_8859_7',
  'ISO_8859_8',
  'JOHAB',
  'KOI8R',
  'KOI8U',
  'LATIN1',
  'LATIN2',
  'LATIN3',
  'LATIN4',
  'LATIN5',
  'LATIN6',
  'LATIN7',
  'LATIN8',
  'LATIN9',
  'LATIN10',
  'MULE_INTERNAL',
  'SJIS',
  'SHIFT_JIS_2004',
  'SQL_ASCII',
  'UHC',
  'WIN866',
  'WIN874',
  'WIN1250',
  'WIN1251',
  'WIN1252',
  'WIN1253',
  'WIN1254',
  'WIN1255',
  'WIN1256',
  'WIN1257',
  'WIN1258',
];
export const PostgresCharsetArray: PostgresCharset[] = ['en_US.utf8', 'POSIX', 'C'];
