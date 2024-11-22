import { Autowired, Injectable } from '@opensumi/di';
import { ServerInfo } from '../../../../local-store-db/common';
import { IServerTreeNode, ServerTreeNodeUtils } from '../../../../base/model/server-tree-node.model';
import { IZookeeperService, IZookeeperServiceToken } from '../../../../server-client/common';
import { IDialogService } from '@opensumi/ide-overlay';
import { IChildrenResult } from '../server-tree-api.service';

@Injectable()
export class ZookeeperTreeApiService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  @Autowired(IZookeeperServiceToken)
  private zookeeperService: IZookeeperService;

  public async resolveZookeeperChildren(server: ServerInfo, parentNode: IServerTreeNode): Promise<IChildrenResult> {
    const { nodeType } = parentNode;
    let parentPath = '/';
    switch (nodeType) {
      case 'server':
        parentPath = '/';
        break;
      case 'zkNode':
        parentPath = parentNode.nodeValue as string;
        break;
    }
    //console.log('zookeeper-resolveZookeeperChildren:parentPath:', parentPath)
    const dbResult = await this.zookeeperService.listChildren({ server }, parentPath);
    //console.log('zookeeper-resolveZookeeperChildren:', dbResult)
    let tree = [];
    if (dbResult && dbResult.success) {
      let parentValue = parentPath === '/' ? '' : parentPath;
      tree = dbResult!.data!.map((item) =>
        ServerTreeNodeUtils.convertNode(
          item.name!,
          item.name!,
          item.name!,
          'Zookeeper',
          'node',
          'zkNode',
          'success',
          '',
          '',
          '',
          `${parentValue}/${item.name!}`,
          '',
          item.stat!.dataLength,
          true,
        ),
      );
    }
    return { success: dbResult.success, result: dbResult, tree };
  }
}
