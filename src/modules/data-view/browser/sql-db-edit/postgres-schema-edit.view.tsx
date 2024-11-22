import React, { useCallback, useEffect, useState } from 'react';
import { Button, Select } from '@opensumi/ide-components';
import { LabelInput, LabelItem } from '../../../components/form';
import { IPostgresDbDetail, IQueryResult } from '../../../server-client/common';
import { AlertView } from '../../../components/alert/alert.view';
import { useInjectable } from '@opensumi/ide-core-browser';
import { WindowsTitle } from '../../../components/title';
import { ServerIconFinder } from '../../../base/config/server-icon.config';
import { MpsqlDbEditService } from './mpsql-db-edit.service';
import { IBaseState } from '../../common/data-browser.types';
import styles from './index.module.less';

const dbErr = '库名不能为空';
export const PostgresSchemaEditView = (props: IBaseState) => {
  const { serverType, option } = props;
  const [schema, setSchema] = useState<string>();
  const [owner, setOwner] = useState<string | undefined>('postgres');
  const [comment, setComment] = useState<string>();
  const [roles, setRoles] = useState<string[]>([]);
  const [result, setResult] = useState<IQueryResult | null>();
  const [oldSchemaInfo, setOldSchemaInfo] = useState<IPostgresDbDetail>();
  const [submitError, setSubmitError] = useState<boolean>(false);
  const sqlDbEditService = useInjectable<MpsqlDbEditService>(MpsqlDbEditService);

  useEffect(() => {
    if (props) {
      sqlDbEditService.init(props);
      initData();
    }
  }, []);

  const initData = useCallback(async () => {
    const queryRoles = await sqlDbEditService.getRoles();
    setRoles(queryRoles);
    //
    if (option === 'edit') {
      let oldSchemaInfo = await sqlDbEditService.getSchemaInfo();
      if (oldSchemaInfo) {
        const { schema, owner, comment } = oldSchemaInfo as IPostgresDbDetail;
        setOldSchemaInfo(oldSchemaInfo);
        setSchema(schema);
        setOwner(owner);
        setComment(comment);
      }
    }
  }, [props, sqlDbEditService]);

  const handleSave = useCallback(async () => {
    const isUpdate = option === 'edit';
    if (!schema) {
      setSubmitError(true);
      return;
    }
    let schemaInfo: IPostgresDbDetail = { schema: schema };
    if (isUpdate) {
      let userIsEdit = false;
      if (oldSchemaInfo?.schema !== schema) {
        schemaInfo.oldschema = oldSchemaInfo?.schema;
        userIsEdit = true;
      }
      if (oldSchemaInfo?.owner !== owner) {
        schemaInfo.owner = owner;
        userIsEdit = true;
      }
      if (oldSchemaInfo?.comment !== comment) {
        schemaInfo.comment = comment;
        userIsEdit = true;
      }
      if (!userIsEdit) return;
    } else {
      schemaInfo = { schema, owner, comment };
    }
    const result = await sqlDbEditService.saveSchema(schemaInfo, isUpdate, true);
    if (!result.success) {
      setResult(result);
    }
  }, [sqlDbEditService, schema, comment, props, owner, oldSchemaInfo]);

  return (
    <div className={styles['db-container']}>
      <WindowsTitle
        title={`Schema${option === 'create' ? '创建' : '修改'}`}
        icon={ServerIconFinder.getServerIcon(serverType, 'db')}
      />

      <LabelInput
        label={'Schema Name'}
        value={schema}
        required={option == 'create'}
        message={dbErr}
        validateMessage={submitError ? { type: 2, message: dbErr } : undefined}
        style={{ marginTop: '22px' }}
        onValueChange={(value) => {
          result && setResult(null);
          setSchema(value);
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

      <div className={styles['opt-message']}>
        {result ? (
          result.success ? (
            <AlertView message={`schema${option === 'create' ? '创建' : '修改'}成功`} type={'success'} />
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
