import { DataInputEnum } from '../../../base/types/edit-input.types';
import { OracleColumnEnum } from '../fields/oracle-fields';
import { DateUtil } from '../../../base/utils/date-util';
import { OracleConvert } from '../convert/oracle-convert';
import { StrKeyObject } from '../../../base/model/common.model';
import { SqlDealUtils } from './sql-deal-utils';
import { isNull } from '../../../base/utils/object-util';
import { DataUtil } from '../../../base/utils/data-util';
import { SqlFileUtils } from './sql-file-utils';
import { MysqlColumnEnum } from '../fields/mysql-fields';

export class OracleUtils {
  public static getColumnValue(columnType?: DataInputEnum | string, value?: string | number): string {
    switch (columnType) {
      case DataInputEnum.date:
        return `TO_DATE('${value}', 'YYYY-MM-DD')`;
      case DataInputEnum.timestamp:
        return `TO_TIMESTAMP('${value}', 'YYYY-MM-DD HH24:MI:SS')`;
      case DataInputEnum.string:
        return `'${value}'`;
      default:
        return `${value}`;
    }
  }

  public static getMockColumnValue(columnName: string, columnType?: DataInputEnum | string): string {
    switch (columnType) {
      case DataInputEnum.date:
        return `TO_DATE('${DateUtil.getDateString(undefined, DateUtil.DATE_STR_yyyy_MM_dd)}', 'YYYY-MM-DD')`;
      case DataInputEnum.timestamp:
        return `TO_TIMESTAMP('${DateUtil.getDateString(undefined, DateUtil.DATETIME_STR)}', 'YYYY-MM-DD HH24:MI:SS')`;
      case DataInputEnum.string:
        return `':${columnName}'`;
      default:
        return `:${columnName}`;
    }
  }

  public static getColumnValueByOriginal(columnType: OracleColumnEnum, value: string | number): string {
    return this.getColumnValue(OracleConvert.fieldToInputType(columnType), value);
  }

  public static getCreateSql(lineTexts: StrKeyObject[]) {
    let createSql = '';
    for (let item of lineTexts) {
      createSql = createSql + item['TEXT'];
    }
    if (createSql) {
      createSql = 'CREATE OR REPLACE ' + createSql;
    }
    return createSql;
  }

  /**
   *
   * @param dateType
   * @param value
   */
  public static getConvertValue(dateType: string, value: string): string {
    if (isNull(value)) {
      return value;
    }
    switch (dateType) {
      case OracleColumnEnum.DATE:
        return DateUtil.getDateString(new Date(value), DateUtil.DATE_STR_yyyy_MM_dd);
      case OracleColumnEnum.TIMESTAMP:
      case OracleColumnEnum.TIMESTAMP_WITH_TIME_ZONE:
      case OracleColumnEnum.TIMESTAMP_WITH_LOCAL_TIME_ZONE:
        return DateUtil.getDateString(new Date(value), DateUtil.TIMESTAMP);
      case OracleColumnEnum.RAW:
        return DataUtil.bufToString(value);
      // case OracleColumnEnum.CLOB:
      // case OracleColumnEnum.NCLOB:
      //   return DateUtil.
      case OracleColumnEnum.BLOB:
        return SqlFileUtils(value,OracleColumnEnum.BLOB);

      case OracleColumnEnum.BFILE:
        return SqlFileUtils(value,OracleColumnEnum.BFILE);

      default:
        return value;
    }
  }

  public static getCreateTableDefaultValue(dateType: string, value: string) {
    const commonType = OracleConvert.fieldToInputType(dateType as OracleColumnEnum);

    switch (commonType) {
      case DataInputEnum.string:
      case DataInputEnum.json:
        return `${SqlDealUtils.escapeString(value)}`;
      case DataInputEnum.date: //因为时间都是用函数生成的，所有不能加双引号
        return value;
      default:
        return value;
    }
  }

  public static getColumnDefinition(simpleType: string, columnLength?: string|number, columnScale?: string|number): string {
    if (([OracleColumnEnum.NVARCHAR2, OracleColumnEnum.NCHAR] as string[]).includes(simpleType)) {
      return `${simpleType}(${columnLength ? columnLength : 255} CHAR)`;
    } else if (([OracleColumnEnum.VARCHAR2, OracleColumnEnum.CHAR] as string[]).includes(simpleType)) {
      return `${simpleType}(${columnLength ? columnLength : 255} BYTE)`;
    } else if (OracleColumnEnum.NUMBER === simpleType && columnScale) {
      return `${simpleType}(${columnLength},${columnScale})`;
    } else if (OracleColumnEnum.TIMESTAMP === simpleType && columnLength) {
      return `${simpleType}(${columnLength})`;
    } else {
      return simpleType;
    }
  }
}
