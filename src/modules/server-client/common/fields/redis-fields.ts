export enum RedisOptionEnum {
  query,
  option,
  server,
  other,
}

export enum RedisResultEnum {
  string = 'string',
  list = 'list',
  oneList = 'oneList',
  object = 'object',
  number = 'number',
  bit = 'bit',
}

export enum RedisKeyEnum {
  //这些命令都带key
  type = 'type',
  pexpireat = 'perpireat',
  rename = 'rename',
  persist = 'persist',
  move = 'move',
  dump = 'dump',
  ttl = 'ttl',
  expire = 'expire',
  del = 'del',
  pttl = 'pttl',
  renamenx = 'renamenx',
  exists = 'exists',
  expireat = 'expireat',
  keys = 'keys',
}

export enum RedisStringEnum {
  /**
   * 有多个key的情况
   * mset ，
   */
  setnx = 'setnx',
  getrange = 'getrange',
  mset = 'mset',
  setex = 'setex',
  set = 'set',
  get = 'get',
  getbit = 'getbit',
  setbit = 'setbit',
  desc = 'desc',
  decrby = 'decrby',
  strlen = 'strlen',
  msetnx = 'msetnx',
  incrby = 'incrby',
  incrbyfloat = 'incrbyfloat',
  setrange = 'setrange',
  psetex = 'psetex',
  append = 'append',
  getset = 'getset',
  mget = 'mget',
  incr = 'incr',
}

export enum RedisHashEnum {
  Hmset = 'hmset',
  Hmget = 'hmget',
  Hset = 'hset',
  Hgetall = 'hgetall',
  Hget = 'hget',
  Hexists = 'hexists',
  Hincrby = 'hincrby',
  Hlen = 'hlen',
  Hdel = 'hdel',
  Hvals = 'hvals',
  Hincrbyfloat = 'hincrbyfloat',
  Hkeys = 'hkeys',
  Hsetnx = 'hsetnx',
}

export enum RedisListEnum {
  Lindex = 'lindex',
  Rpush = 'rpush',
  Lrange = 'lrange',
  Rpoplpush = 'rpoplpush',
  Blpop = 'blpop',
  Brpop = 'brpop',
  Brpoplpush = 'brpoplpush',
  Lrem = 'lrem',
  Llen = 'llen',
  Lpos = 'lpos',
  Ltrim = 'ltrim',
  Lpop = 'lpop',
  Lpushx = 'lpushx',
  Linsert = 'linsert',
  Rpop = 'rpop',
  Lset = 'lset',
  Lpush = 'lpush',
  Rpushx = 'rpushx',
}

export enum RedisSetEnum {
  Sunion = 'sunion',
  Scard = 'scard',
  Srandmember = 'srandmember',
  Smembers = 'smembers',
  Sinter = 'sinter',
  Srem = 'srem',
  Smove = 'smove',
  Sadd = 'sadd',
  Sismemer = 'sismemer',
  Sdiffstore = 'sdiffstore',
  Sdiff = 'sdiff',
  Sscaan = 'sscaan',
  Sinterstore = 'sinterstore',
  Sunionstore = 'sunionstore',
  Spop = 'spop',
}

export enum RedisZSetEnum {
  Zrevrank = 'zrevrank',
  Zlexcount = 'zlexcount',
  Zunionstore = 'zunionstore',
  Zremrangebyrank = 'zremrangebyrank',
  Zcard = 'zcard',
  Zrem = 'zrem',
  Zinterstore = 'zinterstore',
  Zrank = 'zrank',
  Zincrby = 'zincrby',
  Zrangebyscore = 'zrangebyscore',
  Zrangebylex = 'zrangebylex',
  Zscore = 'zscore',
  Zremrangebyscore = 'zremrangebyscore',
  Zscan = 'zscan',
  Zrevrangebyscore = 'zrevrangebyscore',
  Zremrangebylex = 'zremrangebylex',
  Zrevrange = 'zrevrange',
  Zrange = 'zrange',
  Zcount = 'zcount',
  Zadd = 'zadd',
}

export enum RedisConnectEnum {
  Echo = 'echo',
  Select = 'select',
  Ping = 'ping',
  Quit = 'quit',
  Auth = 'auth',
}

export enum RedisServerEnum {
  Flushdb = 'flushdb',
  Save = 'save',
  Showlog = 'showlog',
  Lastsave = 'lastsave',
  Command = 'command',
  Slaveof = 'slaveof',
  Flushall = 'flushall',
  Dbsize = 'dbsize',
  Bgrewriteaof = 'bgrewriteaof',
  Cluster_Slots = 'cluster slots',
  Config_Set = 'config set',
  Command_Info = 'command info',
  Shutdown = 'shutdown',
  Sync = 'sync',
  Client_Kill = 'sync',
  Role = 'role',
  Monitor = 'monitor',
  Command_Getkeys = 'command getkeys',
  Client_Getname = 'client getname',
  Config_Resetstat = 'config resetstat',
  Command_Count = 'command count',
  Time = 'time',
  Info = 'info',
  Config_rewrite = 'config rewrite',
  Client_List = 'client list',
  Client_Setname = 'client setname',
  Bgsave = 'bgsave',
}

export enum RedisScriptEnum {
  Script_kill = 'script kill',
  Script_Load = 'script Load',
  Eval = 'eval',
  Evalsha = 'evalsha',
  Script_Exists = 'script exists',
  Script_Flush = 'script flush',
}

export enum RedisTransactionEnum {
  Exec = 'exec',
  Watch = 'watch',
  Discrad = 'discrad',
  Unwatch = 'unwatch',
  Multi = 'multi',
}

export enum RedisHyperLogLogEnum {
  Pgmerge = 'pgmerge',
  Pfadd = 'pfadd',
  Pfcount = 'pfcount',
}

export enum RedisSubscribeEnum {
  Unsubscribe = 'unsubscribe',
  Subscribe = 'subscribe',
  Pubsub = 'pubsub',
  Punsubscribe = 'punsubscribe',
  Publish = 'publish',
  Psubscribe = 'psubscribe',
}

export enum RedisGeoEnum {
  Geohash = 'geohash',
  Geopos = 'geopos',
  Geodist = 'geodist',
  Georadius = 'georadius',
  Geoadd = 'geoadd',
  Georadiusbymember = 'georadiusbymember',
}
