import { updateMenuItemAI } from '@/lib/admin/ai-jobs';
import { getImageTo3DProvider } from '@/lib/ai/image-to-3d';
import { saveModelForMenuItem } from '@/lib/ai/model-storage';
import type { MenuItem } from '@/lib/types/database';

/**
 * Polls the AI provider and finalizes the menu item when the job completes.
 * Called from the status endpoint while ai_status is processing.
 */
export async function processAIJobIfReady(
  restaurantId: string,
  item: MenuItem,
): Promise<MenuItem> {
  if (!item.ai_job_id || item.ai_status !== 'processing') {
    return item;
  }

  const provider = getImageTo3DProvider();
  const result = await provider.getJobStatus(item.ai_job_id);

  if (result.status === 'pending' || result.status === 'processing') {
    return item;
  }

  if (result.status === 'failed') {
    return updateMenuItemAI(restaurantId, item.id, {
      ai_status: 'failed',
      ai_error: result.error ?? '3D generation failed',
    });
  }

  if (!result.modelUrl) {
    return updateMenuItemAI(restaurantId, item.id, {
      ai_status: 'failed',
      ai_error: 'No model URL returned from provider',
    });
  }

  const modelUrl = await saveModelForMenuItem(result.modelUrl, restaurantId, item.id);

  return updateMenuItemAI(restaurantId, item.id, {
    ai_status: 'completed',
    ai_error: null,
    model_url: modelUrl,
  });
}
