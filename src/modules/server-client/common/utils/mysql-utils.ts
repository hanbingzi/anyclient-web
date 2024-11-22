import { MysqlColumnEnum, MysqlIdType } from '../fields/mysql-fields';
import { DateUtil } from '../../../base/utils/date-util';
import { DataUtil } from '../../../base/utils/data-util';
import { isNull } from '../../../base/utils/object-util';
import { SqlFileUtils } from './sql-file-utils';

export class MysqlUtils {
  /**
   * WHEN DATA_TYPE IN ('char', 'varchar', 'binary', 'varbinary') THEN CONCAT(DATA_TYPE, '(', CHARACTER_MAXIMUM_LENGTH, ')')
   *         WHEN DATA_TYPE IN ('text', 'blob', 'enum', 'set') THEN DATA_TYPE
   *         WHEN DATA_TYPE IN ('decimal', 'numeric') THEN CONCAT(DATA_TYPE, '(', NUMERIC_PRECISION, ',', NUMERIC_SCALE, ')')
   *         WHEN DATA_TYPE IN ('float', 'double') THEN CONCAT(DATA_TYPE, '(', NUMERIC_PRECISION, ',', NUMERIC_SCALE, ')')
   *         WHEN DATA_TYPE = 'bit' THEN CONCAT(DATA_TYPE, '(', NUMERIC_PRECISION, ')')
   *         WHEN DATA_TYPE IN ('time', 'datetime', 'timestamp') AND DATETIME_PRECISION > 0 THEN CONCAT(DATA_TYPE, '(', DATETIME_PRECISION, ')')
   */
  public static getColumnDefinition(simpleType: string, columnLength?: string, columnScale?: string): string {
    if (
      (
        [MysqlColumnEnum.CHAR, MysqlColumnEnum.VARCHAR, MysqlColumnEnum.BINARY, MysqlColumnEnum.VARBINARY] as string[]
      ).includes(simpleType)
    ) {
      return `${simpleType}(${columnLength ? columnLength : 255} )`;
    } else if (MysqlColumnEnum.DECIMAL === simpleType) {
      return `${simpleType}(${columnLength},${columnScale})`;
    } else if (
      ([MysqlColumnEnum.TIMESTAMP, MysqlColumnEnum.DATETIME, MysqlColumnEnum.TIME] as string[]).includes(simpleType) &&
      columnLength
    ) {
      return `${simpleType}(${columnLength})`;
    } else {
      return simpleType;
    }
  }

  public static getConvertValue(dateTypeId: number, value: any): any {
    if (isNull(value) || isNull(dateTypeId)) return value;
    switch (dateTypeId) {
      case MysqlIdType.DATE:
        return DateUtil.getDateString(new Date(value), DateUtil.DATE_STR_yyyy_MM_dd);
      case MysqlIdType.DATETIME:
        return DateUtil.getDateString(new Date(value), DateUtil.DATETIME_STR);
      case MysqlIdType.TIMESTAMP:
        return DateUtil.getDateString(new Date(value), DateUtil.TIMESTAMP);
      case MysqlIdType.TIME:
        return DateUtil.getDateString(new Date(value), DateUtil.DATETIME_STR);
      case MysqlIdType.BIT:
        return DataUtil.bufToBit(value);
      case MysqlIdType.TINYBLOB:
      case MysqlIdType.BLOB:
      case MysqlIdType.MEDIUMBLOB:
      case MysqlIdType.LONGBLOB:
        return SqlFileUtils(value,MysqlColumnEnum.BLOB);
      case MysqlIdType.BINARY:
      case MysqlIdType.VARBINARY:
        return SqlFileUtils(value,MysqlColumnEnum.BINARY);
      default:
        return value;
    }
  }
}
