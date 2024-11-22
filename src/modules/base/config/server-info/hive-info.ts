import { IServerPreference } from '../server-info.config';

export const HivePreference: IServerPreference = {
  name: 'Hive',
  displayName: 'Apache Hive',
  isSupport: false,
  nextSupport: false,
  versions: ['3.x', '2.x', '1.x'],
  connectUseJdbc: true,
  hasDatabaseNode: true,
  hasSchemaNode: false,
  hasShowColumnSql:false
};
