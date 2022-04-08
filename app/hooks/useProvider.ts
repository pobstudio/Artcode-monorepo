import { useMemo } from 'react';
import { PROVIDER } from '../clients/provider';
import { usePriorityProvider } from '../connectors/priority';

export const useProvider = (shouldUseFallback: boolean = false) => {
  const library = usePriorityProvider();
  return useMemo(
    () => (shouldUseFallback && !library ? PROVIDER : library),
    [library, shouldUseFallback],
  );
};
