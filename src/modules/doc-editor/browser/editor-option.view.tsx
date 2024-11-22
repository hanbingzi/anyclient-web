import styles from './data-editor.module.less';
import { Icon, Option, Select } from '@opensumi/ide-components';
import cls from 'classnames';
import React, { useCallback } from 'react';
import { DisplayModelBuffer, DisplayModelString, DisplayModelType } from '../common';

export interface EditorOptionParam {
  dataType: 'string' | 'buffer';
  model: DisplayModelType;
  onSelectMode: (model: DisplayModelType) => void;
  onSave?: () => void;
  onRefresh?: () => void;
  onCopy?: () => void;
  enableSave?: boolean;
  canSave?: boolean;
  enableRefresh?: boolean;
  enableCopy?: boolean;
}

export function EditorOption(param: EditorOptionParam) {
  const {
    dataType,
    model,
    enableSave = false,
    canSave,
    enableRefresh = false,
    enableCopy = true,
    onSelectMode,
    onSave,
    onRefresh,
    onCopy,
  } = param;

  const renderSaveIcon = useCallback(() => {
    return enableSave ? (
      <div className={styles['opt-item']}>
        <Icon
          tooltip={'保存'}
          disabled={!canSave}
          icon={'check'}
          onClick={onSave}
          className={cls('kt-clickable-icon')}
        />
      </div>
    ) : null;
  }, [enableSave, onSave, canSave]);

  const renderRefreshIcon = useCallback(() => {
    return enableRefresh ? (
      <div className={styles['opt-item']}>
        <Icon
          tooltip={'刷新'}
          disabled={false}
          icon={'refresh'}
          onClick={onRefresh}
          className={cls('kt-clickable-icon')}
        />
      </div>
    ) : null;
  }, [enableRefresh, onRefresh]);

  const renderCopyIcon = useCallback(() => {
    return enableCopy ? (
      <div className={styles['opt-item']}>
        <Icon
          tooltip={'复制'}
          disabled={false}
          icon={'file-copy'}
          onClick={onCopy}
          className={cls('kt-clickable-icon')}
        />
      </div>
    ) : null;
  }, [enableCopy, onCopy]);

  return (
    <div className={styles['opt-container']}>
      <div className={styles['type-select-wrap']}>
        <Select
          size={'small'}
          options={dataType === 'string' ? DisplayModelString : DisplayModelBuffer}
          onChange={onSelectMode}
          value={model}
        />
      </div>
      <div className={styles['opt-btn-wrap']}>
        {renderSaveIcon()}
        {renderRefreshIcon()}
        {renderCopyIcon()}
      </div>
    </div>
  );
}
