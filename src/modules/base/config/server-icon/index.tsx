import {
  Db,
  Db_base64,
  FileUnknown,
  FileUnknown_base64,
  Folder,
  FolderOpened,
  Function_base64,
  Functions,
  Procedure,
  Procedure_base64,
  Schema,
  Schema_base64,
  Sequence,
  Sequence_base64,
  Table,
  Table_base64,
  TableView,
  TableView_base64,
  Trigger,
  Trigger_base64,
} from '../../../icons/node';
import { ICON_RESOURCE_PATH } from '../../icon';
import React from 'react';
import { INodeChild, INodeIcon } from '../server-icon.config';

export const FolderIcon: INodeIcon = {
  hasFolderIcon: false,
  icon: <Folder />,
  openIcon: <FolderOpened />,
  closeIcon: <Folder />,
};

export const DefaultIcon: INodeIcon = {
  hasFolderIcon: false,
  icon: <FileUnknown />,
  iconPath: ICON_RESOURCE_PATH.Unknown,
  base64: FileUnknown_base64,
};
export const CommonSqlChildren: INodeChild = {
  db: { hasFolderIcon: false, icon: <Db />, base64: Db_base64 },
  basicDb: { hasFolderIcon: false, icon: <Db />, base64: Db_base64 },
  schema: { hasFolderIcon: false, icon: <Schema />, base64: Schema_base64 },
  basicSchema: { hasFolderIcon: false, icon: <Schema />, base64: Schema_base64 },
  tables: { hasFolderIcon: false, icon: <Table /> },
  basicTables: { hasFolderIcon: false, icon: <Table /> },
  table: {
    hasFolderIcon: false,
    icon: <Table />,
    iconPath: ICON_RESOURCE_PATH.table,
    base64: Table_base64,
  },
  basicTable: {
    hasFolderIcon: false,
    icon: <Table />,
    iconPath: ICON_RESOURCE_PATH.table,
    base64: Table_base64,
  },
  views: { hasFolderIcon: false, icon: <TableView /> },
  basicViews: { hasFolderIcon: false, icon: <TableView /> },
  view: {
    hasFolderIcon: false,
    icon: <TableView />,
    iconPath: ICON_RESOURCE_PATH.tableView,
    base64: TableView_base64,
  },
  basicView: {
    hasFolderIcon: false,
    icon: <TableView />,
    iconPath: ICON_RESOURCE_PATH.tableView,
    base64: TableView_base64,
  },
  procedures: {
    hasFolderIcon: false,
    icon: <Procedure />,
    base64: Procedure_base64,
  },
  basicProcedures: {
    hasFolderIcon: false,
    icon: <Procedure />,
    base64: Procedure_base64,
  },
  procedure: {
    hasFolderIcon: false,
    icon: <Procedure />,
    base64: Procedure_base64,
  },
  basicProcedure: {
    hasFolderIcon: false,
    icon: <Procedure />,
    base64: Procedure_base64,
  },
  sequences: {
    hasFolderIcon: false,
    icon: <Sequence />,
    iconPath: ICON_RESOURCE_PATH.sequenceView,
    base64: Sequence_base64,
  },
  basicSequences: {
    hasFolderIcon: false,
    icon: <Sequence />,
    iconPath: ICON_RESOURCE_PATH.sequenceView,
    base64: Sequence_base64,
  },
  sequence: {
    hasFolderIcon: false,
    icon: <Sequence />,
    iconPath: ICON_RESOURCE_PATH.sequenceView,
    base64: Sequence_base64,
  },
  basicSequence: {
    hasFolderIcon: false,
    icon: <Sequence />,
    iconPath: ICON_RESOURCE_PATH.sequenceView,
    base64: Sequence_base64,
  },
  functions: {
    hasFolderIcon: false,
    icon: <Functions />,
    base64: Function_base64,
  },
  basicFunctions: {
    hasFolderIcon: false,
    icon: <Functions />,
    base64: Function_base64,
  },
  function: {
    hasFolderIcon: false,
    icon: <Functions />,
    iconPath: ICON_RESOURCE_PATH._function,
    base64: Function_base64,
  },
  basicFunction: {
    hasFolderIcon: false,
    icon: <Functions />,
    iconPath: ICON_RESOURCE_PATH._function,
    base64: Function_base64,
  },
  triggers: {
    hasFolderIcon: false,
    icon: <Trigger />,
    base64: Trigger_base64,
  },

  trigger: {
    hasFolderIcon: false,
    icon: <Trigger />,
    base64: Trigger_base64,
  },
};
