//input输入类型
export enum DataInputEnum {
  string = 'string',
  //处理方式等于number
  //short int long float double bigDecimal
  byte = 'byte',
  short = 'short',
  int = 'int',
  long = 'long',
  float = 'float',
  double = 'double',
  bigDecimal = 'bigDecimal',
  number = 'number',
  date = 'date',
  time = 'time',
  datetime = 'datetime',
  timestamp = 'timestamp',
  year = 'year',
  month = 'month',
  day = 'day',
  bytes = 'bytes',
  blob = 'blob',
  clob = 'clob',
  file = 'file',
  json = 'json',
  boolean = 'boolean',
  bit = 'bit',
}

export enum SimpleDataInputEnum {
  string = 'string',
  //处理方式等于number
  //short int long float double bigDecimal
  // short = 'short',
  // int = 'int',
  // long = 'long',
  // float = 'float',
  // double = 'double',
  // bigDecimal = 'bigDecimal',
  number = 'number',
  // date = 'date',
  time = 'time',
  // datetime = 'datetime',
  // timestamp = 'timestamp',
  // year = 'year',
  // month = 'month',
  // day = 'day',
  // blob = 'blob',
  // clob = 'clob',
  file = 'file',
  json = 'json',
  boolean = 'boolean',
  bit = 'bit',
}

export function DataInputToSimple(valueType: DataInputEnum): SimpleDataInputEnum {
  switch (valueType) {
    case DataInputEnum.string:
      return SimpleDataInputEnum.string;
    case DataInputEnum.byte:
    case DataInputEnum.short:
    case DataInputEnum.int:
    case DataInputEnum.long:
    case DataInputEnum.float:
    case DataInputEnum.double:
    case DataInputEnum.bigDecimal:
    case DataInputEnum.number:
      return SimpleDataInputEnum.number;
    case DataInputEnum.date:
    case DataInputEnum.time:
    case DataInputEnum.datetime:
    case DataInputEnum.timestamp:
    case DataInputEnum.year:
    case DataInputEnum.month:
    case DataInputEnum.day:
      return SimpleDataInputEnum.time;
    case DataInputEnum.bytes:
    case DataInputEnum.blob:
    case DataInputEnum.clob:
    case DataInputEnum.file:
      return SimpleDataInputEnum.file;
    case DataInputEnum.json:
      return SimpleDataInputEnum.json;
    case DataInputEnum.boolean:
      return SimpleDataInputEnum.boolean;
    case DataInputEnum.bit:
      return SimpleDataInputEnum.bit;
  }
}

export function isFile(valueType: DataInputEnum): boolean {
  return DataInputToSimple(valueType) === SimpleDataInputEnum.file;
}
