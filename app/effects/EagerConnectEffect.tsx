import { FC, useEffect } from 'react';
import { usePriorityConnector } from '../connectors/priority';

export const EagerConnectEffect: FC = () => {
  const connector = usePriorityConnector();
  // attempt to connect eagerly on mount
  useEffect(() => {
    void connector.connectEagerly?.();
  }, []);

  return <></>;
};
