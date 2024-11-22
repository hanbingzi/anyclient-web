import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@opensumi/ide-components';
import { LabelInput, LabelItem } from '../../../components/form';
import {
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

export const MysqlDbEditView = (props: IBaseState) => {
  const { serverType, nodeName, option } = props;
  // const [dbInfoParam, setDbInfoParam] = useState<IMysqlDbInfo>({})
  const [dbName, setDbName] = useState<string>();
  const [charset, setCharset] = useState<string>();
  const [collate, setCollate] = useState<string>();
  const [collateOptions, setCollateOptions] = useState<MySqlCollation[]>([]);
  const [result, setResult] = useState<IQueryResult | null>();
  const sqlDbEditService = useInjectable<MpsqlDbEditService>(MpsqlDbEditService);

  useEffect(() => {
    //console.log('我会运行几遍--》', props)
    if (props) {
      sqlDbEditService.init(props);
      if (option === 'edit') {
        //查询最初值
        initData();
      }
    }
  }, []);

  const initData = useCallback(async () => {
    //console.log('----->initData', props)
    const data = (await sqlDbEditService.getDatabaseInfo()) as IMysqlDbDetail;
    if (data) {
      const { schema, charset, collate } = data;
      setDbName(schema);
      setCharset(charset);
      setCollate(collate);
      if (!collateOptions || collateOptions.length === 0) {
        if (charset && (MysqlCharsetArray as string[]).includes(charset)) {
          const charsetConfig = MysqlCharsetConfig[charset] as IMysqlCharsetConfig;
          setCollateOptions(charsetConfig.collations);
        }
      }
      //console.log('设置初始值--》', data)
    }
  }, [props, sqlDbEditService, dbName, charset, collate, collateOptions]);

  const handleSave = useCallback(async () => {
    const isUpdate = option === 'edit';
    const result = await sqlDbEditService.saveDb(
      { schema: dbName, charset, collate } as IMysqlDbDetail,
      isUpdate,
      true,
    );
    if (!result.success) {
      setResult(result);
    }
  }, [sqlDbEditService, dbName, charset, collate, props, initData]);

  const handleCharset = useCallback(
    (newCharset: string) => {
      if ((MysqlCharsetArray as string[]).includes(newCharset)) {
        const charsetConfig = MysqlCharsetConfig[newCharset] as IMysqlCharsetConfig;
        setCollate(charsetConfig.defaultCollate);
        setCollateOptions(charsetConfig.collations);
      }
      setCharset(newCharset);
    },
    [MysqlCharsetArray],
  );
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

      <LabelItem label={'Charset'} style={{ marginTop: '22px' }}>
        <SelectInput
          value={charset}
          options={MysqlCharsetArray}
          onChange={(value) => {
            //console.log('mysql--change>', value)
            handleCharset(value);
          }}
        />
      </LabelItem>

      <LabelItem label={'Collate'} style={{ marginTop: '22px' }}>
        <SelectInput
          value={collate}
          options={collateOptions}
          onChange={(value) => {
            //console.log('mysql--change>', value)
            setCollate(value);
          }}
        />
      </LabelItem>

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
