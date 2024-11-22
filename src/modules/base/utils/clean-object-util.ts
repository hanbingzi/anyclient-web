// 在一个函数里，改变传入的对象本身是不好的
import { isEmpty } from './object-util';

export const cleanObjectUtil = (object?: { [key: string]: unknown }) => {
  // Object.assign({}, object)
  if (!object) {
    return {};
  }
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isEmpty(value)) {
      delete result[key];
    }
  });
  return result;
};
