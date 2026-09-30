'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { AIStatus, MenuItem } from '@/lib/types/database';

interface Generate3DPanelProps {
  item: Pick<MenuItem, 'id' | 'image_url' | 'model_url' | 'ai_status' | 'ai_error' | 'name'>;
}

export function Generate3DPanel({ item: initialItem }: Generate3DPanelProps) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiStatus: AIStatus = item.ai_status ?? 'none';
  const isProcessing = aiStatus === 'processing' || aiStatus === 'pending';
  const hasModel = Boolean(item.model_url);
  const isReady = hasModel && !isProcessing && aiStatus !== 'failed';

  const pollStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/ai/status/${item.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Status check failed');

      setItem((prev) => ({ ...prev, ...data.item }));
      if (data.item.ai_status === 'completed' || data.item.ai_status === 'failed') {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status check failed');
    }
  }, [item.id, router]);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [isProcessing, pollStatus]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setShowConfirm(false);

    try {
      const response = await fetch('/api/ai/generate-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Generation failed');

      setItem((prev) => ({ ...prev, ...data.item }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  if (!item.image_url) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-500">
        Upload a food photo above to enable AI 3D generation.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 ring-1 ring-stone-200/80">
      <h3 className="text-sm font-semibold text-stone-900">3D AR Model</h3>
      <p className="mt-1 text-sm text-stone-500">
        Convert the food photo into a 3D model customers can place on their table in AR.
      </p>

      {!isReady && !isProcessing && aiStatus !== 'failed' && (
        <div className="mt-4">
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
              Generate 3D Model
            </button>
          ) : (
            <div className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
              <p className="text-sm text-amber-900">
                This uses AI credits and takes ~1–3 minutes. Continue?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
                  {loading ? 'Starting…' : 'Yes, generate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-stone-50 px-4 py-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-amber-600" />
          <div>
            <p className="text-sm font-medium text-stone-800">Generating 3D model…</p>
            <p className="text-xs text-stone-500">Usually takes 1–3 minutes. Keep this page open.</p>
          </div>
        </div>
      )}

      {isReady && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 ring-1 ring-green-200">
            3D model ready — customers can now use &quot;View on Table&quot; in AR.
          </div>
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50">
              Regenerate model
            </button>
          ) : (
            <div className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
              <p className="text-sm text-amber-900">Regenerate and replace the current 3D model?</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
                  {loading ? 'Starting…' : 'Regenerate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {aiStatus === 'failed' && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
            {item.ai_error ?? '3D generation failed'}
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
            {loading ? 'Retrying…' : 'Retry generation'}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
