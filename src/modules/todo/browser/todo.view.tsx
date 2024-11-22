import * as React from 'react';

import { CommandService, useInjectable } from '@opensumi/ide-core-browser';
import { TodoService } from './todo.service';
import styles from './todo.module.less'
export const Todo = () => {
  const todoMysqlService = useInjectable<TodoService>(TodoService);

  const commandService = useInjectable<CommandService>(CommandService);

  const handleTestClick = () => {
    todoMysqlService.test();
  };

  const handleMysqlClick = () => {
    todoMysqlService.query();
  };

  return (
    <div >
      <h3 className={styles['todo_container']}>Hello world</h3>
      <h3 onClick={handleTestClick}>发现新版本</h3>
      <h3 onClick={handleMysqlClick}>Mysql Run</h3>
    </div>
  );
};
