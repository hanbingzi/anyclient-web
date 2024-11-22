import React, { useMemo, useState } from 'react';
import { KeybindingView } from '@opensumi/ide-quick-open/lib/browser/components/keybinding';
import { KeybindingRegistry, ScopedKeybinding, useInjectable } from '@opensumi/ide-core-browser';
import styles from './query-explorer.module.less';
import { RunAllSqlCommand, RunSelectedSqlCommand } from '../../base/command/code.command';
import { IKeymapService } from '@opensumi/ide-keymaps';

const ShortcutRow = ({ label, keybinding }) => (
  <dl className={styles.shortcutRow}>
    <span className={styles.label}>{label}</span>

    <KeybindingView keybinding={keybinding} className={styles.keybinding} />
  </dl>
);
export const QueryEmptyView = () => {
  const [keyMapLoaded, setKeyMapLoaded] = useState(false);
  const keybindingRegistry = useInjectable<KeybindingRegistry>(KeybindingRegistry);
  const keymapService = useInjectable<IKeymapService>(IKeymapService);
  const init = async () => {
    await keymapService.whenReady;
    setKeyMapLoaded(true);
  };

  React.useEffect(() => {
    init();
  }, []);

  const getKeybinding = (commandId: string) => {
    const bindings: ScopedKeybinding[] = keybindingRegistry.getKeybindingsForCommand(commandId);
    if (!bindings.length) {
      return;
    }
    // const keyBindings = bindings.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    // 如果快捷键条目没有 when 条件，优先使用
    const primaryKeybinding = bindings.find((binding) => !binding.when);
    return primaryKeybinding || bindings[0];
  };

  const ShortcutView = useMemo(() => {
    if (!keyMapLoaded) {
      return;
    }
    const keyInfos = [
      {
        label: '执行SQL',
        command: RunSelectedSqlCommand.id,
        keybinding: getKeybinding(RunSelectedSqlCommand.id),
      },
      {
        label: '执行全部SQL',
        command: RunAllSqlCommand.id,
        keybinding: getKeybinding(RunAllSqlCommand.id),
      },
    ].filter((e) => e.keybinding);

    return (
      <div className={styles.shortcutPanel}>
        {keyInfos.map((keyInfo) => (
          <ShortcutRow key={keyInfo.command} label={keyInfo.label} keybinding={keyInfo.keybinding}></ShortcutRow>
        ))}
      </div>
    );
  }, [keyMapLoaded]);

  return <div className={styles['empty-component']}>{ShortcutView}</div>;
};
