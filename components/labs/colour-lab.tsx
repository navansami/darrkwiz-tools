'use client';
import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/tool-shared';
const harmonies = {
  complementary: [0, 180],
  analogous: [0, 30, -30],
  triadic: [0, 120, 240],
  square: [0, 90, 180, 270],
};
type Harmony = keyof typeof harmonies | 'custom';
const wrap = (h: number) => ((h % 360) + 360) % 360;
const explanations = {
  complementary:
    'Opposite hues, 180° apart. Try using one as a main colour and the other as an accent.',
  analogous:
    'Neighbours, 30° to either side. They share a similar hue family and can create a quieter palette.',
  triadic:
    'Three hues spaced 120° apart. Start with one dominant colour and use the others more sparingly.',
  square: 'Four hues spaced 90° apart. Try one dominant colour, with the other three as accents.',
  custom:
    'Move each picker independently to explore your own relationships. Base hue rotates the whole palette.',
};
function hex(h: number, s: number, l: number) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  return (
    '#' +
    [0, 8, 4]
      .map((n) => {
        const k = (n + h / 30) % 12;
        return Math.round(255 * (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
          .toString(16)
          .padStart(2, '0');
      })
      .join('')
      .toUpperCase()
  );
}
export default function ColourLab() {
  const [hue, setHue] = useState(18),
    [saturation, setSaturation] = useState(75),
    [lightness, setLightness] = useState(55);
  const [harmony, setHarmony] = useState<Harmony>('complementary');
  const [answer, setAnswer] = useState<number | null>(null);
  const [customOffsets, setCustomOffsets] = useState<number[]>([0, 180]);
  const draggingPicker = useRef<number | null>(null);
  const offsets = harmony === 'custom' ? customOffsets : harmonies[harmony];
  const hues = offsets.map((o) => wrap(hue + o));
  function editPicker(index: number, value: number) {
    const next = hues.map((h, i) => (i === index ? wrap(value) : h));
    setHue(next[0]);
    setCustomOffsets(next.map((h) => wrap(h - next[0])));
    setHarmony('custom');
  }
  function chooseHarmony(next: Harmony) {
    if (next === 'custom') setCustomOffsets([...offsets]);
    setHarmony(next);
  }
  const colours = hues.map((h) => hex(h, saturation, lightness));
  function point(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const angle = Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    const value = wrap(Math.round((angle * 180) / Math.PI + 90));
    if (draggingPicker.current === null) setHue(value);
    else editPicker(draggingPicker.current, value);
  }
  function reset() {
    setHue(18);
    setSaturation(75);
    setLightness(55);
    setHarmony('complementary');
    setCustomOffsets([0, 180]);
    draggingPicker.current = null;
    setAnswer(null);
  }
  return (
    <>
      <section className="lesson-intro">
        <span className="eyebrow">01 / THE IDEA</span>
        <h2>Colour is a relationship.</h2>
        <p>
          A hue is a position on a colour wheel. Rotate one colour and the relationships move with
          it. This lab uses the digital HSL wheel: red at 0°, green at 120°, and blue at 240°. It
          differs from a traditional paint colour wheel.
        </p>
      </section>
      <section className="lab-panel">
        <div className="lab-panel-top">
          <span className="eyebrow">02 / MOVE AROUND THE WHEEL</span>
          <button className="button secondary" onClick={reset}>
            Reset lab
          </button>
        </div>
        <div className="lab-columns">
          <div className="wheel-area">
            <div
              className="colour-wheel"
              style={{
                background: `conic-gradient(${Array.from({ length: 13 }, (_, i) => `hsl(${i * 30} ${saturation}% ${lightness}%)`).join(',')})`,
              }}
              onPointerDown={(e) => {
                const marker = (e.target as HTMLElement).closest<HTMLElement>('[data-picker]');
                draggingPicker.current = marker ? Number(marker.dataset.picker) : null;
                e.currentTarget.setPointerCapture(e.pointerId);
                point(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) point(e);
              }}
              role="group"
              aria-label="Colour wheel pickers"
            >
              <div className="wheel-centre">
                <strong>{hue}°</strong>
                <span>BASE HUE</span>
              </div>
              {hues.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  data-picker={i}
                  aria-label={`Colour ${i + 1} picker, ${h} degrees`}
                  onKeyDown={(e) => {
                    if (['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'].includes(e.key)) {
                      e.preventDefault();
                      editPicker(
                        i,
                        h +
                          (['ArrowLeft', 'ArrowDown'].includes(e.key) ? -1 : 1) *
                            (e.shiftKey ? 10 : 1),
                      );
                    }
                  }}
                  className="wheel-marker"
                  style={{
                    left: `${50 + 41 * Math.sin((h * Math.PI) / 180)}%`,
                    top: `${50 - 41 * Math.cos((h * Math.PI) / 180)}%`,
                    background: colours[i],
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="lab-caption">
              Drag a numbered picker to edit its hue. Drag the wheel background to rotate all
              colours. You can also use the sliders or arrow keys on a picker.
            </p>
          </div>
          <div className="lab-controls">
            <label>
              Number of pickers
              <select
                value={hues.length}
                onChange={(e) =>
                  chooseHarmony(
                    ({ 2: 'complementary', 3: 'triadic', 4: 'square' } as const)[
                      Number(e.target.value) as 2 | 3 | 4
                    ],
                  )
                }
              >
                <option value="2">2 pickers</option>
                <option value="3">3 pickers</option>
                <option value="4">4 pickers</option>
              </select>
            </label>
            <label>
              Colour relationship
              <select value={harmony} onChange={(e) => chooseHarmony(e.target.value as Harmony)}>
                {Object.keys(harmonies).map((k) => (
                  <option key={k} value={k}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </option>
                ))}
                <option value="custom">Custom · independent pickers</option>
              </select>
            </label>
            <p>{explanations[harmony]}</p>
            <label htmlFor="colour-hue">
              Base hue <output>{hue}°</output>
              <input
                type="range"
                min="0"
                max="359"
                id="colour-hue"
                value={hue}
                onChange={(e) => setHue(+e.target.value)}
              />
            </label>
            <label htmlFor="colour-saturation">
              Saturation <output>{saturation}%</output>
              <input
                type="range"
                min="0"
                max="100"
                id="colour-saturation"
                value={saturation}
                onChange={(e) => setSaturation(+e.target.value)}
              />
            </label>
            <label htmlFor="colour-lightness">
              Lightness <output>{lightness}%</output>
              <input
                type="range"
                min="5"
                max="95"
                id="colour-lightness"
                value={lightness}
                onChange={(e) => setLightness(+e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="lab-swatches">
          {colours.map((c, i) => (
            <div className="lab-swatch" key={i}>
              <div style={{ background: c }} />
              <strong>{c}</strong>
              <small>
                {hues[i]}° · {i === 0 ? 'Base' : 'Related'}
              </small>
              <label className="picker-hue" htmlFor={`picker-hue-${i}`}>
                Hue for colour {i + 1}
                <input
                  id={`picker-hue-${i}`}
                  type="range"
                  min="0"
                  max="359"
                  value={hues[i]}
                  onChange={(e) => editPicker(i, +e.target.value)}
                />
              </label>
              <CopyButton text={c} label={`Copy colour ${i + 1}`} />
            </div>
          ))}
        </div>
        <div className="lab-export">
          <pre>{`:root {\n${colours.map((c, i) => `  --colour-${i + 1}: ${c};`).join('\n')}\n}`}</pre>
          <CopyButton
            text={`:root {\n${colours.map((c, i) => `  --colour-${i + 1}: ${c};`).join('\n')}\n}`}
            label="Copy palette CSS"
          />
        </div>
      </section>
      <section className="lesson-notes">
        <div>
          <h2>Hue isn’t the whole story.</h2>
          <p>
            Saturation controls the intensity of the hue. Lightness moves it toward black or white.
            Try lowering saturation: the relationship stays the same, but the palette feels
            different.
          </p>
          <p>
            Equal HSL lightness does not mean equal perceived brightness. A harmonious palette also
            needs readable contrast; these relationships alone do not guarantee accessible text.
          </p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/hsl">
            Read the HSL reference ↗
          </a>
        </div>
        <div className="lab-challenge">
          <span className="eyebrow">03 / A SMALL CHALLENGE</span>
          <h3>A hue is at 30°. Where is its complement?</h3>
          <div className="lab-buttons">
            {[60, 180, 210].map((n) => (
              <button
                key={n}
                className="button secondary"
                onClick={() => setAnswer(n)}
                aria-pressed={answer === n}
              >
                {n}°
              </button>
            ))}
          </div>
          <p role="status">
            {answer === null
              ? 'Think halfway around the wheel.'
              : answer === 210
                ? 'Exactly. 30° + 180° = 210°. Opposite sides of the wheel.'
                : 'Try again: a complement is 180° away from the starting hue.'}
          </p>
        </div>
      </section>
      <Link className="button primary" href="/tools/palette-extractor">
        Find a palette in your own image ↗
      </Link>
    </>
  );
}
