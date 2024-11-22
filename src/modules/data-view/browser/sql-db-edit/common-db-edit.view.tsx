import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@opensumi/ide-components';
import { LabelInput, LabelItem } from '../../../components/form';
import {
  IDbDetail,
  IMysqlCharsetConfig,
  IMysqlDbDetail,
  IQueryResult,
  MysqlCharsetArray,
  MysqlCharsetConfig,
  MySqlCollation,
} from '../../../server-client/common';
import { AlertView } from '../../../components/alert/alert.view';
import { useInjectable } from '@opensumi/ide-core-browser';
import { WindowsTitle } from '../../../components/title';
import { ServerIconFinder } from '../../../base/config/server-icon.config';
import { MpsqlDbEditService } from './mpsql-db-edit.service';
import { IBaseState } from '../../common/data-browser.types';
import styles from './index.module.less';
import { SelectInput } from '../../../components/select-input';
import { CommonDbEditService } from './common-db-edit.service';

export const CommonDbEditView = (props: IBaseState) => {
  const { serverType, nodeName, option } = props;
  // const [dbInfoParam, setDbInfoParam] = useState<IMysqlDbInfo>({})
  const [dbName, setDbName] = useState<string>();
  const [result, setResult] = useState<IQueryResult | null>();
  const commonDbEditService = useInjectable<CommonDbEditService>(CommonDbEditService);

  useEffect(() => {
    //console.log('我会运行几遍--》', props)
    if (props) {
      commonDbEditService.init(props);
      if (option === 'edit') {
        //查询最初值
        initData();
      }
    }
  }, []);

  const initData = useCallback(async () => {
    //console.log('----->initData', props)
      setDbName(nodeName);
      //console.log('设置初始值--》', data)
  }, [props, commonDbEditService]);

  const handleSave = useCallback(async () => {
    const isUpdate = option === 'edit';
    const result = await commonDbEditService.saveDb(
      { schema: dbName } as IDbDetail,
      isUpdate,
      true,
    );
    if (!result.success) {
      setResult(result);
    }
  }, [commonDbEditService, dbName, props, initData]);


  return (
    <div className={styles['db-container']}>
      <WindowsTitle
        title={`Database${option === 'create' ? '创建' : '修改'}`}
        icon={ServerIconFinder.getServerIcon(serverType, 'db')}
      />

      <LabelInput
        label={'Database Name'}
        value={dbName}
        required={option == 'create'}
        message={'库名不能为空'}
        style={{ marginTop: '22px' }}
        onValueChange={(value) => {
          result && setResult(null);
          setDbName(value);
        }}
        disabled={option === 'edit'}
      />


      <div className={styles['opt-message']}>
        {result ? (
          result.success ? (
            <AlertView message={`db${option === 'create' ? '创建' : '修改'}成功`} type={'success'} />
          ) : (
            <AlertView message={result.message} type={'error'} />
          )
        ) : null}
      </div>

      <div className={styles['opt-button']}>
        <Button type={'primary'} onClick={() => handleSave()}>
          {option === 'create' ? '保存' : '修改'}
        </Button>
        {/*<Button type={'primary'} style={{marginLeft: '10px'}}*/}
        {/*        onClick={() => handleSave(true)}>{option === 'create'?'保存':'修改'}成功后关闭窗口</Button>*/}
      </div>
    </div>
  );
};
