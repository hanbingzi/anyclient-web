import { format } from 'ts-date';

export class DateUtil {
  public static DATETIME_STR = 'YYYY-MM-DD HH:mm:ss';
  public static DATE_STR_yyyy_MM_dd = 'YYYY-MM-DD';
  public static DATE_STR_yyyyMMdd = 'YYYYMMDD';
  public static TIMESTAMP = 'YYYY-MM-DD HH:mm:ss.SSS';
  public static TIME_STR = 'HH:mm:ss';

  public static getDateString(date?: Date): string;
  public static getDateString(date?: Date, formatStr?: string): string;
  public static getDateString(date?: Date, formatStr?: string): string {
    if (date) {
      return format(date, formatStr ? formatStr : DateUtil.DATETIME_STR)!;
    }
    return format(new Date(), formatStr ? formatStr : DateUtil.DATETIME_STR)!;
  }

  public static timestampToString(timestamp: number): string | null {
    return format(new Date(timestamp), DateUtil.DATETIME_STR);
  }
}
