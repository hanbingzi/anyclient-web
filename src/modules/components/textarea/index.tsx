import * as React from 'react';
import calculateNodeHeight from './calculateNodeHeight';
import getSizingData, { SizingData } from './getSizingData';
import { useComposedRef, useFontsLoadedListener, useWindowResizeListener } from './hooks';
import { noop } from './utils';
import styles from './style.module.less'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Style = Omit<NonNullable<TextareaProps['style']>, 'maxHeight' | 'minHeight'> & {
  height?: number;
};

export type TextareaHeightChangeMeta = {
  rowHeight: number;
};

export interface TextareaAutosizeProps extends Omit<TextareaProps, 'style'> {
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  cacheMeasurements?: boolean;
  style?: Style;
}

const TextareaAutosize: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextareaAutosizeProps> = (
  { cacheMeasurements, maxRows, minRows, onChange = noop,
    onHeightChange = noop, ...props },
  userRef: React.Ref<HTMLTextAreaElement>,
) => {
  const isControlled = props.value !== undefined;
  const libRef = React.useRef<HTMLTextAreaElement | null>(null);
  const ref = useComposedRef(libRef, userRef);
  const heightRef = React.useRef(0);
  const measurementsCacheRef = React.useRef<SizingData>();



  const resizeTextarea = () => {
    const node = libRef.current!;
    const nodeSizingData =
      cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData(node);
    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef.current = nodeSizingData;

    const [height, rowHeight] = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || 'x',
      minRows,
      maxRows,
    );

    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', `${height}px`, 'important');
      onHeightChange(height, { rowHeight });
    }
  };


  React.useLayoutEffect(resizeTextarea);
  useWindowResizeListener(resizeTextarea);
  useFontsLoadedListener(resizeTextarea);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      resizeTextarea();
    }
    onChange(event);
  };

  return <textarea className={styles['textarea']}  {...props} onChange={handleChange} ref={ref} />;
};

export default /* #__PURE__ */ React.forwardRef(TextareaAutosize);
