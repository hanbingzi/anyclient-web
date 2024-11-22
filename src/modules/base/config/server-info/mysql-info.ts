import { IServerPreference } from '../server-info.config';

export const MysqlPreference: IServerPreference = {
  name: 'Mysql',
  isSupport: true,
  nextSupport: false,
  versions: ['5', '8'],
  versionForce:true,
  hasDatabaseNode:true,
  hasViewNode:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:false,
  hasTriggerNode:true,

};
