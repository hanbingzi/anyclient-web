//import { ITree, ITreeNode } from '@opensumi/ide-components';
import { BasicEvent, IDisposable, URI } from '@opensumi/ide-core-common';
import { FileStat } from '@opensumi/ide-file-service';

import { ServerEntity, ServerNode } from './connect-tree-node.define';
import { ITree, ITreeNode } from '../../components/recycle-tree';
import { ServerInfo } from '../../local-store-db/common/model.define';
import { IServerTreeNode } from '../../base/model/server-tree-node.model';
import { Event } from '@opensumi/ide-core-browser';
import { ConnectEmitterInfo } from '../browser/services/open-recent-stat.service';

export const IConnectTreeAPIToken = Symbol('IConnectTreeAPIToken');
export const IConnectTreeServiceToken = Symbol('IConnectTreeServiceToken');

export const IServerTreeApiServiceToken = Symbol('IServerTreeApiServiceToken');

export interface IConnectTreeService extends ITree {
  removeNodeCacheByPath(path: string): void;

  reCacheNode(parent: ServerNode, path: string): void;
}

export interface IConnectTreeAPI {
  // copyFile(from: URI, to: URI): Promise<FileStat | string | void>;
  //
  // createFile(newUri: URI): Promise<string | void>;
  //
  // createDirectory(newUri: URI): Promise<string | void>;
  //
  // delete(uri: URI): Promise<string | void>;
  //
  // mvFiles(oldUri: URI[], newUri: URI, isDirectory?: boolean): Promise<string[] | void>;
  //
  // mv(oldUri: URI, newUri: URI, isDirectory?: boolean): Promise<string | void>;
  clearSuccessLoadNode(path: string): Promise<void>;

  resolveFileChildren(
    tree: IConnectTreeService,
    path: string | FileStat,
    parent?: ServerNode,
    compact?: boolean,
  ): Promise<{
    children: ServerNode[];
    filestat: FileStat;
  }>;

  resolveServerChildren(
    tree: IConnectTreeService,
    path: string | IServerTreeNode,
    parent?: ServerNode,
  ): Promise<{
    children: (ServerEntity | ServerNode)[];
    filestat?: IServerTreeNode;
  } | null>;

  resolveNodeByPath(tree: ITree, path: string, parent?: ServerNode): Promise<ServerNode | undefined>;

  toRootNode(tree: ITree, filestat: FileStat, parent?: ServerNode, name?: string): ServerNode;

  toServerNode(
    tree: ITree,
    treeNode: IServerTreeNode,
    filestat?: FileStat,
    parent?: ServerNode,
    presetName?: string,
  ): ServerNode | ServerEntity;

  getReadableTooltip(path: URI): string;

  resolveFileStat(path: URI): Promise<FileStat | void>;
}

export class FileTreeExpandedStatusUpdateEvent extends BasicEvent<{ uri: URI; expanded: boolean }> {}

export interface FileStatNode extends ITreeNode {
  uri: URI;
  filestat: FileStat;
}

export namespace FileStatNode {
  export function is(node: object | undefined): node is FileStatNode {
    return !!node && 'filestat' in node;
  }

  export function isContentFile(node: any | undefined): node is FileStatNode {
    return !!node && 'filestat' in node && !node.fileStat.isDirectory;
  }

  export function getUri(node: ITreeNode | undefined): string | undefined {
    if (is(node)) {
      return node.filestat.uri;
    }
    return undefined;
  }
}

export enum PasteTypes {
  NONE,
  COPY,
  CUT,
}

export const IConnectDialogModel = Symbol('IConnectDialogModel');

export interface IConnectDialogModel extends IDisposable {
  whenReady: Promise<void>;
}

export const IConnectDialogTreeService = Symbol('IConnectDialogTreeService');

export interface IConnectDialogTreeService extends ITree {
  getDirectoryList(): string[];
}

export const IOpenRecentStatServiceToken = Symbol('IOpenRecentStatServiceToken');

export interface IOpenRecentStatService {
  get onConnectChange(): Event<ConnectEmitterInfo>;

  init();

  pushOpenConnect(serverInfo: ServerInfo, openRecentId?: string);

  pushCloseConnect(serverInfo: ServerInfo);

  isConnect(serverId: string): boolean;
}
