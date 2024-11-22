import { Autowired, Injectable } from '@opensumi/di';
import { ServerInfo } from '../../../../local-store-db/common';
import { IServerTreeNode, ServerTreeNodeUtils } from '../../../../base/model/server-tree-node.model';
import { FullImplSql, ServerHasSchema } from '../../../../base/config/server.config';
import { IRunSqlResult, ISqlServerApiToken, ITableMeta, IVFTSPInfo } from '../../../../server-client/common';
import { SqlServerApiService } from '../../../../server-client/browser/sql-server-api.service';
import { ServerPreferences } from '../../../../base/config/server-info.config';
import { AllNodeType, ServerType } from '../../../../base/types/server-node.types';
import { ServerNodeConfig } from '../../../../base/config/server-node.config';
import { IDialogService } from '@opensumi/ide-overlay';
import { IChildrenResult } from '../server-tree-api.service';

@Injectable()
export class SqlTreeApiService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  @Autowired(ISqlServerApiToken)
  private sqlServerApiService: SqlServerApiService;

  async resolveSqlChildren(server: ServerInfo, parentNode: IServerTreeNode): Promise<IChildrenResult> {
    const { serverType } = server;
    const { nodeType } = parentNode;
    const isBasicSqlNode = !FullImplSql.includes(serverType);
    let result: IRunSqlResult | undefined;
    let tree = [];
    switch (nodeType) {
      case 'server':
        return await this.showSqlServerSubItem(server, isBasicSqlNode);
      case 'db':
      case 'orclDb':
      case 'basicDb':
        return await this.showSqlDatabaseSubItem(server, parentNode.db as string, isBasicSqlNode);
      case 'schema':
      case 'basicSchema':
        tree = this.showSqlModelItem(
          parentNode.serverType!,
          parentNode.db as string,
          parentNode.nodeName,
          isBasicSqlNode,
        );
        return { success: true, tree };

      case 'tables':
      case 'basicTables':
        result = await this.sqlServerApiService.showTables({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as ITableMeta[]).map((info) =>
            ServerTreeNodeUtils.convertNode(
              info.name,
              info.name,
              info.comment,
              server.serverType!,
              'entity',
              isBasicSqlNode ? 'basicTable' : 'table',
              'success',
              parentNode.db,
              parentNode.schema,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'views':
      case 'basicViews':
        result = await this.sqlServerApiService.showViews({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as IVFTSPInfo[]).map((item) =>
            ServerTreeNodeUtils.convertNode(
              item.name,
              item.name,
              item.comment,
              server.serverType!,
              'entity',
              isBasicSqlNode ? 'basicView' : 'view',
              'success',
              parentNode.db,
              parentNode.schema,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'functions':
      case 'basicFunctions':
        result = await this.sqlServerApiService.showFunctions({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as IVFTSPInfo[]).map((item) =>
            ServerTreeNodeUtils.convertNode(
              item.name,
              item.name,
              item.comment,
              server.serverType!,
              'entity',
              isBasicSqlNode ? 'basicFunction' : 'function',
              'success',
              parentNode.db,
              parentNode.schema,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'sequences':
        result = await this.sqlServerApiService.showSequences({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as IVFTSPInfo[]).map((item) =>
            ServerTreeNodeUtils.convertNode(
              item.name,
              item.name,
              item.comment,
              server.serverType!,
              'entity',
              'sequence',
              'success',
              parentNode.db,
              parentNode.schema,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'procedures':
      case 'basicProcedures':
        result = await this.sqlServerApiService.showProcedures({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as IVFTSPInfo[]).map((item) =>
            ServerTreeNodeUtils.convertNode(
              item.name,
              item.name,
              item.comment,
              server.serverType!,
              'entity',
              isBasicSqlNode ? 'basicProcedure' : 'procedure',
              'success',
              parentNode.db,
              parentNode.schema,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'triggers':
        result = await this.sqlServerApiService.showTriggers({
          server,
          db: parentNode.db as string,
          schema: parentNode.schema,
        });
        if (result.success) {
          tree = (result.data as IVFTSPInfo[]).map((item) => {
            let name = item.name;
            let tableName = item.tableName;
            return ServerTreeNodeUtils.convertNode(
              name,
              name,
              item.comment,
              server.serverType!,
              'entity',
              'trigger',
              'success',
              parentNode.db,
              parentNode.schema,
              tableName,
            );
          });
          return { success: true, tree };
        }
        break;
    }
    return { success: result.success, result, tree };
  }

  /**
   *  部分服务下没有database，直接是schema
   * @param server
   * @param isBasicSqlNode
   */
  async showSqlServerSubItem(server: ServerInfo, isBasicSqlNode: boolean): Promise<IChildrenResult> {
    const { serverType } = server;
    const serverSetting = ServerPreferences[serverType];
    let result: IRunSqlResult | undefined;
    if (serverSetting.hasDatabaseNode) {
      const childNodeType: AllNodeType = isBasicSqlNode ? 'basicDb' : serverType === 'Oracle' ? 'orclDb' : 'db';
      result = await this.sqlServerApiService.showDatabases({ server });
      if (result.success) {
        const databases = result.data;
        let treeNodes = databases.map((nodeName) => {
          return ServerTreeNodeUtils.convertNode(
            nodeName,
            nodeName,
            nodeName,
            server.serverType!,
            'node',
            childNodeType,
            'init',
            nodeName,
          );
        });
        //console.log('treeNodes', treeNodes);
        return { success: true, tree: treeNodes };
      }
    } else if (serverSetting.hasSchemaNode) {
      result = await this.sqlServerApiService.showSchemas({ server: server });
      if (result.success) {
        let treeNodes = result.data.map((nodeName) => {
          return ServerTreeNodeUtils.convertNode(
            nodeName,
            nodeName,
            nodeName,
            server.serverType!,
            'node',
            isBasicSqlNode ? 'basicSchema' : 'schema',
            'init',
            '',
            nodeName,
          );
        });
        return { success: true, tree: treeNodes };
      }
    }

    return { success: result.success, result, tree: [] };
  }

  async showSqlDatabaseSubItem(
    serverInfo: ServerInfo,
    dbName: string,
    isBasicSqlNode: boolean,
  ): Promise<IChildrenResult> {
    //console.log('showSqlDatabaseSubItem---->', serverInfo, dbName)
    const serverType = serverInfo.serverType;
    let result: IRunSqlResult | undefined;
    if (ServerHasSchema.includes(serverType)) {
      result = await this.sqlServerApiService.showSchemas({ server: serverInfo, db: dbName });
      if (result.success) {
        let treeNodes = result.data.map((nodeName) => {
          return ServerTreeNodeUtils.convertNode(
            nodeName,
            nodeName,
            nodeName,
            serverInfo.serverType!,
            'node',
            isBasicSqlNode ? 'basicSchema' : 'schema',
            'success',
            dbName,
          );
        });
        return { success: true, tree: treeNodes };
      }
    } else {
      const tree = this.showSqlModelItem(serverType, dbName, '', isBasicSqlNode);
      return { success: true, tree };
    }
    return { success: result.success, result, tree: [] };
  }

  showSqlModelItem(
    server: ServerType,
    dbName: string,
    schema: string = '',
    isBasicSqlNode: boolean,
  ): IServerTreeNode[] {
    //postgre,mysql,sqlite,应该是一样的，oracle，mssql应该各不相同
    const config = ServerPreferences[server];
    const treeNodes: IServerTreeNode[] = [
      ServerNodeConfig.tablesNode(server, dbName, schema, 10, isBasicSqlNode),
      ServerNodeConfig.viewsNode(server, dbName, schema, 9, isBasicSqlNode),
    ];
    if (config.hasFunctionNode) {
      treeNodes.push(ServerNodeConfig.functionsNode(server, dbName, schema, 7, isBasicSqlNode));
    }
    if (config.hasProcedureNode) {
      treeNodes.push(ServerNodeConfig.proceduresNode(server, dbName, schema, 6, isBasicSqlNode));
    }
    if (config.hasSequenceNode) {
      treeNodes.push(ServerNodeConfig.sequencesNode(server, dbName, schema, 5, isBasicSqlNode));
    }
    if (config.hasTriggerNode) {
      treeNodes.push(ServerNodeConfig.triggersNode(server, dbName, schema, 4, isBasicSqlNode));
    }
    return treeNodes;
  }

  // showbasicSqlModelItem(server: ServerType, dbName: string, schema: string = ''): IServerTreeNode[] {
  //   const treeNodes: IServerTreeNode[] = [
  //
  //     ServerNodeConfig.functionsNode(server, dbName, schema, 7, true),
  //     ServerNodeConfig.proceduresNode(server, dbName, schema, 6, true),
  //   ];
  //   return treeNodes;
  // }
}
