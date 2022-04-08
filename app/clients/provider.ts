import {
  AlchemyProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from '@ethersproject/providers';
import { ALCHEMY_KEY, CHAIN_ID, MAINNET_ALCHEMY_KEY } from '../constants';

export const PROVIDER = new AlchemyProvider(CHAIN_ID, ALCHEMY_KEY);

export const MAINNET_PROVIDER = new AlchemyProvider(1, MAINNET_ALCHEMY_KEY);

// account is not optional
export function getSigner(
  library: JsonRpcProvider,
  account: string,
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: JsonRpcProvider,
  account?: string,
): JsonRpcProvider | JsonRpcSigner {
  try {
    return account ? getSigner(library, account) : library;
  } catch (e) {
    return library;
  }
}
