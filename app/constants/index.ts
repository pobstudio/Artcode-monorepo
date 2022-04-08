import { BigNumber } from 'ethers';
import { invert } from 'lodash';
/**
 * Global app related constants
 */
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1');

/**
 * Data constants
 */
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NULL_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const ZERO = BigNumber.from(0);
export const MIN_BLOCK_CONFIRMATIONS = 35;
export const HUNDRED_PERCENT_BPS = 10000;

/**
 * Environment/keys
 */
export const ALCHEMY_KEY =
  CHAIN_ID === 1
    ? process.env.NEXT_PUBLIC_ALCHEMY_KEY
    : process.env.NEXT_PUBLIC_TEST_ALCHEMY_KEY ?? '';
export const MAINNET_ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || '';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
export const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || '';
export const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

/**
 * Links
 */
export const IPFS_LINK = `https://public-pob-studio.mypinata.cloud/ipfs`;
export const IPFS_FALLBACK_LINKS = [
  (hash: string, url: string) => `${IPFS_LINK}/${hash}/${url}`,
  (hash: string, url: string) => `https://ipfs.io/ipfs/${hash}/${url}`,
  (hash: string, url: string) => `https://${hash}.ipfs.dweb.link/${url}`,
];
export const PRIVATE_GATEWAY_IPFS_LINK = `https://pob-studio.mypinata.cloud/ipfs`;
export const STUDIO_PROD_LINK = 'https://pob.studio';
export const SHOP_PROD_LINK = 'https://shop.pob.studio';
export const PROD_LINK = 'https://TODO.pob.studio';
export const SNAPSHOT_LINK = 'https://snapshot.org';
export const BLOG_LINK = `https://pob.mirror.xyz/`;
export const TWITTER_LINK = `https://twitter.com/prrfbeauty`;
export const DISCORD_LINK = `https://discord.gg/pob`;
export const NFT_LICENSE_LINK = `https://www.nftlicense.org`;
export const OPENSEA_LINK = `https://opensea.io/collection/TODO`;
export const GITHUB_LINK = `https://github.com/proofofbeauty/TODO`;
export const PREVIEW_IMAGE_LINK = `https://hash-preview.vercel.app`;
export const SUBGRAPH_LINK = `https://api.thegraph.com/subgraphs/name/proofofbeauty/TODO`;
export const TEST_SUBGRAPH_LINK = `https://api.thegraph.com/subgraphs/name/proofofbeauty/TODO`;

// OG banners
export const GLOBAL_OG_BANNER = `${PROD_LINK}/assets/og/logo-repeat.png`;

/**
 * Dimensions
 */
export const HEADER_HEIGHT = 84;
