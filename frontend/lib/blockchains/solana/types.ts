import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';

export interface SolanaTokenConfig {
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  programId: PublicKey;
  connection: Connection;
}

export interface MintParams {
  authority: Keypair;
  recipient: PublicKey;
  amount: number;
  metadata?: TokenMetadata;
}

export interface TransferParams {
  sender: Keypair;
  recipient: PublicKey;
  amount: number;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string; // URI vers les métadonnées off-chain
  decimals: number;
}

export interface ArtworkParams {
  artist: PublicKey;
  artworkId: string;
  category: TokenCategory;
  isFirstMint: boolean;
}

// Types spécifiques à vos tokens
export type TokenCategory = 
  | 'invention' | 'architecture' | 'comics'
  | 'ecologicalplan' | 'characterdesign'
  | 'vehicles concept' | 'visual effect' | 'motion design'
  | 'african' | 'pacifikian' | 'oriental' | 'indian' | 'amerindian' | 'slavic';

export interface CategoryBonus {
  category: TokenCategory;
  baseReward: number;
  firstMintMultiplier: number;
}

export interface TokenCreationResult {
  txSignature: string;
  mintAddress: PublicKey;
  metadataAddress?: PublicKey;
}