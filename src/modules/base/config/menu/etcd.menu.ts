import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';
import { COMMON_COMMANDS } from './common.menu';

/**
 * etcd 具有的节点
 *
 *
 *
 */

export namespace ETCD_COMMANDS {

  export const etcdServer: Command[][] = [
    COMMON_COMMANDS.connect,
    [CommandIds.editServer]
  ];

  export const Data: Command[][] = [
    [{ ...CommandIds.create, label: '新建Key' }],
    [CommandIds.refresh],
  ];

  export const Dic: Command[][] = [
    [{ ...CommandIds.create, label: '新建Key' }],
    [{ ...CommandIds._delete, label: '删除' }],
    [CommandIds.refresh],
  ];

  export const Key: Command[][] = [
    [{ ...CommandIds.create, label: '新建Key' }],
    [{ ...CommandIds._delete, label: '删除' }],
    [CommandIds.refresh],
  ];

  export const Auth: Command[][] = [
    //[{ ...CommandIds.create, label: '新建Key' }],

    [CommandIds.refresh],
  ];

  export const Cluster: Command[][] = [
    [{ ...CommandIds.create, label: '新建Key' }],

    [CommandIds.refresh],
  ];

  export const Users: Command[][] = [
    [{ ...CommandIds.create, label: '新建用户' }],
    [CommandIds.refresh],
  ];

  export const Roles: Command[][] = [
    [{ ...CommandIds.create, label: '新建角色' }],
    [CommandIds.refresh],
  ];



}
