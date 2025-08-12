import { ethers } from 'ethers';

// ==================== CORE TYPES ====================
export interface TokenConfig {
  provider: ethers.Provider;
  address: string;
  network?: 'mainnet' | 'goerli' | 'sepolia';
}

export interface TransactionParams {
  signer: ethers.Signer;
  gasLimit?: ethers.BigNumberish;
  gasPrice?: ethers.BigNumberish;
}

export interface TransferParams extends TransactionParams {
  to: string;
  amount: string; // en unités lisible (ex: "1.5" pour 1,5 token)
}

export interface ApprovalParams extends TransactionParams {
  spender: string;
  amount: string;
}

// ==================== INTERFACES ====================
export interface ITokenMetadata {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<bigint>;
}

export interface IPausable {
  pause(): Promise<ethers.ContractTransactionResponse>;
  unpause(): Promise<ethers.ContractTransactionResponse>;
  paused(): Promise<boolean>;
}

export interface IFeeManager {
  transferFeeRate(): Promise<bigint>;
  feeCollector(): Promise<string>;
  isExemptFromFee(account: string): Promise<boolean>;
  setTransferFeeRate(
    newRate: ethers.BigNumberish, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;
  setFeeCollector(
    newCollector: string, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;
  setFeeExemption(
    account: string, 
    isExempt: boolean, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;
}

// ==================== TOKEN-SPECIFIC ====================
export interface IAGTTokenFunctions extends ITokenMetadata, IPausable, IFeeManager {
  mintForCategory(
    artist: string,
    category: string,
    isFirst: boolean,
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;

  bankPurchaseArtwork(
    seller: string,
    amount: ethers.BigNumberish,
    artworkId: string,
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;

  getSilverEquivalent(amount: ethers.BigNumberish): Promise<bigint>;
  getTokenValue(amount: ethers.BigNumberish): Promise<bigint>;
}

export interface ITabAsCoinFunctions extends ITokenMetadata, IPausable, IFeeManager {
  mintArtwork(
    artist: string,
    artworkId: string,
    category: string,
    isFirst: boolean,
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse>;

  getGoldEquivalent(amount: ethers.BigNumberish): Promise<bigint>;
  getTokenValue(amount: ethers.BigNumberish): Promise<bigint>;
  getRemainingSlots(user: string): Promise<bigint>;
  getUserSlots(user: string): Promise<bigint>;
  getCategoryBasePrice(category: string): Promise<bigint>;
}

// ==================== CONTRACT TYPES ====================
export interface IAGTToken extends ethers.BaseContract, IAGTTokenFunctions {}
export interface ITabAsCoin extends ethers.BaseContract, ITabAsCoinFunctions {}

// ==================== ABI DEFINITIONS ====================
export const BASE_TOKEN_ABI = [
  // ERC20 Standard
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address, uint256) returns (bool)',
  'function approve(address, uint256) returns (bool)',
  
  // Pausable
  'function pause() external',
  'function unpause() external',
  'function paused() view returns (bool)',
  
  // Fee System
  'function transferFeeRate() view returns (uint256)',
  'function feeCollector() view returns (address)',
  'function isExemptFromFee(address) view returns (bool)',
  'function setTransferFeeRate(uint256) external',
  'function setFeeCollector(address) external',
  'function setFeeExemption(address, bool) external',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Paused(address account)',
  'event Unpaused(address account)',
  'event FeeRateUpdated(uint256 oldRate, uint256 newRate)',
  'event FeeCollectorUpdated(address oldCollector, address newCollector)'
] as const;

export const AGT_TOKEN_ABI = [
  ...BASE_TOKEN_ABI,
  // AGT-specific
  'function mintForCategory(address, string, bool) external',
  'function bankPurchaseArtwork(address, uint256, string) external',
  'function getSilverEquivalent(uint256) view returns (uint256)',
  'function getTokenValue(uint256) view returns (uint256)',
  'function silverPriceUSD() view returns (uint256)',
  // Events
  'event TokensMinted(address indexed to, uint256 amount, uint256 silverGrams)',
  'event BankPurchase(address indexed seller, uint256 amount, string artworkId)'
] as const;

export const TABASCOIN_ABI = [
  ...BASE_TOKEN_ABI,
  // TabAsCoin-specific
  'function mintArtwork(address, string, string, bool) external',
  'function getGoldEquivalent(uint256) view returns (uint256)',
  'function getTokenValue(uint256) view returns (uint256)',
  'function getRemainingSlots(address) view returns (uint256)',
  'function userSlots(address) view returns (uint256)',
  'function categoryBasePrice(string) view returns (uint256)',
  // Events
  'event ArtworkMinted(address indexed artist, string artworkId, uint256 price)',
  'event SlotUsed(address indexed user, uint256 remainingSlots)'
] as const;

// ==================== HELPER TYPES ====================
export type TokenCategory = 
  | 'invention' | 'architecture' | 'comics' 
  | 'ecologicalplan' | 'characterdesign'
  | 'vehicles concept' | 'visual effect' | 'motion design'
  | 'african' | 'pacifikian' | 'oriental' | 'indian' | 'amerindian' | 'slavic';