import { Command } from '@opensumi/ide-core-common';

export const CodeCommand = {
  sqlCompletion: 'sql.completion',
  esCompletion: 'es.completion',
  redisCompletion: 'redis.completion',
  mongodbCompletion: 'mongodb.completion',
};

export const RunCommands = {
  runSql: 'sql.runSql',
  runBatchSql: 'sql.runBatchSql',
  runAllSql: 'sql.runAll',
  runSelectedSql: 'sql.runSelected',
  runRedisCommand: 'redis.runCommand',
  runBatchRedisCommand: 'redis.runBatchCommand',
  runAllRedisCommand: 'redis.runAll',
  runSelectedRedisCommand: 'redis.runSelected',
};

export const SqlCompletionCommand: Command = { id: CodeCommand.sqlCompletion };
export const RedisCompletionCommand: Command = { id: CodeCommand.redisCompletion };
export const EsCompletionCommand: Command = { id: CodeCommand.esCompletion };
export const MongodbCompletionCommand: Command = { id: CodeCommand.mongodbCompletion };

/**
 * 执行单条sql语句
 */
export const RunSqlCommand: Command = { id: RunCommands.runSql };
export const RunBatchSqlCommand: Command = { id: RunCommands.runBatchSql };

export const RunRedisCommand: Command = { id: RunCommands.runRedisCommand };
export const RunBatchRedisCommand: Command = { id: RunCommands.runBatchRedisCommand };
export const RunSelectedSqlCommand: Command = { id: RunCommands.runSelectedSql, label: 'Run Selected Sql' };
/**
 * 执行所有的sql语句
 */
export const RunAllSqlCommand: Command = { id: RunCommands.runAllSql, label: 'Run All Sql' };
