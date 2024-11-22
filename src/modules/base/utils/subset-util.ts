/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
export const subsetUtil = <O extends { [key in string]: unknown }, K extends keyof O>(obj: O, keys: K[]) => {
  const filteredEntries = Object.entries(obj).filter(([key]) => keys.includes(key as K));
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};
