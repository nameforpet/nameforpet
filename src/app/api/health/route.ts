import { NextResponse } from 'next/server';
import { isB2Configured } from '@/lib/b2Storage';

export const dynamic = 'force-dynamic';

async function checkSupabase(): Promise<{ ok: boolean; latencyMs?: number; detail?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === 'your-supabase-url') {
    return { ok: false, detail: 'Not configured' };
  }
  try {
    const start = Date.now();
    // Ping the Supabase REST endpoint directly (no table dependency)
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    const latencyMs = Date.now() - start;
    // 200 or 404 both mean the server is reachable and auth passed
    if (res.status < 500) return { ok: true, latencyMs, detail: 'Connected' };
    return { ok: false, latencyMs, detail: `HTTP ${res.status}` };
  } catch (e: unknown) {
    return { ok: false, detail: e instanceof Error ? e.message : 'Unreachable' };
  }
}

async function checkGeminiAPI(): Promise<{ ok: boolean; latencyMs?: number; detail?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, detail: 'Not configured' };
  try {
    const start = Date.now();
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] }),
        signal: AbortSignal.timeout(8000),
      }
    );
    const latencyMs = Date.now() - start;
    if (res.ok) return { ok: true, latencyMs, detail: 'gemini-3.1-flash-lite' };
    return { ok: false, latencyMs, detail: `HTTP ${res.status}` };
  } catch (e: unknown) {
    return { ok: false, detail: e instanceof Error ? e.message : 'Unreachable' };
  }
}

async function checkB2(): Promise<{ ok: boolean; detail?: string }> {
  if (!isB2Configured()) return { ok: false, detail: 'Not configured — add B2 keys to .env.local' };
  // B2 is configured; we consider it online (a real upload test would consume quota)
  return { ok: true, detail: `Bucket: ${process.env.B2_BUCKET_NAME}` };
}

export async function GET() {
  const [supabase, gemini, b2] = await Promise.all([
    checkSupabase(),
    checkGeminiAPI(),
    checkB2(),
  ]);

  const allOk = supabase.ok && gemini.ok;

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      supabase: { ...supabase, name: 'Supabase Database' },
      gemini:   { ...gemini,   name: 'Gemini Vision AI' },
      b2:       { ...b2,       name: 'Backblaze B2 Storage' },
    },
    env: {
      supabase_url_set: !!(process.env.NEXT_PUBLIC_SUPABASE_URL),
      gemini_key_set:   !!(process.env.GEMINI_API_KEY),
      b2_configured:    isB2Configured(),
      node_env:         process.env.NODE_ENV,
    }
  });
}
