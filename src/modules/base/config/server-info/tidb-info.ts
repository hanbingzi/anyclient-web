import { IServerPreference } from '../server-info.config';

export const TiDBPreference: IServerPreference = {
  name: 'TiDB',
  isSupport: true,
  nextSupport: false,
  connectUseJdbc:true,
  hasDatabaseNode:true,
  hasSchemaNode:false,
  hasViewNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:false,
  hasTriggerNode:true,
  hasRoleNode:false,
  hasVariableNode:false,
  //下面是具体功能是否实现
  hasShowColumnSql:true,
};
