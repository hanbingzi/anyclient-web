import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInjectable } from '@opensumi/ide-core-browser';
import { DisposableCollection } from '@opensumi/ide-utils';
import { IBaseState } from '../../common/data-browser.types';
import { TabsTitleItem } from '../../../components/title';
import { KeyValueList } from '../../../components/data-view';
import { ObjectDataService } from './object-data.service';
import { StrKeyObject } from '../../../base/model/common.model';
import { Tabs } from '@opensumi/ide-components';
import { KeyValueArea } from '../../../components/data-view/key-value-area.view';
import { Info, Sql } from '../../../icons/common';
import { ServerIconFinder } from '../../../base/config/server-icon.config';
import { ServerType } from '../../../base/types/server-node.types';
import styles from './object-data.module.less';

export const ObjectDataView = (props: IBaseState) => {
  const { openUri, nodePath, serverId, serverType, server, nodeType, viewState, db, nodeName, schema } = props;
  const { width, height } = viewState;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectIndex] = useState<number>(0);
  const [infoData, setInfoData] = useState<StrKeyObject>({});
  const [createSql, setCreateSql] = useState<string>('');
  const disposableRef: RefObject<DisposableCollection> = useRef(new DisposableCollection());
  const objectDataService = useInjectable<ObjectDataService>(ObjectDataService);

  useEffect(() => {
    objectDataService.init(openUri, nodePath, server!, db + '', schema, nodeType, nodeName!);
    ensureIsReady();
    //
  }, []);

  const ensureIsReady = useCallback(async () => {
    await objectDataService.whenReady;
    setIsLoading(false);
    // redis type 一旦声明，不会改变
  }, [objectDataService]);

  useEffect(() => {
    disposableRef.current?.push(
      objectDataService.onLoadingChange((isLoading) => {
        setIsLoading(isLoading);
      }),
    );
    disposableRef.current?.push(
      objectDataService.onInfoDataChang((value) => {
        setInfoData(value);
      }),
    );
    disposableRef.current?.push(
      objectDataService.onCreateSqlChang((value) => {
        setCreateSql(value);
      }),
    );
    return () => {
      disposableRef.current?.dispose();
    };
  }, []);

  const sourceHeight = useMemo((): number => {
    const areaHeight = height - 37 - 40;
    return areaHeight > 500 ? areaHeight : 500;
  }, [height]);

  const selectChangeHandle = useCallback((index: number) => {
    setSelectIndex(index);
  }, []);

  return (
    <div className={styles['object-data-container']}>
      <Tabs
        tabs={[
          <TabsTitleItem
            title={'Sql Source'}
            // fixWidth={150}
            icon={<Info />}
          />,
          <TabsTitleItem
            title={'Info'}
            // fixWidth={150}
            icon={<Sql />}
          />,
        ]}
        value={selectedIndex}
        onChange={selectChangeHandle}
      />
      {selectedIndex === 0 ? (
        <KeyValueArea
          style={{ marginTop: 20 }}
          name={nodeName}
          value={createSql}
          icon={ServerIconFinder.getServerIcon(serverType as ServerType, nodeType)}
          height={sourceHeight}
        />
      ) : (
        <KeyValueList value={infoData} lineStyle={{ marginTop: '22px' }} />
      )}
    </div>
  );
};
