import { Autowired, Injectable } from '@opensumi/di';
import { IPostgresRole, IRunSqlResult, ISqlServiceClient, SimpleName } from '../../common';
import { ConnectQuery } from '../../../local-store-db/common';
import { AbstractSqlService } from './abstract-sql-service';
import { IPostgresClientServicePath, IPostgresService, IPostgresServiceClient } from '../../common';
import { PostgresDialect } from '../../common/dialet/postgres-dialect';

@Injectable()
export class PostgresService extends AbstractSqlService implements IPostgresService {
  private postgresDialect = new PostgresDialect();

  @Autowired(IPostgresClientServicePath)
  private postgresServiceClient: IPostgresServiceClient;

  public getClientService(): ISqlServiceClient {
    return this.postgresServiceClient;
  }

  async showRoles(connect: ConnectQuery): Promise<IRunSqlResult<IPostgresRole[]>> {
    const queryResult = await this.getClientService().runSql(connect, this.postgresDialect.showRoles());
    return queryResult;
  }

  async showTablespace(connect: ConnectQuery): Promise<IRunSqlResult<SimpleName[]>> {
    const queryResult = await this.getClientService().runSql(connect, this.postgresDialect.showTablespace());
    return queryResult;
  }

  async showTemplate(connect: ConnectQuery): Promise<IRunSqlResult<SimpleName[]>> {
    const queryResult = await this.getClientService().runSql(connect, this.postgresDialect.showTemplate());
    return queryResult;
  }
}
