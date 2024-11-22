// bigint: JDBC 数据类型 - Long
// binary: JDBC 数据类型 - byte[]
// bit: JDBC 数据类型 - Boolean
// char: JDBC 数据类型 - String
// date: JDBC 数据类型 - Date
// datetime: JDBC 数据类型 - Timestamp
// datetime2: JDBC 数据类型 - Timestamp
// datetimeoffset: JDBC 数据类型 - Timestamp
// decimal: JDBC 数据类型 - BigDecimal
// float: JDBC 数据类型 - Double
// image: JDBC 数据类型 - byte[]
// int: JDBC 数据类型 - Integer
// money: JDBC 数据类型 - BigDecimal
// nchar: JDBC 数据类型 - String
// ntext: JDBC 数据类型 - String
// numeric: JDBC 数据类型 - BigDecimal
// nvarchar: JDBC 数据类型 - String
// real: JDBC 数据类型 - Float
// smalldatetime: JDBC 数据类型 - Timestamp
// smallint: JDBC 数据类型 - Short
// smallmoney: JDBC 数据类型 - BigDecimal
// text: JDBC 数据类型 - String
// time: JDBC 数据类型 - Time
// timestamp: JDBC 数据类型 - byte[]
// tinyint: JDBC 数据类型 - Short
// uniqueidentifier: JDBC 数据类型 - String
// varbinary: JDBC 数据类型 - byte[]
// varchar: JDBC 数据类型 - String
export enum MssqlColumnEnum {
  bigint = 'bigint',
  binary = 'binary',
  bit = 'bit',
  char = 'char',
  date = 'date',
  datetime = 'datetime',
  datetime2 = 'datetime2',
  datetimeoffset = 'datetimeoffset',
  decimal = 'decimal',
  float = 'float',
  image = 'image',
  int = 'int',
  money = 'money',
  nchar = 'nchar',
  ntext = 'ntext',
  numeric = 'numeric',
  nvarchar = 'nvarchar',
  real = 'real',
  smalldatetime = 'smalldatetime',
  smallint = 'smallint',
  smallmoney = 'smallmoney',
  text = 'text',
  time = 'time',
  timestamp = 'timestamp',
  tinyint = 'tinyint',
  uniqueidentifier = 'uniqueidentifier',
  varbinary = 'varbinary',
  varchar = 'varchar',
}

/**
 * Mssql 下拉类型选择
 */
export const MssqlColumnType: string[] = [
  //常用放前面
  MssqlColumnEnum.int ,
  MssqlColumnEnum. bigint ,
  MssqlColumnEnum.date ,
  MssqlColumnEnum.datetime ,
  MssqlColumnEnum.varchar ,
  MssqlColumnEnum.nvarchar ,
  MssqlColumnEnum.bit ,
  MssqlColumnEnum.char ,
  //后面的是不常用的
  MssqlColumnEnum.binary ,

  MssqlColumnEnum.datetime2 ,
  MssqlColumnEnum.datetimeoffset ,
  MssqlColumnEnum.decimal ,
  MssqlColumnEnum.float ,
  MssqlColumnEnum.image ,

  MssqlColumnEnum.money ,
  MssqlColumnEnum.nchar ,
  MssqlColumnEnum.ntext ,
  MssqlColumnEnum.numeric ,

  MssqlColumnEnum.real ,
  MssqlColumnEnum.smalldatetime ,
  MssqlColumnEnum.smallint ,
  MssqlColumnEnum.smallmoney ,
  MssqlColumnEnum.text ,
  MssqlColumnEnum.time ,
  MssqlColumnEnum.timestamp ,
  MssqlColumnEnum.tinyint ,
  MssqlColumnEnum.uniqueidentifier ,
  MssqlColumnEnum.varbinary ,





];
