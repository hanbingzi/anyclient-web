import styles from './index.module.less';
import cls from 'classnames';
import * as React from 'react';
import { Icon } from '@opensumi/ide-components';
import { useInjectable } from '@opensumi/ide-core-browser';
import { IPreviewControllerServiceToken } from '../common';
import { PreviewControllerService } from './preview-controller.service';
import { useCallback } from 'react';
import { SearchPreviewPosition } from '../../base/types/layout.types';

export const Portrait = () => {
  const previewControllerService = useInjectable<PreviewControllerService>(IPreviewControllerServiceToken);

  const previewHandle = useCallback((position: SearchPreviewPosition) => {
    previewControllerService.controlPreviewPosition(position);
  }, []);

  return (
    <div className={styles['toolbar-right']}>
      <div className={cls(styles['toolbar-icon'])}>
        <Icon
          icon={'dock-down'}
          onClick={() => {
            previewHandle(SearchPreviewPosition.BOTTOM);
          }}
        />
      </div>
      <div className={cls(styles['toolbar-icon'])}>
        <Icon
          icon={'dock-right'}
          onClick={() => {
            previewHandle(SearchPreviewPosition.RIGHT);
          }}
        />
      </div>
      {/*<div className={cls(styles['toolbar-icon'] )}>*/}
      {/*  <IconSvg icon={<Wechat/>} size={"large"} shadow={false}/>*/}
      {/*</div>*/}
      <div className={cls(styles['toolbar-item-box'])}>
        <div className={styles['head-portrait']}></div>
      </div>
    </div>
  );
};
