import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { ALCHEMY_KEY, CHAIN_ID } from '../constants';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: {
        [CHAIN_ID]: `https://eth-${
          CHAIN_ID === 1 ? 'mainnet' : 'rinkeby'
        }.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      },
    }),
  [CHAIN_ID],
);
