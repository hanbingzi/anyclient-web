import { IServerPreference } from '../server-info.config';

export const DB2Preference: IServerPreference = {
  name: 'DB2',
  displayName: 'IBM DB2',
  isSupport: true,
  nextSupport: false,
  connectUseJdbc:true,
  hasDatabaseNode:true,
  hasSchemaNode:true,
  hasViewNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasShowColumnSql:true,
};
