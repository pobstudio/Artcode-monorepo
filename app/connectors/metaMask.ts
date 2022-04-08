import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CHAIN_ID } from '../constants';

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions),
  [CHAIN_ID],
);
