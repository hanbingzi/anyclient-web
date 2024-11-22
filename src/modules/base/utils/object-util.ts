export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

/**
 *
 * @param value
 */
export const isEmpty = (value: unknown) => value === undefined || value === null || value === '';

export const isNotEmpty = (value: unknown) => !isEmpty(value);


/**
 * 判断数据是否为空
 * @param value
 */
export const isNull = (value: unknown) => value === undefined || value === null;

export const isNotNull = (value: unknown) => !isNull(value);

export const isArrayVoid = (value: any[] | null | undefined) =>
  value === undefined || value === null || value.length === 0;

export function removeNullValues(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
export function removeEmptyValues(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}
