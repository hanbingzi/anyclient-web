import * as React from 'react';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import styles from './index.module.less';
import { DisposableCollection, useInjectable } from '@opensumi/ide-core-browser';
import { DbSelectService } from './db-select.service';
import { DbNode, ServerNode } from '../../base/model/cache-node.model';
import { IDbSelectServiceToken } from '../common';
import { IconType, IIconService } from '@opensumi/ide-theme';
import { ServerHasDb, ServerHasSchema } from '../../base/config/server.config';
import { Select } from '../../components/select';

export const DbSelect = () => {
  const [selectedServer, setSelectedServer] = useState<ServerNode | null>();
  const [selectedDb, setSelectedDb] = useState<DbNode | null>();
  const [selectedSchema, setSelectedSchema] = useState<DbNode | null>();

  const [serverNodes, setServerNodes] = useState<ServerNode[]>();
  const [dbNodes, setDbNodes] = useState<DbNode[]>();
  const [schemaNodes, setSchemas] = useState<DbNode[]>();

  const dbSelectService = useInjectable<DbSelectService>(IDbSelectServiceToken);
  const iconService = useInjectable<IIconService>(IIconService);
  const disposableRef: RefObject<DisposableCollection> = useRef(new DisposableCollection());

  const handleSelectServer = useCallback((selectServer: string) => {
    dbSelectService.setSelectServerByUser(selectServer);
  }, []);

  const handleSelectDb = useCallback((selectDb: string) => {
    dbSelectService.setSelectDbByUser(selectDb);
  }, []);

  const handleSelectSchema = useCallback((selectSchema: string) => {
    dbSelectService.setSelectedSchemaByUser(selectSchema);
  }, []);

  useEffect(() => {
    disposableRef.current?.push(
      dbSelectService.onServerNodesChange((serverNodes) => {
        setServerNodes(serverNodes);
      }),
    );
    disposableRef.current?.push(
      dbSelectService.onDbNodesChange((dbNodes) => {
        setDbNodes(dbNodes);
      }),
    );
    disposableRef.current?.push(
      dbSelectService.onSchemaNodesChange((schemaNodes) => {
        setSchemas(schemaNodes);
      }),
    );
    disposableRef.current?.push(
      dbSelectService.onSelectedServerNodeChange((selectedServer) => {
        setSelectedServer(selectedServer);
      }),
    );
    disposableRef.current?.push(
      dbSelectService.onSelectedDbNodeChange((dbNode) => {
        setSelectedDb(dbNode);
      }),
    );

    disposableRef.current?.push(
      dbSelectService.onSelectedSchemaNodeChange((schemaNode) => {
        setSelectedSchema(schemaNode);
      }),
    );
    return () => {
      disposableRef.current?.dispose();
    };
  }, []);

  const renderDbSelect = useCallback(() => {
    if (!selectedServer) {
      return null;
    }
    const { serverType } = selectedServer;
    if (ServerHasDb.includes(serverType)) {
      return (
        <div className={cls(styles['toolbar-item-box'], styles['toolbar-select'])}>
          <Select
            options={
              dbNodes
                ? [
                    { label: '', value: '' },
                    ...dbNodes.map((item) => ({
                      label: item.name,
                      value: item.value,
                      iconClass: iconService.fromIcon('', item.iconBase64, IconType.Base64),
                    })),
                  ]
                : []
            }
            showSearch={false}
            size={'small'}
            style={{ minWidth: '120px', maxWidth: '300px' }}
            value={selectedDb?.value}
            onChange={handleSelectDb}
            allowOptionsOverflow={true}
          />
        </div>
      );
    }
  }, [selectedServer, selectedDb, dbNodes]);
  const renderSchemaSelect = useCallback(() => {
    if (!selectedServer) {
      return null;
    }
    const { serverType } = selectedServer;

    if (ServerHasSchema.includes(serverType)) {
      return (
        <div className={cls(styles['toolbar-item-box'], styles['toolbar-select'])}>
          <Select
            options={
              schemaNodes
                ? [
                    { label: '', value: '' },
                    ...schemaNodes.map((item) => ({
                      label: item.name,
                      value: item.name,
                      iconClass: iconService.fromIcon('', item.iconBase64, IconType.Base64),
                      renderCheck: true,
                    })),
                  ]
                : []
            }
            showSearch={false}
            size={'small'}
            style={{ minWidth: '120px', maxWidth: '200px' }}
            onChange={handleSelectSchema}
            value={selectedSchema?.name}
            allowOptionsOverflow={true}
          />
        </div>
      );
    }
  }, [selectedServer, selectedDb, selectedSchema, schemaNodes]);

  return (
    <div className={styles['toolbar-center']}>
      <div className={cls(styles['toolbar-item-box'], styles['toolbar-select'])}>
        {serverNodes && serverNodes.length > 0 && (
          <Select
            options={[
              { label: '', value: '' },
              ...serverNodes.map((item) => ({
                label: item.name,
                value: item.name,
                iconClass: iconService.fromIcon('', item.iconBase64, IconType.Base64),
                renderCheck: true,
              })),
            ]}
            showSearch={false}
            size={'small'}
            style={{ minWidth: '120px', maxWidth: '300px' }}
            onChange={handleSelectServer}
            value={selectedServer?.name}
            allowOptionsOverflow={true}
            //optionStyle={{paddingLeft: '2px', paddingRight: '2px', textAlign: 'center'}}
          />
        )}
      </div>

      {renderDbSelect()}
      {renderSchemaSelect()}
      <div className={cls(styles['toolbar-item-box'], styles['toolbar-option'])}>
        {/*<Icon icon={'refresh'} size={"small"}/>*/}
        {/*<IconSvg icon={<Run/>}/>*/}
      </div>
      {/*<div className={cls(styles['toolbar-item'], styles['toolbar-option'])}>*/}
      {/*  <IconSvg icon={<Stop/>} disabled={true}/>*/}
      {/*</div>*/}
    </div>
  );
};
