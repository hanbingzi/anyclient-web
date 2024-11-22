import React from 'react';
import styles from './word.module.less';

export interface IFontParam {
  word: string;
  fontSize?: number;
  background?: string;
  width?: number;
  height?: number;
}

/**
 * var
 * int
 *
 * json:
 *
 */
export function WordIcon({ word, fontSize = 16, background = '#3478c6', width = 48, height = 22 }: IFontParam) {
  return (
    <div className={styles['font-container']} style={{ fontSize, background, width, height, lineHeight: height }}>
      {word}
    </div>
  );
}
