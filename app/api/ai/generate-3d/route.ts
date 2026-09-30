import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { updateMenuItemAI } from '@/lib/admin/ai-jobs';
import { getAdminMenuItem } from '@/lib/admin/menu-items';
import { getImageTo3DProvider, isAIConfigured } from '@/lib/ai/image-to-3d';
import { resolveImageUrlForAI } from '@/lib/ai/resolve-image-url';

export async function POST(request: Request) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json({ error: 'AI generation is not configured' }, { status: 503 });
  }

  const body = (await request.json()) as { itemId?: string };
  if (!body.itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
  }

  const item = await getAdminMenuItem(admin.restaurant.id, body.itemId);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  if (!item.image_url) {
    return NextResponse.json({ error: 'Upload a food photo before generating 3D' }, { status: 400 });
  }

  if (item.ai_status === 'processing') {
    return NextResponse.json({ error: 'Generation already in progress' }, { status: 409 });
  }

  try {
    const provider = getImageTo3DProvider();
    const imageUrl = await resolveImageUrlForAI(item.image_url);
    const { jobId } = await provider.createJob(imageUrl);

    const updated = await updateMenuItemAI(admin.restaurant.id, item.id, {
      ai_job_id: jobId,
      ai_status: 'processing',
      ai_error: null,
    });

    return NextResponse.json({
      item: updated,
      message: '3D generation started',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to start generation';
    await updateMenuItemAI(admin.restaurant.id, item.id, {
      ai_status: 'failed',
      ai_error: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
