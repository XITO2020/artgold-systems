import PinataSDK from '@pinata/sdk';

const pinata = new PinataSDK({
  pinataJWTKey: process.env.PINATA_JWT!
});

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function pinFileToIPFS(
  file: Buffer,
  filename: string,
  metadata: Record<string, any> = {}
): Promise<PinataResponse> {
  try {
    const result = await pinata.pinFileToIPFS(file, {
      pinataMetadata: {
        name: filename,
        ...metadata
      },
      pinataOptions: {
        cidVersion: 1
      }
    });

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
  metadata: Record<string, any>
): Promise<void> {
  try {
    await pinata.hashMetadata(cid, {
      ...metadata,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating metadata:', error);
    throw error;
  }
}