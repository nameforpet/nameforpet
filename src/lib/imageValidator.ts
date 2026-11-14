// Image payload and magic-byte security validator
// Protects the server and storage from disguised binaries, scripts, and malformed files

export interface ValidationResult {
  valid: boolean;
  mimeType?: string;
  sizeBytes?: number;
  error?: string;
}

/**
 * Validates a base64 or buffer image by checking its cryptographic magic bytes.
 */
export function validateImageSecurity(base64DataOrUrl: string, maxBytes: number = 15 * 1024 * 1024): ValidationResult {
  if (!base64DataOrUrl || typeof base64DataOrUrl !== 'string') {
    return { valid: false, error: 'No image data provided.' };
  }

  // Extract raw base64 string
  let rawBase64 = base64DataOrUrl;
  let claimedMime = 'image/jpeg';

  if (base64DataOrUrl.startsWith('data:')) {
    const match = base64DataOrUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return { valid: false, error: 'Malformed data URL format.' };
    }
    claimedMime = match[1];
    rawBase64 = match[2];
  }

  // Calculate approximate byte size from base64 length
  const sizeBytes = Math.floor((rawBase64.length * 3) / 4);
  if (sizeBytes > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds the security limit of ${maxMb} MB. Please upload a smaller image.`,
      sizeBytes,
    };
  }

  try {
    // Read the first 16 bytes for magic number verification
    const headerBuffer = Buffer.from(rawBase64.substring(0, 32), 'base64');
    if (headerBuffer.length < 4) {
      return { valid: false, error: 'Invalid or corrupted image header.' };
    }

    const hex = headerBuffer.toString('hex').toLowerCase();

    // 1. JPEG: FF D8 FF
    if (hex.startsWith('ffd8ff')) {
      return { valid: true, mimeType: 'image/jpeg', sizeBytes };
    }

    // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
    if (hex.startsWith('89504e47')) {
      return { valid: true, mimeType: 'image/png', sizeBytes };
    }

    // 3. GIF: 47 49 46 38 (GIF87a or GIF89a)
    if (hex.startsWith('47494638')) {
      return { valid: true, mimeType: 'image/gif', sizeBytes };
    }

    // 4. WebP: RIFF .... WEBP (52 49 46 46 .... 57 45 42 50)
    if (hex.startsWith('52494646') && headerBuffer.slice(8, 12).toString('ascii') === 'WEBP') {
      return { valid: true, mimeType: 'image/webp', sizeBytes };
    }

    // 5. BMP: 42 4D (BM)
    if (hex.startsWith('424d')) {
      return { valid: true, mimeType: 'image/bmp', sizeBytes };
    }

    // 6. AVIF / HEIC (ftyp)
    if (headerBuffer.length >= 12 && headerBuffer.slice(4, 8).toString('ascii') === 'ftyp') {
      return { valid: true, mimeType: claimedMime || 'image/avif', sizeBytes };
    }

    return {
      valid: false,
      error: 'Security Warning: File signature does not match a valid image format (JPEG, PNG, WebP, GIF, BMP). Non-image files are blocked.',
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Failed to parse image signature.',
    };
  }
}
