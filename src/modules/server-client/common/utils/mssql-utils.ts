import { MssqlColumnEnum } from '../fields/mssql-fields';
import { isNotEmpty } from '../../../base/utils/object-util';

export class MssqlUtils {
  public static getColumnDefinition(simpleType: string, columnLength?: string, columnScale?: string): string {
    //const { dataType, length, precision, scale } = columnInfo;
    const upperDataType = simpleType.toUpperCase();
    switch (simpleType) {
      case MssqlColumnEnum.char:
      case MssqlColumnEnum.varchar:
      case MssqlColumnEnum.nchar:
      case MssqlColumnEnum.nvarchar:
      case MssqlColumnEnum.binary:
      case MssqlColumnEnum.varbinary:
        return `${upperDataType}(${columnLength || 'MAX'})`;
      case MssqlColumnEnum.decimal:
      case MssqlColumnEnum.numeric:
        if (isNotEmpty(columnLength) && isNotEmpty(columnScale)) {
          return `${upperDataType}(${columnLength}, ${columnScale})`;
        }
        return upperDataType;

      case MssqlColumnEnum.float:
      case MssqlColumnEnum.real:
        if (isNotEmpty(columnLength)) {
          return `${upperDataType}(${columnLength})`;
        }
        return upperDataType;

      case MssqlColumnEnum.datetime2:
      case MssqlColumnEnum.time:
      case MssqlColumnEnum.datetimeoffset:
        if (isNotEmpty(columnScale)) {
          return `${upperDataType}(${columnScale})`;
        }
        return upperDataType;

      default:
        // For types like INT, BIGINT, DATE, etc., we don't need to specify length
        return upperDataType;
    }
  }
}
