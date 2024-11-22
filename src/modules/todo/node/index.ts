import { Injectable, Provider } from '@opensumi/di';
import { TodoClient } from './todo.client';
import { NodeModule } from '@opensumi/ide-core-node';
import { ITodoClientPath, ITodoClientToken } from '../common';

@Injectable()
export class ToDoNodeModule extends NodeModule {
  providers: Provider[] = [
    {
      token: ITodoClientToken,
      useClass: TodoClient,
    },
  ];

  backServices = [
    {
      servicePath: ITodoClientPath,
      token: ITodoClientToken,
    },
  ];
}
