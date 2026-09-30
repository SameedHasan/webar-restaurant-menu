import type { ImageTo3DProvider, JobStatusResult } from '@/lib/ai/types';

const MOCK_JOB_DELAY_MS = 4000;

interface MockJob {
  startedAt: number;
}

const jobs = new Map<string, MockJob>();

export function createMockProvider(): ImageTo3DProvider {
  return {
    async createJob(imageUrl: string) {
      void imageUrl;
      const jobId = `mock-${crypto.randomUUID()}`;
      jobs.set(jobId, { startedAt: Date.now() });
      return { jobId };
    },

    async getJobStatus(jobId: string): Promise<JobStatusResult> {
      const job = jobs.get(jobId);
      if (!job) {
        return { status: 'failed', error: 'Mock job not found' };
      }

      const elapsed = Date.now() - job.startedAt;
      if (elapsed < MOCK_JOB_DELAY_MS) {
        return {
          status: 'processing',
          progress: Math.min(95, Math.round((elapsed / MOCK_JOB_DELAY_MS) * 100)),
        };
      }

      jobs.delete(jobId);
      return {
        status: 'completed',
        progress: 100,
        modelUrl: '__MOCK_SAMPLE__',
      };
    },
  };
}
