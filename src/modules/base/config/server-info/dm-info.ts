import { IServerPreference } from '../server-info.config';

export const DMPreference: IServerPreference = {
  name: 'DM',
  displayName: '达梦',
  connectUseJdbc: true,
  isSupport: true,
  nextSupport: false,
  hasDatabaseNode: true,
  hasViewNode: true,
  hasFunctionNode: true,
  hasProcedureNode: true,
  hasSequenceNode: true,
  hasTriggerNode: true,
};
