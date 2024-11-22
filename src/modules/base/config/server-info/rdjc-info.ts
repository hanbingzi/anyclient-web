import { IServerPreference } from '../server-info.config';

export const RDJCPreference: IServerPreference = {
  name: 'RDJC',
  displayName: '人大金仓',
  isSupport: false,
  nextSupport: false,
  connectUseJdbc:true,
  hasFunctionNode:true,
  hasProcedureNode:true,
  hasSequenceNode:true,
  hasTriggerNode:true,

};
