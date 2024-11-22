import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';
import { COMMON_COMMANDS } from './common.menu';

export namespace ZOOKEEPER_COMMANDS {
  export const zkServer: Command[][] = [
    [CommandIds.refresh],
    COMMON_COMMANDS.connect,
    [CommandIds.editServer]
  ];

  export const zkNode: Command[][] = [
    [{...CommandIds.create,label:'新建key'}
      ,CommandIds.createDic],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制名称' }],
    [{ ...CommandIds._delete }],
  ];
}
