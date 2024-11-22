import { CommandContribution, CommandRegistry, Domain, URI } from '@opensumi/ide-core-browser';
import { ServerCommandIds } from '../../base/command/menu.command';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  EditorComponentRenderMode,
  IResourceOpenOptions,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser';
import { Autowired } from '@opensumi/di';
import { OpenParam } from '../../base/param/open-view.param';
import { ResourceService } from '@opensumi/ide-editor';
import { DataBrowserResourceProvider } from './data-browser.provider';
import { DataBrowserView } from './data-browser.view';

/**
 * 常量要全部大写
 */
export const DATA_BROWSER_ID = 'data-browser-id';

@Domain(BrowserEditorContribution, CommandContribution)
export class TableViewContribution implements BrowserEditorContribution, CommandContribution {
  @Autowired(WorkbenchEditorService)
  private readonly workbenchEditorService: WorkbenchEditorService;

  @Autowired(DataBrowserResourceProvider)
  private readonly dataBrowserResourceProvider: DataBrowserResourceProvider;

  // @Autowired(IEditorDocumentModelContentRegistry)
  // private readonly contentRegistry: IEditorDocumentModelContentRegistry;

  // @Autowired(TokenCustomEditorDocumentContentProvider)
  // private readonly customEditorDocumentContentProvider: IEditorDocumentModelContentProvider;
  //
  // registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry): void {
  //   registry.registerEditorDocumentModelContentProvider(this.customEditorDocumentContentProvider);
  // }

  // @Autowired(JSONRedisViewProviderToken)
  // private readonly JSONRedisViewProvider: IEditorDocumentModelContentProvider;

  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorComponent({
      uid: DATA_BROWSER_ID,
      scheme: DATA_BROWSER_ID,
      component: DataBrowserView,
      renderMode: EditorComponentRenderMode.ONE_PER_RESOURCE, // EditorComponentRenderMode[Symbol.hasInstance]//.ONE_PER_WORKBENCH,
    });
    registry.registerEditorComponentResolver(DATA_BROWSER_ID, (resource, results) => {
      results.push({
        type: 'component',
        componentId: DATA_BROWSER_ID,
      });
    });
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider(this.dataBrowserResourceProvider);
  }

  // registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry): void {
  //   registry.registerEditorDocumentModelContentProvider(this.JSONRedisViewProvider);
  // }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(ServerCommandIds.openDataView, {
      execute: (openParam: OpenParam, options?: IResourceOpenOptions) =>
        this.workbenchEditorService.open(
          URI.from({
            scheme: DATA_BROWSER_ID,
            query: URI.stringifyQuery(openParam),
          }),
          options,
        ),
    });
  }
}
