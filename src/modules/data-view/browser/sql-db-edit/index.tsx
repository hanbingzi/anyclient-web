import React from 'react';
import { IBaseState } from '../../common/data-browser.types';
import { MysqlDbEditView } from './mysql-db-edit.view';
import { PostgresDbEditView } from './postgres-db-edit.view';
import { PostgresSchemaEditView } from './postgres-schema-edit.view';
import { MysqlTypeDb } from '../../../base/config/server.config';
import { CommonDbEditView } from './common-db-edit.view';

export const SqlDbEditView = (props: IBaseState) => {
  const { serverType, nodeType, option } = props;
  if (MysqlTypeDb.includes(serverType)) {
    return <MysqlDbEditView {...props} />;
  } else if (serverType === 'Postgresql') {
    if (nodeType === 'server') {
      return <PostgresDbEditView {...props} />;
    }
    if (nodeType === 'db') {
      if (option === 'edit') {
        return <PostgresDbEditView {...props} />;
      } else if (option === 'create') {
        return <PostgresSchemaEditView {...props} />;
      }
    }
    if (nodeType === 'schema') {
      if (option === 'edit') {
        return <PostgresSchemaEditView {...props} />;
      }
    }
  }else if(serverType==='Hive'){
    return <CommonDbEditView {...props} />;
  }
  return <div>暂时不支持</div>;
};
