import React from 'react';
import {
  CommandService,
  FILE_COMMANDS,
  FileUri,
  IWindowService,
  localize,
  URI,
  useInjectable,
} from '@opensumi/ide-core-browser';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { IMessageService } from '@opensumi/ide-overlay';
import styles from './styles.module.less';

export const SelectWorkspaceView = ({ recentWorkspaces }: { recentWorkspaces: string[] }) => {
  const commandService: CommandService = useInjectable<CommandService>(CommandService);
  const windowService: IWindowService = useInjectable<IWindowService>(IWindowService);
  const fileService: IFileServiceClient = useInjectable<IFileServiceClient>(IFileServiceClient);
  const messageService: IMessageService = useInjectable<IMessageService>(IMessageService);

  return (
    <div className={styles['workspace-wrap']}>
      {recentWorkspaces && recentWorkspaces.length > 0 && (
        <div className={styles['recent-container']}>
          <h3>{localize('welcome.recent.workspace')}</h3>
          {recentWorkspaces?.map((workspace: string) => {
            let workspacePath = workspace;
            if (workspace.startsWith('file://')) {
              workspacePath = FileUri.fsPath(workspace);
            }
            return (
              <div key={workspace} className={styles.recentRow}>
                <a
                  onClick={async () => {
                    const uri = new URI(workspace);
                    const exist = await fileService.getFileStat(uri.toString());
                    if (exist) {
                      windowService.openWorkspace(uri, { newWindow: false });
                    } else {
                      messageService.error(localize('welcome.workspace.noExist'));
                    }
                  }}
                >
                  {workspacePath}
                </a>
              </div>
            );
          })}
        </div>
      )}
      <div className={styles['open-container']}>
        <h3>设置一个新的工作区</h3>
        <div>
          <a
            onClick={() => {
              commandService.executeCommand(FILE_COMMANDS.OPEN_FOLDER.id, { newWindow: false });
            }}
          >
            {localize('file.open.folder')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SelectWorkspaceView;
