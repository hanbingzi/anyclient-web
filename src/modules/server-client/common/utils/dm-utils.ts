import { DMColumnEnum } from '../fields/dm-fields';

export class DMUtils {
  public static getColumnDefinition(simpleType: string, columnLength?: string, columnScale?: string): string {
    const upperDataType = simpleType.toUpperCase();
    switch (simpleType) {
      // NUMERIC(p,s) 或 DECIMAL(p,s)
      case DMColumnEnum.NUMERIC:
      case DMColumnEnum.DECIMAL:
        return `${simpleType}(${columnLength || 10},${columnScale || 2})`;
      // 字符串类型:
      //   CHAR(n)
      case DMColumnEnum.CHAR:
        return `${simpleType}(${columnLength || 1})`;
      // VARCHAR(n)
      case DMColumnEnum.VARCHAR:
      // VARCHAR2(n)
      case DMColumnEnum.VARCHAR2:
        return `${simpleType}(${columnLength || 255})`;
      default:
        return upperDataType;
    }
  }
}
