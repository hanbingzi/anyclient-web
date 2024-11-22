import { DataInputEnum, DataInputToSimple, SimpleDataInputEnum } from '../../../base/types/edit-input.types';
import { NumberColumnConfig } from '../../../base/config/sql.config';
import { ServerType } from '../../../base/types/server-node.types';
import { ISetParam, IWhereParam } from '../../../base/model/sql-param.model';
import { isNotEmpty, isNull } from '../../../base/utils/object-util';
import { IColumnMeta } from '../';
import { PostgresColumnEnum } from '../fields/postgres-fields';
import { MysqlColumnEnum } from '../fields/mysql-fields';
import { OracleColumnEnum } from '../fields/oracle-fields';
import { OracleUtils } from './oracle-utils';
import { MysqlConvert } from '../convert/mysql-convert';
import { PostgresConvert } from '../convert/postgres-convert';
import { OracleConvert } from '../convert/oracle-convert';
import { CommonConvert } from '../convert/common-convert';
import { MssqlConvert } from '../convert/mssql-convert';
import { MssqlColumnEnum } from '../fields/mssql-fields';

export class SqlDealUtils {
  /**
   * 防止输入的字符串还有单引号，导致出错
   * @param value
   */
  public static escapeString(value: string): string {
    return value.replace(/'/g, "''");
  }

  public static isNumColumn(columnType: DataInputEnum | string = 'string'): boolean {
    return NumberColumnConfig.includes(columnType.toLocaleLowerCase());
  }

  public static isNumColumnByServerType(serverType: ServerType, columnType: string): boolean {
    let inputType = SqlDealUtils.convertFieldsToInputType(serverType, columnType);
    return NumberColumnConfig.includes(inputType);
  }

  /**
   * 经过测试 postgres的bit使用string处理
   * @param columnType
   * @param value
   * @param server
   */
  public static getWhereValue(columnType?: DataInputEnum | string, value?: any, server?: ServerType): string {
    switch (server) {
      case 'Oracle':
        //where 查询的是否，应该会有bug
        return OracleUtils.getColumnValue(columnType, value);
      default:
        if (this.isNumColumn(columnType) || columnType === 'boolean' || value.toLowerCase() === 'null') {
          return `${value}`;
        } else {
          return `'${this.escapeString(value)}'`;
        }
    }
  }

  /**
   * 只能生成非时间类型的
   * @param whereParam
   */
  public static generateWhereSql(whereParam: IWhereParam, server?: ServerType): string {
    const { columnKey, columnType, whereType, whereValue } = whereParam;
    if (whereValue) {
      switch (whereType) {
        case '=':
          return `${columnKey} = ${this.getWhereValue(columnType!, whereValue, server)} `;
        case '<':
          return `${columnKey} < ${this.getWhereValue(columnType!, whereValue, server)} `;
        case '>':
          return `${columnKey} > ${this.getWhereValue(columnType!, whereValue, server)} `;
        case 'in':
          let inSql = `${columnKey} in `;
          if (Array.isArray(whereValue)) {
            inSql = inSql + `\(${whereValue.map((item) => this.getWhereValue(columnType!, item, server)).join(',')}\) `;
          } else {
            inSql = inSql + `(${this.getWhereValue(columnType!, whereValue, server)}) `;
          }
          return inSql;
        case 'not in':
          let notInSql = `${columnKey} in `;
          if (Array.isArray(whereValue)) {
            notInSql =
              notInSql + `\(${whereValue.map((item) => this.getWhereValue(columnType!, item, server)).join(',')}\) `;
          } else {
            notInSql = notInSql + `(${this.getWhereValue(columnType!, whereValue, server)}) `;
          }
          return notInSql;
        case 'like':
          return `${columnKey} like  \'${whereValue}\' `;
        case '<>':
          return `${columnKey} <> ${this.isNumColumn(columnType) ? whereValue : `\'${whereValue}\'`} `;
      }
    } else {
      switch (whereType) {
        case 'isNull':
          return `${columnKey} is null `;
        case 'isEmpty':
          return `${columnKey} = '' `;
      }
    }
    return '';
  }

  /**
   * 经过测试 postgres的bit使用string处理 ,有问题，时间类型和boolean应该没有完全匹配，文件类型的没有处理
   * @param columnType 目前只接受DataInputEnum类型
   * @param value
   * @param server
   */
  public static getSetValue(columnType?: DataInputEnum | string, value?: any, server?: ServerType): string {
    const simpleDataType = DataInputToSimple(columnType as DataInputEnum);
    //console.log(`getSetValue:columnType:${columnType},value:${value},server:${server}`);
    if (isNull(value) || String(value).toLowerCase() === 'null') {
      return `NULL`;
    }
    if (server === 'Oracle') {
      return OracleUtils.getColumnValue(columnType, value);
    } else {
      if ([SimpleDataInputEnum.number, SimpleDataInputEnum.boolean].includes(simpleDataType)) {
        return `${value}`;
      } else if (simpleDataType.valueOf() === 'bit') {
        if (server === 'Postgresql') {
          return `'${value}'`;
        } else {
          return `${value}`;
        }
      } else if (simpleDataType === SimpleDataInputEnum.file) {
        return 'NULL';
      } else if (simpleDataType === SimpleDataInputEnum.time) {
        return `'${value}'`;
      } else if ([SimpleDataInputEnum.string, SimpleDataInputEnum.json].includes(simpleDataType)) {
        return `'${this.escapeString(value)}'`;
      } else {
        return `'${value}'`;
      }
    }
  }

  public static generateSetSql(whereParam: ISetParam, server?: ServerType): string {
    const { columnKey, columnType, setValue } = whereParam;
    if (isNotEmpty(setValue)) {
      return `${columnKey} = ${this.getSetValue(columnType!, setValue, server)} `;
    } else {
      return `${columnKey} = NULL `;
    }
  }

  public static generateMockColumnValue(
    columnName: string,
    columnType?: DataInputEnum | string,
    server?: ServerType,
  ): string {
    switch (server) {
      case 'Oracle':
        return OracleUtils.getMockColumnValue(columnName, columnType);
      default:
        if (this.isNumColumn(columnType)) {
          return `:${columnName}`;
        } else {
          return `'${columnName}'`;
        }
    }
  }

  //判断数据在表格中在编辑的时候，展示的类型
  public static convertFieldsToInputType(serverType: ServerType, columnType: string): DataInputEnum {
    switch (serverType) {
      case 'Mariadb':
      case 'TiDB':
      case 'OceanBase':
      case 'Mysql':
        return MysqlConvert.fieldToInputType(columnType as MysqlColumnEnum);
      case 'Postgresql':
        return PostgresConvert.fieldToInputType(columnType as PostgresColumnEnum);
      case 'Oracle':
        return OracleConvert.fieldToInputType(columnType as OracleColumnEnum);
      case 'SQLServer':
        return MssqlConvert.fieldToInputType(columnType as MssqlColumnEnum);
      default:
        return CommonConvert.fieldToInputType(columnType);
    }
  }
  public static convertFieldsToSimpleType(serverType: ServerType, columnType: string): SimpleDataInputEnum {
    return DataInputToSimple(this.convertFieldsToInputType(serverType,columnType));
  }

  public static getDefaultValue(serverType: ServerType, columnType: string,defaultValue:any){
    const simpleType = SqlDealUtils.convertFieldsToSimpleType(serverType, columnType);
    //还的判断选择的类型
    let convertNewValue = `'${defaultValue}'`;
    if(simpleType === 'number' || simpleType === 'boolean' || simpleType === 'bit' || String(defaultValue).startsWith('\'')){
       convertNewValue = `${defaultValue}`;
    }
    return convertNewValue;
  }

  // public static convertFieldsIdToInputType(serverType: ServerType, columnId: number): DataInputEnum {
  //   switch (serverType) {
  //     case 'Mysql':
  //       return MysqlConvert.fieldToInputType(MysqlConvert.fieldsIdToColumn(columnId));
  //     case 'Postgresql':
  //       return PostgresConvert.fieldToInputType(PostgresConvert.fieldsIdToColumn(columnId));
  //     default:
  //       console.error('');
  //       return DataInputEnum.string;
  //   }
  // }

  /**
   *
   * @param columnMeta
   */
  public static judgeColumnIsPrimary(columnMeta: IColumnMeta) {
    if (columnMeta.isPrimary) {
      return true;
    }
    if (isNull(columnMeta.key)) {
      return false;
    }
    return columnMeta.key === 'PRI' || columnMeta.key === 'PRIMARY KEY' || columnMeta.key === 'P';
  }

  public static is(object: any, type: string): boolean {
    if (!object) return false;
    return object.__proto__.constructor.name == type;
  }
}
