import { MysqlColumnEnum, MysqlIdType } from '../fields/mysql-fields';
import { DataInputEnum } from '../../../base/types/edit-input.types';

export class MysqlConvert {
  public static fieldToInputType = (field: MysqlColumnEnum): DataInputEnum => {
    switch (field) {
      //常用放前面
      case MysqlColumnEnum.INT:
      case MysqlColumnEnum.BIGINT:
      case MysqlColumnEnum.FLOAT:
      case MysqlColumnEnum.DOUBLE:
      case MysqlColumnEnum.TINYINT:
      case MysqlColumnEnum.SMALLINT:
      case MysqlColumnEnum.MEDIUMINT:
      case MysqlColumnEnum.DECIMAL:
        return DataInputEnum.number;
      case MysqlColumnEnum.BIT:
        return DataInputEnum.bit;

      case MysqlColumnEnum.VARCHAR:
      case MysqlColumnEnum.CHAR:
      case MysqlColumnEnum.TINYTEXT:
      case MysqlColumnEnum.TEXT:
      case MysqlColumnEnum.MEDIUMTEXT:
      case MysqlColumnEnum.LONGTEXT:
        return DataInputEnum.string;

      case MysqlColumnEnum.DATETIME:
        return DataInputEnum.datetime;

      case MysqlColumnEnum.TIMESTAMP:
        return DataInputEnum.timestamp;

      case MysqlColumnEnum.TIME:
        return DataInputEnum.time;

      case MysqlColumnEnum.YEAR:
        return DataInputEnum.year;

      case MysqlColumnEnum.DATE:
        return DataInputEnum.date;

      case MysqlColumnEnum.BOOL:
        return DataInputEnum.boolean;

      case MysqlColumnEnum.BINARY:
      case MysqlColumnEnum.VARBINARY:
      case MysqlColumnEnum.TINYBLOB:
      case MysqlColumnEnum.BLOB:
      case MysqlColumnEnum.MEDIUMBLOB:
      case MysqlColumnEnum.LONGBLOB:
        return DataInputEnum.file;
      case MysqlColumnEnum.JSON:
        return DataInputEnum.json;
      //后面的是不常用的

      case MysqlColumnEnum.ENUM:
      case MysqlColumnEnum.SET:
      case MysqlColumnEnum.GEOMETRY:
      case MysqlColumnEnum.POINT:
      case MysqlColumnEnum.LINESTRING:
      case MysqlColumnEnum.POLYGON:
      case MysqlColumnEnum.MULTIPOINT:
      case MysqlColumnEnum.MULTILINESTRING:
      case MysqlColumnEnum.MULTIPOLYGON:
      case MysqlColumnEnum.GEOMETRYCOLLECTION:
      default:
        return DataInputEnum.string;
    }
  };

  public static fieldsIdToColumn(idType: MysqlIdType): MysqlColumnEnum {
    switch (idType) {
      case MysqlIdType.DECIMAL:
        return MysqlColumnEnum.DECIMAL;
      case MysqlIdType.TINYINT:
        return MysqlColumnEnum.TINYINT;
      case MysqlIdType.SMALLINT:
        return MysqlColumnEnum.SMALLINT;
      case MysqlIdType.INT:
        return MysqlColumnEnum.INT;
      case MysqlIdType.FLOAT:
        return MysqlColumnEnum.FLOAT;
      case MysqlIdType.DOUBLE:
        return MysqlColumnEnum.DOUBLE;
      case MysqlIdType.TIMESTAMP:
        return MysqlColumnEnum.TIMESTAMP;
      case MysqlIdType.BIGINT:
        return MysqlColumnEnum.BIGINT;
      case MysqlIdType.MEDIUMINT:
        return MysqlColumnEnum.MEDIUMINT;
      case MysqlIdType.DATE:
        return MysqlColumnEnum.DATE;
      case MysqlIdType.YEAR:
        return MysqlColumnEnum.YEAR;
      case MysqlIdType.BIT:
        return MysqlColumnEnum.BIT;
      case MysqlIdType.DATETIME:
        return MysqlColumnEnum.DATETIME;
      case MysqlIdType.TIME:
        return MysqlColumnEnum.TIME;
      case MysqlIdType.JSON:
        return MysqlColumnEnum.JSON;
      case MysqlIdType.ENUM:
        return MysqlColumnEnum.ENUM;
      case MysqlIdType.SET:
        return MysqlColumnEnum.SET;
      case MysqlIdType.TINYBLOB:
        return MysqlColumnEnum.TINYBLOB;
      case MysqlIdType.MEDIUMBLOB:
        return MysqlColumnEnum.MEDIUMBLOB;
      case MysqlIdType.LONGBLOB:
        return MysqlColumnEnum.LONGBLOB;
      case MysqlIdType.BLOB:
        return MysqlColumnEnum.BLOB;
      case MysqlIdType.VARCHAR:
        return MysqlColumnEnum.VARCHAR;
      case MysqlIdType.CHAR:
        return MysqlColumnEnum.CHAR;
      case MysqlIdType.GEOMETRY:
        return MysqlColumnEnum.GEOMETRY;
      default:
        return MysqlColumnEnum.VARCHAR;
    }
  }
}
