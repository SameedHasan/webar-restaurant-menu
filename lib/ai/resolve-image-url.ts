import { readFile } from 'fs/promises';
import path from 'path';
import { getAppUrl } from '@/lib/config/env';

/**
 * Meshy requires a publicly reachable URL or a base64 data URI.
 * Local dev uploads are converted to data URIs automatically.
 */
export async function resolveImageUrlForAI(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) return imageUrl;

  const appUrl = getAppUrl();
  let absoluteUrl = imageUrl;

  if (imageUrl.startsWith('/')) {
    absoluteUrl = `${appUrl}${imageUrl}`;

    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
      const buffer = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime =
        ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
  }

  return absoluteUrl;
}
