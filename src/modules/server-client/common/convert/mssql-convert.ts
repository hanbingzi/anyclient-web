import { DataInputEnum } from '../../../base/types/edit-input.types';
import { MssqlColumnEnum } from '../fields/mssql-fields';

export class MssqlConvert {
  public static fieldToInputType = (field: MssqlColumnEnum): DataInputEnum => {
    switch (field) {
      //常用放前面
      case MssqlColumnEnum.bigint:
        return DataInputEnum.long;
      case MssqlColumnEnum.binary:
        return DataInputEnum.file;
      case MssqlColumnEnum.bit:
        return DataInputEnum.bit;
      case MssqlColumnEnum.char:
      case MssqlColumnEnum.nchar:
      case MssqlColumnEnum.ntext:
      case MssqlColumnEnum.nvarchar:
      case MssqlColumnEnum.uniqueidentifier:
      case MssqlColumnEnum.varchar:
      case MssqlColumnEnum.text:
        return DataInputEnum.string;
      case MssqlColumnEnum.date:
        return DataInputEnum.date;
      case MssqlColumnEnum.datetime:
      case MssqlColumnEnum.datetime2:
      case MssqlColumnEnum.datetimeoffset:
      case MssqlColumnEnum.smalldatetime:
        return DataInputEnum.timestamp;
      case MssqlColumnEnum.decimal:
      case MssqlColumnEnum.money:
      case MssqlColumnEnum.numeric:
      case MssqlColumnEnum.smallmoney:
        return DataInputEnum.bigDecimal;
      case MssqlColumnEnum.float:
        return DataInputEnum.double;
      case MssqlColumnEnum.smallint:
      case MssqlColumnEnum.tinyint:
        return DataInputEnum.short;
      case MssqlColumnEnum.int:
        return DataInputEnum.int;
      case MssqlColumnEnum.real:
        return DataInputEnum.float;
      case MssqlColumnEnum.time:
        return DataInputEnum.time;
      case MssqlColumnEnum.timestamp:
      case MssqlColumnEnum.image:
      case MssqlColumnEnum.varbinary:
        return DataInputEnum.file;
      default:
        return DataInputEnum.string;
    }
  };

}
