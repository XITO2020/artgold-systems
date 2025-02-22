import { ethers } from 'ethers';
import { IERC20, ERC20_ABI } from './types';

export function getAGTContract(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IERC20 {
  const contract = new ethers.Contract(
    address,
    ERC20_ABI,
    signerOrProvider
  );
  
  return contract as unknown as IERC20;
}