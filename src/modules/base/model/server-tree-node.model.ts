import { AllNodeType, ServerType } from '../types/server-node.types';

//此处循环依赖，应该改掉
import { OpenRecentInfo, ServerCluster, ServerInfo } from '../../local-store-db/common/model.define';

export type LevelType = 'root' | 'group' | 'server' | 'node' | 'entity'; //分组，根，节点，实体 ,文件夹，文件

export type NodeStat = 'init' | 'loading' | 'error' | 'success'; //init最初状态，loading加载中 3.success加载成功 4.error加载失败

export interface IServerTreeNode {
  /**
   * 展示字段，displayName
   * redis例子：
   * dispalyName:db1(10) , nodeName:db1 ,nodeValue:1，
   * 不做特殊说明外，nodeName基本都等于nodeValue
   */
  displayName: string;
  /**
   *
   */
  nodeName: string;
  /**
   * 实际值
   */
  nodeValue?: string | number;

  db?: string | number;
  /**
   * postgre中称为模式
   * oracle中
   */
  schema?: string;

  table?:string;
  /**
   * 提示信息
   */
  tooltip?: string;
  /**
   * 图标
   */
  //headIcon?: ReactNode;

  key?: string;

  icon?: string;

  sort?: number;

  serverType?: ServerType; //服务类型

  levelType?: LevelType;

  nodeStat?: NodeStat;

  /**
   * 节点类型
   */
  nodeType?: AllNodeType;
  /**
   * 主键
   */
  primaryId?: string;

  openRecentId?: string;

  /**
   *
   * tree使用中的基本信息
   */
  serverInfo?: ServerInfo;

  cluster?: ServerCluster[];

  iconClassName?: string;
  /**
   * 描述
   */
  description?: string;
  extra?: string;
  /**
   * 子节点
   */
  children?: IServerTreeNode[] | null;

  clickLoadData?: boolean;

  dataLength?: number;
  /**
   * 是否默认展开
   */
  //expanded?: boolean;
  /**
   * 是否可展开，若为 false 则不显示展开收起图标
   */
  //expandable?: boolean;

  /**
   * 其他属性
   */
  //[key: string]: any;
}

export class ServerTreeNodeUtils {
  public static convertServer(
    server: ServerInfo,
    openRecent?: OpenRecentInfo,
    nodeStat: NodeStat = 'init',
  ): IServerTreeNode {
    const data: IServerTreeNode = {
      nodeName: server.serverName!,
      // headIcon: ServerIcon[server.serverType]?.icon,
      key: server.serverType + '-' + server.serverName,
      sort: openRecent ? openRecent.sortNo : server.sortNo,
      serverType: server.serverType,
      levelType: 'server',
      nodeStat,
      nodeType: 'server',
      primaryId: server.serverId,
      openRecentId: openRecent ? openRecent.recentId : undefined,
      serverInfo: server,
      displayName: server.serverName!,
      nodeValue: server.serverName,
    };

    return data;
  }

  public static convertNode(
    displayName: string,
    nodeName: string,
    tooltip: string,
    serverType: ServerType,
    levelType: LevelType,
    nodeType: AllNodeType,
    nodeStat: NodeStat = 'success',
    db?: string | number,
    schema?: string,
    table?:string,
    nodeValue?: string | number,
    extra?: string,
    dataLength?: number,
    clickLoadData?: boolean,
  ): IServerTreeNode {
    const data: IServerTreeNode = {
      displayName,
      nodeName,
      tooltip: tooltip ? tooltip : nodeName,
      // headIcon: ServerIcon[server]?.children[nodeType].icon,
      serverType,
      levelType,
      nodeStat: nodeStat,
      nodeType,
      db,
      nodeValue,
      schema,
      table,
      dataLength,
      clickLoadData,
      extra,
    };

    return data;
  }

  public static convertGroup(groupName: string): IServerTreeNode {
    const data: IServerTreeNode = {
      displayName: groupName,
      nodeName: groupName,
      key: groupName,
      levelType: 'group',
      nodeStat: 'success',
      nodeValue: groupName,
    };
    return data;
  }
}
