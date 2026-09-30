export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function shouldUseMockData(): boolean {
  if (process.env.USE_MOCK_DATA === 'true') return true;
  return !isSupabaseConfigured();
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export const DEV_ADMIN_COOKIE = 'tablear-admin-session';
