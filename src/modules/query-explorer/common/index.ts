import { ServerInfo } from '../../local-store-db/common';
import { IRunSqlResult } from '../../server-client/common';

export const IQuerySqlExplorerServiceToken = Symbol('QuerySqlExplorerServiceToken');

export const ISqlTableResultServiceToken = Symbol('SqlTableResultServiceToken');

export const ISqlTableResultJdbcServiceToken = Symbol('SqlTableResultJdbcServiceToken');

export interface ResultExplorerProps {
  isShow: boolean;
  width: number;
  height: number;
  serverInfo: ServerInfo;

  dbValue?: string;
  schemaName?: string;

  runResult: IRunSqlResult;
}
