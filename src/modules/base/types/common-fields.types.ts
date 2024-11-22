export enum RedisType {
  hash = 'hash',
  list = 'list',
  string = 'string',
  zset = 'zset',
  set = 'set',
}

export type RedisInputType = 'string' | 'hash' | 'list' | 'set' | 'zset';

export const RedisInputOption: RedisInputType[] = ['string', 'hash', 'list', 'set', 'zset'];
