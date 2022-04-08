export interface Deployment {
  multisig: string;
  nft: string;
}

export type Deployments = { [chainId: number]: Deployment };
