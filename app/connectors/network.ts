import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { ALCHEMY_KEY, CHAIN_ID } from '../constants';

export const [network, hooks] = initializeConnector<Network>(
  (actions) =>
    new Network(actions, {
      [CHAIN_ID]: `https://eth-${
        CHAIN_ID === 1 ? 'mainnet' : 'rinkeby'
      }.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    }),
  [CHAIN_ID],
);
