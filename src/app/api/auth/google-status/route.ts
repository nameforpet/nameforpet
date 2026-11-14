import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ enabled: false, reason: 'No Supabase URL configured' });
  }

  try {
    const checkRes = await fetch(`${supabaseUrl}/auth/v1/authorize?provider=google`, {
      method: 'GET',
      redirect: 'manual'
    });

    // When Google OAuth is disabled in Supabase, status is 400 with "Unsupported provider"
    // When enabled, it returns 302 / 303 / 307 redirecting to Google OAuth
    const isEnabled = checkRes.status >= 300 && checkRes.status < 400;

    return NextResponse.json({
      enabled: isEnabled,
      status: checkRes.status
    });
  } catch (error: unknown) {
    return NextResponse.json({
      enabled: false,
      error: error instanceof Error ? error.message : 'Check failed'
    });
  }
}
