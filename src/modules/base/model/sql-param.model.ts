import { DataInputEnum } from '../types/edit-input.types';
import { WhereType } from '../types/sql.types';

export interface IWhereParam {
  columnKey?: string;
  columnType?: DataInputEnum | string;
  whereValue?: string | number | string[] | number[];
  whereType?: WhereType;
}

export interface ISetParam {
  columnKey?: string;
  columnType?: DataInputEnum;
  setValue?: string | number | string[] | number[];
}
