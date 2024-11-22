import { Domain, SlotLocation } from '@opensumi/ide-core-browser';
import { ComponentContribution, ComponentRegistry } from '@opensumi/ide-core-browser/lib/layout';
import { Autowired } from '@opensumi/di';
import ServerInfoView from './server-info.view';
import { IServerEditService } from '../common';

const serverManagerViewId = 'server-manager-view';

//MenuContribution
@Domain(ComponentContribution)
export class ServerManagerContribution implements ComponentContribution {
  @Autowired(IServerEditService)
  private readonly serverEditService: IServerEditService;

  registerComponent(registry: ComponentRegistry): void {
    registry.register(
      serverManagerViewId,
      {
        id: serverManagerViewId,
        component: ServerInfoView,
      },
      undefined,
      //插槽位置声明
      SlotLocation.extra,
    );
  }
}
