import { AllNodeType, ServerType } from '../types/server-node.types';
import { ServerInfo } from '../../local-store-db/common/model.define';
import { IBreadCrumbPart } from '../model/navigation.model';

/**
 *  'open'： 服务树 双击打开
 *  'edit'：服务树 右键编辑
 *  'create' ：服务树 邮件创建
 *  'sqlResult'： sql运行结果展示
 */
export type OpenOption = 'open' | 'edit' | 'create' | 'addChild';

export interface OpenParam {
  // 被点击的名称
  nodeName: string;
  nodeValue?: string | number;
  serverId: string;
  serverType: ServerType;
  // openRecentId: string;
  db?: string | number;
  schema?: string;
  nodeType: AllNodeType;
  option: OpenOption;
  path: string;
  /**
   * 额外信息，json方式传输
   */
  extra?: string;
}

export interface OpenViewParam extends OpenParam {
  server: ServerInfo;

  /**
   * 面包屑
   */
  breadCrumb: IBreadCrumbPart[];
}
