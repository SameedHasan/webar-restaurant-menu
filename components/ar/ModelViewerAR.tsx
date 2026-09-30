'use client';

import '@google/model-viewer';

interface ModelViewerARProps {
  src: string;
  alt: string;
  poster?: string | null;
  scale?: string;
  enableAR?: boolean;
}

export function ModelViewerAR({
  src,
  alt,
  poster,
  scale = '0.4 0.4 0.4',
  enableAR = true,
}: ModelViewerARProps) {
  return (
    <model-viewer
      src={src}
      alt={alt}
      poster={poster ?? undefined}
      ar={enableAR || undefined}
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      interaction-prompt="auto"
      scale={scale}
      style={{ width: '100%', height: '100%', minHeight: '60vh', background: '#1c1917' }}
    />
  );
}
