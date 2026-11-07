import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SiteShell } from '@/components/site-shell';
import './globals.css';

const body = localFont({
  src: [
    { path: '../public/fonts/dm-sans-regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/dm-sans-bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});
const display = localFont({
  src: [
    { path: '../public/fonts/space-grotesk-regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/space-grotesk-bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL('https://darrkwiz.com'),
  title: { default: 'Darrkwiz — Tools, Learn & Playground', template: '%s · Darrkwiz' },
  description:
    'Tools, Learn, Playground: a home for making, understanding, and experimenting. Try six free browser tools, with interactive theory and creative playgrounds coming next.',
  openGraph: {
    title: 'Darrkwiz — Tools, Learn & Playground',
    description: 'Make with free browser tools. Explore the roadmap for interactive lessons and creative playgrounds.',
    type: 'website',
    url: 'https://darrkwiz.com',
    siteName: 'Darrkwiz',
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
