import { DataInputEnum } from '../../../base/types/edit-input.types';

/**
 * column meta info
 */
export interface IColumnMeta {
  //实际的字段名称
  name: string;
  //重命名的字段名称
  label: string;
  columnType: string;
  dataType?: DataInputEnum;
  columnDefinition?: string;
  columnLength?: string|number;
  columnScale?: string |number;
  //最大长度，暂时无用
  maxLength?: string|number;
  //yes or no
  nullable?: string |number;
  defaultValue?: any;
  comment?: string;
  tableName?: string;
  key?: string;
  autoIncrement?: string|number;
  extra?: any;
  isNotNull?: boolean;
  isUnique?: boolean;
  isPrimary?: boolean;
  pk?: string;
  isAutoIncrement?: boolean;
  //isIdentity?: boolean;
  identitySeed?: number;
  identityIncrement?: number;
}

export interface IPrimaryMeta {
  tableName: string;
  columnName: string;
  columnType: string;
  ordinal: number;
  constraint?: string;
}

export interface ITableMeta {
  name: string;
  comment: string;
  constraint?: string;
  charset?: string;
  engine?: string;
}

/**
 * view function trigger sequence produce 展示需要
 */
export interface IVFTSPInfo {
  name: string;
  comment: string;
  tableName: string;
}
