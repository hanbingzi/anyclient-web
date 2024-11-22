export enum OracleColumnEnum {
  VARCHAR2 = 'VARCHAR2',
  NVARCHAR2 = 'NVARCHAR2',
  CHAR = 'CHAR',
  NCHAR = 'NCHAR',
  CLOB = 'CLOB',
  NCLOB = 'NCLOB',
  LONG = 'LONG',
  RAW = 'RAW',
  BLOB = 'BLOB',
  BFILE = 'BFILE',
  NUMBER = 'NUMBER',
  FLOAT = 'FLOAT',
  BINARY_FLOAT = 'BINARY_FLOAT',
  BINARY_DOUBLE = 'BINARY_DOUBLE',
  DATE = 'DATE',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMP_WITH_TIME_ZONE = 'TIMESTAMP WITH TIME ZONE',
  TIMESTAMP_WITH_LOCAL_TIME_ZONE = 'TIMESTAMP WITH LOCAL TIME ZONE',
  // INTERVAL_YEAR_TO_MONTH = 'INTERVAL YEAR TO MONTH',
  // INTERVAL_DAY_TO_SECOND = 'INTERVAL DAY TO SECOND',
  JSON = 'JSON',
}

export enum OracleAutoIncrementType {
  AutoIncrement = 'auto_increment',
}

/**
 * Oracle 下拉类型选择
 */
export const OracleColumnType: string[] = [
  //常用放前面
  OracleColumnEnum.VARCHAR2,
  OracleColumnEnum.NVARCHAR2,
  OracleColumnEnum.CHAR,
  OracleColumnEnum.NUMBER,
  OracleColumnEnum.FLOAT,
  OracleColumnEnum.DATE,
  OracleColumnEnum.TIMESTAMP,
  OracleColumnEnum.NCHAR,
  OracleColumnEnum.CLOB,
  OracleColumnEnum.NCLOB,
  OracleColumnEnum.LONG,
  OracleColumnEnum.RAW,
  OracleColumnEnum.BLOB,
  OracleColumnEnum.BFILE,
  OracleColumnEnum.BINARY_FLOAT,
  OracleColumnEnum.BINARY_DOUBLE,
  OracleColumnEnum.TIMESTAMP_WITH_TIME_ZONE,
  OracleColumnEnum.TIMESTAMP_WITH_LOCAL_TIME_ZONE,
  // OracleColumnEnum.INTERVAL_YEAR_TO_MONTH,
  // OracleColumnEnum.INTERVAL_DAY_TO_SECOND,
  OracleColumnEnum.JSON,
];
