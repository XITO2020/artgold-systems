import { PublicKey, Connection, Cluster } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';

export const getProgramId = (network: string): PublicKey => {
  const PROGRAM_IDS = {
    'mainnet-beta': new PublicKey(process.env.NEXT_PUBLIC_SOLANA_MAINNET_PROGRAM_ID!),
    'devnet': new PublicKey(process.env.NEXT_PUBLIC_SOLANA_DEVNET_PROGRAM_ID!),
    'testnet': new PublicKey(process.env.NEXT_PUBLIC_SOLANA_TESTNET_PROGRAM_ID!)
  };
  return PROGRAM_IDS[network as keyof typeof PROGRAM_IDS] || PROGRAM_IDS.devnet;
};

export const getConnection = (network: Cluster): Connection => {
  return new Connection(
    clusterApiUrl(network),
    { commitment: 'confirmed' }
  );
};

export const deriveTokenAccountAddress = async (
  owner: PublicKey,
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('token_account'), owner.toBuffer()],
    programId
  );
};