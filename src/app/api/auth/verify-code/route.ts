import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/otpStore';
import { isDisposableEmail } from '@/lib/disposableEmailBlocker';

export async function POST(req: NextRequest) {
  try {
    const { email, code, name } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Email and 6-digit code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check disposable email
    const check = isDisposableEmail(cleanEmail);
    if (check.isDisposable) {
      return NextResponse.json({
        success: false,
        error: 'Temporary and disposable email addresses are not allowed.'
      }, { status: 400 });
    }

    const cleanCode = code.toString().trim();

    const result = verifyCode(cleanEmail, cleanCode);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Code is valid! Create / return the authenticated user payload
    const resolvedName = name?.trim() || result.name || cleanEmail.split('@')[0];
    const user = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      role: 'user',
      savedNamesCount: 0,
      ordersCount: 0,
      provider: 'email_verification_code'
    };

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified!',
      user
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
