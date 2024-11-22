import { IServerPreference } from '../server-info.config';

export const PrestoPreference: IServerPreference = {
  name: 'Presto',
  displayName: 'Presto',
  hasDatabaseNode: true,
  isSupport: true,
  nextSupport: false,
  connectUseJdbc: true,
  hasSchemaNode:true,
  hasViewNode:true,
  hasProcedureNode:true,
  hasFunctionNode:true,
};
