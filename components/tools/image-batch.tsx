'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, X, Image as ImageIcon, Check, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { Busy, ErrorMessage, FileDrop, SampleButton } from '@/components/tool-shared';
import { basename, canvasBlob, downloadBlob, fitSize, formatBytes, loadImage } from '@/lib/image';
type Result = { blob: Blob; name: string; url: string; width: number; height: number };
type Entry = { id: string; file: File; preview: string; result?: Result; error?: string };
export default function ImageBatch({ mode }: { mode: 'compress' | 'convert' }) {
  const compress = mode === 'compress';
  const [entries, setEntries] = useState<Entry[]>([]);
  const [format, setFormat] = useState(compress ? 'webp' : 'png');
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState('1920');
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const urls = useRef(new Set<string>());
  const inputVersion = useRef(0);
  useEffect(
    () => () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );
  const addUrl = (blob: Blob) => {
    const u = URL.createObjectURL(blob);
    urls.current.add(u);
    return u;
  };
  const revoke = (url: string) => {
    URL.revokeObjectURL(url);
    urls.current.delete(url);
  };
  async function addFiles(files: File[]) {
    setError('');
    const accepted: Entry[] = [];
    for (const file of files) {
      try {
        await loadImage(file);
        accepted.push({ id: crypto.randomUUID(), file, preview: addUrl(file) });
      } catch (e) {
        setError(`${file.name}: ${(e as Error).message}`);
      }
    }
    setEntries((old) => {
      const all = [...old, ...accepted];
      all.slice(20).forEach((e) => revoke(e.preview));
      return all.slice(0, 20);
    });
  }
  function invalidate() {
    inputVersion.current++;
    setEntries((old) =>
      old.map((e) => {
        if (e.result) revoke(e.result.url);
        return { ...e, result: undefined, error: undefined };
      }),
    );
    setProgress(0);
  }
  async function process() {
    if (busy) return;
    setBusy(true);
    setError('');
    setProgress(0);
    const version = inputVersion.current;
    const snapshot = entries;
    try {
      for (let i = 0; i < snapshot.length; i++) {
        const entry = snapshot[i];
        let result: Result | undefined;
        let failure: string | undefined;
        try {
          const img = await loadImage(entry.file);
          const size = compress
            ? maxWidth === 'original'
              ? { width: img.naturalWidth, height: img.naturalHeight }
              : fitSize(img.naturalWidth, img.naturalHeight, Number(maxWidth), Number(maxWidth))
            : fitSize(img.naturalWidth, img.naturalHeight, 8192, 8192);
          const c = document.createElement('canvas');
          c.width = size.width;
          c.height = size.height;
          const ctx = c.getContext('2d')!;
          if (format === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.width, c.height);
          }
          ctx.drawImage(img, 0, 0, c.width, c.height);
          let blob = await canvasBlob(c, `image/${format}`, quality / 100);
          let name = `${basename(entry.file.name)}-${compress ? 'small' : 'converted'}.${format === 'jpeg' ? 'jpg' : format}`;
          if (
            compress &&
            blob.size > entry.file.size &&
            entry.file.type === blob.type &&
            size.width === img.naturalWidth &&
            size.height === img.naturalHeight
          ) {
            blob = entry.file;
            name = entry.file.name;
          }
          result = { blob, name, url: addUrl(blob), width: c.width, height: c.height };
        } catch (e) {
          failure = (e as Error).message;
        }
        if (version !== inputVersion.current) {
          if (result) revoke(result.url);
          break;
        }
        setEntries((old) =>
          old.map((e) => {
            if (e.id !== entry.id) return e;
            if (e.result) revoke(e.result.url);
            return { ...e, result, error: failure };
          }),
        );
        setProgress(i + 1);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function downloadAll() {
    setZipping(true);
    setError('');
    try {
      const zip = new JSZip();
      entries.forEach((e, i) => {
        if (e.result) zip.file(`${String(i + 1).padStart(2, '0')}-${e.result.name}`, e.result.blob);
      });
      downloadBlob(
        await zip.generateAsync({ type: 'blob' }),
        `darrkwiz-${compress ? 'compressed' : 'converted'}-images.zip`,
      );
    } catch {
      setError('Could not create the ZIP. Try downloading images individually.');
    } finally {
      setZipping(false);
    }
  }
  const finished = entries.filter((e) => e.result);
  const before = finished.reduce((n, e) => n + e.file.size, 0);
  const after = finished.reduce((n, e) => n + (e.result?.blob.size || 0), 0);
  const saved = before ? Math.round((1 - after / before) * 100) : 0;
  return (
    <div className="workspace-panel batch-panel">
      <div className="batch-intro">
        <div>
          <div className="panel-label">01 / DROP IT LIKE IT’S BIG</div>
          <FileDrop
            multiple
            onFiles={(f) => {
              if (!busy) void addFiles(f);
            }}
          />
          {!entries.length && <SampleButton onFile={(f) => void addFiles([f])} />}
        </div>
        <div className="batch-settings">
          <div className="panel-label">02 / THE DETAILS</div>
          <fieldset disabled={busy}>
            <legend className="sr-only">Image export settings</legend>
            <label className="setting">
              Output format
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                  invalidate();
                }}
              >
                <option value="webp">WebP · Small & modern</option>
                <option value="jpeg">JPEG · Widely supported</option>
                <option value="png">PNG · Lossless</option>
              </select>
            </label>
            {compress && (
              <label className="setting">
                Maximum dimensions
                <select
                  value={maxWidth}
                  onChange={(e) => {
                    setMaxWidth(e.target.value);
                    invalidate();
                  }}
                >
                  <option value="original">Keep original size</option>
                  <option value="3840">Fit within 3840 × 3840</option>
                  <option value="1920">Fit within 1920 × 1920</option>
                  <option value="1280">Fit within 1280 × 1280</option>
                  <option value="800">Fit within 800 × 800</option>
                </select>
              </label>
            )}
            {format !== 'png' && (
              <label className="setting" htmlFor="image-quality">
                <span>
                  Quality <output>{quality}%</output>
                </span>
                <input
                  id="image-quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    invalidate();
                  }}
                />
              </label>
            )}
            <p className="setting-hint">
              {format === 'png'
                ? 'PNG keeps full quality and transparency; files may be larger.'
                : format === 'jpeg'
                  ? 'Transparent areas become white in JPEG.'
                  : 'WebP keeps transparency with efficient compression.'}
              {!compress && ' Images over 8192px are scaled down for browser reliability.'}
            </p>
          </fieldset>
          <button
            className="button primary full-width"
            disabled={!entries.length || busy}
            onClick={process}
          >
            {busy ? (
              <Busy label={`Processing ${progress + 1} of ${entries.length}…`} />
            ) : (
              <>
                <ImageIcon size={17} />
                {compress ? 'Compress' : 'Convert'}{' '}
                {entries.length
                  ? `${entries.length} image${entries.length > 1 ? 's' : ''}`
                  : 'images'}
              </>
            )}
          </button>
        </div>
      </div>
      <ErrorMessage message={error} />
      {entries.length > 0 && (
        <div className="batch-results">
          <div className="results-header">
            <div>
              <span className="eyebrow">03 / THE GOOD STUFF</span>
              <h3>
                {finished.length
                  ? `${finished.length} image${finished.length > 1 ? 's' : ''} ready`
                  : `${entries.length} image${entries.length > 1 ? 's' : ''} in the queue`}
              </h3>
            </div>
            {finished.length > 0 && (
              <button className="button secondary" disabled={zipping || busy} onClick={downloadAll}>
                {zipping ? (
                  <Busy label="Packing…" />
                ) : (
                  <>
                    <Archive size={17} /> Download ZIP
                  </>
                )}
              </button>
            )}
          </div>
          {finished.length > 0 && (
            <div className="batch-summary" role="status">
              <Check size={17} />
              <span>
                {formatBytes(before)} → {formatBytes(after)}{' '}
                {compress
                  ? `· ${saved >= 0 ? `${saved}% lighter` : `${Math.abs(saved)}% larger — try a lower quality or smaller size`}`
                  : ''}
              </span>
            </div>
          )}
          <div className="batch-list">
            {entries.map((e) => (
              <div className="batch-row" key={e.id}>
                <img src={e.preview} alt="" />
                <div className="batch-file-info">
                  <strong>{e.file.name}</strong>
                  <span>
                    {formatBytes(e.file.size)}
                    {e.result && (
                      <>
                        {' '}
                        → <b>{formatBytes(e.result.blob.size)}</b> · {e.result.width} ×{' '}
                        {e.result.height}
                      </>
                    )}
                  </span>
                  {e.error && (
                    <span className="file-error" role="alert">
                      {e.error}
                    </span>
                  )}
                </div>
                {e.result && (
                  <button
                    className="icon-button"
                    aria-label={`Download ${e.result.name}`}
                    disabled={busy}
                    onClick={() => downloadBlob(e.result!.blob, e.result!.name)}
                  >
                    <Download size={18} />
                  </button>
                )}
                <button
                  className="icon-button"
                  aria-label={`Remove ${e.file.name}`}
                  disabled={busy}
                  onClick={() => {
                    revoke(e.preview);
                    if (e.result) revoke(e.result.url);
                    setEntries((old) => old.filter((x) => x.id !== e.id));
                  }}
                >
                  <X size={17} />
                </button>
              </div>
            ))}
          </div>
          <p className="setting-hint">
            {compress
              ? 'Images are never upscaled. Results depend on the original image and format.'
              : 'Converting a file does not restore quality lost in the original.'}
          </p>
        </div>
      )}
    </div>
  );
}
