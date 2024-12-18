import { Button } from '@opensumi/ide-components';
import React, { useEffect } from 'react';
import styles from './server.module.less';
import { ServerType } from '../../base/types/server-node.types';
import { ServerIcon } from '../../base/config/server-icon.config';
import { IServerClass, ServerTypeClassInfo } from '../../base/config/server.config';
import cls from 'classnames';
import { useInjectable } from '@opensumi/ide-core-browser';
import { IServerEditService } from '../common';
import { observer } from 'mobx-react-lite';
import { ServerPreferences } from '../../base/config/server-info.config';
import { localize } from '@opensumi/ide-core-common';

interface ServerClassItemProps {
  serverClass: IServerClass;
  selectedClassName: string;
  setSelectedClass: (active: IServerClass) => void;
}

const ServerClassItem = (props: ServerClassItemProps) => {
  const { selectedClassName, serverClass } = props;
  const { displayName } = serverClass;

  const handleServerActive = () => {
    props.setSelectedClass(serverClass);
  };

  return (
    <div
      className={cls(styles['server-class-item'], displayName && selectedClassName === displayName && styles.selected)}
      onClick={handleServerActive}
    >
      {displayName}
    </div>
  );
};

const ServerItem = ({
  index,
  serverName,
  selectedServer,
  setSelectedServer,
}: {
  index: number;
  serverName: ServerType;
  selectedServer: ServerType;
  setSelectedServer: (selectedServer: ServerType) => void;
}) => {
  const isSupport = ServerPreferences[serverName].isSupport;
  const isNextSupport = ServerPreferences[serverName].nextSupport;
  const displayName = ServerPreferences[serverName].displayName;
  const showName = displayName ? displayName : serverName;

  const handleSelectedServer = () => {
    if (isSupport) {
      setSelectedServer(serverName);
    }
  };

  return (
    <div
      className={cls(styles['server-item'], selectedServer && selectedServer === serverName && styles.selected)}
      onClick={handleSelectedServer}
    >
      <div className={styles['server-item-icon']}>{ServerIcon[serverName]['icon']}</div>
      <div className={cls(styles['server-item-content'], !isSupport && styles['server-item-disable'])}>
        {showName}
        {isNextSupport && `(${localize('next.version.support')})`}
      </div>
    </div>
  );
};

const ServerSelectView = observer(() => {
  const serverEditService = useInjectable<IServerEditService>(IServerEditService);
  //
  // const [selectedClass, setSelectedClass] = useState<ServerClass>()
  // const [selectedServer, setSelectedServer] = useState<ServerType>()
  //
  useEffect(() => {
    if (!serverEditService.selectedClass) {
      handleSelectedClass(ServerTypeClassInfo[0]);
    }
  }, []);

  const handleSelectedServer = (_selectedServer: ServerType) => {
    serverEditService.setSelectedServer(_selectedServer);
  };

  const handleSelectedClass = (_selectedClass: IServerClass) => {
    serverEditService.setSelectedClass(_selectedClass);
  };

  return (
    <div className={styles['server-select-wrap']}>
      <div className={styles['server-select-container']}>
        <div className={styles['server-class-select']}>
          {ServerTypeClassInfo.map((item) => (
            <ServerClassItem
              key={item.displayName }
              serverClass={item}
              setSelectedClass={handleSelectedClass}
              selectedClassName={serverEditService.selectedClass! && serverEditService.selectedClass.displayName}
            />
          ))}
        </div>
        <div className={styles['server-select']}>
          {serverEditService.selectedClass?.servers.map((item, index) => (
            <ServerItem
              key={item + index}
              index={index}
              serverName={item}
              selectedServer={serverEditService.selectedServer!}
              setSelectedServer={handleSelectedServer}
            />
          ))}
        </div>
      </div>
      <div className={styles['option-container']}>
        <Button
          size='large'
          onClick={() => {
            serverEditService.hide();
          }}
        >
          {localize('ButtonCancel')}
        </Button>
        &nbsp;
        <Button
          size='large'
          type='primary'
          onClick={() => {
            serverEditService.next();
          }}
        >
          {localize('botton.next')}
        </Button>
      </div>
    </div>
  );
});

export default ServerSelectView;
