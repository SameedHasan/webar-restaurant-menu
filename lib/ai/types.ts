export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobStatusResult {
  status: JobStatus;
  modelUrl?: string;
  usdzUrl?: string;
  error?: string;
  progress?: number;
}

export interface ImageTo3DProvider {
  createJob(imageUrl: string): Promise<{ jobId: string }>;
  getJobStatus(jobId: string): Promise<JobStatusResult>;
}
