import { IServerPreference } from '../server-info.config';

export const ClickHousePreference: IServerPreference = {
  name: 'ClickHouse',
  displayName: 'ClickHouse',
  isSupport: true,
  connectUseJdbc:true,
  hasDatabaseNode:true,
  hasProcedureNode: true,
};
