import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToB2, isB2Configured } from '@/lib/b2Storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';
import { validateImageSecurity } from '@/lib/imageValidator';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (20 uploads per minute per IP to protect cloud storage from flooding)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`upload_${clientIp}`, { limit: 20, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Upload rate limit reached. Please wait ${rateCheck.retryAfterSeconds}s before uploading again.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
      );
    }

    const { image, prefix } = await req.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // 2. Cryptographic Magic-Byte Validation (blocks fake/malicious file extensions)
    const securityCheck = validateImageSecurity(image, 15 * 1024 * 1024);
    if (!securityCheck.valid) {
      return NextResponse.json({ success: false, error: securityCheck.error }, { status: 400 });
    }

    if (!isB2Configured()) {
      return NextResponse.json({
        success: false,
        error: 'Backblaze B2 is not yet configured with API credentials. Please set B2_KEY_ID, B2_APPLICATION_KEY, B2_ENDPOINT, and B2_BUCKET_NAME in .env.local',
        configured: false,
      });
    }

    const uploadResult = await uploadImageToB2(image, prefix || 'pet');

    if (!uploadResult.success) {
      return NextResponse.json({ success: false, error: uploadResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server upload error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
