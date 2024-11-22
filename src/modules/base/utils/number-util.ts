import { isEmpty } from './object-util';

export const range = (start: number, end: number) => {
  const array: number[] = [];
  const inc = end - start > 0;
  for (let i = start; inc ? i <= end : i >= end; inc ? i++ : i--) {
    inc ? array.push(i) : array.unshift(i);
  }
  return array;
};

export const isCanNumber=(value:any)=>{
  if(isEmpty(value)){
    return false;
  }
  if(typeof value === 'number'){
    return true;
  }
  //判断给的字符串能不能转换为number
  const regex =  /^-?\d+(\.\d+)?$/;
  if (regex.test(value)) {
    return true
  }
  return false;
}
