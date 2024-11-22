import { SearchPreviewPosition } from '../../base/types/layout.types';
import { IStorage, STORAGE_NAMESPACE, StorageProvider } from '@opensumi/ide-core-common';
import { AppConstants } from '../../../common/constants';
import { BOTTOM_QUERY_RESULT_CONTAINER } from '../../query-explorer/browser/query-explorer.contribution';
import { Autowired, Injectable } from '@opensumi/di';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { SlotLocation } from '@opensumi/ide-core-browser';

@Injectable()
export class PreviewControllerService {
  @Autowired(StorageProvider)
  private readonly storageProvider: StorageProvider;

  @Autowired(IMainLayoutService)
  private readonly layoutService: IMainLayoutService;

  public async controlPreviewPosition(position: SearchPreviewPosition) {
    const storage: IStorage = await this.storageProvider(STORAGE_NAMESPACE.EXPLORER);
    const storagePosition = await storage.get(AppConstants.SEARCH_PREVIEW_KEY);
    if (position === SearchPreviewPosition.RIGHT) {
      //切换right的显示
      if (storagePosition === SearchPreviewPosition.RIGHT) {
        //const rightTabBarService = this.layoutService.getTabbarService("right");
        const isVisible = this.layoutService.isVisible(SlotLocation.right);
        //if (!isVisible) {
        this.layoutService.toggleSlot(SlotLocation.right, !isVisible);
      } else {
        storage.set(AppConstants.SEARCH_PREVIEW_KEY, SearchPreviewPosition.RIGHT);
        //隐藏bottom
        const bottomContainer = this.layoutService.getTabbarHandler(BOTTOM_QUERY_RESULT_CONTAINER);
        bottomContainer?.isVisible && bottomContainer.deactivate();
        bottomContainer?.hide();
        //展示right
        const rightTabBarService = this.layoutService.getTabbarService('right');
        rightTabBarService.updatePanelVisibility(true);
        this.layoutService.toggleSlot(SlotLocation.right, true);
      }
    } else {
      if (storagePosition === SearchPreviewPosition.BOTTOM) {
        const bottomContainer = this.layoutService.getTabbarHandler(BOTTOM_QUERY_RESULT_CONTAINER);
        bottomContainer?.isVisible ? bottomContainer.deactivate() : bottomContainer?.activate();
      } else {
        storage.set(AppConstants.SEARCH_PREVIEW_KEY, SearchPreviewPosition.BOTTOM);
        //隐藏right
        const rightTabBarService = this.layoutService.getTabbarService('right');
        rightTabBarService.updatePanelVisibility(false);
        //展示bottom
        const bottomContainer = this.layoutService.getTabbarHandler(BOTTOM_QUERY_RESULT_CONTAINER);
        bottomContainer?.show();
        bottomContainer?.activate();
      }
    }
  }
}
