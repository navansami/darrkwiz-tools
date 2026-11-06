import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://darrkwiz.com', priority: 1 },
    ...tools.map((t) => ({ url: `https://darrkwiz.com/tools/${t.slug}`, priority: 0.8 })),
  ];
}
