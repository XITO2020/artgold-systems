import { ethers } from 'ethers';
import TabAsCoinABI from '../contracts/TabAsCoin.json';

export const TAB_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TAB_TOKEN_ADDRESS;

export async function getTokenBalance(address: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(TAB_TOKEN_ADDRESS!, TabAsCoinABI, provider);
  return await contract.balanceOf(address);
}

export async function convertPaymentToTAB(amount: number) {
  // Convert fiat payment to TAB tokens (1 USD = 1 TAB)
  return amount;
}

export async function mintTAB(address: string, amount: number) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(TAB_TOKEN_ADDRESS!, TabAsCoinABI, signer);
  return await contract.mint(address, amount);
}