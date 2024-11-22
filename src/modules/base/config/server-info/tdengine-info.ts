import { IServerPreference } from '../server-info.config';

export const TDEnginePreference: IServerPreference = {
  name: 'TDEngine',
  isSupport: true,
  nextSupport: false,
  hasDatabaseNode: true,
  connectUseJdbc: true,
  hasViewNode: true,
  hasProcedureNode: false,
  hasFunctionNode:true,
};
