import type { ImageTo3DProvider, JobStatusResult } from '@/lib/ai/types';

const MESHY_BASE = 'https://api.meshy.ai/openapi/v1/image-to-3d';

type MeshyTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

interface MeshyTaskResponse {
  id: string;
  status: MeshyTaskStatus;
  model_urls?: { glb?: string; usdz?: string };
  task_error?: { message?: string };
  progress?: number;
}

function mapMeshyStatus(status: MeshyTaskStatus): JobStatusResult['status'] {
  switch (status) {
    case 'PENDING':
      return 'pending';
    case 'IN_PROGRESS':
      return 'processing';
    case 'SUCCEEDED':
      return 'completed';
    case 'FAILED':
    case 'CANCELED':
      return 'failed';
    default:
      return 'processing';
  }
}

export function createMeshyProvider(apiKey: string): ImageTo3DProvider {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  return {
    async createJob(imageUrl: string) {
      const response = await fetch(MESHY_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          image_url: imageUrl,
          ai_model: 'meshy-6',
          should_texture: true,
          target_formats: ['glb'],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Meshy API error (${response.status}): ${body}`);
      }

      const data = (await response.json()) as { result: string };
      return { jobId: data.result };
    },

    async getJobStatus(jobId: string): Promise<JobStatusResult> {
      const response = await fetch(`${MESHY_BASE}/${jobId}`, { headers });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Meshy API error (${response.status}): ${body}`);
      }

      const task = (await response.json()) as MeshyTaskResponse;
      const status = mapMeshyStatus(task.status);

      return {
        status,
        modelUrl: task.model_urls?.glb,
        usdzUrl: task.model_urls?.usdz,
        error: task.task_error?.message,
        progress: task.progress,
      };
    },
  };
}
