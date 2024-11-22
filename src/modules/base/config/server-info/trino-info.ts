import { IServerPreference } from '../server-info.config';

export const TrinoPreference: IServerPreference = {
  name: 'Trino',
  displayName: 'Trino',
  isSupport: true,
  nextSupport: false,
  //使用jdbc数据库连接，其他的功能，如:sql处理都使用,jdbc连接更有优势，如更优秀的数据库连接池管理
  connectUseJdbc: true,
  hasDatabaseNode: true,
  hasSchemaNode: true,
  hasViewNode: true,
  hasProcedureNode: true,
  hasFunctionNode: true,
};
