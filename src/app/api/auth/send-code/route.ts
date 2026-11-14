import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode } from '@/lib/otpStore';
import { isDisposableEmail } from '@/lib/disposableEmailBlocker';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (5 verification code dispatches per 10 minutes per IP)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`otp_${clientIp}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many verification requests. Please wait ${rateCheck.retryAfterSeconds}s before requesting another code.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
      );
    }

    const { email, name } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email format (e.g. name@domain.com).' }, { status: 400 });
    }

    // Check and block disposable / temporary emails
    const check = isDisposableEmail(cleanEmail);
    if (check.isDisposable) {
      return NextResponse.json({
        success: false,
        error: `Temporary or disposable email addresses (@${check.domain || 'burner'}) cannot be used to create accounts. Please use a permanent email address (e.g. Gmail, Outlook, Yahoo, iCloud, or your work domain).`
      }, { status: 400 });
    }

    // Generate 6-digit code
    const { code, expiresAt } = generateVerificationCode(cleanEmail, name);

    // In a production environment with Resend / SendGrid / Nodemailer, send the email here.
    // We log it clearly to the server console and pass codePreview for instant testing.
    console.log(`[AUTH] Verification Code for ${cleanEmail}: ${code} (expires at ${new Date(expiresAt).toLocaleTimeString()})`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}`,
      codePreview: code, // Included so user can test and auto-fill in demo mode
      expiresAt
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send verification code';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
