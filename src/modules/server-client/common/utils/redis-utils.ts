import {
  RedisConnectEnum,
  RedisGeoEnum,
  RedisHashEnum,
  RedisHyperLogLogEnum,
  RedisKeyEnum,
  RedisListEnum,
  RedisOptionEnum,
  RedisResultEnum,
  RedisServerEnum,
  RedisSetEnum,

  RedisStringEnum, RedisZSetEnum,
} from '../fields/redis-fields';

export const RedisCommandRegexKey =
  'Type|Pexpireat|Rename|Persist|Move|Dump|TTL|Expire|DEL|Pttl|Renamenx|Exists|Expireat|keys';
export const RedisCommandRegexString =
  'Setnx|Getrange|Mset|Setex|Set|Get|Getbit|Setbit|Decr|Decrby|Strlen|Msetnx|Incrby|Incrbyfloat|Setrange|Psetex|Append|Getset|Mget|Incr';
export const RedisCommandRegexHash =
  'Hmset|Hmget|Hset|Hgetall|Hget|Hexists|Hincrby|Hlen|Hdel|Hvals|Hincrbyfloat|Hkeys|Hsetnx';
export const RedisCommandRegexList =
  'Lindex|Rpush|Lrange|Rpoplpush|LPos|Blpop|Brpop|Brpoplpush|Lrem|Llen|Ltrim|Lpop|Lpushx|Linsert|Rpop|Lset|Lpush|Rpushx';
export const RedisCommandRegexSet =
  'Sunion|Scard|Standmember|Smembers|Sismember|Sinter|Srem|Smove|Sadd|Sismemer|Sdiffstore|Sdiff|Sscaan|Sinterstore|Sunionstore|Spop';
export const RedisCommandRegexSortedSet =
  'Zrevrank|Zlexcount|Zunionstore|Zremrangebyrank|Zcard|Zrem|Zinterstore|Zrank|Zincrby|Zrangebyscore|Zrangebylex|Zscore|Zremrangebyscore|Zscan|Zrevrangebyscore|Zremrangebylex|Zrevrange|Zrange|Zcount|Zadd';
export const RedisCommandRegexConnect = 'Echo|Select|Ping|Quit|Auth';
export const RedisCommandRegexServer =
  'Flushdb|Save|Showlog|Lastsave|Command|Slaveof|Flushall|Dbsize|Bgrewriteaof|Cluster\\s+Slots|Config\\s+Set|Shutdown|Sync|Client\\s+Kill|Role|Monitor|Command\\s+Getkeys|Client\\s+Getname|Config\\s+Resetstat|Command\\s+Count|Time|Info|Config\\s+rewrite|Client\\s+List|Client\\s+Setname|Bgsave';
export const RedisCommandRegexScript = 'Script\\s+kill|Script\\s+Load|Eval|Evalsha|Script\\s+Exists|Script\\s+Flush';
export const RedisCommandRegexTransaction = 'Exec|Watch|Discrad|Unwatch|Multi';
export const RedisCommandRegexHyperLogLog = 'Pgmerge|Pfadd|Pfcount';
export const RedisCommandRegexSubscribe = 'Unsubscribe|Subscribe|Pubsub|Punsubscribe|Publish|Psubscribe';
export const RedisCommandRegexGeo = 'Geohash|Geopos|Geodist|Georadius|Geoadd|Georadiusbymember';

//特殊不带key keys *,randomkey
export interface IRedisCommandParser {
  command: string;
  args?: string[];
  option: RedisOptionEnum;
  resultType: RedisResultEnum;
}

// key:Type, Pexpireat, Rename, Persist, Move,Dump,TTL,Expire,DEL,Pttl,Renamenx,Exists,Expireat,keys;
// string:Setnx,Getrange,Mset,Setex,Set,Get,Getbit,Setbit,Decr,Decrby,Strlen,Msetnx,Incrby,Incrbyfloat,Setrange,Psetex,Append,Getset,Mget,Incr;
// Hash:Hmset,Hmget-,Hset,Hgetall,Hget,Hexists,Hincrby,Hlen,Hdel,Hvals-,Hincrbyfloat,Hkeys-,Hsetnx;
// List:Lindex-,Rpush,Lrange,Rpoplpush,Blpop,Brpop,Brpoplpush,Lrem,Llen,Ltrim,Lpop,Lpushx,Linsert,Rpop,Lset,Lpush,Rpushx
// Set:Sunion,Scard,Standmember,Smembers,Sinter,Srem,Smove,Sadd,Sismemer,Sdiffstore,Sdiff,Sscaan,Sinterstore,Sunionstore,Spop
// Sorted Set:Zrevrank,Zlexcount,Zunionstore,Zremrangebyrank,Zcard,Zrem,Zinterstore,Zrank,Zincrby,Zrangebyscore,Zrangebylex,Zscore,Zremrangebyscore,Zscan,Zrevrangebyscore,Zremrangebylex,Zrevrange,Zrange,Zcount,Zadd,
// Server:Flushdb,Save,Showlog,Lastsave,Command,Slaveof,Flushall,Dbsize,Bgrewriteaof,Cluster Slots,Config Set,Shutdown,Sync ,Client Kill ,Role,Monitor,Command Getkeys,Client Getname,Config Resetstat,Command Count,Time,Info,Config rewrite,Client List,Client Setname,Bgsave
// 脚本:Script kill,Script Load,Eval,Evalsha,Script Exists,Script Flush,
// 事务 命令:Exec, Watch,Discrad,Unwatch,Multi,
// HyperLogLog:Pgmerge,Pfadd,Pfcount
// 发布订阅:Unsubscribe,Subscribe,Pubsub,Punsubscribe,Publish,Psubscribe,
// Geo:Geohash,Geopos,Geodist,Georadius,Geoadd,Georadiusbymember

export class RedisUtils {
  //疑问的：hvals，
  //查询key，

  public static QueryForList: string[] = [
    RedisKeyEnum.keys,
    RedisStringEnum.mget,

    RedisHashEnum.Hmget,
    RedisHashEnum.Hkeys,
    RedisHashEnum.Hvals,

    RedisListEnum.Lrange,
    RedisSetEnum.Sunion,
    RedisSetEnum.Srandmember,
    RedisSetEnum.Smembers,

    RedisSetEnum.Sinter,

    RedisSetEnum.Sdiffstore,
    RedisSetEnum.Sdiff,
    RedisSetEnum.Sscaan,
    RedisSetEnum.Sinterstore,
    RedisSetEnum.Sunionstore,
    RedisSetEnum.Spop,

    RedisZSetEnum.Zrevrank,
    RedisZSetEnum.Zlexcount,
    RedisZSetEnum.Zrange,
    RedisZSetEnum.Zrevrange,
    RedisZSetEnum.Zrangebyscore,
    RedisZSetEnum.Zrevrangebyscore,
    RedisZSetEnum.Zscan,

    RedisConnectEnum.Echo,
    RedisServerEnum.Lastsave,
    RedisServerEnum.Command,
    RedisServerEnum.Cluster_Slots,
    RedisServerEnum.Command_Info,
    RedisServerEnum.Role,
    RedisServerEnum.Command_Getkeys,
    RedisServerEnum.Client_Getname,
    RedisServerEnum.Time,
    RedisServerEnum.Client_List,

    RedisGeoEnum.Geohash,
    RedisGeoEnum.Geopos,
    RedisGeoEnum.Geodist,
    RedisGeoEnum.Georadius,
    RedisGeoEnum.Georadiusbymember,
  ];
  // 这种类型比较特殊，返回的数据是string，但需要用表格展示
  public static QueryForOneList: string[] = [RedisKeyEnum.type,RedisHashEnum.Hget];
  public static QueryForString: string[] = [RedisStringEnum.get, RedisListEnum.Lindex];
  public static QueryForNumber: string[] = [
    RedisKeyEnum.ttl,
    RedisKeyEnum.pttl,
    RedisKeyEnum.exists,
    RedisListEnum.Llen,
    RedisListEnum.Lpos,

    RedisSetEnum.Scard,
    RedisSetEnum.Sismemer,

    RedisZSetEnum.Zlexcount,
    RedisZSetEnum.Zcard,
    RedisZSetEnum.Zrank,
    RedisZSetEnum.Zincrby,
    RedisZSetEnum.Zcount,
    RedisZSetEnum.Zscore,



    RedisServerEnum.Dbsize,
    RedisServerEnum.Command_Count,
    RedisHyperLogLogEnum.Pfcount,
  ];

  public static QueryForObject: string[] = [RedisHashEnum.Hgetall, RedisServerEnum.Info];
  // public static OptionOfNumberRes: string[] = [RedisKeyEnum.pexpireat,RedisKeyEnum.persist,RedisKeyEnum.move,
  //   RedisKeyEnum.del,RedisKeyEnum.renamenx,RedisKeyEnum.expireat,RedisStringEnum.setnx,RedisStringEnum.mset,
  // ];
  // public static OptionOfStringRes: string[] = [RedisKeyEnum.rename,RedisStringEnum.setex];
  // public static OptionOfSerial:string[] = [RedisKeyEnum.dump];
  // //操作,会返回操作成功的个数 key set,del,rename

  public static parserCommand(fullCommand: string): IRedisCommandParser | null {
    const commandMatch = new RegExp(
      `^(${RedisCommandRegexKey}|${RedisCommandRegexString}|${RedisCommandRegexHash}|${RedisCommandRegexList}|${RedisCommandRegexSet}|${RedisCommandRegexSortedSet}|${RedisCommandRegexConnect}|${RedisCommandRegexServer}|${RedisCommandRegexScript}|${RedisCommandRegexTransaction}|${RedisCommandRegexHyperLogLog}|${RedisCommandRegexSubscribe}|${RedisCommandRegexGeo})`,
      'i',
    );
    const commandReg = commandMatch.exec(fullCommand);
    if (!commandReg) {
      return null;
    }
    const command = commandReg[0];
    const argsStr = fullCommand.substring(command.length);
    const args: string[] = RedisUtils.splitCommandArgs(argsStr);
    const [option, resultType] = RedisUtils.queryState(command);
    return { command, args, option, resultType };
  }

  public static queryState(command: string): [RedisOptionEnum, RedisResultEnum] {
    const commandPrefix = command.toLowerCase();
    if (RedisUtils.QueryForString.includes(commandPrefix)) {
      return [RedisOptionEnum.query, RedisResultEnum.string];
    } else if (RedisUtils.QueryForList.includes(commandPrefix)) {
      return [RedisOptionEnum.query, RedisResultEnum.list];
    } else if (RedisUtils.QueryForObject.includes(commandPrefix)) {
      return [RedisOptionEnum.query, RedisResultEnum.object];
    } else if (RedisUtils.QueryForNumber.includes(commandPrefix)) {
      return [RedisOptionEnum.query, RedisResultEnum.number];
    } else if (RedisUtils.QueryForOneList.includes(commandPrefix)) {
      return [RedisOptionEnum.query, RedisResultEnum.oneList];
    } else {
      return [RedisOptionEnum.option, RedisResultEnum.string];
    }
  }

  public static splitCommandArgs(argsStr: string): string[] {
    const commandArgs = argsStr.trim();
    let inSingleQuoteString = false,
      inDoubleQuoteString = false;
    let args: string[] = [];
    let arg: string = '';
    for (let i = 0; i < commandArgs.length; i++) {
      let ch = commandArgs.charAt(i);
      if (ch == `'`) {
        inSingleQuoteString = !inSingleQuoteString;
      } else if (ch == `"`) {
        inDoubleQuoteString = inDoubleQuoteString;
      }
      const inString = inSingleQuoteString || inDoubleQuoteString;
      if (inString) {
        arg = arg + ch;
        continue;
      }
      if (ch.match(/\s/)) {
        if (arg) {
          args.push(arg);
          arg = '';
        }
        continue;
      }
      arg = arg + ch;
    }
    args.push(arg);
    return args;
  }
}
