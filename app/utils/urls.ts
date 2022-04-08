import { deployments } from '@pob-monorepo/protocol';
import { BigNumber } from 'ethers';
import { CHAIN_ID, IPFS_LINK } from '../constants';

export const getOpenSeaUrl = (tokenId: string) => {
  return `https://${CHAIN_ID === 1 ? '' : 'testnets.'}opensea.io/assets/${
    deployments[CHAIN_ID].erc1155
  }/${BigNumber.from(tokenId).toString()}`;
};

export const getOpenSeaAccountUrl = (address: string) => {
  return `https://${
    CHAIN_ID === 1 ? '' : 'testnets.'
  }opensea.io/accounts/${address}`;
};

export const getEtherscanTxUrl = (txhash: string) => {
  return `https://${CHAIN_ID === 1 ? '' : 'rinkeby.'}etherscan.io/tx/${txhash}`;
};

export const getEtherscanAddressUrl = (address: string) => {
  return `https://${
    CHAIN_ID === 1 ? '' : 'rinkeby.'
  }etherscan.io/address/${address}`;
};

export const getIPFSUrl = (cid: string) => {
  return `${IPFS_LINK}/${cid}`;
};
