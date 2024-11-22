import React from 'react';

import ABCIcon from './abc-icon';
import BitIcon from './bit-icon';
import BooleanIcon from './boolean-icon';
import DateIcon from './date-icon';
import JsonIcon from './json-icon';
import ListIcon from './list-icon';
import MapIcon from './map-icon';
import NumberIcon from './number-icon';
import SetIcon from './set-icon';
import TimeIcon from './time-icon';
import { File } from '../node';

export { default as ABCIcon } from './abc-icon';
export { default as BitIcon } from './bit-icon';
export { default as BooleanIcon } from './boolean-icon';
export { default as DateIcon } from './date-icon';
export { default as HashIcon } from './hash-icon';
export { default as JsonIcon } from './json-icon';
export { default as ListIcon } from './list-icon';
export { default as MapIcon } from './map-icon';
export { default as NumberIcon } from './number-icon';
export { default as SetIcon } from './set-icon';
export { default as StringIcon } from './string-icon';
export { default as TimeIcon } from './time-icon';
export { default as ZSetIcon } from './zset-icon';

export function FontTypeIcon({ fontType }: { fontType: string }) {
  switch (fontType) {
    case 'string':
      return <ABCIcon />;
    case 'byte':
    case 'short':
    case 'int':
    case 'long':
    case 'float':
    case 'double':
    case 'number':
    case 'bigDecimal':
      return <NumberIcon />;
    case 'boolean':
      return <BooleanIcon />;
    case 'timestamp':
    case 'time':
      return <TimeIcon />;
    case 'date':
    case 'datetime':
    case 'year':
    case 'month':
      return <DateIcon />;
    case 'bytes':
    case 'blob':
    case 'clob':
      return <File />;
    case 'file':
      return <File />;
    case 'json':
      return <JsonIcon />;
    case 'bit':
      return <BitIcon />;
    case 'list':
      return <ListIcon />;
    case 'map':
      return <MapIcon />;
    case 'set':
      return <SetIcon />;
    default:
      return null;
  }
}
