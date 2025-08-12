// src/services/pinataService.ts
import PinataSDK from '@pinata/sdk';
import fs from 'fs';

const PINATA_API_KEY = process.env.PINATA_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET!;

// Utilisez 'new' pour créer une instance de PinataClient
const pinata = new PinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface PinataMetadata {
  name: string;
  keyvalues?: Record<string, string | number | null>;
}

export async function pinFileToIPFS(
  file: Buffer | File,
  filename: string,
  metadata: Record<string, string | number | null> = {}
): Promise<PinataResponse> {
  try {
    // Convert File to Buffer if needed
    const buffer = file instanceof File ?
      Buffer.from(await file.arrayBuffer()) :
      file;

    const options : object = {
      pinataMetadata: {
        name: filename,
        keyvalues: metadata,
      },
      pinataOptions: {
        cidVersion: 1 as 0 | 1 | undefined,
      },
    };

    const result = await pinata.pinFileToIPFS(buffer, options);

    // Update metadata separately to avoid type issues
    if (Object.keys(metadata).length > 0) {
      await pinata.hashMetadata(result.IpfsHash, metadata);
    }

    return result;
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw error;
  }
}

export async function unpinFile(cid: string): Promise<void> {
  try {
    await pinata.unpin(cid);
  } catch (error) {
    console.error('Error unpinning file:', error);
    throw error;
  }
}

export function getIPFSUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

export async function updateMetadata(
  cid: string,
  metadata: Record<string, string | number | null>
): Promise<void> {
  try {
    await pinata.hashMetadata(cid, metadata);
  } catch (error) {
    console.error('Error updating metadata:', error);
    throw error;
  }
}
