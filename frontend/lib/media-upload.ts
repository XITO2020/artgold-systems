import { prisma } from './db';
import { pinFileToIPFS, getIPFSUrl, unpinFile } from './pinata';

// Define IPFSStatus enum since it's not exported by Prisma
export enum IPFSStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  FAILED = 'FAILED'
}

export async function uploadMedia(
  file: Buffer,
  filename: string,
  mimeType: string,
  metadata: Record<string, any> = {}
): Promise<string> {
  try {
    // Pin file to IPFS
    const pinataResponse = await pinFileToIPFS(file, filename, metadata);

    // Create IPFS media record
    const media = await prisma.iPFSMedia.create({
      data: {
        cid: pinataResponse.IpfsHash,
        filename,
        mimeType,
        size: pinataResponse.PinSize,
        status: IPFSStatus.UPLOADED,
        url: getIPFSUrl(pinataResponse.IpfsHash)
      }
    });

    return media.id;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

export async function deleteMedia(mediaId: string): Promise<void> {
  try {
    const media = await prisma.iPFSMedia.findUnique({
      where: { id: mediaId }
    });

    if (!media) {
      throw new Error('Media not found');
    }

    // Unpin from IPFS
    await unpinFile(media.cid);

    // Delete database record
    await prisma.iPFSMedia.delete({
      where: { id: mediaId }
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
}

export async function getMediaUrl(mediaId: string): Promise<string> {
  const media = await prisma.iPFSMedia.findUnique({
    where: { id: mediaId }
  });

  if (!media) {
    throw new Error('Media not found');
  }

  return media.url || getIPFSUrl(media.cid);
}