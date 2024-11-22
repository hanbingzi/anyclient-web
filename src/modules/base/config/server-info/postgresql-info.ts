import { IServerPreference } from '../server-info.config';

export const PostgresPreference: IServerPreference = {
  name: 'Postgresql',
  isSupport: true,
  nextSupport: false,
  versions: ['9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '10', '11', '12', '13', '14', '15', '16'],
  hasDatabaseNode:true,
  hasSchemaNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:true,
  hasTriggerNode:true,


};
