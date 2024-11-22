import { Autowired, Injectable } from '@opensumi/di';
import { IDialogService } from '@opensumi/ide-overlay';
import {
  IQueryResult,
  IRedisKeyPathInfo,
  IRedisService,
  IRedisServiceToken,
  QueryResultError,
} from '../../../../server-client/common';
import { IServerTreeNode, ServerTreeNodeUtils } from '../../../../base/model/server-tree-node.model';
import { ServerNodeConfig } from '../../../../base/config/server-node.config';
import { ServerInfo } from '../../../../local-store-db/common';
import { IChildrenResult } from '../server-tree-api.service';

@Injectable()
export class RedisTreeApiService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  @Autowired(IRedisServiceToken)
  private redisService: IRedisService;

  /**
   * 加载子菜单
   * @param server
   * @param parentNode
   * @param pattern
   */
  public async resolveRedisChildren(
    server: ServerInfo,
    parentNode: IServerTreeNode,
    pattern: string,
  ): Promise<IChildrenResult> {
    const { nodeType } = parentNode;
    let result: IQueryResult = QueryResultError.UNREALIZED_ERROR;
    let tree = [];
    switch (nodeType) {
      case 'server':
        result = await this.redisService.showDatabases({ server });
        if (result.success) {
          tree = result!.data!.map((item) =>
            ServerTreeNodeUtils.convertNode(
              item.displayName,
              item.name,
              item.name,
              'Redis',
              'node',
              'redisDb',
              'init',
              item.db,
              '',
              '',
              item.db,
            ),
          );
          return { success: true, tree };
        }
        break;
      case 'redisDb':
        const keys = await this.redisService.showDatabaseSubKey({ server, db: parentNode.db as number }, pattern);
        //此处key加载的不好，最好是同事能加载多级，有空研究下别人是怎么加载的
        let treeNodes: IServerTreeNode[] = [];
        if (keys) {
          this.processKey(keys, treeNodes, parentNode.db as number);
        }
        return { success: true, tree: treeNodes };
      //break;
      case 'redisFolder':
        const folderKeys = await this.redisService.showFolderSubKey(
          {
            server,
            db: parentNode.db as number,
          },
          parentNode.nodeValue as string,
        );
        let treeNodes1: IServerTreeNode[] = [];
        if (folderKeys) {
          this.processKey(folderKeys, treeNodes1, parentNode.db as number);
        }
        return { success: true, tree: treeNodes1 };
    }
    return { success: false, result, tree: [] };
  }

  processKey(keyMap: Map<string, IRedisKeyPathInfo>, treeNodes: IServerTreeNode[], db: number) {
    for (let [key, val] of keyMap) {
      const { name, type, count, isKey, fullPath, child } = val;
      let keyName = isKey ? name : `${name} (${count})`;
      let treeNodeChild: IServerTreeNode[] = [];
      if (!isKey && child && child.size > 0) {
        this.processKey(child, treeNodeChild, db);
      }
      const nodeType = isKey ? ServerNodeConfig.convertRedisType(type) : 'redisFolder';
      let keyNode = ServerTreeNodeUtils.convertNode(
        keyName,
        key,
        key,
        'Redis',
        isKey ? 'entity' : 'node',
        nodeType,
        'success',
        db,
        '',
        '',
        fullPath,
      );
      if (treeNodeChild.length > 0) {
        keyNode.children = treeNodeChild;
      }
      treeNodes.push(keyNode);
    }
  }
}
