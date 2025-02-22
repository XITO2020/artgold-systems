import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_TABZ_PROGRAM_ID!);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const getProgramAddress = async (
  seeds: Array<Buffer | Uint8Array>,
  programId: PublicKey = PROGRAM_ID
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(seeds, programId);
};