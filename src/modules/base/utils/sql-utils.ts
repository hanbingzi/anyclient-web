import { Pattern } from '../constant';

export class SqlUtils {
  public static isQuery(sql: string): boolean {
    return /^(SELECT|SHOW|EXPLAIN|DESCRIBE|WITH)\s/i.test(sql.trim());
  }

  /**
   * 获取sql语句中的表
   * @param sql
   */
  public static getSelectTableName(sql: string): string[] {
    const tableMatch = new RegExp(Pattern.SELECT_TABLE_PATTERN, 'gi');
    let tableNames: string[] = [];
    while (true) {
      let result = tableMatch.exec(sql);
      if (!result) {
        break;
      }
      tableNames.push(result[2]);
    }
    return tableNames;
  }

  public static getFirstTableName(sql: string, tablePattern: string): string | null {
    const tableMatch = new RegExp(tablePattern, 'img').exec(sql);
    if (tableMatch) {
      return tableMatch[0]
        .replace(/\bfrom|join|update|into\b/i, '') // remove keyword
        .replace(/`|"|'/g, '') // trim tableName
        .replace(/^\s*\[(.+)\]$/, '$1') // trim tableName again
        .trim();
    }
    return null;
  }
}
