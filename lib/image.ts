export const ACCEPT_IMAGES = 'image/png,image/jpeg,image/webp,image/avif';
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/avif'].includes(file.type)) {
      reject(new Error('Choose a PNG, JPEG, WebP, or AVIF image.'));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Please choose an image under 25 MB.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth * img.naturalHeight > 40_000_000)
        reject(new Error('This image is too large. Try an image under 40 megapixels.'));
      else resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This image could not be read. Try another image or format.'));
    };
    img.src = url;
  });
}
export function canvasBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 0.85,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error('Could not export this image. Try a smaller image.'));
        else if (b.type !== type)
          reject(new Error('Your browser cannot export this format. Try PNG or JPEG.'));
        else resolve(b);
      },
      type,
      quality,
    ),
  );
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function basename(name: string) {
  return name.replace(/\.[^.]+$/, '');
}
export async function demoFile(): Promise<File> {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 680;
  const x = c.getContext('2d')!;
  x.fillStyle = '#e7d5ae';
  x.fillRect(0, 0, 1000, 680);
  x.fillStyle = '#e49a5b';
  x.beginPath();
  x.arc(730, 205, 105, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = '#a0ae82';
  x.beginPath();
  x.moveTo(0, 420);
  x.bezierCurveTo(250, 180, 320, 580, 650, 370);
  x.bezierCurveTo(850, 240, 920, 330, 1000, 280);
  x.lineTo(1000, 680);
  x.lineTo(0, 680);
  x.fill();
  x.fillStyle = '#63795d';
  x.beginPath();
  x.moveTo(0, 590);
  x.bezierCurveTo(330, 330, 550, 600, 1000, 420);
  x.lineTo(1000, 680);
  x.lineTo(0, 680);
  x.fill();
  x.fillStyle = '#354d40';
  x.beginPath();
  x.moveTo(0, 650);
  x.bezierCurveTo(370, 530, 640, 700, 1000, 540);
  x.lineTo(1000, 680);
  x.lineTo(0, 680);
  x.fill();
  return new File([await canvasBlob(c)], 'a-little-landscape.png', { type: 'image/png' });
}
export function fitSize(w: number, h: number, maxW: number, maxH: number) {
  const scale = Math.min(1, maxW / w, maxH / h);
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}
export function extractPalette(img: HTMLImageElement, count: number): string[] {
  const canvas = document.createElement('canvas');
  const { width, height } = fitSize(img.naturalWidth, img.naturalHeight, 150, 150);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;
  const bins = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const key = (data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4);
    const b = bins.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    b.r += data[i];
    b.g += data[i + 1];
    b.b += data[i + 2];
    b.n++;
    bins.set(key, b);
  }
  const buckets = [...bins.values()]
    .sort((a, b) => b.n - a.n)
    .map((b) => ({ r: Math.round(b.r / b.n), g: Math.round(b.g / b.n), b: Math.round(b.b / b.n) }));
  const chosen: typeof buckets = [];
  for (const b of buckets) {
    if (chosen.every((c) => Math.hypot(c.r - b.r, c.g - b.g, c.b - b.b) > 48)) chosen.push(b);
    if (chosen.length === count) break;
  }
  if (chosen.length < count)
    for (const b of buckets) {
      if (!chosen.includes(b)) chosen.push(b);
      if (chosen.length === count) break;
    }
  return chosen.map(
    (c) =>
      '#' +
      [c.r, c.g, c.b]
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase(),
  );
}
