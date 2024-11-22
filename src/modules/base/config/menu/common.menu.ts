import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';

export namespace COMMON_COMMANDS {
  export const connect: Command[] = [
    {
      ...CommandIds.deleteConnect,
      label: '从当前工作空间移除',
    },
    CommandIds.closeConnect,
    CommandIds.refreshConnect,
  ];
}


