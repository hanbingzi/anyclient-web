import React, { PropsWithChildren, RefObject, useEffect, useRef, useState } from 'react';
import { DisposableCollection, useInjectable, ViewState } from '@opensumi/ide-core-browser';
import { DataItemInfoService, JsonId } from './data-item-info.service';
import { StringEditorView } from '../../doc-editor/browser/string-editor.view';

export const DataItemInfoView = ({ viewState }: PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;

  const [data, setData] = useState<any>();

  const disposableRef: RefObject<DisposableCollection> = useRef(new DisposableCollection());

  const dataItemInfoService = useInjectable<DataItemInfoService>(DataItemInfoService);

  useEffect(() => {
    disposableRef.current?.push(
      dataItemInfoService.onDataChange((data) => {
        setData(data);
      }),
    );
    return () => {
      disposableRef.current?.dispose();
    };
  }, []);

  return (
    <div>
      <StringEditorView
        width={width}
        height={height}
        keyData={data}
        viewId={JsonId}
        dataType={'string'}
        enableRefresh={false}
        enableCopy={true}
        enableSave={false}
        initFinish={true}
      />
    </div>
  );
};
