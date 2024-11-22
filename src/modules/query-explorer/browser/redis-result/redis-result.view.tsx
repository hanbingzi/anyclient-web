import React, { useCallback, useEffect, useState } from 'react';
import cls from 'classnames';
import styles from '../query-explorer.module.less';
import { isNotEmpty, isNull } from '../../../base/utils/object-util';
import { ITableColumn, TableEditor } from '../../../components/table-editor';
import { DataInputEnum } from '../../../base/types/edit-input.types';
import { ResultExplorerProps } from '../../common';
import { IKeyResult } from '../../../server-client/common';
import { RedisResultEnum } from '../../../server-client/common/fields/redis-fields';
import { StringEditorView } from '../../../doc-editor/browser/string-editor.view';

//as IKeyResult
export const RedisResultView = (props: ResultExplorerProps) => {
  const { isShow, width, height, serverInfo, dbValue, runResult } = props;
  const { valueType, keyName, data, command } = runResult as IKeyResult;
  //保持和数据库中的ttl一致
  const [keyValue, setKeyValue] = useState<any>();
  //const [initFinish,setInitFinish] = useState<boolean>(false)
  const jsonId = `redis-result-${command}`;
  //console.log('keyName---->',keyName,'dbValue:',dbValue,'server:',serverInfo)

  // useEffect(() => {
  ////console.log('RedisResultView-->',keyValue)
  //  // json 展示比较麻烦，得用opensumi自带的provider，为了方便provider获取数据，目前是把json数据临时存储在DocumentEditorService.JsonTempStore里面
  //   if (keyValue && valueType==='string') {
  //     DocumentEditorService.Store.set(jsonId, {keyData: keyValue})
  //   }
  //   return () => {
  //     DocumentEditorService.Store.delete(jsonId)
  //   };
  // }, [keyValue,valueType])

  useEffect(() => {
    switch (valueType) {
      case RedisResultEnum.number:
      case RedisResultEnum.oneList:
        setKeyValue([data]);
        break;
      case RedisResultEnum.string:
      case RedisResultEnum.list:
        setKeyValue(data);
        break;
      case RedisResultEnum.object:
        let transferredData: { key: string; value: any }[] = [];
        Object.keys(data).map((key) => transferredData.push({ key, value: data[key] }));
        setKeyValue(transferredData);
        break;
    }
  }, [valueType, data]);

  const getColumn = useCallback(
    (redisType: RedisResultEnum): ITableColumn[] => {
      const viewWidth = width < 700 ? 700 : width - 100;
      if (redisType == RedisResultEnum.object) {
        const keyWidth = Math.floor(viewWidth * 0.3);
        const valueWidth = Math.floor(viewWidth * 0.7);
        const tableColumn: ITableColumn[] = [
          { title: 'Key', columnKey: 'key', dataType: DataInputEnum.string, width: keyWidth, nullAble: 'NO' },
          { title: 'Value', columnKey: 'value', dataType: DataInputEnum.string, width: valueWidth, nullAble: 'NO' },
        ];
        return tableColumn;
      } else {
        const tableColumn: ITableColumn[] = [
          { title: 'Value', columnKey: 'value', dataType: DataInputEnum.string, width: viewWidth, nullAble: 'NO' },
        ];
        return tableColumn;
      }
    },
    [width],
  );

  const renderContent = useCallback(() => {
    if (isNotEmpty(valueType)) {
      switch (valueType) {
        case RedisResultEnum.string:
          //36未标题栏的高度,因为opensumi展示文档的原因，此处代码写的不符合逻辑
          return (
            <StringEditorView
              width={width}
              height={height}
              keyName={keyName ? keyName[0] : ''}
              keyData={keyValue}
              viewId={jsonId}
              modelMethod={'Redis'}
              initFinish={true}
              dataType={'buffer'}
              connect={{ server: serverInfo!, db: dbValue ? dbValue : 0 }}
              enableSave={true}
              enableRefresh={true}
            />
          );
        case RedisResultEnum.list:
        case RedisResultEnum.oneList:
        case RedisResultEnum.object:
        case RedisResultEnum.number:
          const convertData = isNull(keyValue)
            ? []
            : valueType === RedisResultEnum.object
            ? keyValue
            : (keyValue as string[]).map((item) => ({ value: item }));
          return (
            <TableEditor
              cellStyle={{ textAlign: 'center' }}
              {...{
                tableWidth: width,
                tableHeight: height, //
                option: true,
              }}
              // dataType={valueType === RedisResultEnum.object ? 'Object' : 'Array'}
              columns={getColumn(valueType)}
              data={convertData}
              optionArgs={{ search: true }}
            />
          );
      }
    }
  }, [keyValue, keyName, dbValue, serverInfo, valueType, width, height, getColumn, jsonId]);

  return (
    <div className={cls(isShow ? styles['data-container-show'] : styles['data-container-hidden'])}>
      {renderContent()}
    </div>
  );
};
