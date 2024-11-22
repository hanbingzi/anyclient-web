import { ServerType } from '../../base/types/server-node.types';
import { Command } from '@opensumi/ide-core-common';
import { IServerClass } from '../../base/config/server.config';
import { ServerCluster, ServerInfo } from '../../local-store-db/common';
import React from 'react';
import { IQueryResult } from '../../server-client/common';

export type pageStateType = 'select' | 'input' | 'edit';

export interface TestConnectResult {
  stat: 'success' | 'error' | 'init';
  //errorCode?: number | string;
  //errorMessage?: string;
  result?: IQueryResult;
}

export const IServerEditService = Symbol('IServerEditService');

export interface IServerEditService {
  closable?: boolean;

  isVisible(): boolean;

  get selectedClass(): IServerClass | undefined;

  get selectedServer(): ServerType | undefined;

  get pageState(): pageStateType | undefined;

  get serverInfo(): ServerInfo | undefined;

  get cluster(): ServerCluster[] | undefined;

  get testConnectResult(): TestConnectResult;

  get testIsLoading(): boolean;

  get jdkIsError(): boolean;

  title(): React.ReactNode | string;

  reset(): void;

  hide(): void;

  resetTestConnect(): void;

  open(option: Command, treeId?: number, entityId?: string): void;

  setSelectedServer(server: ServerType): void;

  setSelectedClass(selectedClass: IServerClass): void;

  next(): void;

  last(): void;

  testConnect(serverInfo: ServerInfo, clusters?: ServerCluster[] | null): void;

  saveConnect(serverInfo: ServerInfo, clusters?: ServerCluster[] | null): Promise<boolean>;

  editConnect(
    serverInfo: ServerInfo,
    clusters?: ServerCluster[] | null,
    deleteClusterId?: string[] | null,
  ): Promise<boolean>;


}
