import { ComponentRegistryInfo } from '@opensumi/ide-core-browser';
import * as React from 'react';

export const TopSlotRenderer: (props: { className: string; components: ComponentRegistryInfo[] }) => any = ({
  className,
  components,
}) => {
  const tmp = components.map((item) => item.views[0].component!);
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'space-between' }}>
      {tmp.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};
