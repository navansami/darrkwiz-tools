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
  title: { default: 'Darrkwiz — Small tools. Big possibilities.', template: '%s · Darrkwiz' },
  description:
    'Six handy tools for people who make things. Style screenshots, compress and convert images, clean and compare text, and discover colour palettes. Free. Private. Right in your browser.',
  openGraph: {
    title: 'Darrkwiz — Small tools. Big possibilities.',
    description: 'A little less busywork. A lot more making.',
    type: 'website',
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
