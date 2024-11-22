import { IServerPreference } from '../server-info.config';

export const CommonSqlPreference: IServerPreference = {
  name: 'CommonSql',
  isSupport: true,
  nextSupport: false,
  hasDatabaseNode:true,
  hasViewNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:false,
  hasTriggerNode:false,

};
