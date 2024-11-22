import { IServerPreference } from '../server-info.config';

export const OraclePreference: IServerPreference = {
  name: 'Oracle',
  isSupport: true,
  nextSupport: false,
  versions: ['11g', '12c', '18c', '19c', '21c'],
  versionForce:true,
  hasDatabaseNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:true,
  hasTriggerNode:true,
};
