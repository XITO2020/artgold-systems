import { ethers } from 'ethers';
import { IERC20 } from './types';

export async function getTokenBalance(
  contract: IERC20, 
  address: string
): Promise<string> {
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
}

export async function approveSpending(
  contract: IERC20,
  spender: string,
  amount: string
): Promise<ethers.ContractTransactionResponse> {
  const parsedAmount = ethers.parseUnits(amount, 18);
  return await contract.approve(spender, parsedAmount);
}