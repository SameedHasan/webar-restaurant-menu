import { createMeshyProvider } from '@/lib/ai/meshy';
import { createMockProvider } from '@/lib/ai/mock-provider';
import type { ImageTo3DProvider } from '@/lib/ai/types';
import { shouldUseMockData } from '@/lib/config/env';

export function getImageTo3DProvider(): ImageTo3DProvider {
  if (shouldUseMockData()) {
    return createMockProvider();
  }

  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    throw new Error('MESHY_API_KEY is not configured');
  }

  return createMeshyProvider(apiKey);
}

export function isAIConfigured(): boolean {
  return shouldUseMockData() || Boolean(process.env.MESHY_API_KEY);
}
