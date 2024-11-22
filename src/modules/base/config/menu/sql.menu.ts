import { Command } from '@opensumi/ide-core-common';
import { ServerCommandIds as CommandIds } from '../../command/menu.command';
import { COMMON_COMMANDS } from './common.menu';

export namespace SQL_COMMANDS {
  export const sqlServer: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    COMMON_COMMANDS.connect,
    [CommandIds.editServer, { ...CommandIds.create, label: '新建库' }],
    [CommandIds.runSqlFile],
  ];
  // [CommandIds.cmdView],
  export const db: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制库名' }],
    [CommandIds.editDb, { ...CommandIds._delete, label: '删除库' }],
    [
      CommandIds.closeConnect,
      // CommandIds.sqlStructureAndDataBackup,
      // CommandIds.sqlStructureBackup,
      // CommandIds.runSqlFile,
    ],
  ];
  export const PostgresDb: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制库名' }],
    [
      { ...CommandIds.editDb, label: '编辑库' },
      { ...CommandIds._delete, label: '删除库' },
    ],
    [{ ...CommandIds.create, label: '新建Schema' }],
    [CommandIds.closeConnect],
  ];
  export const orclDb: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制库名' }],
    [CommandIds.closeConnect,]
  ];
  export const schema: Command[][] = [
    [CommandIds.newQuery],
    [{ ...CommandIds._delete, label: '删除' }],
    // [
    //   CommandIds.sqlStructureAndDataBackup,
    //   CommandIds.sqlStructureBackup,
    //   CommandIds.runSqlFile,
    // ],
    [CommandIds.refresh],
    [{ ...CommandIds.editDb, label: '编辑Schema' }],
  ];

  export const tables: Command[][] = [[CommandIds.createTable], [CommandIds.refresh]];

  export const table: Command[][] = [
    [CommandIds.tableSelect],
    //[CommandIds.refresh],
    [CommandIds.rename, { ...CommandIds.edit, label: '编辑表结构' }],
    [CommandIds.clearTable, { ...CommandIds._delete, label: '删除表' }],
    [
      { ...CommandIds.copy, label: '复制表名' },
      CommandIds.copyTable,
      CommandIds.copyTableSelectSql,
      // CommandIds.copyTableInsertSql,
      // CommandIds.copyTableUpdateSql,
      // CommandIds.copyTableDeleteSql,
    ],
  ];

  export const tableViews: Command[][] = [[CommandIds.refresh]];

  export const tableView: Command[][] = [
    [CommandIds.tableSelect],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制视图名' }],
    [CommandIds.copyViewCreateSql, { ...CommandIds._delete, label: '删除视图表' }],
  ];

  export const functions: Command[][] = [[CommandIds.refresh]];
  export const _function: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
  export const procedures: Command[][] = [[CommandIds.refresh]];
  export const procedure: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
  export const triggers: Command[][] = [[CommandIds.refresh]];
  export const trigger: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
  export const sequences: Command[][] = [[CommandIds.refresh]];
  export const sequence: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
  //------------------------------basic sql ----------------------------------------------------------
  export const basicDb: Command[][] = [
    [CommandIds.newQuery],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制库名' }],
    //[CommandIds.editDb, { ...CommandIds._delete, label: '删除库' }],
    [
      CommandIds.closeConnect,
      // CommandIds.sqlStructureAndDataBackup,
      // CommandIds.sqlStructureBackup,
      // CommandIds.runSqlFile,
    ],
  ];
  export const basicSchema: Command[][] = [
    [CommandIds.newQuery],
    //[{ ...CommandIds._delete, label: '删除' }],
    // [
    //   CommandIds.sqlStructureAndDataBackup,
    //   CommandIds.sqlStructureBackup,
    //   CommandIds.runSqlFile,
    // ],
    [CommandIds.refresh],
    //[{ ...CommandIds.editDb, label: '编辑Schema' }],
  ];
  export const basicTables: Command[][] = [
    //[CommandIds.createTable],
    [CommandIds.refresh],
  ];
  export const basicTable: Command[][] = [
    [CommandIds.tableSelect],
    //[CommandIds.refresh],
    //[CommandIds.rename, { ...CommandIds.edit, label: '编辑表结构' }],
    [
      CommandIds.clearTable,
      { ...CommandIds._delete, label: '删除表' },
    ],
    [
      { ...CommandIds.copy, label: '复制表名' },
      //CommandIds.copyTable,
      CommandIds.copyTableSelectSql,
      // CommandIds.copyTableInsertSql,
      // CommandIds.copyTableUpdateSql,
      // CommandIds.copyTableDeleteSql,
    ],
  ];
  export const basicTableViews: Command[][] = [[CommandIds.refresh]];
  export const basicTableView: Command[][] = [
    [CommandIds.tableSelect],
    [CommandIds.refresh],
    [{ ...CommandIds.copy, label: '复制视图名' }],
    [CommandIds.copyViewCreateSql, { ...CommandIds._delete, label: '删除视图表' }],
  ];
  export const basicFunctions: Command[][] = [[CommandIds.refresh]];
  export const basicFunction: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
  export const basicProcedures: Command[][] = [[CommandIds.refresh]];
  export const basicProcedure: Command[][] = [[{ ...CommandIds.copy, label: '复制名称' }, CommandIds._delete]];
}
