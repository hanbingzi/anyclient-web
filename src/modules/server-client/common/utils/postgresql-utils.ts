import { PostgresColumnEnum, PostgresTypeId } from '../fields/postgres-fields';
import { DateUtil } from '../../../base/utils/date-util';
import { DataUtil } from '../../../base/utils/data-util';
import { isNull } from '../../../base/utils/object-util';
import { SqlFileUtils } from './sql-file-utils';
import { OracleColumnEnum } from '../fields/oracle-fields';

export class PostgresUtils {
  public static getColumnDefinition(type: string, length?: string, precision?: string): string {
    // 对于 DECIMAL 或 NUMERIC 类型，如果提供了长度和精度
    if (type === PostgresColumnEnum.NUMERIC && length != null && precision != null) {
      return `${type}(${length}, ${precision})`;
    }
    // 对于 VARCHAR 类型，如果提供了长度
    else if (type === PostgresColumnEnum.VARCHAR && length != null) {
      return `${type}(${length})`;
    }
    // 对于 CHAR 或 CHARACTER 类型，如果提供了长度
    else if (type === PostgresColumnEnum.CHAR && length != null) {
      return `${type}(${length})`;
    } else if (type === PostgresColumnEnum.TIMESTAMPTZ && length != null) {
      return `${type}(${length})`;
    }
    // 其他情况，只返回类型
    else {
      return type;
    }
  }

  /**
   *
   * @param dateTypeId
   * @param value
   */
  public static getConvertValue(dateTypeId: number, value: any): any {
    if (isNull(value)) return value;
    switch (dateTypeId) {
      case PostgresTypeId.DATE:
        return DateUtil.getDateString(new Date(value), DateUtil.DATE_STR_yyyy_MM_dd);
      case PostgresTypeId.TIMESTAMP:
      case PostgresTypeId.TIMESTAMPTZ:
        return DateUtil.getDateString(new Date(value), DateUtil.TIMESTAMP);
      case PostgresTypeId.INTERVAL:
        return this.formatInterval(value);
      case PostgresTypeId.TIME:
      case PostgresTypeId.TIMETZ:
        return value;
      case PostgresTypeId.BYTEA:
        return SqlFileUtils(value,PostgresColumnEnum.BYTEA);
        //return DataUtil.bufToHexOX(value);
      case PostgresTypeId.JSON:
        return JSON.stringify(value);
      case PostgresTypeId.CIRCLE:
        return JSON.stringify(value);
      case PostgresTypeId.ARRAY:
        return JSON.stringify(value);
      default:
        return value;
    }
  }

  public static formatInterval(intervalObj: any): string {
    let intervalParts: string[] = [];
    if (intervalObj.years) {
      intervalParts.push(intervalObj.years + ' year' + (intervalObj.years > 1 ? 's' : ''));
    }
    if (intervalObj.months) {
      intervalParts.push(intervalObj.months + ' month' + (intervalObj.months > 1 ? 's' : ''));
    }
    if (intervalObj.days) {
      intervalParts.push(intervalObj.days + ' day' + (intervalObj.days > 1 ? 's' : ''));
    }
    if (intervalObj.hours) {
      intervalParts.push(intervalObj.hours + ' hour' + (intervalObj.hours > 1 ? 's' : ''));
    }
    if (intervalObj.minutes) {
      intervalParts.push(intervalObj.minutes + ' minute' + (intervalObj.minutes > 1 ? 's' : ''));
    }
    if (intervalObj.seconds) {
      intervalParts.push(intervalObj.seconds + ' second' + (intervalObj.seconds > 1 ? 's' : ''));
    }
    return intervalParts.join(' ');
  }
}
