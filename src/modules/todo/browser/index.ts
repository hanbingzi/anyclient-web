import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { TodoContribution } from './todo.contribution';
import { ITodoClientPath, ITodoToken } from '../common';
import { TodoService } from './todo.service';

@Injectable()
export class TodoModule extends BrowserModule {
  providers: Provider[] = [
    TodoContribution,
    {
      token: ITodoToken,
      useClass: TodoService,
    },
  ];
  backServices = [
    {
      servicePath: ITodoClientPath,
    },
  ];
}
