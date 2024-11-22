/**
 * SQLite
 * SQLite 中的数字类型比较简单，因为它遵循动态类型系统。下面是它支持的数值类型字段：
 * INTEGER: 一个有符号整数，根据值的大小可以存储在1、2、3、4、6或8字节中。
 * REAL: 一个浮点值，存储为8字节的 IEEE 浮点数字。
 * MySQL
 * MySQL 支持多种数字类型，这里是一些常见的：
 *
 * 整数类型：
 * TINYINT: 非常小的整数，有符号的范围是 (-128,127)，无符号的范围是 (0, 255)。
 * SMALLINT: 小的整数，有符号的范围是 (-32768, 32767)，无符号的范围是 (0, 65535)。
 * MEDIUMINT: 中等大小的整数，有符号的范围是 (-8388608, 8388607)，无符号的范围是 (0, 16777215)。
 * INT 或 INTEGER: 标准的整数，有符号的范围是 (-2147483648, 2147483647)，无符号的范围是 (0, 4294967295)。
 * BIGINT: 大的整数，有符号的范围是 (-9223372036854775808, 9223372036854775807)，无符号的范围是 (0, 18446744073709551615)。
 * 浮点数和定点数类型：
 * FLOAT: 单精度浮点数。
 * DOUBLE: 双精度浮点数。
 * DECIMAL 或 NUMERIC: 定点数，精度和范围可以指定。
 * SQL Server
 * 在 SQL Server 中，数字类型可以分为几个类别：
 *
 * 精确数值类型：
 * bit,tinyint, smallint,  int,bigint,numeric,decimal,float,real
 * BIT: 整数类型，范围是0到1。
 * TINYINT: 0 到 255。
 * SMALLINT: -32768 到 32767。
 * INT: -2147483648 到 2147483647。
 * BIGINT: -9223372036854775808 到 9223372036854775807。
 * NUMERIC(p, s): 可以定义精度(p)和小数位数(s)的定点数。
 * DECIMAL(p, s): 同 NUMERIC，DECIMAL 和 NUMERIC 是同义词。
 * 近似数值类型：
 *
 * FLOAT(n): 从 -1.79E+308 到 1.79E+308 的浮点数，精度为n位。
 * REAL: 浮点数，精度较FLOAT低。
 * Oracle
 * Oracle 数据库的数字类型包括：
 * number, float,binary_float,binary_double,
 * NUMBER: 可以存储0、正数、负数或十进制数，在括号中指定精度和小数位。
 * NUMBER(p, s): 其中 p 是精度，s 是小数位数。如果省略 p 和 s，则表示范围和精度几乎没有限制。
 * FLOAT: 一个带有浮点数精度的数字。
 * BINARY_FLOAT: 单精度 IEEE 754 浮点数。
 * BINARY_DOUBLE: 双精度 IEEE 754 浮点数。
 *
 * PostgreSQL
 * PostgreSQL 支持多种数字数据类型，包括：
 *
 * 整数类型：
 * 整数类型：
 *
 * int2 或 SMALLINT: 16 位整数，取值范围从 -32768 到 32767。
 * int4 或 INTEGER: 32 位整数，取值范围从 -2147483648 到 2147483647。
 * int8 或 BIGINT: 64 位整数，取值范围从 -9223372036854775808 到 9223372036854775807。
 * SMALLINT: -32768 至 32767 的范围内的小整数。
 * INTEGER: -2147483648 至 2147483647 的范围内的标准整数。
 * BIGINT: -9223372036854775808 至 9223372036854775807 的范围内的大整数。
 * 序列生成器类型：
 *
 * SMALLSERIAL: SMALLINT 类型的自动增长列。
 * SERIAL: INTEGER 类型的自动增长列。
 * BIGSERIAL: BIGINT 类型的自动增长列。
 * 浮点数类型：
 *
 * REAL: 单精度浮点数。
 * DOUBLE PRECISION: 双精度浮点数。
 * 定点数类型：
 *
 * NUMERIC(precision, scale): 用户自定义精度的精确数值类型。
 * DECIMAL(precision, scale): 功能上与 NUMERIC 相同。
 * 金融数值类型：
 *
 * MONEY: 货币金额，它是一个带有固定小数点的类型，通常用于表示货币值。
 *
 *
 *
 * SQLite
 * integer,real,
 * MySQL
 * tinyint, smallint, mediumint, int, integer, bigint,float, double, decimal,
 * SQL Server
 * bit,tinyint, smallint,  int,bigint,numeric,decimal,float,real
 * Oracle
 * number, float,binary_float,binary_double,
 * PostgreSQL
 * smallint,int2, integer,int4, bigint,int8,smallint, serial,bigserial,real,double precision,numeric,decimal,money
 *
 *
 */

export const NumberColumnConfig: string[] = [
  //SQLite
  'integer',
  'real',
  //MySQL
  'tinyint',
  'smallint',
  'mediumint',
  'int',
  'integer',
  'bigint',
  'float',
  'double',
  'decimal',
  //SQL Server
  'bit',
  'tinyint',
  'smallint',
  'int',
  'bigint',
  'numeric',
  'decimal',
  'float',
  'real',
  //Oracle
  'number',
  'float',
  'binary_float',
  'binary_double',
  //PostgreSQL
  'smallint',
  'int2',
  'integer',
  'int4',
  'bigint',
  'int8',
  'smallint',
  'serial',
  'bigserial',
  'real',
  'double',
  'precision',
  'numeric',
  'decimal',
  'money',
];
