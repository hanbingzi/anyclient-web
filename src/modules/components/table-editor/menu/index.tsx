import React, { useCallback, useEffect } from 'react';
import styles from './style.module.less';
import { IMenu } from '../table-editor.types';
import cls from 'classnames';

export interface IMenuProps {
  menus: IMenu[][];
  //selectData?: any;
  visible: boolean;
  closeMenu: () => void;
  position: { x: number; y: number };
}

// export interface IMenuGroup {
//   label: string;
//   onClick: (...args: any[]) => void;
// }

export const Menu = (menuProps: IMenuProps) => {
  const { menus, visible, position, closeMenu } = menuProps;

  const handleClick = useCallback(() => {
    closeMenu();
  }, []);

  useEffect(() => {
    //document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      //document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <ul
      className={styles['menu-container']}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {menus.map((menuGroup, index) => {
        const menuGroupView = menuGroup.map((menuItem, groupIndex) => (
          <li
            key={index + '-' + groupIndex}
            className={cls(
              styles['menu-item'],
              menuItem.visible ? styles['menu-item-active'] : styles['menu-item-disable'],
            )}
            onClick={(event) => {
              if (menuItem.visible) {
                menuItem.onClick();
              } else {
                event.stopPropagation();
              }
            }}
          >
            {menuItem.label}
          </li>
        ));
        index < menus.length - 1 &&
          menuGroupView.push(<li key={index + 'divider'} className={styles['menu-item-divider']}></li>);
        return menuGroupView;
      })}
    </ul>
  );
};
