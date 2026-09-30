'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Upload failed');

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700">Food photo</label>

      {value && (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200">
          <Image src={value} alt="Uploaded food" fill className="object-cover" sizes="320px" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50">
          {uploading ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
