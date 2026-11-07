'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Busy, ErrorMessage, FileDrop, useImageFile } from '@/components/tool-shared';
import { canvasBlob, demoFile, downloadBlob, fitSize, formatBytes } from '@/lib/image';
type Result = {
  original: string;
  encoded: string;
  baseline: number;
  blob: Blob;
  width: number;
  height: number;
};
async function sample() {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 680;
  const ctx = c.getContext('2d')!;
  const image = new Image();
  const file = await demoFile();
  const url = URL.createObjectURL(file);
  try {
    image.src = url;
    await image.decode();
    ctx.drawImage(image, 0, 0);
  } finally {
    URL.revokeObjectURL(url);
  }
  ctx.fillStyle = '#eae8df';
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText('Look a little closer.', 50, 100);
  for (let y = 150; y < 310; y += 3)
    for (let x = 50; x < 500; x += 3) {
      const n = (x * 17 + y * 31) % 255;
      ctx.fillStyle = `rgb(${n},${160 + (n % 90)},${100 + (n % 100)})`;
      ctx.fillRect(x, y, 2, 2);
    }
  return new File([await canvasBlob(c)], 'texture-study.png', { type: 'image/png' });
}
export default function CompressionLab() {
  const { image, file, error, setError, loading, selectFile } = useImageFile();
  const [format, setFormat] = useState('jpeg'),
    [quality, setQuality] = useState(65),
    [split, setSplit] = useState(50),
    [zoom, setZoom] = useState('1');
  const [result, setResult] = useState<Result | null>(null),
    [busy, setBusy] = useState(false),
    [sampleBusy, setSampleBusy] = useState(false),
    [answer, setAnswer] = useState<string | null>(null);
  async function loadSample() {
    setSampleBusy(true);
    try {
      await selectFile(await sample());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSampleBusy(false);
    }
  }
  useEffect(() => {
    if (!image) return;
    let active = true;
    const urls: string[] = [];
    setBusy(true);
    setResult(null);
    setError('');
    const timer = setTimeout(async () => {
      try {
        const c = document.createElement('canvas');
        const size = fitSize(image.naturalWidth, image.naturalHeight, 1200, 1200);
        c.width = size.width;
        c.height = size.height;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(image, 0, 0, c.width, c.height);
        const baseline = await canvasBlob(c);
        const blob = await canvasBlob(c, `image/${format}`, quality / 100);
        if (!active) return;
        const original = URL.createObjectURL(baseline),
          encoded = URL.createObjectURL(blob);
        urls.push(original, encoded);
        setResult({
          original,
          encoded,
          baseline: baseline.size,
          blob,
          width: c.width,
          height: c.height,
        });
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) setBusy(false);
      }
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [image, format, quality, setError]);
  const saving = result ? (1 - result.blob.size / result.baseline) * 100 : 0;
  return (
    <>
      <section className="lesson-intro">
        <span className="eyebrow">01 / THE IDEA</span>
        <h2>Fewer bytes. What changes?</h2>
        <p>
          Lossless compression preserves pixels. Lossy compression trades some image detail for
          smaller files. Move the quality slider and inspect the result: edges, texture, and
          lettering often reveal changes first.
        </p>
      </section>
      <section className="lab-panel">
        <div className="lab-panel-top">
          <span className="eyebrow">02 / COMPARE REAL ENCODINGS</span>
          <button
            className="button secondary"
            onClick={() => {
              setFormat('jpeg');
              setQuality(65);
              setSplit(50);
              setZoom('1');
              setAnswer(null);
            }}
          >
            Reset settings
          </button>
        </div>
        <div className="lab-columns">
          <div>
            <FileDrop
              compact={!!image}
              onFiles={(files) => {
                if (files[0]) void selectFile(files[0]);
              }}
            />
            <button
              className="text-link sample-button"
              disabled={sampleBusy || loading}
              onClick={loadSample}
            >
              {sampleBusy ? 'Making a sample…' : 'Try a textured sample'}
            </button>
            <p className="lab-caption">
              Your image stays in this browser. Preview limited to 1200 pixels per side;
              transparency is placed on white for a fair comparison.
            </p>
          </div>
          <div className="lab-controls">
            <label>
              Output format
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="jpeg">JPEG · lossy</option>
                <option value="webp">WebP · lossy</option>
                <option value="png">PNG · lossless</option>
              </select>
            </label>
            <label htmlFor="encoding-quality">
              Encoding quality <output>{format === 'png' ? 'Lossless' : `${quality}%`}</output>
              <input
                id="encoding-quality"
                type="range"
                min="1"
                max="100"
                value={quality}
                disabled={format === 'png'}
                onChange={(e) => setQuality(+e.target.value)}
              />
            </label>
            <p>
              {format === 'png'
                ? 'PNG preserves the prepared pixels. Its encoding ignores the quality slider.'
                : 'Quality is an encoder setting, not a percentage of detail retained. Results vary with the browser and image.'}
            </p>
            <label>
              Inspection zoom
              <select value={zoom} onChange={(e) => setZoom(e.target.value)}>
                <option value="1">Fit</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
              </select>
            </label>
          </div>
        </div>
        <ErrorMessage message={error} />
        {(loading || busy) && <Busy label="Encoding the comparison…" />}
        {result && !busy && (
          <>
            <div className="compression-stats">
              <div>
                <small>PREPARED PNG BASELINE</small>
                <strong>{formatBytes(result.baseline)}</strong>
              </div>
              <div>
                <small>{format.toUpperCase()} RESULT</small>
                <strong>{formatBytes(result.blob.size)}</strong>
              </div>
              <div>
                <small>VS. PNG BASELINE</small>
                <strong>
                  {Math.abs(saving).toFixed(1)}% {saving >= 0 ? 'smaller' : 'larger'}
                </strong>
              </div>
            </div>
            <p className="lab-caption">
              {file?.name} · {result.width} × {result.height} preview pixels. Sizes compare
              encodings of the same prepared pixels, not the original upload.
            </p>
            <div className="comparison-scroll">
              <div
                className="image-comparison"
                style={{
                  width: `${+zoom * 100}%`,
                  aspectRatio: `${result.width}/${result.height}`,
                }}
              >
                <img src={result.encoded} alt="Encoded comparison" />
                <img
                  src={result.original}
                  alt="Prepared lossless baseline"
                  style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                />
                <div className="comparison-line" style={{ left: `${split}%` }} />
                <span className="comparison-tag">PNG BASELINE</span>
                <span className="comparison-tag right">{format.toUpperCase()} RESULT</span>
              </div>
            </div>
            <label htmlFor="comparison-position" className="comparison-control">
              Comparison position <output>{split}%</output>
              <input
                id="comparison-position"
                type="range"
                min="0"
                max="100"
                value={split}
                onChange={(e) => setSplit(+e.target.value)}
              />
            </label>
            <button
              className="button primary"
              onClick={() =>
                downloadBlob(result.blob, `compression-study.${format === 'jpeg' ? 'jpg' : format}`)
              }
            >
              Download {format.toUpperCase()} result
            </button>
          </>
        )}
        {!image && !loading && (
          <div className="lab-empty">
            Start with the textured sample or bring your own image.
            <br />
            <small>Look for texture disappearing as quality drops.</small>
          </div>
        )}
      </section>
      <section className="lesson-notes">
        <div>
          <h2>Choose for the image.</h2>
          <p>
            Photographs and textured scenes can tolerate some loss. Sharp text and flat graphics can
            expose artifacts quickly. A smaller image dimension can save more than another drop in
            quality; this experiment holds the prepared dimensions fixed.
          </p>
          <p>
            Re-encoding an already compressed file can make it larger. Here, the baseline is a fresh
            PNG of the prepared pixels so the comparison stays consistent.
          </p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob">
            How browser image encoding works ↗
          </a>
        </div>
        <div className="lab-challenge">
          <span className="eyebrow">03 / A SMALL CHALLENGE</span>
          <h3>Does quality 50 mean the file will be half the size?</h3>
          <div className="lab-buttons">
            {['Yes', 'No'].map((a) => (
              <button
                key={a}
                className="button secondary"
                aria-pressed={answer === a}
                onClick={() => setAnswer(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <p role="status">
            {answer === null
              ? 'Make a prediction, then try the slider.'
              : answer === 'No'
                ? 'Correct. Quality changes the encoding tradeoff; file size also depends on the image, format, and encoder.'
                : 'Try comparing two quality settings. The relationship between quality and file size is not a fixed ratio.'}
          </p>
        </div>
      </section>
      <Link className="button primary" href="/tools/image-compressor">
        Compress your full-size images ↗
      </Link>
    </>
  );
}
