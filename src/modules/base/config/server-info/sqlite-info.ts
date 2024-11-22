import { IServerPreference } from '../server-info.config';

export const SqlitePreference: IServerPreference = {
  name: 'Sqlite',
  isSupport: false,
  nextSupport: false,
  hasDatabaseNode:true,
  hasSchemaNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:true,
  hasTriggerNode:true,

};
