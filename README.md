# Darrkwiz

A Next.js App Router site organized around **Tools · Learn · Playground**, styled from `STYLE_GUIDE.md`. Six browser tools are available today: screenshot studio, batch image compressor, batch image converter, text cleaner, text comparison, and palette extractor. Learn includes a colour theory lab and an image compression explainer. Playground includes an interactive CSS easing editor. Created by Navan Sami.

See [HandOff.md](HandOff.md) for the complete feature roadmap, content architecture, first-release priorities, and SEO direction.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Each tool has a permanent URL under `/tools/`.

## Deploy to Vercel

Push this directory to your Git repository and import it into Vercel. Choose the **Next.js** preset. Build command: `npm run build`. Leave the output directory at its default. No environment variables, database, API keys, or server storage are needed. Connect `darrkwiz.com` under your Vercel project's Domains settings and follow its DNS instructions.

Alternatively, run `npx vercel` from this directory with your Vercel account.

## Checks

```sh
npm run typecheck
npm run build
npm test
```

Browser tests use system Google Chrome if available; otherwise install Playwright Chromium with `npx playwright install chromium`. The test runner starts a local production server, so run the production build first.

## How the tools work

- **Screenshot studio:** image upload or generated sample, gradient backgrounds, padding, rounded corners, optional shadow and browser frame, four canvas shapes, 1×/2× PNG export.
- **Image compressor:** up to 20 images, WebP/JPEG/PNG encoding, quality settings, proportional resizing without upscaling, individual or ZIP downloads. PNG is lossless; quality applies to JPEG and WebP. If re-encoding the same format at the original size produces a larger file, the original is retained.
- **Image converter:** batch PNG/JPEG/WebP exports, quality for lossy formats, ZIP download, white background for JPEG transparency. Outputs beyond 8192 pixels per side are scaled down.
- **Text cleaner:** live cleanup, line joining, duplicate removal, whitespace and quote fixes, letter case, copy and TXT export. Limit: 250,000 characters.
- **Text compare:** word or line diff, case/spacing options, explicit added/removed styles, copy and TXT export. Limit: 50,000 characters per input with a processing timeout for very large differences.
- **Palette extractor:** sampled image colour quantization, 3–8 colours (or fewer for simple images), HEX/RGB copy, CSS variables and palette PNG downloads. Transparent pixels are ignored.

Files and text are processed entirely in the browser. Nothing is uploaded. Image inputs: PNG, JPEG, WebP, AVIF (browser decoding support required), maximum 25 MB and 40 megapixels each. Browser memory limits still apply; use smaller batches for large originals.

Fonts are self-hosted; their OFL licenses are in `public/fonts/`. Motion is enabled by default unless reduced motion is preferred. The header toggle persists the visitor's choice locally. Core tools work with motion paused.

## Interactive experiences

- `/learn/colour-theory`: draggable HSL wheel, two to four independently editable pickers, complementary/analogous/triadic/square relationships, adjustable saturation and lightness, CSS palette export, and a short challenge.
- `/learn/image-compression`: local image upload or textured sample, real JPEG/WebP/PNG encodings, PNG baseline comparison, zoom, file sizes, and result download. Prepared previews are limited to 1200 pixels per side.
- `/playground/css-easing`: draggable cubic Bézier handles, presets, duration controls, explicit motion comparison, time scrubbing, and CSS export.

Each experience has its own canonical URL, search and social metadata, visible Navan Sami attribution, and author structured data. `/learn` and `/playground` provide linked indexes.
