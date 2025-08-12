// Types communs
export type Network = 'mainnet' | 'testnet' | 'devnet';
export type TokenStandard = 'ERC20' | 'SPL';

// Config token
export interface TokenConfig {
  network: Network;
  contractAddress: string;
  provider: ethers.Provider | Connection;
}