import { test, expect } from '@playwright/test';
const routes = [
  '/learn',
  '/playground',
  '/learn/colour-theory',
  '/learn/image-compression',
  '/playground/css-easing',
];
test('experience pages have distinct search metadata, canonical URLs, and Navan Sami attribution', async ({
  page,
}) => {
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(title).toContain('Navan Sami');
    titles.add(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://darrkwiz.com${route}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://darrkwiz.com${route}`,
    );
    await expect(page.locator('main').getByRole('link', { name: /Navan Sami/ })).toBeVisible();
  }
  expect(titles.size).toBe(routes.length);
});
test('colour relationships update the exported palette and wheel supports dragging', async ({
  page,
}) => {
  await page.goto('/learn/colour-theory');
  await page.getByLabel('Base hue').fill('30');
  await expect(page.locator('.lab-swatch small').nth(1)).toContainText('210°');
  await page.getByLabel('Colour relationship').selectOption('triadic');
  await expect(page.locator('.lab-swatch')).toHaveCount(3);
  await expect(page.locator('.lab-swatch small').nth(1)).toContainText('150°');
  await expect(page.locator('.lab-swatch small').nth(2)).toContainText('270°');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy palette CSS' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('--colour-3:');
  const wheel = page.locator('.colour-wheel');
  await wheel.scrollIntoViewIfNeeded();
  const box = (await wheel.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 5, box.y + box.height / 2);
  await page.mouse.up();
  await expect(page.getByLabel('Base hue')).toHaveValue('90');
  await page.getByRole('button', { name: '210°', exact: true }).click();
  await expect(page.locator('.lab-challenge [role="status"]')).toContainText('Exactly');
  await page.getByRole('button', { name: 'Reset lab' }).click();
  await expect(page.getByLabel('Base hue')).toHaveValue('18');
});
test('compression encodes real files, compares PNG baseline, and recovers from invalid uploads', async ({
  page,
}) => {
  await page.goto('/learn/image-compression');
  await page
    .getByLabel('Upload image', { exact: true })
    .setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') });
  await expect(page.locator('.error-message')).toContainText('could not be read');
  await page.getByRole('button', { name: 'Try a textured sample' }).click();
  const downloadButton = page.getByRole('button', { name: 'Download JPEG result' });
  await expect(downloadButton).toBeVisible();
  await page.getByLabel('Encoding quality').fill('5');
  await expect(downloadButton).toBeVisible();
  const low = await page.locator('.compression-stats strong').nth(1).innerText();
  await page.getByLabel('Encoding quality').fill('95');
  await expect(downloadButton).toBeVisible();
  const high = await page.locator('.compression-stats strong').nth(1).innerText();
  expect(high).not.toBe(low);
  await page.getByLabel('Inspection zoom').selectOption('4');
  await expect(page.locator('.image-comparison')).toHaveAttribute('style', /width: 400%/);
  await page.getByLabel('Comparison position').fill('25');
  await expect(page.locator('img[alt="Prepared lossless baseline"]')).toHaveAttribute(
    'style',
    /75%/,
  );
  await page.getByLabel('Output format').selectOption('png');
  await expect(page.getByLabel('Encoding quality')).toBeDisabled();
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG result' }).click();
  const download = await event;
  expect(download.suggestedFilename()).toBe('compression-study.png');
  const { readFile } = await import('node:fs/promises');
  const data = await readFile((await download.path())!);
  expect(data.subarray(1, 4).toString()).toBe('PNG');
});
test('easing exports the selected curve and supports explicit playback with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/playground/css-easing');
  expect(
    await page
      .locator('.motion-dot')
      .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
  ).toBe(0);
  await page.locator('.lab-panel').getByRole('button', { name: 'Ease in', exact: true }).click();
  await expect(page.locator('.lab-export pre')).toContainText('cubic-bezier(0.42, 0, 1, 1)');
  await page.getByLabel('Inspect elapsed time').fill('50');
  await expect(page.locator('.comparison-control output')).toContainText('31.5% progress');
  await page.getByRole('button', { name: 'Play comparison' }).click();
  await expect(page.locator('.lab-buttons [role="status"]')).toContainText('Playing');
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  expect(
    await page
      .locator('.motion-dot')
      .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
  ).toBe(0);
  await page.getByRole('button', { name: 'Reset playground' }).click();
  await expect(page.getByLabel('Control 1 X')).toHaveValue('0.25');
});
test('experience pages fit narrow screens and navigation reaches the new indexes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      route,
    ).toBe(false);
  }
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await page.getByRole('link', { name: /Colour theory lab/ }).click();
  await expect(page).toHaveURL(/\/learn\/colour-theory$/);
});
