import { NextResponse } from 'next/server';
import { DEV_ADMIN_COOKIE, shouldUseMockData } from '@/lib/config/env';
import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  if (shouldUseMockData()) {
    response.cookies.set(DEV_ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  }

  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return response;
}
