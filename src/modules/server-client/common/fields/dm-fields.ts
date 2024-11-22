export enum DMColumnEnum {
  //数值类型:
  // TINYINT (1字节)
  TINYINT = 'TINYINT',
  // SMALLINT (2字节)
  SMALLINT = 'SMALLINT',
  // INT (4字节)
  INT = 'INT',
  // BIGINT (8字节)
  BIGINT = 'BIGINT',
  // NUMERIC(p,s) 或 DECIMAL(p,s)
  NUMERIC = 'NUMERIC',
  DECIMAL = 'DECIMAL',
  // FLOAT
  FLOAT = 'FLOAT',
  // DOUBLE
  DOUBLE = 'DOUBLE',
  // REAL
  REAL = 'REAL',
  // 字符串类型:
  //   CHAR(n)
  CHAR = 'CHAR',
  // VARCHAR(n)
  VARCHAR = 'VARCHAR',
  // VARCHAR2(n)
  VARCHAR2 = 'VARCHAR2',
  // TEXT
  TEXT = 'TEXT',
  // LONG
  LONG = 'LONG',
  // CLOB
  CLOB = 'CLOB',
  // 日期和时间类型:
  //   DATE
  DATE = 'DATE',
  // TIME
  TIME = 'TIME',
  // TIMESTAMP
  TIMESTAMP = 'TIMESTAMP',
  // INTERVAL YEAR TO MONTH
  INTERVAL_YEAR_TO_MONTH = 'INTERVAL YEAR TO MONTH',
  // INTERVAL DAY TO SECOND
  INTERVAL_DAY_TO_SECOND = 'INTERVAL DAY TO SECOND',
  // 二进制类型:
  //   BINARY(n)
  BINARY = 'BINARY',
  // VARBINARY(n)
  VARBINARY = 'VARBINARY',
  // BLOB
  BLOB = 'BLOB',
  // BFILE
  BFILE = 'BFILE',
  // 布尔类型:
  //   BOOLEAN
  BOOLEAN = 'BOOLEAN',
  // 复杂类型:
  //   ARRAY
  ARRAY = 'ARRAY',
  // STRUCT
  STRUCT = 'STRUCT',
  // SET
  SET = 'SET',
  // MULTISET
  MULTISET = 'MULTISET',
  // REF
  REF = 'REF',
  // SYSNAME (系统名称类型)

  // 空间数据类型:
  //   SDO_GEOMETRY (用于存储地理空间数据)
  SDO_GEOMETRY = 'SDO_GEOMETRY',
  // 其他特殊类型:
  //   GUID (全局唯一标识符)
  GUID = 'GUID',
  // XML
  XML = 'XML',
  // 大对象类型:
  // JSON类型:
  //   JSON
  JSON = 'JSON',
  // 货币类型:
  //  MONEY
  MONEY = 'MONEY',
}

/**
 * Mssql 下拉类型选择
 */
export const DMColumnType: string[] = [
  DMColumnEnum.TINYINT,
  DMColumnEnum.SMALLINT,
  DMColumnEnum.INT,
  DMColumnEnum.BIGINT,
  DMColumnEnum.NUMERIC,
  DMColumnEnum.DECIMAL,
  DMColumnEnum.FLOAT,
  DMColumnEnum.DOUBLE,
  DMColumnEnum.REAL,
  DMColumnEnum.CHAR,
  DMColumnEnum.VARCHAR,
  DMColumnEnum.VARCHAR2,
  DMColumnEnum.TEXT,
  DMColumnEnum.LONG,
  DMColumnEnum.CLOB,
  DMColumnEnum.DATE,
  DMColumnEnum.TIME,
  DMColumnEnum.TIMESTAMP,
  DMColumnEnum.INTERVAL_YEAR_TO_MONTH,
  DMColumnEnum.INTERVAL_DAY_TO_SECOND,
  DMColumnEnum.BINARY,
  DMColumnEnum.VARBINARY,
  DMColumnEnum.BLOB,
  DMColumnEnum.BFILE,
  DMColumnEnum.BOOLEAN,
  DMColumnEnum.ARRAY,
  DMColumnEnum.STRUCT,
  DMColumnEnum.SET,
  DMColumnEnum.MULTISET,
  DMColumnEnum.REF,
  DMColumnEnum.SDO_GEOMETRY,
  DMColumnEnum.GUID,
  DMColumnEnum.XML,
  DMColumnEnum.JSON,
  DMColumnEnum.MONEY,
];
