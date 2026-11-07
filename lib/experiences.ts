import type { Metadata } from 'next';
export const experiences = [
  {
    slug: 'colour-theory',
    section: 'learn',
    title: 'Colour theory lab',
    description:
      'Explore complementary, analogous, and triadic colours with a draggable colour wheel. Build a palette and export CSS.',
    tag: 'COLOUR & DESIGN',
    number: '01',
  },
  {
    slug: 'image-compression',
    section: 'learn',
    title: 'Image compression explainer',
    description:
      'See what image compression changes. Compare real JPEG, WebP, and PNG encodings, inspect details, and download the result.',
    tag: 'IMAGES & THE WEB',
    number: '02',
  },
  {
    slug: 'css-easing',
    section: 'playground',
    title: 'CSS easing playground',
    description:
      'Shape a cubic Bézier curve, compare it with linear motion, and copy working CSS for your next animation.',
    tag: 'MOTION & CODE',
    number: '03',
  },
] as const;
export function experienceMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} by Navan Sami`;
  return {
    title: fullTitle,
    description,
    authors: [{ name: 'Navan Sami', url: 'https://navansami.com' }],
    alternates: { canonical: path },
    openGraph: {
      title: `${fullTitle} · Darrkwiz`,
      description,
      url: path,
      type: 'website',
      siteName: 'Darrkwiz',
    },
    twitter: { card: 'summary', title: `${fullTitle} · Darrkwiz`, description },
  };
}
