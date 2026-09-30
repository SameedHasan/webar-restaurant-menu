'use client';

import { useSyncExternalStore } from 'react';
import { isMobileUserAgent } from '@/lib/utils/device';

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return isMobileUserAgent(navigator.userAgent);
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
