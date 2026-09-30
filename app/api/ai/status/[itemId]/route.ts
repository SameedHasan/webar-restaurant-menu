import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { getAdminMenuItem } from '@/lib/admin/menu-items';
import { processAIJobIfReady } from '@/lib/ai/process-job';

interface StatusRouteProps {
  params: Promise<{ itemId: string }>;
}

export async function GET(_request: Request, { params }: StatusRouteProps) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId } = await params;
  let item = await getAdminMenuItem(admin.restaurant.id, itemId);

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  if (item.ai_status === 'processing') {
    item = await processAIJobIfReady(admin.restaurant.id, item);
  }

  return NextResponse.json({
    item: {
      id: item.id,
      ai_status: item.ai_status ?? 'none',
      ai_error: item.ai_error ?? null,
      ai_job_id: item.ai_job_id ?? null,
      model_url: item.model_url ?? null,
    },
  });
}
