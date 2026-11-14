import crypto from 'crypto';

interface B2AuthCache {
  authToken: string;
  apiUrl: string;
  downloadUrl: string;
  expiresAt: number;
}

let authCache: B2AuthCache | null = null;

export function isB2Configured(): boolean {
  return !!(
    process.env.B2_KEY_ID &&
    process.env.B2_APPLICATION_KEY &&
    process.env.B2_BUCKET_ID &&
    process.env.B2_BUCKET_NAME
  );
}

async function getB2Auth(): Promise<B2AuthCache> {
  const now = Date.now();
  if (authCache && authCache.expiresAt > now) {
    return authCache;
  }

  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;

  if (!keyId || !applicationKey) {
    throw new Error('B2 credentials missing');
  }

  const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
  const res = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    headers: { Authorization: `Basic ${credentials}` },
    cache: 'no-store'
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`B2 Authorization failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  authCache = {
    authToken: data.authorizationToken,
    apiUrl: data.apiInfo.storageApi.apiUrl,
    downloadUrl: data.apiInfo.storageApi.downloadUrl,
    // Cache for 12 hours (tokens typically last 24h)
    expiresAt: now + 12 * 60 * 60 * 1000
  };

  return authCache;
}

export interface B2UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  fileId?: string;
  error?: string;
}

/**
 * Uploads a base64 or buffer image to Backblaze B2 (10 GB Free Storage).
 */
export async function uploadImageToB2(
  data: string | Buffer,
  prefix: string = 'pet'
): Promise<B2UploadResult> {
  if (!isB2Configured()) {
    return {
      success: false,
      error: 'B2_NOT_CONFIGURED',
    };
  }

  try {
    const auth = await getB2Auth();
    const bucketId = process.env.B2_BUCKET_ID!;
    const bucketName = process.env.B2_BUCKET_NAME!;

    // 1. Get Upload URL
    const upUrlRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        Authorization: auth.authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucketId }),
      cache: 'no-store'
    });

    if (!upUrlRes.ok) {
      throw new Error(`Failed to get upload URL: ${await upUrlRes.text()}`);
    }

    const upUrlData = await upUrlRes.json();

    // 2. Parse Image Buffer
    let buffer: Buffer;
    let contentType = 'image/jpeg';
    let extension = 'jpg';

    if (typeof data === 'string') {
      if (data.startsWith('data:')) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          contentType = matches[1];
          buffer = Buffer.from(matches[2], 'base64');
          if (contentType.includes('png')) extension = 'png';
          else if (contentType.includes('webp')) extension = 'webp';
          else if (contentType.includes('gif')) extension = 'gif';
        } else {
          buffer = Buffer.from(data, 'base64');
        }
      } else {
        buffer = Buffer.from(data, 'base64');
      }
    } else {
      buffer = data;
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const dateFolder = new Date().toISOString().slice(0, 10);
    const fileName = `uploads/${dateFolder}/${prefix}_${timestamp}_${randomId}.${extension}`;
    const sha1 = crypto.createHash('sha1').update(buffer).digest('hex');

    // 3. Upload File
    const uploadRes = await fetch(upUrlData.uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: upUrlData.authorizationToken,
        'X-Bz-File-Name': fileName,
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'X-Bz-Content-Sha1': sha1
      },
      body: buffer as unknown as BodyInit
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${await uploadRes.text()}`);
    }

    const uploadData = await uploadRes.json();

    // 4. Generate Download Authorization Token (valid for 7 days = 604,800s)
    const downAuthRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_get_download_authorization`, {
      method: 'POST',
      headers: {
        Authorization: auth.authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bucketId,
        fileNamePrefix: fileName,
        validDurationInSeconds: 604800
      }),
      cache: 'no-store'
    });

    let viewUrl = `${auth.downloadUrl}/file/${bucketName}/${fileName}`;
    if (downAuthRes.ok) {
      const downAuthData = await downAuthRes.json();
      viewUrl += `?Authorization=${downAuthData.authorizationToken}`;
    }

    return {
      success: true,
      url: viewUrl,
      key: fileName,
      fileId: uploadData.fileId
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    console.error('Backblaze B2 Upload Error:', message);
    return {
      success: false,
      error: message
    };
  }
}
