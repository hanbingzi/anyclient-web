import { PostgresColumnEnum, PostgresTypeId } from '../fields/postgres-fields';
import { DataInputEnum } from '../../../base/types/edit-input.types';

export class PostgresConvert {
  public static fieldToInputType = (field: PostgresColumnEnum): DataInputEnum => {
    switch (field) {
      case PostgresColumnEnum.INT2:
      case PostgresColumnEnum.INT4:
      case PostgresColumnEnum.INT8:
      case PostgresColumnEnum.FLOAT4:
      case PostgresColumnEnum.FLOAT8:
      case PostgresColumnEnum.NUMERIC:
        return DataInputEnum.number;

      case PostgresColumnEnum.VARBIT:
      case PostgresColumnEnum.BIT:
        return DataInputEnum.bit;

      case PostgresColumnEnum.CHAR:
      case PostgresColumnEnum.VARCHAR:
      case PostgresColumnEnum.UUID:
      case PostgresColumnEnum.TEXT:
        return DataInputEnum.string;

      case PostgresColumnEnum.DATE:
        return DataInputEnum.date;

      case PostgresColumnEnum.TIME:
        return DataInputEnum.time;

      case PostgresColumnEnum.TIMESTAMP:
      case PostgresColumnEnum.TIMESTAMPTZ:
        return DataInputEnum.timestamp;
      case PostgresColumnEnum.JSON:
      case PostgresColumnEnum.JSONB:
        return DataInputEnum.json;

      case PostgresColumnEnum.BOOL:
        return DataInputEnum.boolean;
      case PostgresColumnEnum.TIMETZ:
      case PostgresColumnEnum.INTERVAL:

      case PostgresColumnEnum.XML:
      case PostgresColumnEnum.REGPROC:
      case PostgresColumnEnum.MACADDR8:
        return DataInputEnum.string;

      case PostgresColumnEnum.BYTEA:
        return DataInputEnum.file;
      //特殊类型
      case PostgresColumnEnum.OID:
      case PostgresColumnEnum.TID:
      case PostgresColumnEnum.XID:
      case PostgresColumnEnum.CID:
      case PostgresColumnEnum.MONEY:
        return DataInputEnum.number;

      case PostgresColumnEnum.PG_NODE_TREE:
      case PostgresColumnEnum.SMGR:
      case PostgresColumnEnum.PATH:
      case PostgresColumnEnum.POLYGON:
      case PostgresColumnEnum.CIDR:
      case PostgresColumnEnum.ABSTIME:
      case PostgresColumnEnum.RELTIME:
      case PostgresColumnEnum.TINTERVAL:
      case PostgresColumnEnum.CIRCLE:

      case PostgresColumnEnum.MACADDR:
      case PostgresColumnEnum.INET:
      case PostgresColumnEnum.ACLITEM:
      case PostgresColumnEnum.BPCHAR:

      case PostgresColumnEnum.REFCURSOR:
      case PostgresColumnEnum.REGPROCEDURE:
      case PostgresColumnEnum.REGOPER:
      case PostgresColumnEnum.REGOPERATOR:
      case PostgresColumnEnum.REGCLASS:
      case PostgresColumnEnum.REGTYPE:
      case PostgresColumnEnum.TXID_SNAPSHOT:
      case PostgresColumnEnum.PG_LSN:
      case PostgresColumnEnum.PG_NDISTINCT:
      case PostgresColumnEnum.PG_DEPENDENCIES:
      case PostgresColumnEnum.TSVECTOR:
      case PostgresColumnEnum.TSQUERY:
      case PostgresColumnEnum.GTSVECTOR:
      case PostgresColumnEnum.REGCONFIG:
      case PostgresColumnEnum.REGDICTIONARY:

      case PostgresColumnEnum.REGNAMESPACE:
      case PostgresColumnEnum.REGROLE:
      default:
        return DataInputEnum.string;
    }
  };

  public static fieldsIdToColumn(typeId: PostgresTypeId): PostgresColumnEnum {
    switch (typeId) {
      case PostgresTypeId.BOOL:
        return PostgresColumnEnum.BOOL;
      case PostgresTypeId.BYTEA:
        return PostgresColumnEnum.BYTEA;
      case PostgresTypeId.CHAR:
        return PostgresColumnEnum.CHAR;
      case PostgresTypeId.INT8:
        return PostgresColumnEnum.INT8;
      case PostgresTypeId.INT2:
        return PostgresColumnEnum.INT2;
      case PostgresTypeId.INT4:
        return PostgresColumnEnum.INT4;
      case PostgresTypeId.REGPROC:
        return PostgresColumnEnum.REGPROC;
      case PostgresTypeId.TEXT:
        return PostgresColumnEnum.TEXT;
      case PostgresTypeId.OID:
        return PostgresColumnEnum.OID;
      case PostgresTypeId.TID:
        return PostgresColumnEnum.TID;
      case PostgresTypeId.XID:
        return PostgresColumnEnum.XID;
      case PostgresTypeId.CID:
        return PostgresColumnEnum.CID;
      case PostgresTypeId.JSON:
        return PostgresColumnEnum.JSON;
      case PostgresTypeId.XML:
        return PostgresColumnEnum.XML;
      case PostgresTypeId.PG_NODE_TREE:
        return PostgresColumnEnum.PG_NODE_TREE;
      case PostgresTypeId.SMGR:
        return PostgresColumnEnum.SMGR;
      case PostgresTypeId.PATH:
        return PostgresColumnEnum.PATH;
      case PostgresTypeId.POLYGON:
        return PostgresColumnEnum.POLYGON;
      case PostgresTypeId.CIDR:
        return PostgresColumnEnum.CIDR;
      case PostgresTypeId.FLOAT4:
        return PostgresColumnEnum.FLOAT4;
      case PostgresTypeId.FLOAT8:
        return PostgresColumnEnum.FLOAT8;
      case PostgresTypeId.ABSTIME:
        return PostgresColumnEnum.ABSTIME;
      case PostgresTypeId.RELTIME:
        return PostgresColumnEnum.RELTIME;
      case PostgresTypeId.TINTERVAL:
        return PostgresColumnEnum.TINTERVAL;
      case PostgresTypeId.CIRCLE:
        return PostgresColumnEnum.CIRCLE;
      case PostgresTypeId.MACADDR8:
        return PostgresColumnEnum.MACADDR8;
      case PostgresTypeId.MONEY:
        return PostgresColumnEnum.MONEY;
      case PostgresTypeId.MACADDR:
        return PostgresColumnEnum.MACADDR;
      case PostgresTypeId.INET:
        return PostgresColumnEnum.INET;
      case PostgresTypeId.ARRAY:
        return PostgresColumnEnum.ARRAY;
      case PostgresTypeId.ACLITEM:
        return PostgresColumnEnum.ACLITEM;
      case PostgresTypeId.BPCHAR:
        return PostgresColumnEnum.BPCHAR;
      case PostgresTypeId.VARCHAR:
        return PostgresColumnEnum.VARCHAR;
      case PostgresTypeId.DATE:
        return PostgresColumnEnum.DATE;
      case PostgresTypeId.TIME:
        return PostgresColumnEnum.TIME;
      case PostgresTypeId.TIMESTAMP:
        return PostgresColumnEnum.TIMESTAMP;
      case PostgresTypeId.TIMESTAMPTZ:
        return PostgresColumnEnum.TIMESTAMPTZ;
      case PostgresTypeId.INTERVAL:
        return PostgresColumnEnum.INTERVAL;
      case PostgresTypeId.TIMETZ:
        return PostgresColumnEnum.TIMETZ;
      case PostgresTypeId.BIT:
        return PostgresColumnEnum.BIT;
      case PostgresTypeId.VARBIT:
        return PostgresColumnEnum.VARBIT;
      case PostgresTypeId.NUMERIC:
        return PostgresColumnEnum.VARBIT;
      case PostgresTypeId.REFCURSOR:
        return PostgresColumnEnum.REFCURSOR;
      case PostgresTypeId.REGPROCEDURE:
        return PostgresColumnEnum.REFCURSOR;
      case PostgresTypeId.REGOPER:
        return PostgresColumnEnum.REFCURSOR;
      case PostgresTypeId.REGOPERATOR:
        return PostgresColumnEnum.REGOPERATOR;
      case PostgresTypeId.REGCLASS:
        return PostgresColumnEnum.REGCLASS;
      case PostgresTypeId.REGTYPE:
        return PostgresColumnEnum.REGTYPE;
      case PostgresTypeId.UUID:
        return PostgresColumnEnum.UUID;
      case PostgresTypeId.TXID_SNAPSHOT:
        return PostgresColumnEnum.TXID_SNAPSHOT;
      case PostgresTypeId.PG_LSN:
        return PostgresColumnEnum.PG_LSN;
      case PostgresTypeId.PG_NDISTINCT:
        return PostgresColumnEnum.PG_NDISTINCT;
      case PostgresTypeId.PG_DEPENDENCIES:
        return PostgresColumnEnum.PG_DEPENDENCIES;
      case PostgresTypeId.TSVECTOR:
        return PostgresColumnEnum.TSVECTOR;
      case PostgresTypeId.TSQUERY:
        return PostgresColumnEnum.TSQUERY;
      case PostgresTypeId.GTSVECTOR:
        return PostgresColumnEnum.GTSVECTOR;
      case PostgresTypeId.REGCONFIG:
        return PostgresColumnEnum.REGCONFIG;
      case PostgresTypeId.REGDICTIONARY:
        return PostgresColumnEnum.REGDICTIONARY;
      case PostgresTypeId.JSONB:
        return PostgresColumnEnum.JSONB;
      case PostgresTypeId.REGNAMESPACE:
        return PostgresColumnEnum.REGNAMESPACE;
      case PostgresTypeId.REGROLE:
        return PostgresColumnEnum.REGROLE;
    }
  }
}
