import { getPriorityConnector } from '@web3-react/core';
import { hooks as metaMaskHooks, metaMask } from './metaMask';
import { hooks as networkHooks, network } from './network';
import { hooks as walletConnectHooks, walletConnect } from './walletConnect';

const {
  usePriorityAccount,
  usePriorityChainId,
  usePriorityConnector,
  usePriorityProvider,
  usePriorityIsActivating,
} = getPriorityConnector(
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [network, networkHooks],
);

export {
  usePriorityAccount,
  usePriorityChainId,
  usePriorityConnector,
  usePriorityProvider,
  usePriorityIsActivating,
};
