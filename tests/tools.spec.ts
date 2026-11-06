import { test, expect, type Download } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
async function bytes(download: Download) {
  return readFile((await download.path())!);
}

test('toolbox filters, search, navigation, and motion preference work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SMALL TOOLS.');
  await expect(page.locator('.tool-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(page.locator('.tool-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'All tools' }).click();
  await page.getByRole('textbox', { name: 'Search tools' }).fill('palette');
  await expect(page.locator('.tool-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('.tool-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Enable animations' })).toBeVisible();
  await page.getByRole('button', { name: 'Enable animations' }).click();
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await page.screenshot({
    path: '/tmp/darrkwiz-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
});

test('screenshot studio exports a real PNG with chosen canvas and scale', async ({ page }) => {
  await page.goto('/tools/screenshot-studio');
  await page.getByRole('button', { name: 'Just exploring? Try a sample' }).click();
  await expect(page.getByRole('button', { name: 'Download PNG', exact: true })).toBeEnabled();
  await page.getByLabel('Canvas shape').selectOption('square');
  await page.getByLabel('Export resolution').selectOption('2');
  await expect(page.locator('.studio-preview .panel-label')).toContainText('2400 × 2400');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
  const download = await event;
  const data = await bytes(download);
  expect(data.subarray(1, 4).toString()).toBe('PNG');
  expect(data.readUInt32BE(16)).toBe(2400);
  expect(data.readUInt32BE(20)).toBe(2400);
  expect(download.suggestedFilename()).toBe('a-little-landscape-darrkwiz.png');
  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await page.screenshot({
    path: '/tmp/darrkwiz-studio.png',
    fullPage: true,
    animations: 'disabled',
  });
});

test('batch compressor resizes images and produces a usable ZIP', async ({ page }) => {
  await page.goto('/tools/image-compressor');
  await page.getByRole('button', { name: 'Just exploring? Try a sample' }).click();
  await expect(page.locator('.batch-row')).toHaveCount(1);
  await page.getByLabel('Maximum dimensions').selectOption('800');
  await page.getByRole('button', { name: 'Compress 1 image', exact: true }).click();
  await expect(page.locator('.batch-file-info')).toContainText('800 × 544');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download ZIP', exact: true }).click();
  const zip = await JSZip.loadAsync(await bytes(await event));
  const names = Object.keys(zip.files);
  expect(names).toHaveLength(1);
  expect(names[0]).toMatch(/\.webp$/);
  const data = await zip.files[names[0]].async('nodebuffer');
  expect(data.subarray(0, 4).toString()).toBe('RIFF');
  expect(data.subarray(8, 12).toString()).toBe('WEBP');
  await page.getByLabel('Quality').fill('60');
  await expect(page.getByRole('button', { name: 'Download ZIP', exact: true })).toHaveCount(0);
});

test('converter handles multiple files and composites JPEG transparency onto white', async ({
  page,
}) => {
  await page.goto('/tools/image-converter');
  const image = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 20;
    c.height = 10;
    const x = c.getContext('2d')!;
    x.fillStyle = '#ff0000';
    x.fillRect(0, 0, 10, 10);
    return c.toDataURL().split(',')[1];
  });
  await page.getByLabel('Upload images').setInputFiles([
    { name: 'alpha.png', mimeType: 'image/png', buffer: Buffer.from(image, 'base64') },
    { name: 'second.png', mimeType: 'image/png', buffer: Buffer.from(image, 'base64') },
  ]);
  await expect(page.locator('.batch-row')).toHaveCount(2);
  await page.getByLabel('Output format').selectOption('jpeg');
  await page.getByRole('button', { name: 'Convert 2 images', exact: true }).click();
  await expect(page.locator('.results-header')).toContainText('2 images ready');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download ZIP', exact: true }).click();
  const zip = await JSZip.loadAsync(await bytes(await event));
  expect(Object.keys(zip.files)).toHaveLength(2);
  const name = Object.keys(zip.files)[0];
  const data = await zip.files[name].async('nodebuffer');
  expect(data[0]).toBe(255);
  expect(data[1]).toBe(216);
  const pixel = await page.evaluate(async (base64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext('2d')!;
    x.drawImage(img, 0, 0);
    return Array.from(x.getImageData(18, 5, 1, 1).data);
  }, data.toString('base64'));
  expect(pixel[0]).toBeGreaterThan(245);
  expect(pixel[1]).toBeGreaterThan(245);
  expect(pixel[2]).toBeGreaterThan(245);
});

test('text cleanup preserves paragraphs, removes duplicates, and exports output', async ({
  page,
}) => {
  await page.goto('/tools/text-cleaner');
  await page
    .getByLabel('01 / THE BEFORE')
    .fill('  Hello    world.  \nThis is a line.\nThis is a line.\n\nAnother paragraph.  ');
  await page.getByRole('checkbox', { name: 'Remove duplicate lines' }).check();
  await page.getByRole('checkbox', { name: 'Join broken lines' }).check();
  await expect(page.getByLabel('02 / A FRESH START')).toHaveValue(
    'Hello world. This is a line.\n\nAnother paragraph.',
  );
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy clean text', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'Hello world. This is a line.\n\nAnother paragraph.',
  );
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save .txt', exact: true }).click();
  expect((await bytes(await event)).toString()).toBe(
    'Hello world. This is a line.\n\nAnother paragraph.',
  );
});

test('word comparison identifies additions, removals, and stale results', async ({ page }) => {
  await page.goto('/tools/text-compare');
  await page.getByLabel('01 / ORIGINAL TEXT').fill('Make good things.');
  await page.getByLabel('02 / UPDATED TEXT').fill('Make great things.');
  await page.getByRole('button', { name: 'Find the difference' }).click();
  await expect(page.locator('.diff-added')).toContainText('great');
  await expect(page.locator('.diff-removed')).toContainText('good');
  await page.getByLabel('02 / UPDATED TEXT').fill('MAKE GOOD THINGS.');
  await expect(page.getByRole('status')).toContainText('inputs have changed');
  await page.getByRole('checkbox', { name: 'Ignore case' }).check();
  await page.getByRole('button', { name: 'Find the difference' }).click();
  await expect(page.getByRole('heading', { name: 'A perfect match.' })).toBeVisible();
});

test('palette extraction finds real source colours and exports CSS', async ({ page }) => {
  await page.goto('/tools/palette-extractor');
  const image = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 90;
    c.height = 30;
    const x = c.getContext('2d')!;
    ['#FF0000', '#00FF00', '#0000FF'].forEach((v, i) => {
      x.fillStyle = v;
      x.fillRect(i * 30, 0, 30, 30);
    });
    return c.toDataURL().split(',')[1];
  });
  await page
    .getByLabel('Upload image', { exact: true })
    .setInputFiles({
      name: 'colours.png',
      mimeType: 'image/png',
      buffer: Buffer.from(image, 'base64'),
    });
  await expect(page.locator('.colour-swatch')).toHaveCount(3);
  for (const colour of ['#FF0000', '#00FF00', '#0000FF'])
    await expect(page.getByRole('button', { name: `Copy ${colour}`, exact: true })).toBeVisible();
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save CSS', exact: true }).click();
  const css = (await bytes(await event)).toString();
  expect(css).toContain('--color-1:');
  expect(css).toContain('#FF0000');
});

test('bad uploads fail clearly without preventing a later valid upload', async ({ page }) => {
  await page.goto('/tools/screenshot-studio');
  await page
    .getByLabel('Upload image', { exact: true })
    .setInputFiles({
      name: 'broken.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image'),
    });
  await expect(page.locator('.error-message')).toContainText('could not be read');
  await page.getByRole('button', { name: 'Just exploring? Try a sample' }).click();
  await expect(page.getByRole('button', { name: 'Download PNG', exact: true })).toBeEnabled();
});

test('all six workspaces and the home page fit a 320px mobile screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const paths = [
    '/',
    '/tools/screenshot-studio',
    '/tools/image-compressor',
    '/tools/image-converter',
    '/tools/text-cleaner',
    '/tools/text-compare',
    '/tools/palette-extractor',
  ];
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('main h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const sample = page.getByRole('button', { name: 'Just exploring? Try a sample' });
    if (await sample.count()) {
      await sample.click();
      await page.waitForTimeout(200);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow, `Overflow at ${path}`).toBe(false);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('link', { name: 'The idea', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: '/tmp/darrkwiz-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
});

test('reduced motion is respected and unknown tools return 404', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Enable animations' })).toBeVisible();
  const response = await page.goto('/tools/unknown');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing here.');
});
