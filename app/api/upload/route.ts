import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { shouldUseMockData } from '@/lib/config/env';
import { createServerClient } from '@/lib/supabase/server';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: Request) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;

  if (shouldUseMockData()) {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  }

  const supabase = await createServerClient();
  const storagePath = `${admin.restaurant.id}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from('food-images').upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('food-images').getPublicUrl(storagePath);

  return NextResponse.json({ url: publicUrl });
}
