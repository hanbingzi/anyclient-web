import { Command } from '@opensumi/ide-core-common';
import { getIcon } from '@opensumi/ide-components';

export const PanelCommand = {
  rightPreviewVisible: 'panel.rightPreviewVisible',
  bottomPreviewVisible: 'panel.bottomPreviewVisible',
  dataItemInfoVisible: 'panel.dataItemInfoVisible',
};

export const RightPreviewVisible: Command = { id: PanelCommand.rightPreviewVisible, label: 'Search Result' };
export const BottomPreviewVisible: Command = { id: PanelCommand.bottomPreviewVisible, label: 'Search Result' };
//dataItemInfo 显示与否
export const DataItemInfoVisible: Command = { id: PanelCommand.dataItemInfoVisible, label: 'Data Info' };

export const DataItemInfoClear: Command = {
  id: 'panel.dataItemInfoClear',
  label: 'Data Info',
  iconClass: getIcon('clear'),
};
