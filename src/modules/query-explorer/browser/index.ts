import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { QueryExplorerContribution } from './query-explorer.contribution';
import { IQuerySqlExplorerServiceToken, ISqlTableResultJdbcServiceToken, ISqlTableResultServiceToken } from '../common';
import { QuerySqlExplorerService } from './query-sql-explorer.service';
import { SqlTableResultService } from './table-result/sql-table-result.service';

@Injectable()
export class QueryExplorerModule extends BrowserModule {
  providers: Provider[] = [
    QueryExplorerContribution,
    {
      token: IQuerySqlExplorerServiceToken,
      useClass: QuerySqlExplorerService,
    },
    {
      token: ISqlTableResultServiceToken,
      useClass: SqlTableResultService,
    },
  ];
}
