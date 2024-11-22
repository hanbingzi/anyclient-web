import { OpenOption } from '../../base/param/open-view.param';
import { AllNodeType, ServerType } from '../../base/types/server-node.types';
import { URI } from '@opensumi/ide-utils';
import { ServerInfo } from '../../local-store-db/common';

export interface ViewState {
  width: number;
  height: number;
}

export interface IBaseState {
  viewState: ViewState;
  //
  serverId: string;
  server: ServerInfo;
  serverType: ServerType;
  openUri: URI;
  nodeName: string;
  nodePath: string;
  nodeType: AllNodeType;
  option?: OpenOption;
  db?: string | number;
  schema?: string;
}

// 表格打开参数
// export interface IBaseState extends IBaseState {
//   //db: string | number;
//   schema?: string;
//   //tableName?: string;
// }

export interface IZKInfoState extends IBaseState {
  fullPath: string;
}
