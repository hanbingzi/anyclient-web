import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';
import { COMMON_COMMANDS } from './common.menu';

export namespace KAFKA_COMMANDS {
  export const kafkaServer: Command[][] = [
    COMMON_COMMANDS.connect,
    [CommandIds.editServer]
  ];
  export const topics: Command[][] = [
    [CommandIds.refresh],
    [CommandIds.topicCreate]
  ];
  export const topic: Command[][] = [
    [CommandIds.topicAddMessage],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [CommandIds.topicCreate, CommandIds._delete],
  ];
  export const groups: Command[][] = [[CommandIds.refresh]];
  export const brokers: Command[][] = [[CommandIds.refresh]];
}
