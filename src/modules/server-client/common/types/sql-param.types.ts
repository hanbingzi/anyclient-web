import { DataInputEnum } from '../../../base/types/edit-input.types';

export interface CreateIndexParam {
  table: string;
  column: string;
  type: string;
  indexType: string;
}

export interface CreateTableParam {
  table: string;
  columns: CreateColumnParam[];
  primaryKeys?: string[];
  engine?: string;
  charset?: string;
}

export interface CreateColumnParam {
  columnName: string;
  columnType: string;
  columnLength?: string;
  columnScale?: string;
  notNull?: boolean;
  defaultValue?: any;
  comment?: string;
  //isPrimary?:boolean;
  autoIncrement?: string;
  extra?: string; //'auto_increment'
}

export interface UpdateColumnParam {
  //table: string;

  columnName?: string;
  newColumnName?: string;
  columnType?: string;
  newColumnType?: string;
  columnLength?: string;
  newColumnLength?: string;
  columnScale?: string;
  newColumnScale?: string;
  notNull?: boolean;
  newNotNull?: boolean;
  defaultValue?: string;
  newDefaultValue?: string;
  comment?: string;
  newComment?: string;
  isPrimary?: boolean;
  autoIncrement?: string;
  newAutoIncrement?: string;
  //extra: string;
}

export interface SortColumnParam {
  beforeKey?: string;
  columnName: string;
  columnType: string;
  columnLength: number;
}

export interface DeleteColumnParam {
  columnName: string;
}

export class UpdateTableParam {
  database?: string;
  table: string;
  newTableName: string;
  comment: string;
  newComment: string;
}

export interface UpdateParam {
  id?: string | number;
  idName?: string;
  idType?: string;
  updateData: Set<UpdateValueParam>;
}

export interface UpdateCompositeKeyParam {
  keys?: CompositeKeyParam[];
  updateData: Set<UpdateValueParam>;
}

export interface UpdateValueParam {
  columnName: string;
  newValue: any;
  valueType: DataInputEnum;
}

export interface CompositeKeyParam {
  primaryKey: string;
  primaryValue: string | number;
  valueType: DataInputEnum;
}
