import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IConnectInfo } from '../../common';
import { ServerType } from '../../../base/types/server-node.types';

export class EmptyDialect extends AbstractDefaultSqlDialect {
  getFullName(connectInfo: IConnectInfo, table: string): string {
    return table;
  }

  getServerType(): ServerType {
    return 'CommonSql';
  }


}
