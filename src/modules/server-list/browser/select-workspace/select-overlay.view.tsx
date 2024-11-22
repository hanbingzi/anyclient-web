import React from 'react';
import { observer } from 'mobx-react-lite';
import { useInjectable } from '@opensumi/ide-core-browser';
import { ISelectWorkspaceService } from './select-workspace.service';
import { Overlay } from '@opensumi/ide-components';
import SelectWorkspaceView from './select-workspace.view';

const SelectOverlayView = observer(() => {
  const selectWorkspaceService = useInjectable<ISelectWorkspaceService>(ISelectWorkspaceService);

  return (
    <Overlay
      title={'请先设置一个工作区'}
      visible={selectWorkspaceService.isVisible()}
      onClose={() => {
        selectWorkspaceService.hide();
      }}
      afterClose={() => {}}
      // centered
      width={500}
    >
      <SelectWorkspaceView recentWorkspaces={selectWorkspaceService.getRecentWorkspaces()} />
    </Overlay>
  );
});

export default SelectOverlayView;
