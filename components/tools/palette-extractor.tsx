'use client';
import { useEffect, useMemo, useState } from 'react';
import { Download, Copy, Check, Palette } from 'lucide-react';
import {
  Busy,
  CopyButton,
  ErrorMessage,
  FileDrop,
  ImagePreview,
  SampleButton,
  useImageFile,
} from '@/components/tool-shared';
import { downloadBlob, extractPalette } from '@/lib/image';
export default function PaletteExtractor() {
  const { file, image, error, loading, selectFile } = useImageFile();
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState('hex');
  const [copied, setCopied] = useState('');
  const [copyError, setCopyError] = useState('');
  const colours = useMemo(() => (image ? extractPalette(image, count) : []), [image, count]);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(''), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  function rgb(hex: string) {
    return `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
  }
  const css = `:root {\n${colours.map((c, i) => `  --color-${i + 1}: ${format === 'hex' ? c : rgb(c)};`).join('\n')}\n}`;
  async function copyColour(c: string) {
    try {
      await navigator.clipboard.writeText(format === 'hex' ? c : rgb(c));
      setCopied(c);
      setCopyError('');
    } catch {
      setCopyError('Clipboard unavailable. You can select and copy the values below.');
    }
  }
  function downloadPalette() {
    const c = document.createElement('canvas');
    c.width = 1500;
    c.height = 1000;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#111210';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#eae8df';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('A little colour discovery.', 70, 100);
    ctx.font = '22px monospace';
    ctx.fillStyle = '#92948b';
    ctx.fillText('DARRKWIZ / YOUR PALETTE', 70, 150);
    const width = 1360 / colours.length;
    colours.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(70 + i * width, 220, width, 560);
      ctx.font = '20px monospace';
      ctx.fillStyle = '#eae8df';
      ctx.fillText(color, 78 + i * width, 830);
    });
    ctx.fillStyle = '#92948b';
    ctx.fillText('Found at darrkwiz.com', 70, 940);
    c.toBlob((b) => {
      if (b) downloadBlob(b, 'darrkwiz-palette.png');
    });
  }
  return (
    <div className="workspace-panel palette-panel">
      <div className="palette-layout">
        <div className="palette-image-side">
          <div className="panel-label">
            <span>01 / FIND YOUR INSPIRATION</span>
            <Palette size={16} />
          </div>
          {image && (
            <div className="palette-image">
              <ImagePreview image={image} />
            </div>
          )}
          <FileDrop
            compact={!!image}
            onFiles={(f) => {
              if (f[0]) void selectFile(f[0]);
            }}
          />
          {!image && <SampleButton onFile={selectFile} />}
          <ErrorMessage message={error} />
          {loading && <Busy label="Finding the good colours…" />}
          {file && <p className="file-name">{file.name}</p>}
        </div>
        <div className="palette-result-side">
          <div className="panel-label">02 / A HAPPY LITTLE DISCOVERY</div>
          <div className="palette-controls">
            <label className="inline-setting">
              Colours
              <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[3, 4, 5, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} colours
                  </option>
                ))}
              </select>
            </label>
            <div className="segmented" aria-label="Colour format">
              {['hex', 'rgb'].map((f) => (
                <button
                  key={f}
                  aria-pressed={format === f}
                  className={format === f ? 'active' : ''}
                  onClick={() => setFormat(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {!image ? (
            <div className="palette-placeholder">
              <div>
                {['#687b59', '#b7c8a3', '#edcf92', '#df956d', '#b25b44'].map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </div>
              <h3>
                A whole mood,
                <br />
                <em>hiding in an image.</em>
              </h3>
              <p>Drop in a photo and see what turns up.</p>
            </div>
          ) : colours.length === 0 ? (
            <p role="status">This image is fully transparent. Try an image with visible colours.</p>
          ) : (
            <>
              <div className="extracted-palette">
                {colours.map((c) => (
                  <button
                    key={c}
                    className="colour-swatch"
                    onClick={() => void copyColour(c)}
                    aria-label={`Copy ${format === 'hex' ? c : rgb(c)}`}
                  >
                    <span style={{ background: c }}>
                      {copied === c ? <Check size={21} /> : <Copy size={18} />}
                    </span>
                    <strong>{format === 'hex' ? c : rgb(c)}</strong>
                    <small>{copied === c ? 'Copied!' : 'Click to copy'}</small>
                  </button>
                ))}
              </div>
              <ErrorMessage message={copyError} />
              <p className="setting-hint">
                {colours.length < count
                  ? `Found ${colours.length} distinct colour${colours.length === 1 ? '' : 's'} in this image. `
                  : ''}
                Colours are sampled from the image; transparent pixels are ignored.
              </p>
              <div className="palette-code">
                <div className="pane-heading">
                  <span>READY FOR YOUR NEXT IDEA</span>
                  <CopyButton text={css} label="Copy CSS" className="text-link" />
                </div>
                <pre>{css}</pre>
              </div>
              <div className="action-group">
                <button className="button primary" onClick={downloadPalette}>
                  <Download size={16} /> Save palette PNG
                </button>
                <button
                  className="button secondary"
                  onClick={() =>
                    downloadBlob(new Blob([css], { type: 'text/css' }), 'darrkwiz-palette.css')
                  }
                >
                  <Download size={16} /> Save CSS
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
