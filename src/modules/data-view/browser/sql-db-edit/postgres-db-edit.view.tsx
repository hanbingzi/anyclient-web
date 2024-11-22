import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Select } from '@opensumi/ide-components';
import { LabelInput, LabelItem } from '../../../components/form';
import {
  IPostgresDbDetail,
  IQueryResult,
  PostgresCharsetArray,
  PostgresEncodingArray,
} from '../../../server-client/common';
import { AlertView } from '../../../components/alert/alert.view';
import { useInjectable } from '@opensumi/ide-core-browser';
import { WindowsTitle } from '../../../components/title';
import { ServerIconFinder } from '../../../base/config/server-icon.config';
import { MpsqlDbEditService } from './mpsql-db-edit.service';
import { IBaseState } from '../../common/data-browser.types';
import styles from './index.module.less';
import { SelectInput } from '../../../components/select-input';
import { Switch } from 'antd';

const dbErr = '库名不能为空';
export const PostgresDbEditView = (props: IBaseState) => {
  const { serverType, option } = props;
  const [dbName, setDbName] = useState<string>();
  const [owner, setOwner] = useState<string | undefined>('postgres');
  const [comment, setComment] = useState<string | undefined>();
  const [roles, setRoles] = useState<string[]>([]);
  const [encoding, setEncoding] = useState<string | undefined>('UTF8');
  const [template, setTemplate] = useState<string>();
  const [templateOption, setTemplateOption] = useState<string[]>([]);
  const [tablespace, setTablespace] = useState<string>();
  const [tablespaceOption, setTablespaceOption] = useState<string[]>([]);
  const [charset, setCharset] = useState<string>();
  const [collate, setCollate] = useState<string>();
  const [connlimit, setConnlimit] = useState<number | undefined>(-1);
  const [istemplate, setIstemplate] = useState<boolean>(false);
  const [result, setResult] = useState<IQueryResult | null>();
  const sqlDbEditService = useInjectable<MpsqlDbEditService>(MpsqlDbEditService);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [oldDb, setOldDb] = useState<IPostgresDbDetail>();

  useEffect(() => {
    sqlDbEditService.init(props);
    initData();
  }, []);

  const initData = useCallback(async () => {
    const queryRoles = await sqlDbEditService.getRoles();
    const queryTablespace = await sqlDbEditService.getTablespace();
    const queryTemplate = await sqlDbEditService.getTemplate();
    setRoles(queryRoles);
    setTablespaceOption(queryTablespace);
    setTemplateOption(queryTemplate);
    if (option === 'edit') {
      //加载初始化数据
      const connectInfo = (await sqlDbEditService.getDatabaseInfo()) as IPostgresDbDetail;
      if (connectInfo) {
        const { database, owner, encoding, datctype, tablespace, collate, connlimit, comment } = connectInfo;
        setOldDb(connectInfo);
        setDbName(database);
        setOwner(owner);
        setEncoding(encoding);
        setTablespace(tablespace);
        setCharset(datctype);
        setCollate(collate);
        setConnlimit(connlimit);
        setComment(comment);
      }
    }
  }, [props, sqlDbEditService]);

  const handleSave = useCallback(async () => {
    const isUpdate = option === 'edit';
    if (!dbName) {
      setSubmitError(true);
      return;
    }
    let connectInfo: IPostgresDbDetail = { database: dbName };
    if (isUpdate) {
      let userIsEdit = false;
      if (dbName !== oldDb?.database) {
        connectInfo.olddatabase = oldDb?.database;
        userIsEdit = true;
      }
      if (connlimit !== oldDb?.connlimit) {
        connectInfo.connlimit = connlimit;
        userIsEdit = true;
      }
      if (owner !== oldDb?.owner) {
        connectInfo.owner = owner;
        userIsEdit = true;
      }
      if (comment !== oldDb?.comment) {
        connectInfo.comment = comment;
        userIsEdit = true;
      }
      if (!userIsEdit) {
        return;
      }
    } else {
      connectInfo = {
        database: dbName,
        owner,
        encoding,
        template,
        tablespace,
        charset,
        collate,
        connlimit,
        istemplate,
      };
    }

    const result = await sqlDbEditService.saveDb(connectInfo, isUpdate, true);
    if (!result.success) {
      setResult(result);
    }
  }, [
    sqlDbEditService,
    dbName,
    props,
    owner,
    encoding,
    template,
    tablespace,
    charset,
    collate,
    connlimit,
    istemplate,
    comment,
    oldDb,
  ]);

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
        message={dbErr}
        validateMessage={submitError ? { type: 2, message: dbErr } : undefined}
        style={{ marginTop: '22px' }}
        onValueChange={(value) => {
          result && setResult(null);
          setDbName(value);
          setSubmitError(false);
        }}
      />

      <LabelInput
        label={'Comment'}
        value={comment}
        style={{ marginTop: '22px' }}
        onValueChange={(value) => {
          setComment(value);
        }}
      />

      <LabelItem label={'Owner'} style={{ marginTop: '22px' }}>
        <Select
          value={owner}
          options={roles}
          onChange={(value) => {
            setOwner(value);
          }}
        />
      </LabelItem>

      <LabelItem label={'Encoding'} style={{ marginTop: '22px' }}>
        <SelectInput
          options={PostgresEncodingArray}
          value={encoding}
          onChange={(value) => {
            setEncoding(value);
          }}
          disabled={option === 'edit'}
        />
      </LabelItem>

      {option === 'create' ? (
        <LabelItem label={'Template'} style={{ marginTop: '22px' }}>
          <SelectInput
            options={templateOption}
            value={template}
            onChange={(value) => {
              setTemplate(value);
            }}
          />
        </LabelItem>
      ) : null}

      <LabelItem label={'Tablespace'} style={{ marginTop: '22px' }}>
        <SelectInput
          options={tablespaceOption}
          value={tablespace}
          onChange={(value) => {
            setTablespace(value);
          }}
          disabled={option === 'edit'}
        />
      </LabelItem>

      <LabelItem label={'Character type'} style={{ marginTop: '22px' }}>
        <SelectInput
          options={PostgresCharsetArray}
          value={charset}
          onChange={(value) => {
            setCharset(value);
          }}
          disabled={option === 'edit'}
        />
      </LabelItem>

      <LabelItem label={'Collate'} style={{ marginTop: '22px' }}>
        <SelectInput
          options={PostgresCharsetArray}
          value={collate}
          onChange={(value) => {
            setCollate(value);
          }}
          disabled={option === 'edit'}
        />
      </LabelItem>

      <LabelItem label={'Connection Limit'} style={{ marginTop: '22px' }}>
        <Input
          type={'number'}
          value={String(connlimit)}
          onChange={(event) => {
            setConnlimit(Number(event.target.value));
            //console.log('connection limit->', event.target.value)
          }}
        />
      </LabelItem>

      {option === 'create' ? (
        <LabelItem label={'Is Template'} style={{ marginTop: '22px' }}>
          <Switch
            style={{ width: '20px' }}
            checked={istemplate}
            onChange={(checked, event) => {
              setIstemplate(checked);
            }}
          />
        </LabelItem>
      ) : null}

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
        {/*        onClick={() => handleSave(true)}>{option === 'create' ? '保存' : '修改'}成功后关闭窗口</Button>*/}
      </div>
    </div>
  );
};
