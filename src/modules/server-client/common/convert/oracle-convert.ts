import { OracleColumnEnum } from '../fields/oracle-fields';
import { DataInputEnum } from '../../../base/types/edit-input.types';

export class OracleConvert {
  public static fieldToInputType(field: OracleColumnEnum): DataInputEnum {
    switch (field) {
      case OracleColumnEnum.VARCHAR2:
      case OracleColumnEnum.NVARCHAR2:
      case OracleColumnEnum.CHAR:
      case OracleColumnEnum.NCHAR:
      case OracleColumnEnum.LONG:
        return DataInputEnum.string;
      case OracleColumnEnum.NUMBER:
      case OracleColumnEnum.FLOAT:
      case OracleColumnEnum.BINARY_FLOAT:
      case OracleColumnEnum.BINARY_DOUBLE:
        return DataInputEnum.number;
      case OracleColumnEnum.DATE:
        return DataInputEnum.date;
      case OracleColumnEnum.TIMESTAMP:
        return DataInputEnum.timestamp;
      case OracleColumnEnum.TIMESTAMP_WITH_TIME_ZONE:
        return DataInputEnum.timestamp; //暂时使用timestamp，测试过能保证数据插入和查询的真实
      case OracleColumnEnum.TIMESTAMP_WITH_LOCAL_TIME_ZONE:
        return DataInputEnum.timestamp; //暂时使用timestamp，测试过能保证数据插入和查询的真实
      //表示日期间隔，使用字符串
      // case OracleColumnEnum.INTERVAL_YEAR_TO_MONTH:
      // case OracleColumnEnum.INTERVAL_DAY_TO_SECOND:
      //   return DataInputEnum.string;
      case OracleColumnEnum.JSON:
        return DataInputEnum.json;
      case OracleColumnEnum.CLOB:
      case OracleColumnEnum.NCLOB:
        return DataInputEnum.string;
      case OracleColumnEnum.RAW:
      case OracleColumnEnum.BLOB:
      case OracleColumnEnum.BFILE:
        return DataInputEnum.file;
      default:
        return DataInputEnum.string;
    }
  }
}
