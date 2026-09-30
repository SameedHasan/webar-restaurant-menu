import { copyFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { shouldUseMockData } from '@/lib/config/env';
import { createServiceClient } from '@/lib/supabase/service';

const SAMPLE_MODEL = path.join(process.cwd(), 'public', 'models', 'sample-burger.glb');

export async function saveModelForMenuItem(
  source: string | Buffer,
  restaurantId: string,
  itemId: string,
): Promise<string> {
  const modelsDir = path.join(process.cwd(), 'public', 'models');
  await mkdir(modelsDir, { recursive: true });

  const localFilename = `${itemId}.glb`;
  const localPath = path.join(modelsDir, localFilename);

  if (source === '__MOCK_SAMPLE__') {
    await copyFile(SAMPLE_MODEL, localPath);
    return `/models/${localFilename}`;
  }

  let buffer: Buffer;
  if (Buffer.isBuffer(source)) {
    buffer = source;
  } else {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to download GLB (${response.status})`);
    }
    buffer = Buffer.from(await response.arrayBuffer());
  }

  if (shouldUseMockData()) {
    await writeFile(localPath, buffer);
    return `/models/${localFilename}`;
  }

  const supabase = createServiceClient();
  const storagePath = `${restaurantId}/${itemId}.glb`;

  const { error } = await supabase.storage.from('ar-models').upload(storagePath, buffer, {
    contentType: 'model/gltf-binary',
    upsert: true,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from('ar-models').getPublicUrl(storagePath);

  return publicUrl;
}
