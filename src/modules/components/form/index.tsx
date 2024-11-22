import React, { CSSProperties, ReactNode, useCallback } from 'react';
import { IInputBaseProps, ValidateInput, ValidateInputProp } from '@opensumi/ide-components';
import { isEmpty } from '../../base/utils/object-util';
import styles from './style.module.less';
import cls from 'classnames';

export { BorderInput } from './border-input.view';

export interface LabelItemProps {
  required?: boolean;
  label: string;
  size?: 'default' | 'large' | 'small';
  marginTop?: number;
  style?: CSSProperties;
  children?: ReactNode;
  isValidate?: boolean;
}

export interface LabelInputProps extends LabelItemProps {
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';

  message?: string;

  value: any;
  onValueChange: (value: string) => void;
}

export const LabelItem = (props: LabelItemProps) => {
  const { required, label, size, style, children, marginTop = 22 } = props;
  return (
    <div className={styles['item-input-container']} style={{ marginTop, ...style }}>
      <div
        className={cls(
          styles['label-wrap'],
          size === 'default' && styles['label-wrap-default'],
          size === 'small' && styles['label-wrap-small'],
          size === 'large' && styles['label-wrap-large'],
        )}
      >
        {required ? <div className={styles['required']}>*</div> : null}
        <div>{label}</div>
      </div>
      <div className={styles['input-wrap']}>{children}</div>
    </div>
  );
};

/**
 * 带label和验证的input
 * @param props
 * @constructor
 */
export const LabelInput = (props: LabelInputProps & ValidateInputProp) => {
  const {
    isValidate = false,
    type = 'text',
    label,
    required = false,
    message = '此为必填项',
    size = 'default',
    value,
    onValueChange,
    style,
    ...restProps
  } = props;

  const handleValidate = useCallback(
    (inputValue: string | number) => {
      if (required && isEmpty(inputValue)) {
        return { type: 2, message };
      }
    },
    [required, value, message],
  );

  return (
    <LabelItem {...props}>
      <ValidateInput
        value={value}
        type={type}
        validate={(value) => handleValidate(value)}
        size={size}
        onValueChange={onValueChange}
        validateMessage={isValidate ? { type: 2, message } : undefined}
        {...restProps}
      />
    </LabelItem>
  );
};
