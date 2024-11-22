import {
  CreateColumnParam,
  CreateIndexParam,
  CreateTableParam,
  UpdateColumnParam,
  UpdateTableParam,
} from '../types/sql-param.types';
import { AbstractDefaultSqlDialect } from './abstract-default-sql-dialect';
import { IColumnMeta, IConnectInfo, IPostgresDbDetail, IPrimaryMeta, ITableMeta } from '../../common';
import { IPageService } from '../page/pageService';
import { PostgresPageService } from '../page/postgrePageService';
import { ServerType } from '../../../base/types/server-node.types';

export class TDEngineDialect extends AbstractDefaultSqlDialect {

  getServerType(): ServerType {
    return 'TDEngine';
  }


  public getFullName(connectInfo: IConnectInfo, name: string): string {
    return `${connectInfo.db}.${name}`;
  }

  /*--------------------切换database，schema，-------------*/

  public useDataBase(database: string | number): string {
    return `USE ${database}`;
  }



  /*--------------------show-------------*/










}
