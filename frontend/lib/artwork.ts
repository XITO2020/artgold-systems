import QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';
import { ArtworkMetadata } from '@t/artwork';

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

export async function generateSerialNumber(): Promise<string> {
  const timestamp = Date.now().toString(36);
  const random = nanoid(8);
  return `TAB-${timestamp}-${random}`;
}

export async function generateQRCode(serialNumber: string): Promise<string> {
  const qrData = {
    serialNumber,
    verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${serialNumber}`,
    timestamp: Date.now()
  };

  return await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}

export async function validateArtworkMetadata(metadata: ArtworkMetadata): Promise<{
  isValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  // Validate dimensions
  if (!metadata.dimensions || 
      metadata.dimensions.width < 800 || 
      metadata.dimensions.height < 800) {
    errors.push('Artwork dimensions must be at least 800x800');
  }

  // Validate location
  if (!metadata.location || 
      !metadata.location.latitude || 
      !metadata.location.longitude) {
    errors.push('Location information is required');
  }

  // Validate materials
  if (!metadata.materials || metadata.materials.length === 0) {
    errors.push('At least one material must be specified');
  }

  // Validate creation date
  if (!metadata.creationDate || new Date(metadata.creationDate) > new Date()) {
    errors.push('Valid creation date is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}