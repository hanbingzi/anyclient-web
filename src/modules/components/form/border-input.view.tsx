import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import cls from 'classnames';
import styles from './boeder-input.module.less';
import { Icon, ValidateInput } from '@opensumi/ide-components';
import { isEmpty } from '../../base/utils/object-util';

export interface BorderInputProps {
  title: string;
  value: string;
  isNumber?: boolean;
  readonly?: boolean;
  enableSave?: boolean;
  enableRevert?: boolean;
  width?: number;
  style?: CSSProperties;
  onSave?: (value: string) => void;
  onChange?: (value: string) => void;
}

/**
 * 自带边框的input
 * @param props
 * @constructor
 */
export const BorderIconInput = (props: BorderInputProps) => {
  const { title, value, readonly, enableSave = false, enableRevert = false, onSave, width, style } = props;
  const [currentValue, setCurrentValue] = useState<string>();
  const handleRevert = useCallback(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className={cls(styles['input-container'])} style={{ ...style, width: width || 400 }}>
      <div className={cls(styles['group-item'], styles['group-title'])}>{title}</div>
      <div className={cls(styles['group-item'], styles['group-input'])}>
        <ValidateInput
          type={'text'}
          // validate={hasValidateError}
          onBlur={() => {
            // handleKeyNameChange(value);
          }}
          onValueChange={(value) => {
            setCurrentValue(value);
          }}
          value={currentValue}
        />
      </div>
      {enableRevert && enableSave && (
        <div className={cls(styles['group-item'], styles['option'])}>
          {enableRevert ? (
            <Icon
              tooltip={'撤销'}
              disabled={value === currentValue}
              icon={'rollback'}
              onClick={handleRevert}
              className={cls('kt-clickable-icon', styles['cache-icon'])}
            />
          ) : null}
          {enableSave ? (
            <Icon
              tooltip={'保存'}
              disabled={value === currentValue || isEmpty(currentValue)}
              icon={'check'}
              onClick={() => {
                onSave && onSave(currentValue!);
              }}
              className={cls('kt-clickable-icon', styles['cache-icon'])}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export const BorderInput = (props: BorderInputProps) => {
  const { title, value, width, onChange, style } = props;

  return (
    <div className={cls(styles['input-container'])} style={{ ...style, width: width || 400 }}>
      <div className={cls(styles['group-item'], styles['group-title'])}>{title}</div>
      <div className={cls(styles['group-item'], styles['group-input'])}>
        <ValidateInput
          type={'text'}
          onValueChange={(value) => {
            if (onChange) {
              onChange(value);
            }
          }}
          value={value}
        />
      </div>
    </div>
  );
};
