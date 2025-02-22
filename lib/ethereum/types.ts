import { ethers } from 'ethers';

export interface AGTTokenConfig {
  provider: ethers.Provider;
  address: string;
}

export interface TransferParams {
  to: string;
  amount: string;
  signer: ethers.Signer;
}

export interface ApprovalParams {
  spender: string;
  amount: string;
  signer: ethers.Signer;
}

export interface IERC20Functions {
  transfer(to: string, amount: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  approve(spender: string, amount: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  balanceOf(account: string): Promise<bigint>;
}

export interface IERC20 extends ethers.BaseContract, IERC20Functions {}

export const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)'
] as const;