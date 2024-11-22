import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';
import { COMMON_COMMANDS } from './common.menu';

export namespace REDIS_COMMANDS {
  export const redisServer: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    COMMON_COMMANDS.connect,
    [CommandIds.editServer],
    //[CommandIds.runRedisFile],
    [CommandIds.cmdView],
  ];

  export const redisDb: Command[][] = [
    [CommandIds.filterSearch],
    [CommandIds.newQuery],
    [{ ...CommandIds.create, label: '新建Key' }],
    [CommandIds.refresh],
    [CommandIds.redisKeySearchCmd],
    [...CommandIds.redisKeyAddCmdMenu],
    [CommandIds.redisKeyDeleteCmd, CommandIds.redisKeyExpireCmd, CommandIds.redisKeyTtlCmd],
  ];
  export const redisNode: Command[][] = [
    [{ ...CommandIds.create, label: '新建Key' }],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [{ ...CommandIds._delete, label: '删除目录' }],
    [CommandIds.redisKeySearchCmd],
    [...CommandIds.redisKeyAddCmdMenu],
    [CommandIds.redisKeyDeleteCmd, CommandIds.redisKeyExpireCmd, CommandIds.redisKeyTtlCmd],

  ];

  // 菜单排序尊许增 查 删 其他
  // 适用于redis
  /**
   * SET key value          # 设置键值对
   * GET key                # 获取键的值
   * DEL key                # 删除键
   * INCR key               # 将键的整数值加1
   * DECR key               # 将键的整数值减1
   * EXPIRE key seconds     # 设置键的过期时间
   * TTL key                # 查看键的剩余生存时间
   */
  export const redisStr: Command[][] = [
    [CommandIds.edit, CommandIds.refresh],
    [{ ...CommandIds._delete }],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [
      CommandIds.redisKeySetCmd,
      CommandIds.redisKeyGetCmd,
      CommandIds.redisKeyDeleteCmd,
      CommandIds.redisKeyExpireCmd,
      CommandIds.redisKeyTtlCmd,
    ],
  ];

  /**
   * LPUSH key value        # 将一个值插入到列表头部redisListKeyLPushCmd
   * RPUSH key value        # 将一个值插入到列表尾部redisListKeyRPushCmd
   * LPos key               # 返回包含元素的个数
   * LPOP key               # 移除并返回列表的第一个元素
   * RPOP key               # 移除并返回列表的最后一个元素
   * LLEN key               # 获取列表的长度
   * LRANGE key start stop  # 获取列表指定范围内的元素 redisKeyGetRangeCmd
   * LREM key count value   # 移除列表中与参数 value 相等的元素
   */
  export const redisList: Command[][] = [
    [CommandIds.edit, CommandIds.refresh],
    [{ ...CommandIds._delete }],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [
      CommandIds.redisListKeyLPushCmd,
      CommandIds.redisListKeyRPushCmd,
      CommandIds.redisKeyGetCmd,
      CommandIds.redisKeyGetLengthCmd,
      CommandIds.redisKeyExistsItemCmd,
      CommandIds.redisKeyDeleteCmd,
      CommandIds.redisKeyDeleteItemCmd,
      CommandIds.redisKeyExpireCmd,
      CommandIds.redisKeyTtlCmd,
    ],
  ];

  /**
   * HSET key field value   # 设置哈希表中的字段
   * HGET key field         # 获取哈希表中指定字段的值
   * HLEN key               # 查询 Hash 的长度
   * HDEL key field         # 删除哈希表中的字段
   * HGETALL key            # 获取哈希表中所有的字段和值
   * HEXISTS key field      # 检查哈希表中是否存在指定的字段
   * HKEYS key              # 获取哈希表中的所有字段
   * HVALS key              # 获取哈希表中所有字段的值
   */
  export const redisHash: Command[][] = [
    [CommandIds.edit, CommandIds.refresh],
    [{ ...CommandIds._delete }],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [
      CommandIds.redisHashKeySetCmd,
      { ...CommandIds.redisKeyGetCmd, label: '复制HashKey查询命令' },
      CommandIds.redisKeyGetAllCmd,
      { ...CommandIds.redisKeyExistsItemCmd, label: '复制检查HashKey是否存在指定字段' },
      CommandIds.redisHashKeyGetKeysCmd,
      CommandIds.redisHashKeyGetValuesCmd,
      CommandIds.redisKeyGetLengthCmd,
      CommandIds.redisKeyDeleteCmd,
      CommandIds.redisKeyDeleteItemCmd,
      CommandIds.redisKeyExpireCmd,
      CommandIds.redisKeyTtlCmd,
    ],
  ];

  /**
   * SADD key member        # 添加一个元素到集合 redisSetKeySetCmd
   * SREM key member        # 移除集合中的指定元素 redisKeyDeleteItemCmd
   * SMEMBERS key           # 返回集合中的所有成员 redisKeyGetAllCmd
   * SISMEMBER key member   # 判断成员元素是否是集合的成员 redisKeyExistsItemCmd
   * SCARD key              # 获取集合的成员数 redisKeyGetLengthCmd,
   * SINTER key1 key2       # 返回给定所有集合的交集
   * SUNION key1 key2       # 返回所有给定集合的并集
   */
  export const redisSet: Command[][] = [
    [CommandIds.edit, CommandIds.refresh],
    [{ ...CommandIds._delete }],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [
      CommandIds.redisSetKeySetCmd,
      CommandIds.redisKeyGetCmd,
      // CommandIds.redisKeyGetAllCmd,
      CommandIds.redisKeyGetLengthCmd,
      CommandIds.redisKeyExistsItemCmd,

      CommandIds.redisKeyDeleteCmd,
      CommandIds.redisKeyDeleteItemCmd,

      CommandIds.redisKeyExpireCmd,
      CommandIds.redisKeyTtlCmd,
    ],
  ];
  /**
   * ZADD key score member  # 添加元素到有序集合 redisSetKeySetCmd
   * ZRANGE key start stop  # 通过索引区间返回有序集合成指定区间内的成员 redisKeyGetRangeCmd
   * ZREM key member        # 移除有序集合中的一个成员 redisKeyDeleteItemCmd
   * ZRANK key member       # 返回有序集合中指定成员的索引
   * ZCARD key              # 获取有序集合的成员数 redisKeyGetLengthCmd
   * ZSCORE key member      # 返回有序集合中，成员的分数值
   */
  export const redisZSet: Command[][] = [
    [CommandIds.edit, CommandIds.refresh],
    [{ ...CommandIds._delete }],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [
      CommandIds.redisZSetKeySetCmd,
      CommandIds.redisKeyGetCmd,
      CommandIds.redisKeyGetLengthCmd,
      CommandIds.redisKeyExistsItemCmd,

      CommandIds.redisKeyDeleteCmd,
      CommandIds.redisKeyDeleteItemCmd,

      CommandIds.redisKeyExpireCmd,
      CommandIds.redisKeyTtlCmd,
    ],
  ];
}
