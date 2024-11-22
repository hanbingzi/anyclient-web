import { IServerPreference } from '../server-info.config';

export const MariadbPreference: IServerPreference = {
  name: 'Mariadb',
  isSupport: true,
  nextSupport: false,
  hasDatabaseNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasViewNode:true,
  hasSchemaNode:false,
  hasShowColumnSql:true,
  hasTriggerNode:true,

};
