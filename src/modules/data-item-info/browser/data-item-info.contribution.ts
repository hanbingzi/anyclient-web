import { CommandContribution, CommandRegistry, Domain, StorageProvider } from '@opensumi/ide-core-common';
import {
  ComponentContribution,
  ComponentRegistry,
  getIcon,
  SlotLocation,
  TabBarToolbarContribution,
  localize,
  ToolbarRegistry,
} from '@opensumi/ide-core-browser';
import { DataItemInfoClear, DataItemInfoVisible } from '../../base/command/panel.command';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { Autowired } from '@opensumi/di';
import { DataItemInfoView } from './data-item-info.view';
import { DataItemInfoService } from './data-item-info.service';

export const DATA_ITEM_INFO_CONTAINER = 'data-item-info-container';

@Domain(ComponentContribution, CommandContribution, TabBarToolbarContribution)
export class DataItemInfoContribution implements ComponentContribution, CommandContribution, TabBarToolbarContribution {
  @Autowired(IMainLayoutService)
  private readonly layoutService: IMainLayoutService;

  @Autowired(StorageProvider)
  private readonly storageProvider: StorageProvider;

  @Autowired(DataItemInfoService)
  private readonly dataItemInfoService: DataItemInfoService;

  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'data-item-info-bottom',
      {
        id: DATA_ITEM_INFO_CONTAINER,
        component: DataItemInfoView,
      },
      {
        title: localize('data.info'),
        priority: 100,
        containerId: DATA_ITEM_INFO_CONTAINER,
      },
      SlotLocation.bottom,
    );
  }

  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(DataItemInfoVisible, {
      execute: () => {
        const bottomContainer = this.layoutService.getTabbarHandler(DATA_ITEM_INFO_CONTAINER);
        const isActivated = bottomContainer?.isActivated();
        isActivated ? bottomContainer?.deactivate() : bottomContainer?.activate();
      },
    });
    registry.registerCommand(DataItemInfoClear, {
      execute: () => {
        this.dataItemInfoService.clearData();
      },
    });
  }

  registerToolbarItems(registry: ToolbarRegistry) {
    registry.registerItem({
      id: DataItemInfoClear.id,
      command: DataItemInfoClear.id,
      viewId: DATA_ITEM_INFO_CONTAINER,
      iconClass: getIcon('clear'),
    });
  }
}
