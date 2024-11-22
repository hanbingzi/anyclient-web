import { IServerPreference } from '../server-info.config';

export const SqlserverPreference: IServerPreference = {
  name: 'SQLServer',
  isSupport: true,
  nextSupport: false,
  connectUseJdbc: true,
  hasDatabaseNode: true,
  hasSchemaNode: true,
  hasFunctionNode: true,
  hasProcedureNode: true,
  hasSequenceNode: true,
  hasTriggerNode: true,
};
