import React from 'react';
//import ReactDatePicker, {ReactDatePickerProps, registerLocale} from "react-datepicker";
//import "./react-datepicker.less"
//import zhCN from 'date-fns/locale/zh-CN';
//registerLocale('zhCN', zhCN)
import { ConfigProvider, DatePicker as AntdDatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
//import '@opensumi/antd-theme/lib/index.css';

export const DateTimePicker = (props: DatePickerProps) => {
  return <AntdDatePicker {...props} />;
};
//
// export interface DatePickerProps extends ReactDatePickerProps {
//   size?: 'default' | 'large' | 'small';
// }
// export const DatePicker = (props: DatePickerProps) => {
//   const {dateFormat = "yyyy-MM-dd HH:mm:ss"} = props;
//   return (
//     <ReactDatePicker {...props}
//                      dateFormat={dateFormat}
//                      locale={'zhCN'}
//                      showPopperArrow={false}
//
//     />
//   )
//}
