import { CellDataProps, CellProps, ISqlFile } from './table-editor.types';
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import cls from 'classnames';
import { CheckBox } from '@opensumi/ide-components';
import styles from './table-editor.module.less';
import { ENTER_KEY, TAB_KEY } from '../../base/types/keys.types';
import { isEmpty, isNull } from '../../base/utils/object-util';
import { DataInputEnum, DataInputToSimple, isFile } from '../../base/types/edit-input.types';
import { AutoComplete, DatePicker, Select as AntdSelect, TimePicker } from 'antd';
import { PickerMode } from 'rc-picker/es/interface';
import TextareaAutosize from '../textarea';
import { ErrorToast } from '../error';

export const Cell = (props: CellProps) => {
  const {
    rowId,
    rowIndex,
    columnIndex,
    data,
    initialValue,
    column,
    style,
    searchWord,
    width,
    isEditor,
    isSelected,
    isModified,
    isAdd = false,
    isError = false,
    onDoubleClick,
    onClick,
    onMouseDown,
    onMouseOver,
    // onChange,
    onCommit,
    onContextMenu,
    onKeyDown,
  } = props;

  const { columnKey, showEdit, render } = column;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const handleDoubleClick = (ev: React.MouseEvent) => {
    if (onDoubleClick) onDoubleClick(ev, rowId, rowIndex!, columnIndex!);
  };

  const handleClick = (ev: React.MouseEvent) => {
    //console.log('cell interaction---------->');
    if (onClick) onClick(ev, rowId, rowIndex!, columnIndex!);
  };

  // const handleMouseDown = (ev: React.MouseEvent) => {
  //     if (onMouseDown) {
  //         onMouseDown(ev, rowIndex!, columnIndex!)
  //     }
  // }
  //
  // const handleMouseOver = (ev: React.MouseEvent) => {
  //     if (onMouseOver) {
  //         onMouseOver(ev, rowIndex!, columnIndex!)
  //     }
  // }

  const handleCommit = (newValue: any, e?: React.KeyboardEvent) => {
    if (onCommit) {
      if (newValue === data || (isEmpty(newValue) && isEmpty(data))) {
        onCommit(undefined, e);
      } else {
        if (column.disableEdit) {
          //不允许编辑的列
          return;
        }
        onCommit([{ rowId, columnIndex, columnKey, newValue, lastValue: data, option: isAdd ? 'add' : 'update' }], e);
      }
    }
  };

  const renderCellContent = useCallback(() => {
    if (render) {
      return render({
        value: data,
        initialValue,
        columnKey,
        column,
        rowId,
        rowIndex,
        columnIndex,
        isAdd,
        isEditor,
        width,
        multiCommit: onCommit,
        commit: handleCommit,
      });
    }
    if (showEdit) {
      return (
        <EditViewer
          value={data}
          columnKey={columnKey}
          column={column}
          rowId={rowId}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          initialValue={initialValue}
          isAdd={isAdd}
          forwardedRef={cellRef}
          width={width - 1}
          commit={handleCommit}
        />
      );
    } else if (isEditor) {
      return (
        <DataEditor
          value={data}
          columnKey={columnKey}
          column={column}
          rowId={rowId}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          initialValue={initialValue}
          width={width}
          isAdd={isAdd}
          forwardedRef={cellRef}
          commit={handleCommit}
        />
      );
    }
    return (
      <ValueViewer
        value={data}
        columnKey={columnKey}
        column={column}
        rowId={rowId}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        initialValue={initialValue}
        isAdd={isAdd}
        width={width - 1}
        searchWord={searchWord}
      />
    );
  }, [
    data,
    initialValue,
    columnKey,
    column,
    rowId,
    rowIndex,
    columnIndex,
    isAdd,
    isEditor,
    width,
    onCommit,
    handleCommit,
    cellRef,
  ]);

  const classNames = cls(
    styles['cell'],
    styles['cell-div'],
    isSelected && styles['selected'],
    isModified && styles['modified'],
    isAdd && data && styles['modified'],
    isError && styles['error'],
  );
  return (
    <div
      className={classNames}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      style={{ ...style, width: `${width}px` }}
      onContextMenu={(e) => onContextMenu(e)}
      ref={cellRef}
    >

      {renderCellContent()}
    </div>
  );
};

export function DataEditor({
  value,
  initialValue,
  columnKey,
  column,
  rowId,
  rowIndex,
  columnIndex,
  width,
  isAdd,
  commit,
  forwardedRef,
}: CellDataProps & { forwardedRef: RefObject<HTMLDivElement> }) {
  const [currentValue, setCurrentValue] = useState(value);
  const currentValueRef = useRef<string | number | undefined>();
  const destroyCommit = useRef<boolean>(true);
  // const inputRef = useRef<HTMLInputElement>(null);
  const { inputType, dataType } = column!;

  useEffect(() => {
    // if (inputRef && inputRef.current) {
    //   inputRef.current.focus();
    // }
    return () => {
      //当点击其他地方时，执行提交
      //console.log('useEffect执行3,提交的value', currentValueRef.current)
      const isCommit = destroyCommit.current;
      //console.log('DataEditor useEffect执行2,提交的value', currentValueRef.current, ',isCommit:', isCommit);
      if (isCommit) {
        //console.log('DataEditor useEffect执行2,handleCommit');
        handleCommit(undefined, currentValueRef.current);
      }
    };
  }, []);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const handleInputChange = (value: string, isNum: boolean = false) => {
    //let newValue = inputRef.current?.value;
    if (isNum) {
      const regex = /^-?\d+(\.\d+)?$/;
      if (regex.test(value)) {
        setCurrentValue(value);
      }else if(isEmpty(value)){
        setCurrentValue(value);
      }
    } else {
      setCurrentValue(value);
    }
  };
  // const handleAreaChange = (e: ChangeEventHandler<HTMLAreaElement>) => {
  //   let newValue = e.target.value;
  //   //console.log('input handleChange 新设置的值：', newValue);
  //   setCurrentValue(newValue);
  // };

  const handleTimeChange = (newValue: string) => {
    // console.log('handleTimeChange-->:', newValue);
    setCurrentValue(newValue);
    //时间点击完成，开启点击外部提交数值
    //enableClickOutSide!()
  };

  const handleSelect = (newValue: any) => {
    //console.log('handleSelect-->:', newValue)
    setCurrentValue(newValue);
    //handleCommit(undefined);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    // console.log('cell handleKey');
    const keyCode = e.which || e.keyCode;

    if (keyCode === ENTER_KEY || keyCode === TAB_KEY) {
      //console.log('handleKey BEFORE IsAdd:', isAdd);
      destroyCommit.current = false;
      handleCommit(e);
      //e.preventDefault()
    }
  };

  const handleCommit = (e?: React.KeyboardEvent, newValue?: string | number | undefined) => {
    //console.log('handleCommit被执行的newValue', newValue, ';currentValue', currentValue);
    if (commit) {
      commit(newValue !== undefined ? newValue : currentValue, e);
      //   console.log('handleCommit BEFORE,newValue', newValue, ';currentValue:', currentValue, ';initialValue:', initialValue)
      // if (isAdd) {
      //   if (currentValue || newValue !== undefined) {
      //   }
      // } else {
      //   onCommit(rowId, rowIndex, columnIndex, {
      //     key: columnKey,
      //     newValue: newValue !== undefined ? newValue : currentValue,
      //     //  oldValue: initialValue,
      //     option: 'update'
      //   }, e)
      // }
    }
  };

  const renderInput = ({ isNum = false }: { isNum?: boolean }) => {
    const showValue = isFile(column.dataType)
      ? getFileShowValue(currentValue)[0]
      : isNull(currentValue)
      ? ''
      : currentValue;
    return (
      <TextareaAutosize
        value={showValue}
        onChange={(e) => handleInputChange(e.target.value, isNum)}
        onKeyDown={handleKey}
        style={{ width }}
        autoFocus
      />
    );
  };
  // const renderInputNumber = () => {
  //   return (
  //     <input
  //       className={styles['data-editor']}
  //       value={currentValue ? currentValue : ''}
  //       type={'number'}
  //       onChange={(e)=>handleInputChange(e.target.value)}
  //       onKeyDown={handleKey}
  //       ref={inputRef}
  //     />
  //   );
  // };

  const renderDatePicker = () => {
    let dateFormat = '';
    let showTime = false;
    let picker: PickerMode = 'date';
    switch (dataType!) {
      case DataInputEnum.date:
        dateFormat = 'YYYY-MM-DD';
        break;
      case DataInputEnum.timestamp:
      case DataInputEnum.datetime:
        dateFormat = 'YYYY-MM-DD HH:mm:ss';
        showTime = true;
        break;
      case DataInputEnum.year:
        dateFormat = 'yyyy';
        picker = 'year';
        break;
    }
    const dateValue = currentValue ? moment(currentValue, dateFormat) : null;
    //console.log('-----------------dateValue:', dateValue);
    return (
      <DatePicker
        style={{ width: '100%' }}
        //onKeyDown={handleKey}
        onChange={(m, ds) => {
          console.log('onChange DatePicker', ds);
          handleTimeChange(ds);
        }}
        onOk={(m) => {
          console.log('onOk-->');
        }}
        size={'small'}
        showTime={showTime}
        bordered={false}
        value={dateValue}
        picker={picker}
      />
    );
  };
  const renderTimePicker = () => {
    return (
      <TimePicker
        style={{ width: '100%' }}
        //onKeyDown={handleKey}
        onChange={(m, ds) => {
          handleTimeChange(ds);
        }}
        size={'small'}
        bordered={false}
        value={currentValue ? moment(currentValue, 'HH:mm:ss') : null}
      />
    );
  };

  const renderSelect = () => {
    return (
      // <Select
      //   options={column!.selectGroup}
      //   showSearch={true}
      //   dropdownRenderType={'absolute'}
      //   value={currentValue}
      //   onChange={handleSelect}
      //   size={'small'}
      //   //className={styles['antd-data-editor']}
      //   allowOptionsOverflow={true}
      //   onKeyDown={handleKey}
      //
      // >
      // </Select>
      <AntdSelect
        options={column!.selectGroup as any}
        showSearch={true}
        // dropdownRenderType={'absolute'}
        value={currentValue}
        onChange={handleSelect}
        size={'small'}
        //className={styles['antd-data-editor']}
        // allowOptionsOverflow={true}
        onKeyDown={handleKey}
        style={{ width: '100%' }}
        getPopupContainer={() => forwardedRef!.current!}
      ></AntdSelect>
    );
  };
  const renderSelectInput = () => {
    return (
      // <SelectInput
      //   options={column!.selectGroup!}
      //   value={currentValue as string}
      //   onChange={handleSelect}
      //   onSelected={handleSelect}
      //   size={'small'}
      //   style={{ width: '100%' }}
      //   allowOptionsOverflow={true}
      //   bordered={false}
      //   onKeyDown={handleKey}
      //   autoFocus={true}
      //   getPopupContainer={trigger => trigger.parentNode}
      // />);
      <AutoComplete
        style={{ width: '100%' }}
        options={column!.selectGroup! as any}
        value={currentValue as string}
        size={'small'}
        bordered={false}
        autoFocus={true}
        onChange={handleSelect}
        defaultOpen={true}
        filterOption={(inputValue, option) =>
          (option!.value! as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        getPopupContainer={() => forwardedRef.current!}
      />
    );
  };

  const renderContent = () => {
    //console.log('value:', initialValue, value, ';type=>', column?.dataType, ';inputType:', column?.inputType)
    if (inputType === 'select') {
      return renderSelect();
    } else if (inputType === 'selectInput') {
      return renderSelectInput();
    } else if (inputType === 'input') {
      if (dataType === 'number') {
        return renderInput({ isNum: true });
      } else if (
        [DataInputEnum.date, DataInputEnum.datetime, DataInputEnum.year, DataInputEnum.timestamp].includes(dataType!)
      ) {
        return renderDatePicker();
      } else if ([DataInputEnum.time].includes(dataType!)) {
        return renderTimePicker();
      }
    }
    return renderInput({});
  };
  return <>{renderContent()}</>;
}

export function ValueViewer({ value, searchWord, width, column: { dataType } }: CellDataProps) {
  //console.log('ValueViewer', value);
  const simpleData = DataInputToSimple(dataType);
  const valueClassNames = cls(
    styles['value-viewer'],
    simpleData === 'number' && styles['num-viewer'],
    simpleData === 'time' && styles['time-viewer'],
    simpleData === 'boolean' && styles['boolean-viewer'],
  );
  if (isNull(value)) {
    return (
      <span
        className={cls(styles['value-viewer'], styles['null-viewer'])}
        style={{ width: `${width}px` }}
        title={value + ''}
      >
        NULL
      </span>
    );
  }
  if (simpleData === 'file') {
    const [text, hasText] = getFileShowValue(value);
    return (
      <span
        className={cls(styles['value-viewer'], !hasText && styles['null-viewer'])}
        style={{ width: `${width}px` }}
        // title={value + ''}
      >
        {text}
      </span>
    );
  }
  if (!searchWord) {
    return (
      <span className={valueClassNames} style={{ width: `${width}px` }} title={value + ''}>
        {value + ''}
      </span>
    );
  } else {
    const arr = String(value).split(searchWord);
    return (
      //styles['value-viewer']
      <span className={valueClassNames} style={{ width: `${width}px` }}>
        {arr.map((str, index) => (
          <span key={index}>
            {str}
            {index === arr.length - 1 ? null : <span className={styles['value-mark']}>{searchWord}</span>}
          </span>
        ))}
      </span>
    );
  }
  //}
}

/**
 * 展示状态就是可以编辑的。
 */
export function EditViewer({
  value = '',
  initialValue,
  columnKey,
  column,
  rowId,
  rowIndex,
  columnIndex,
  width,
  isAdd,
  commit,
  onEditorCurrentValue,
  forwardedRef,
}: CellDataProps & { forwardedRef: RefObject<HTMLDivElement> }) {
  const { inputType, selectGroup } = column!;
  const [currentValue, setCurrentValue] = useState<string | number | boolean>(value!);

  const handleCheckbox = () => {
    //console.log('handleCheckbox被执行的newValue', !currentValue);
    //const checked = e.target.checked;
    setCurrentValue(!currentValue);
    commit!(!currentValue);
  };
  const handleSelect = (value: string) => {
    //console.log('handleSelect被执行的newValue', value);
    setCurrentValue(value);
    commit!(value);
  };
  const clickTest = () => {
    console.log('clickTest被执行的newValue', currentValue);
  };

  if (inputType === 'checkbox') {
    //width-1,其中的1代表父边框
    return (
      <div className={styles['edit-viewer']} style={{ width: `${width}px` }} onClick={handleCheckbox}>
        {/*<CheckBox type={"checkbox"} onChange={handleCheckbox} checked={!!currentValue}/>*/}
        {/*外层控制选择*/}
        <CheckBox onChange={() => {}} checked={!!currentValue} />
        {/*<input type={'checkbox'} checked={!!currentValue} onChange={(event) => {*/}
        {/*  handleCheckbox();*/}
        {/*}} />*/}
      </div>
    );
  } else if (inputType === 'select') {
    return (
      // <Select
      //   options={selectGroup}
      //   showSearch={true}
      //   value={currentValue}
      //   onChange={handleSelect}
      //   size={'small'}
      //   style={{ width: '100%' }}
      //   allowOptionsOverflow={true}
      //   bordered={false}
      // />
      <AntdSelect
        options={column!.selectGroup as any}
        showSearch={true}
        value={currentValue}
        onChange={handleSelect}
        size={'small'}
        bordered={false}
        //className={styles['antd-data-editor']}
        style={{ width: '100%' }}
        getPopupContainer={() => forwardedRef.current!}
      ></AntdSelect>
    );
  } else if (inputType === 'selectInput') {
    //这种方式直接展示，有操作bug
    return (
      // <SelectInput
      //   options={selectGroup!}
      //   value={(currentValue) as string}
      //   onChange={handleSelect}
      //   onSelected={handleSelect}
      //   size={'small'}
      //   style={{ width: '100%' }}
      //   allowOptionsOverflow={true}
      //   bordered={false}
      <AutoComplete
        style={{ width: '100%' }}
        options={column!.selectGroup! as any}
        value={currentValue as string}
        size={'small'}
        bordered={false}
        //autoFocus={true}
        onChange={handleSelect}
        //defaultOpen={true}
        filterOption={(inputValue, option) =>
          (option!.value! as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        getPopupContainer={() => forwardedRef.current!}
      />
    );
  } else {
    return null;
  }
}

export function getFileShowValue(cellFile: ISqlFile): [data: string, hasText: boolean] {
  //console.log('getFileShowValue-->',cellFile)
  //hasText 颜色不置灰，但也不能编辑
  if (isNull(cellFile)) {
    return ['NULL', false];
  }
  if (cellFile.data) {
    return [cellFile.data, true];
  }
  if (cellFile.name) {
    return [cellFile.name, false];
  }
  if ((cellFile as any).hasOwnProperty('type') && (cellFile as any).data) {
    return [(cellFile as any).toString(), false];
  }
  return [cellFile as string, false];
}
