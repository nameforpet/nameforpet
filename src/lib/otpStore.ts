// In-memory verification code store with expiration and rate limiting
// Attached to globalThis to ensure sharing across Next.js API route webpack bundles

interface StoredOTP {
  code: string;
  expiresAt: number;
  attempts: number;
  name?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, StoredOTP> | undefined;
}

if (!globalThis.__otpStore) {
  globalThis.__otpStore = new Map<string, StoredOTP>();
}

const otpStore = globalThis.__otpStore;

/**
 * Generates and stores a 6-digit verification code for an email.
 * Valid for 10 minutes.
 */
export function generateVerificationCode(email: string, name?: string): { code: string; expiresAt: number } {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate a secure 6-digit number between 100000 and 999999
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizedEmail, {
    code,
    expiresAt,
    attempts: 0,
    name: name?.trim() || undefined,
  });

  return { code, expiresAt };
}

/**
 * Verifies a 6-digit code for an email.
 */
export function verifyCode(email: string, enteredCode: string): { success: boolean; error?: string; name?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  if (!stored) {
    return { success: false, error: 'No verification code was sent to this email. Please request a new code.' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { success: false, error: 'This verification code has expired. Please request a new one.' };
  }

  if (stored.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return { success: false, error: 'Too many incorrect attempts. Please request a new verification code.' };
  }

  if (stored.code !== enteredCode.trim()) {
    stored.attempts += 1;
    const remaining = 5 - stored.attempts;
    return {
      success: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // Code is valid: delete from store to prevent reuse
  const matchedName = stored.name;
  otpStore.delete(normalizedEmail);

  return { success: true, name: matchedName };
}

/**
 * Gets the current active code for debugging/development demo previews.
 */
export function getActiveCode(email: string): string | null {
  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);
  if (!stored || Date.now() > stored.expiresAt) return null;
  return stored.code;
}
