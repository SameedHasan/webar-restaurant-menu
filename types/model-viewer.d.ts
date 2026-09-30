import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ModelViewerElementProps = HTMLAttributes<HTMLElement> & {
  src?: string;
  'ios-src'?: string;
  alt?: string;
  ar?: boolean;
  'ar-modes'?: string;
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'shadow-intensity'?: string;
  'environment-image'?: string;
  exposure?: string;
  'interaction-prompt'?: string;
  scale?: string;
  poster?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<ModelViewerElementProps, HTMLElement>;
    }
  }
}
