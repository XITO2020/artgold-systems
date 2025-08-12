import { ethers } from 'ethers';
import { IAGTToken, ITabAsCoin, AGT_TOKEN_ABI, TABASCOIN_ABI } from './types';

export function getAGTContract(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IAGTToken {
  const contract = new ethers.Contract(
    address,
    AGT_TOKEN_ABI,
    signerOrProvider
  );
  
  return contract as unknown as IAGTToken;
}

export function getTabContract(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): ITabAsCoin {
  const contract = new ethers.Contract(
    address,
    TABASCOIN_ABI,
    signerOrProvider
  );
  
  return contract as unknown as ITabAsCoin;
}