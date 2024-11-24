import { Autowired } from '@opensumi/di';
import { ClientAppContribution } from '@opensumi/ide-core-browser/lib/common';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  EditorComponentRenderMode,
  IResource,
  ResourceService,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser/types';
import { Domain, localize, StorageProvider, URI } from '@opensumi/ide-core-common';
import { IWorkspaceService } from '@opensumi/ide-workspace/lib/common';
import { IconService } from '@opensumi/ide-theme/lib/browser';
import { WelcomeView } from './welcome.view';
import { IconType } from '@opensumi/ide-theme';
import { anyclient_base64 } from '../../icons/main';

// const COMPONENTS_VIEW_COMMAND = {
//   id: 'opensumi-builtin-services-sample',
// };

const COMPONENTS_ID = 'anyclient-welcome-id';
const COMPONENTS_SCHEME_ID = 'anyclient-welcome-id';

@Domain(BrowserEditorContribution, ClientAppContribution)
export class WelcomeContribution implements ClientAppContribution, BrowserEditorContribution {
  @Autowired(IWorkspaceService)
  protected readonly workspaceService: IWorkspaceService;

  @Autowired(IconService)
  protected readonly iconService: IconService;

  @Autowired(StorageProvider)
  protected readonly getStorage: StorageProvider;

  @Autowired(WorkbenchEditorService)
  protected readonly editorService: WorkbenchEditorService;

  //
  // registerCommands(registry: CommandRegistry) {
  //   registry.registerCommand(COMPONENTS_VIEW_COMMAND, {
  //     execute: () => {
  //       this.editorService.open(new URI(`${COMPONENTS_SCHEME_ID}://`), { preview: false });
  //     },
  //   });
  // }

  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorComponent({
      uid: COMPONENTS_ID,
      scheme: COMPONENTS_SCHEME_ID,
      component: WelcomeView,
      renderMode: EditorComponentRenderMode.ONE_PER_WORKBENCH,
    });

    registry.registerEditorComponentResolver(COMPONENTS_SCHEME_ID, (resource, results) => {
      results.push({
        type: 'component',
        componentId: COMPONENTS_ID,
      });
    });
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider({
      scheme: COMPONENTS_SCHEME_ID,
      provideResource: async (uri: URI): Promise<IResource<any>> => {
        return {
          uri,
          name: localize('welcome.title'),
          icon: this.iconService.fromIcon('', anyclient_base64, IconType.Base64)!,
        };
      },
    });
  }

  async onDidStart() {
    //打开欢迎页
    //this.editorService.open(new URI(`${COMPONENTS_SCHEME_ID}://`), { preview: false });
  }
}
