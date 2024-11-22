import { IServerPreference } from '../server-info.config';

export const OceanBasePreference: IServerPreference = {
  name: 'OceanBase',
  isSupport: true,
  nextSupport: false,
  hasDatabaseNode: true,
  //使用jdbc数据库连接，其他的功能，如:sql处理都使用,jdbc连接更有优势，如更优秀的数据库连接池管理
  connectUseJdbc: true,
  hasViewNode: true,
  hasFunctionNode: true,
  hasProcedureNode: true,
  hasSequenceNode: false,
  hasTriggerNode: false,
  hasRoleNode: false,
  hasVariableNode: false,
  hasShowColumnSql: true,
};
