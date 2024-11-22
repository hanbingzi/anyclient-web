export class RedisDialect {

  // 适用于redis
  public searchKey(key: string = 'key*'): string {
    return `KEYS ${key}`;
  }
  //-------------------String 类型操作------------------------------------>>>>
  //SET key value          # 设置键值对
  public setKeyValue(key: string = 'key', value: any = 'value'): string {
    return `SET ${key} ${value}`;
  }

  //GET key                # 获取键的值
  public getKeyValue(key: string = 'key') {
    return `GET ${key}`;
  }

  // * DEL key                # 删除键
  public delKey(key: string = 'key') {
    return `DEL ${key}`;
  }

  // * INCR key               # 将键的整数值加1
  // * DECR key               # 将键的整数值减1

  // * EXPIRE key seconds     # 设置键的过期时间
  public expireKey(key: string = 'key', seconds?: number) {
    return `EXPIRE ${key} ${seconds ? seconds : 'seconds'}`;
  }

  // * TTL key                # 查看键的剩余生存时间
  public ttlKey(key: string = 'key') {
    return `TTL ${key}`;
  }

  //-------------------List 类型操作------------------------------------>>>>
  // * LPUSH key value        # 将一个值插入到列表头部redisListKeyLPushCmd
  public lPushKeyValue(key: string = 'key', value: any = 'value') {
    return `LPUSH ${key} ${value}`;
  }

  // * RPUSH key value        # 将一个值插入到列表尾部redisListKeyRPushCmd
  public rPushKeyValue(key: string = 'key', value: any = 'value') {
    return `RPUSH ${key} ${value}`;
  }
  //LPos key               # 返回包含元素的个数
  public lPosKey(key: string = 'key', value: any = 'value') {
    return `LPOS ${key} ${value}`;
  }
  // * LPOP key               # 移除并返回列表的第一个元素
  public lPopKey(key: string = 'key') {
    return `LPOP ${key}`;
  }

  // * RPOP key               # 移除并返回列表的最后一个元素
  public rPopKey(key: string = 'key') {
    return `RPOP ${key}`;
  }

  // * LLEN key               # 获取列表的长度
  public lLenKey(key: string = 'key') {
    return `LLEN ${key}`;
  }

  // * LRANGE key start stop  # 获取列表指定范围内的元素 redisKeyGetRangeCmd
  public lRangeKey(key: string = 'key', start: number = 0, stop: number = -1) {
    return `LRANGE ${key} ${start} ${stop}`;
  }

  // * LREM key count value   # 移除列表中与参数 value 相等的元素
  public lRemKeyValue(key: string = 'key', count: number = 1, value: any = 'value') {
    return `LREM ${key} ${count} ${value}`;
  }


  //-------------------Hash 类型操作------------------------------------>>>>
  // * HSET key field value   # 设置哈希表中的字段
  public hSetKeyFieldValue(key: string = 'key', field: string = 'field', value: any = 'value') {
    return `HSET ${key} ${field} ${value}`;
  }

  // * HGET key field         # 获取哈希表中指定字段的值
  public hGetKeyField(key: string = 'key', field: string = 'field') {
    return `HGET ${key} ${field}`;
  }

  //HLEN key               # 查询 Hash 的长度
  public hLenKey(key: string = 'key') {
    return `HLEN ${key}`;
  }

  // * HDEL key field         # 删除哈希表中的字段
  public hDelKeyField(key: string = 'key', field: string = 'field') {
    return `HDEL ${key} ${field}`;
  }

  // * HGETALL key            # 获取哈希表中所有的字段和值
  public hGetAll(key: string = 'key') {
    return `HGETALL ${key}`;
  }

  // * HEXISTS key field      # 检查哈希表中是否存在指定的字段
  public hExistsKeyField(key: string = 'key', field: string = 'field') {
    return `HEXISTS ${key} ${field}`;
  }

  // * HKEYS key              # 获取哈希表中的所有字段
  public hKeysKey(key: string = 'key') {
    return `HKEYS ${key}`;
  }

  // * HVALS key              # 获取哈希表中所有字段的值
  public hValsKey(key: string = 'key') {
    return `HVALS ${key}`;
  }


  //-------------------Set 类型操作------------------------------------>>>>
  // * SADD key member        # 添加一个元素到集合 redisSetKeySetCmd
  public sAddKeyMember(key: string = 'key', member: any = 'member') {
    return `SADD ${key} ${member}`;
  }

  // * SREM key member        # 移除集合中的指定元素 redisKeyDeleteItemCmd
  public sRemKeyMember(key: string = 'key', member: any = 'member') {
    return `SREM ${key} ${member}`;
  }

  // * SMEMBERS key           # 返回集合中的所有成员 redisKeyGetAllCmd
  public sMembersKey(key: string = 'key') {
    return `SMEMBERS ${key}`;
  }

  // * SISMEMBER key member   # 判断成员元素是否是集合的成员 redisKeyExistsItemCmd
  public sIsMember(key: string = 'key', member: any = 'member') {
    return `SISMEMBER ${key} ${member}`;
  }

  // * SCARD key              # 获取集合的成员数 redisKeyGetLengthCmd,
  public sCardKey(key: string = 'key') {
    return `SCARD ${key} `;
  }

  // * SINTER key1 key2       # 返回给定所有集合的交集

  // * SUNION key1 key2       # 返回所有给定集合的并集

  //-------------------ZSET 类型操作------------------------------------>>>>
  // * ZADD key score member  # 添加元素到有序集合 redisSetKeySetCmd
  public zAddKeyMember(key: string = 'key', score: number = 1, member: any = 'member') {
    return `ZADD ${key} ${score} ${member}`;
  }

  // * ZRANGE key start stop  # 通过索引区间返回有序集合成指定区间内的成员 redisKeyGetRangeCmd
  public zRangeKey(key: string = 'key', start: number = 0, stop: number = 1) {
    return `ZRANGE ${key} ${start} ${stop}`;
  }

  // * ZREM key member        # 移除有序集合中的一个成员 redisKeyDeleteItemCmd
  public zRemKeyMember(key: string = 'key', member: any = 'member') {
    return `ZREM ${key} ${member}`;
  }

  // * ZRANK key member       # 返回有序集合中指定成员的索引
  public zRankKeyMember(key: string = 'key', member: any = 'member') {
    return `ZRANK ${key} ${member}`;
  }

  // * ZCARD key              # 获取有序集合的成员数 redisKeyGetLengthCmd
  public zCardKey(key: string = 'key') {
    return `ZCARD ${key}`;
  }

  // * ZSCORE key member      # 返回有序集合中，成员的分数值
  public zScore(key: string = 'key', member: any='member') {
    return `ZSCORE ${key} ${member}`;
  }
}
