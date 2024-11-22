import { Autowired } from '@opensumi/di';
import { Domain } from '@opensumi/ide-core-browser';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import { IMainLayoutService, MainLayoutContribution } from '@opensumi/ide-main-layout';

import { Todo } from './todo.view';
import { WorkbenchEditorService } from '@opensumi/ide-editor';

@Domain(MainLayoutContribution)
export class TodoContribution implements MainLayoutContribution {
  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  onDidRender() {
    this.mainLayoutService.collectViewComponent(
      {
        component: Todo,
        collapsed: false,
        id: 'todo-view',
        name: 'Todo',
      },
      EXPLORER_CONTAINER_ID,
      // RecentExplorerId
    );
  }
}
