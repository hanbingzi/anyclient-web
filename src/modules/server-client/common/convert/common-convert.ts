import { DataInputEnum } from '../../../base/types/edit-input.types';

export class CommonConvert {
  public static fieldToInputType(field: string): DataInputEnum {

    switch (field.toLowerCase()) {
      case 'float':
      case 'double':
      case 'smallint':
      case 'tinyint':
      case 'int':
      case 'integer':
      case 'real':
      case 'bigint':
      case 'bit':
        return DataInputEnum.number;
      case 'char':
      case 'nchar':
      case 'ntext':
      case 'uniqueidentifier':
      case 'varchar':
      case 'nvarchar':
      case 'text':
      case 'xml':
      case 'array':
        return DataInputEnum.string;
      case 'json':
        return DataInputEnum.json;
      case 'date':
        return DataInputEnum.date;
      case 'datetime':
      case 'datetime2':
      case 'datetimeoffset':
      case 'smalldatetime':
      case 'timestamp':
        return DataInputEnum.timestamp;
      case 'decimal':
      case 'money':
      case 'numeric':
      case 'smallmoney':
        return DataInputEnum.bigDecimal;
      case 'time':
        return DataInputEnum.time;
      case 'image':
      case 'varbinary':
      case 'binary':

        return DataInputEnum.file;
      default:
        return DataInputEnum.string;
    }
  }
}
