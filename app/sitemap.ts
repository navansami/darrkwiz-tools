import type { MetadataRoute } from 'next';
import { experiences } from '@/lib/experiences';
import { tools } from '@/lib/tools';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://darrkwiz.com', priority: 1 },
    { url: 'https://darrkwiz.com/learn', priority: 0.9 },
    { url: 'https://darrkwiz.com/playground', priority: 0.9 },
    ...experiences.map((e) => ({
      url: `https://darrkwiz.com/${e.section}/${e.slug}`,
      priority: 0.8,
    })),
    ...tools.map((t) => ({ url: `https://darrkwiz.com/tools/${t.slug}`, priority: 0.8 })),
  ];
}
