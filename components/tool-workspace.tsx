'use client';
import dynamic from 'next/dynamic';
const ScreenshotStudio = dynamic(() => import('./tools/screenshot-studio'), {
  loading: () => <p className="tool-loading">Setting up your studio…</p>,
});
const ImageBatch = dynamic(() => import('./tools/image-batch'), {
  loading: () => <p className="tool-loading">Setting up your workbench…</p>,
});
const TextCleaner = dynamic(() => import('./tools/text-cleaner'));
const TextCompare = dynamic(() => import('./tools/text-compare'));
const PaletteExtractor = dynamic(() => import('./tools/palette-extractor'));
export function ToolWorkspace({ slug }: { slug: string }) {
  switch (slug) {
    case 'screenshot-studio':
      return <ScreenshotStudio />;
    case 'image-compressor':
      return <ImageBatch mode="compress" />;
    case 'image-converter':
      return <ImageBatch mode="convert" />;
    case 'text-cleaner':
      return <TextCleaner />;
    case 'text-compare':
      return <TextCompare />;
    case 'palette-extractor':
      return <PaletteExtractor />;
    default:
      return null;
  }
}
