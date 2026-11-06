'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Busy, ErrorMessage, FileDrop, SampleButton, useImageFile } from '@/components/tool-shared';
import { basename, canvasBlob, downloadBlob, fitSize } from '@/lib/image';
const backgrounds = [
  { name: 'Tangerine', colors: ['#ff8452', '#c73c22'] },
  { name: 'Sage', colors: ['#b7c8a3', '#64785e'] },
  { name: 'Lilac', colors: ['#d8c7ea', '#8a73a7'] },
  { name: 'Paper', colors: ['#eeeade', '#d4cfbf'] },
  { name: 'Midnight', colors: ['#303730', '#111210'] },
];
export default function ScreenshotStudio() {
  const { image, file, error, setError, selectFile, loading } = useImageFile();
  const [bg, setBg] = useState(0);
  const [padding, setPadding] = useState(72);
  const [radius, setRadius] = useState(14);
  const [shadow, setShadow] = useState(true);
  const [frame, setFrame] = useState(true);
  const [aspect, setAspect] = useState('auto');
  const [scale, setScale] = useState('1');
  const [busy, setBusy] = useState(false);
  const [dimensions, setDimensions] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current || !image) return;
    const c = canvas.current;
    const ctx = c.getContext('2d')!;
    const fit = fitSize(image.naturalWidth, image.naturalHeight, 1000, 800);
    const bar = frame ? 32 : 0;
    let width = fit.width + padding * 2;
    let height = fit.height + padding * 2 + bar;
    if (aspect === 'square') {
      width = 1200;
      height = 1200;
    }
    if (aspect === 'landscape') {
      width = 1440;
      height = 900;
    }
    if (aspect === 'portrait') {
      width = 1000;
      height = 1250;
    }
    const multiplier = Number(scale);
    c.width = width * multiplier;
    c.height = height * multiplier;
    ctx.scale(multiplier, multiplier);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, backgrounds[bg].colors[0]);
    gradient.addColorStop(1, backgrounds[bg].colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const size = fitSize(
      image.naturalWidth,
      image.naturalHeight,
      width - padding * 2,
      height - padding * 2 - bar,
    );
    const x = (width - size.width) / 2;
    const y = (height - size.height - bar) / 2;
    ctx.save();
    if (shadow) {
      ctx.shadowColor = 'rgba(0,0,0,.35)';
      ctx.shadowBlur = 42;
      ctx.shadowOffsetY = 18;
    }
    ctx.fillStyle = '#252722';
    ctx.beginPath();
    ctx.roundRect(x, y, size.width, size.height + bar, radius);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, size.width, size.height + bar, radius);
    ctx.clip();
    ctx.fillStyle = '#252722';
    ctx.fillRect(x, y, size.width, size.height + bar);
    ctx.drawImage(image, x, y + bar, size.width, size.height);
    if (frame) {
      ['#ff776a', '#e5c478', '#b7c8a3'].forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + 15 + i * 14, y + 16, 3.5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    ctx.restore();
    setDimensions(`${c.width} × ${c.height}`);
  }, [image, bg, padding, radius, shadow, frame, aspect, scale]);
  async function exportImage() {
    if (!canvas.current || !file) return;
    setBusy(true);
    setError('');
    try {
      downloadBlob(await canvasBlob(canvas.current), `${basename(file.name)}-darrkwiz.png`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="workspace-panel">
      <div className="studio-layout">
        <aside className="tool-settings">
          <div className="panel-label">
            <span>01 / MAKE IT YOURS</span>
            <ImageIcon size={16} />
          </div>
          <FileDrop
            compact={!!image}
            onFiles={(files) => {
              if (files[0]) void selectFile(files[0]);
            }}
          />
          {!image && <SampleButton onFile={selectFile} />}
          {file && <p className="file-name">{file.name}</p>}
          <ErrorMessage message={error} />
          {loading && <Busy label="Reading your image…" />}
          <fieldset disabled={!image || loading}>
            <legend className="sr-only">Screenshot settings</legend>
            <div className="setting">
              <span className="field-label">Background</span>
              <div className="background-swatches">
                {backgrounds.map((b, i) => (
                  <button
                    key={b.name}
                    className={bg === i ? 'selected' : ''}
                    style={{ background: `linear-gradient(135deg,${b.colors.join(',')})` }}
                    title={b.name}
                    aria-label={`${b.name} background`}
                    aria-pressed={bg === i}
                    onClick={() => setBg(i)}
                  />
                ))}
              </div>
            </div>
            <label className="setting">
              Canvas shape
              <select value={aspect} onChange={(e) => setAspect(e.target.value)}>
                <option value="auto">Fit image</option>
                <option value="square">Square · 1:1</option>
                <option value="landscape">Landscape · 16:10</option>
                <option value="portrait">Portrait · 4:5</option>
              </select>
            </label>
            <label className="setting" htmlFor="screenshot-padding">
              <span>
                Padding <output>{padding}px</output>
              </span>
              <input
                id="screenshot-padding"
                type="range"
                min="24"
                max="160"
                step="4"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
              />
            </label>
            <label className="setting" htmlFor="screenshot-radius">
              <span>
                Corner radius <output>{radius}px</output>
              </span>
              <input
                id="screenshot-radius"
                type="range"
                min="0"
                max="40"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </label>
            <label className="check-setting">
              <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)} />{' '}
              Browser frame
            </label>
            <label className="check-setting">
              <input
                type="checkbox"
                checked={shadow}
                onChange={(e) => setShadow(e.target.checked)}
              />{' '}
              Soft shadow
            </label>
            <label className="setting">
              Export resolution
              <select value={scale} onChange={(e) => setScale(e.target.value)}>
                <option value="1">1× · Standard</option>
                <option value="2">2× · Extra crisp</option>
              </select>
            </label>
          </fieldset>
          <button
            className="button primary full-width"
            disabled={!image || busy || loading}
            onClick={exportImage}
          >
            {busy ? (
              <Busy label="Exporting…" />
            ) : (
              <>
                <Download size={17} /> Download PNG
              </>
            )}
          </button>
          <button
            className="text-link reset-button"
            disabled={!image}
            onClick={() => {
              setBg(0);
              setPadding(72);
              setRadius(14);
              setShadow(true);
              setFrame(true);
              setAspect('auto');
              setScale('1');
            }}
          >
            <RotateCcw size={13} /> Reset style
          </button>
        </aside>
        <div className="studio-preview">
          <div className="panel-label">
            <span>02 / THE GLOW-UP</span>
            <span>{dimensions && image ? dimensions : 'LIVE PREVIEW'}</span>
          </div>
          <div className="canvas-stage">
            {image ? (
              <canvas ref={canvas} aria-label="Styled screenshot preview" />
            ) : (
              <div className="preview-placeholder">
                <span className="placeholder-star">✳</span>
                <h2>
                  Your screenshot,
                  <br />
                  <em>with a little extra.</em>
                </h2>
                <p>Add an image to give it the good treatment.</p>
              </div>
            )}
          </div>
          <div className="preview-note">
            <span className="status-dot" />{' '}
            {image ? 'Looking good. Ready when you are.' : 'A little polish goes a long way.'}
          </div>
        </div>
      </div>
    </div>
  );
}
