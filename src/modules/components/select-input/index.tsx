import classNames from 'classnames';
import React, { useCallback, CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { getIcon, Icon } from '@opensumi/ide-components';
import styles from './style.module.less';

export interface IDataOption {
  label?: string;
  notMatch?: boolean;
  value: string;
}

export interface IDataOptionGroup {
  groupName: string;
  options: IDataOption[];
}

export interface ISelectProps {
  className?: string;
  size?: 'large' | 'default' | 'small';
  loading?: boolean;
  options: string[] | IDataOption[] | IDataOptionGroup[];
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onSelected?: (value: string) => void;
  /**
   * 当鼠标划过时触发回调
   * @param value 鼠标划过的是第几个 option
   */
  onMouseEnter?: (value: string, index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  maxHeight?: string;
  style?: CSSProperties;
  optionStyle?: CSSProperties;
  equals?: (v1: string | undefined, v2: string | undefined) => boolean;
  optionRenderer?: React.FC<{ data: IDataOption; isCurrent: boolean }>;
  groupTitleRenderer?: React.FC<{ group: IDataOptionGroup; index: number }>;
  headerComponent?: React.FC<any> | React.ComponentClass;
  footerComponent?: React.FC<any> | React.ComponentClass;
  bordered?: boolean;

  /**
   * 展示选择框提示
   */
  notMatchWarning?: string;
  /**
   * 搜索 placeholder
   */
  searchPlaceholder?: string;
  /**
   * 搜索时，根据输入筛选, 如果showSearch为true，则默认使用 label 判断
   */
  filterOption?: (input: string, options: IDataOption | string, group?: IDataOptionGroup) => boolean;
  /**
   * 列表为空时的展示组件
   */
  emptyComponent?: React.FC<any>;

  /**
   * 在显示可选项之前的操作
   * 返回 true 表示阻止此次显示
   */
  onBeforeShowOptions?: () => boolean;

  /**
   * 允许 select 的选项框宽度比 select宽度大, 默认 false
   */
  allowOptionsOverflow?: boolean;

  /**
   * 定义选择组件下拉选择菜单的渲染方式
   * fixed —— 相对视窗位置
   * absolute —— 相对于组件位置
   * 默认值为 fixed
   */
  dropdownRenderType?: 'fixed' | 'absolute';

  /**
   * 当前鼠标划过属性的描述信息
   */
  description?: string;

  /**
   * 显示下拉图标
   */
  showDownIcon?: boolean;
}

export const Option: React.FC<
  React.PropsWithChildren<{
    value: string | number;
    children?: any;
    className?: string;
    onClick?: (value: string | number) => void;
    optionLabelProp?: string;
    disabled?: boolean;
    label?: string | undefined;
    style?: any;
    containerClassName?: string[];
  }>
> = ({ value, children, disabled, onClick, className, ...otherProps }) => (
  <span
    {...otherProps}
    className={classNames(className, disabled && styles['option-disabled'])}
    onClick={() => onClick && !disabled && onClick(value)}
  >
    {children}
  </span>
);

export function isDataOptions(
  options: Array<React.ReactNode | { label: string; value: string }> | undefined,
): options is Array<{ label: string; value: string; iconClass?: string }> {
  if (!options) {
    return false;
  }
  if (options.length === 0) {
    return true;
  }
  return isDataOption(options[0]);
}

export function isDataOptionGroups(
  options: Array<string> | Array<IDataOption> | IDataOptionGroup[] | undefined,
): options is IDataOptionGroup[] {
  if (!options) {
    return false;
  }
  if (options.length === 0) {
    return true;
  }
  return isDataOptionGroup(options[0]);
}

function isDataOption(
  option: React.ReactNode | { label: string; value: string },
): option is { label: string; value: string; iconClass?: string } {
  return (option as any).value !== undefined;
}

function isDataOptionGroup(option: any): option is IDataOptionGroup {
  return (option as any).groupName !== undefined && isDataOptions((option as any).options);
}

function defaultOptionRenderer(v: { data: IDataOption | string; isCurrent: boolean }) {
  return <React.Fragment>{typeof v.data === 'string' ? v.data : v.data.label}</React.Fragment>;
}

function defaultGroupTitleRenderer({ group, index }: { group: IDataOptionGroup; index: number }) {
  return (
    <div key={'header_' + index} className={styles['select-group-header']}>
      <div>{group.groupName}</div>
    </div>
  );
}

function defaultFilterOption(input: string, option: IDataOption | string) {
  let strToSearch: string | undefined = typeof option === 'string' ? option : option.label;
  if (strToSearch === undefined) {
    strToSearch = typeof option === 'string' ? option : option.value;
  }
  if (typeof strToSearch === 'string') {
    return strToSearch.indexOf(input) !== -1;
  }
  return false;
}

export function SelectInput({
  disabled,
  options,
  size = 'default',
  value = '',
  autoFocus = false,
  onChange,
  onSelected,
  style,
  optionStyle,
  className,
  maxHeight,
  equals = (v1, v2) => v1 === v2,
  optionRenderer = defaultOptionRenderer,
  groupTitleRenderer,
  footerComponent,
  headerComponent,
  bordered = true,
  filterOption = defaultFilterOption,
  searchPlaceholder = '',
  emptyComponent,
  onBeforeShowOptions,
  allowOptionsOverflow,
  dropdownRenderType = 'fixed',
  onKeyDown,
}: ISelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  //console.log(`select-input --- value:${value},open:${open},filter:${filter}`)

  const selectRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const toggleOpen = useCallback(() => {
    const target = !open;
    if (target) {
      if (onBeforeShowOptions && onBeforeShowOptions()) {
        return;
      }
    }
    setOpen(target);
    !open && setFilter(false);
  }, [open, onBeforeShowOptions, onBeforeShowOptions]);

  const handleValueChange = useCallback(
    (value: string) => {
      if (onChange) {
        onChange(value);
      }
      //选择框打开的情况下，如果进行输入，则开始过滤
      open && !filter && setFilter(true);
    },
    [value, open, filter, onChange],
  );

  const handleSelected = useCallback(
    (value: string) => {
      if (onSelected) {
        //console.log('onSelected-->', value)
        onSelected(value);
      } else {
        onChange(value);
      }
      setOpen(false);
      setFilter(false);
    },
    [value, onSelected, onChange],
  );

  const optionsContainerClasses = classNames(styles['select-options'], {
    [styles['select-options-visible']]: open,
    [styles[`select-options-${size}`]]: size,
  });

  //const showWarning = notMatchWarning && selected.notMatch;

  const selectClasses = classNames(styles['select-value'], {
    //[styles['select-warning']]: showWarning,
    [styles['select-disabled']]: disabled,
    [styles['select-value-active']]: open,
    [styles[`select-value-${size}`]]: size,
    [styles['select-value-bordered']]: bordered,
  });

  useEffect(() => {
    if (selectRef.current && overlayRef.current) {
      const boxRect = selectRef.current.getBoundingClientRect();
      if (allowOptionsOverflow) {
        overlayRef.current.style.minWidth = `${boxRect.width}px`;
        // 防止戳出屏幕
        overlayRef.current.style.maxWidth = `${window.innerWidth - boxRect.left - 4}px`;
      } else {
        overlayRef.current.style.width = `${boxRect.width}px`;
      }
      // 防止戳出下方屏幕
      const toBottom = window.innerHeight - boxRect.bottom;
      if (!maxHeight || toBottom < parseInt(maxHeight, 10)) {
        overlayRef.current.style.maxHeight = `${toBottom}px`;
      }
      overlayRef.current.style.position = dropdownRenderType === 'fixed' ? 'fixed' : 'absolute';
    }
    if (open) {
      const listener = () => {
        setOpen(false);
      };
      document.addEventListener('click', listener);
      return () => {
        document.removeEventListener('click', listener);
      };
    }
  }, [open]);

  // 根据搜索输入过滤 options
  if (value && filter) {
    const result: any[] = [];
    if (options && isDataOptionGroups(options)) {
      for (const group of options) {
        const filteredGroup: IDataOptionGroup = {
          groupName: group.groupName,
          options: group.options.filter((o) => filterOption(value, o, group)),
        };
        if (filteredGroup.options.length > 0) {
          // 不显示空的group
          result.push(filteredGroup);
        }
      }
      options = result;
    } else if (options) {
      //@ts-ignore
      options.forEach((o: string | IDataOption) => {
        if (filterOption(value, o)) {
          result.push(o);
        }
      });
      options = result;
    }
  }

  const renderSearch = () => (
    <React.Fragment>
      <input
        className={classNames(styles['select-search'])}
        onChange={(e) => {
          handleValueChange(e.target.value);
        }}
        value={value ? value : ''}
        autoFocus={autoFocus}
        placeholder={searchPlaceholder || ''}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <Icon iconClass={getIcon('down')} onClick={toggleOpen} />
    </React.Fragment>
  );

  return (
    <div className={classNames(styles['select-container'], className)} ref={selectRef}>
      <p className={selectClasses} style={style}>
        {/*{showSearch && open ? renderSearch() : renderSelected()}*/}
        {renderSearch()}
      </p>
      {/*{showWarning && <div className={styles['select-warning-text']}>{notMatchWarning}</div>}*/}

      {open && (
        <SelectOptionsList
          optionRenderer={optionRenderer}
          options={options}
          equals={equals}
          optionStyle={optionStyle}
          currentValue={value}
          size={size}
          onSelect={handleSelected}
          groupTitleRenderer={groupTitleRenderer}
          className={optionsContainerClasses}
          style={{ maxHeight: `${maxHeight}px` }}
          ref={overlayRef}
          footerComponent={footerComponent}
          headerComponent={headerComponent}
          emptyComponent={emptyComponent}
        />
      )}
    </div>
  );
}

export interface ISelectOptionsListProps {
  className?: string;
  size?: 'large' | 'default' | 'small';
  currentValue?: string;
  options: string[] | IDataOption[] | IDataOptionGroup[];
  onSelect: (value: string) => void;
  optionStyle?: any;
  equals?: (v1: string | undefined, v2: string | undefined) => boolean;
  optionRenderer?: React.FC<{ data: IDataOption; isCurrent: boolean }>;
  groupTitleRenderer?: React.FC<{ group: IDataOptionGroup; index: number }>;
  style?: any;
  renderCheck?: boolean;
  headerComponent?: React.FC<any> | React.ComponentClass;
  footerComponent?: React.FC<any> | React.ComponentClass;
  emptyComponent?: React.FC<any> | React.ComponentClass;
}

export const SelectOptionsList = React.forwardRef((props: ISelectOptionsListProps, ref) => {
  const {
    options,
    optionRenderer: OPC = defaultOptionRenderer,
    equals = (v1, v2) => v1 === v2,
    onSelect,
    currentValue,
    optionStyle,
    size,
    className,
    style,
    groupTitleRenderer: GT = defaultGroupTitleRenderer,
    renderCheck,
    headerComponent: HC,
    footerComponent: FC,
    emptyComponent: EC,
  } = props;
  const optionsContainerClasses = classNames(
    styles['select-options'],
    {
      [styles[`select-options-${size}`]]: true,
    },
    className,
  );

  function renderWithGroup(groups: IDataOptionGroup[]) {
    return groups.map((group, index) => {
      const header = <GT group={group} index={index} />;
      return (
        <React.Fragment key={'group_' + index}>
          {header}
          {renderWithoutGroup(group.options)}
        </React.Fragment>
      );
    });
  }

  function renderWithoutGroup(options: IDataOption[] | string[]) {
    return (
      options &&
      options.map((v, index) => {
        const value = typeof v === 'string' ? v : v.value;
        const isCurrent = equals(currentValue, value);
        return (
          <Option
            value={index}
            key={index}
            className={classNames({
              [styles['select-option-select']]: isCurrent,
              [styles['select-option-default']]: true,
              [styles['option-with-check']]: renderCheck,
            })}
            onClick={() => onSelect(value)}
            style={optionStyle}
          >
            {renderCheck && equals(currentValue, value) ? (
              <div className={styles['option-check']}>
                <Icon icon={'check'} />
              </div>
            ) : undefined}
            <OPC data={v} isCurrent={isCurrent} />
          </Option>
        );
      })
    );
  }

  let isEmpty: boolean;
  if (isDataOptionGroups(options)) {
    isEmpty = options.filter((group) => group.options.length > 0).length === 0;
  } else {
    isEmpty = options.length === 0;
  }

  return (
    <div
      className={optionsContainerClasses}
      style={style}
      //@ts-ignore
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {HC ? <HC /> : null}
      {isEmpty && EC ? (
        <EC />
      ) : (
        (isDataOptionGroups(options) ? renderWithGroup(options) : renderWithoutGroup(options)) || (EC && <EC />)
      )}
      {FC ? <FC /> : null}
    </div>
  );
});
