import { Domain } from '@opensumi/ide-core-common';
import {
  ClientAppContribution,
  ComponentContribution,
  ComponentRegistry,
  SlotLocation,
  SlotRendererContribution,
  SlotRendererRegistry,
} from '@opensumi/ide-core-browser';
import { ToolBarView } from './index.view';
import { getIcon } from '@opensumi/ide-components';
import { TopSlotRenderer } from './top-slot';
import { Autowired } from '@opensumi/di';
import { DbSelectService } from './db-select.service';
import { IDbSelectServiceToken } from '../common';

@Domain(ClientAppContribution, ComponentContribution)
export class ToolbarOptionContribution implements ClientAppContribution, ComponentContribution {
  @Autowired(IDbSelectServiceToken)
  private dbSelectService: DbSelectService;

  // @Autowired(IToolbarRegistry)
  // registry: IToolbarRegistry;
  //
  // onDidStart() {
  //   this.registry.registerToolbarAction({
  //     component: createToolbarActionBtn({
  //       title: "test",
  //       id: 'test---',
  //       iconClass: getIcon('search')
  //     }), description: 'test',
  //     id: 'tttt',
  //     strictPosition: {location: 'menu-left', group: '_head'}//location:'toolbar-center',
  //   })
  // }

  // 暂时废除
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'toolbar',
      [
        {
          id: 'toolbar',
          component: ToolBarView,
          name: '测试',
        },
      ],
      {
        iconClass: getIcon('search'),
        priority: 1,
        containerId: 'toolbar-container',
      },
      SlotLocation.top,
    );
    // registry.register(
    //   'toolbar1',
    //   [
    //     {
    //       id: 'toolbar1',
    //       component: TestAction,
    //       name: '测试'
    //     }
    //   ],
    //   {
    //     iconClass: getIcon('search'),
    //     priority: 1,
    //     containerId: 'toolbar-container1',
    //   },
    //   SlotLocation.action,
    // );
  }

  initialize() {
    this.dbSelectService.setListener();
  }
}

// 通过 SlotRendererContribution 替换顶部的 SlotRenderer，将默认的上下平铺模式改成横向的 flex 模式：
@Domain(SlotRendererContribution)
export class ToolbarSlotContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry) {
    registry.registerSlotRenderer(SlotLocation.top, TopSlotRenderer);
  }
}
