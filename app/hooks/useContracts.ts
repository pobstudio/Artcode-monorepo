import { deployments, ERC721A__factory } from '@pob-monorepo/protocol';
import { useMemo } from 'react';
import { CHAIN_ID } from '../constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useProvider } from './useProvider';
import { usePriorityAccount } from '../connectors/priority';
import { getProviderOrSigner } from '../clients/provider';

export const useERC721AContract = (
  address = deployments[CHAIN_ID].nft,
  shouldUseFallback: boolean = false,
) => {
  const account = usePriorityAccount();
  const provider = useProvider(shouldUseFallback);

  return useMemo(() => {
    if (!account && !provider) {
      return;
    }

    return ERC721A__factory.connect(
      address,
      getProviderOrSigner(provider as JsonRpcProvider, account as string),
    );
  }, [account, address, provider]);
};
