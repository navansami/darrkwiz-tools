'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { CopyButton } from '@/components/tool-shared';
const presets: Record<string, number[]> = {
  Ease: [0.25, 0.1, 0.25, 1],
  Linear: [0, 0, 1, 1],
  'Ease in': [0.42, 0, 1, 1],
  'Ease out': [0, 0, 0.58, 1],
  'Ease in out': [0.42, 0, 0.58, 1],
  Overshoot: [0.34, 1.56, 0.64, 1],
};
export default function EasingLab() {
  const [points, setPoints] = useState(presets.Ease),
    [duration, setDuration] = useState(1200),
    [position, setPosition] = useState(50),
    [playing, setPlaying] = useState(false),
    [answer, setAnswer] = useState<string | null>(null);
  const selected = useRef<HTMLDivElement>(null),
    linear = useRef<HTMLDivElement>(null),
    animations = useRef<Animation[]>([]);
  const curve = `cubic-bezier(${points.join(', ')})`;
  function stop() {
    animations.current.forEach((a) => a.cancel());
    animations.current = [];
    setPlaying(false);
  }
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.documentElement.dataset.motion === 'off') {
        animations.current.forEach((a) => a.cancel());
        animations.current = [];
        setPlaying(false);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });
    return () => {
      observer.disconnect();
      animations.current.forEach((a) => a.cancel());
    };
  }, []);
  useEffect(() => {
    animations.current.forEach((a) => a.cancel());
    animations.current = [];
    setPlaying(false);
  }, [points, duration, position]);
  function play() {
    stop();
    setPlaying(true);
    const tracks = [selected.current!, linear.current!];
    animations.current = tracks.map((el, i) =>
      el.animate([{ left: '0%' }, { left: '100%' }], {
        duration,
        easing: i === 0 ? curve : 'linear',
        fill: 'forwards',
      }),
    );
    void Promise.all(animations.current.map((a) => a.finished))
      .then(() => setPlaying(false))
      .catch(() => {});
  }
  function change(i: number, v: number) {
    setPoints((old) => old.map((p, j) => (j === i ? v : p)));
  }
  function drag(e: PointerEvent<SVGSVGElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 300,
      y = ((e.clientY - r.top) / r.height) * 300;
    const handle = Number(e.currentTarget.dataset.handle);
    setPoints((old) =>
      old.map((p, i) =>
        i === handle * 2
          ? Math.round(Math.max(0, Math.min(1, (x - 40) / 220)) * 100) / 100
          : i === handle * 2 + 1
            ? Math.round(Math.max(-0.6, Math.min(1.6, (210 - y) / 110)) * 100) / 100
            : p,
      ),
    );
  }
  function progress(x: number) {
    let lo = 0,
      hi = 1,
      t = 0.5;
    const b = (t: number, a: number, b: number) =>
      3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
    for (let i = 0; i < 30; i++) {
      t = (lo + hi) / 2;
      if (b(t, points[0], points[2]) < x) lo = t;
      else hi = t;
    }
    return b(t, points[1], points[3]);
  }
  const value = progress(position / 100),
    css = `.moving-element {\n  transition: transform ${duration}ms ${curve};\n}\n\n.moving-element.is-moved {\n  transform: translateX(200px);\n}`;
  return (
    <>
      <section className="lesson-intro">
        <span className="eyebrow">01 / THE IDEA</span>
        <h2>Same distance. Different feeling.</h2>
        <p>
          Easing maps elapsed time to animation progress. Linear moves steadily. A curve can start
          slowly, land gently, or overshoot. The graph’s horizontal axis is time; its vertical axis
          is progress.
        </p>
      </section>
      <section className="lab-panel">
        <div className="lab-panel-top">
          <span className="eyebrow">02 / SHAPE THE MOTION</span>
          <button
            className="button secondary"
            onClick={() => {
              stop();
              setPoints(presets.Ease);
              setDuration(1200);
              setPosition(50);
              setAnswer(null);
            }}
          >
            Reset playground
          </button>
        </div>
        <div className="lab-buttons">
          {Object.entries(presets).map(([name, p]) => (
            <button
              className="button secondary"
              key={name}
              aria-pressed={p.every((n, i) => points[i] === n)}
              onClick={() => setPoints(p)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="lab-columns easing-columns">
          <div>
            <svg
              className="bezier-graph"
              viewBox="0 0 300 300"
              aria-label="Cubic Bézier curve. Drag either control point or use the sliders."
              onPointerMove={drag}
              onPointerDown={(e) => {
                const target = e.target as SVGElement;
                if (target.dataset.handle !== undefined) {
                  e.currentTarget.dataset.handle = target.dataset.handle;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
              }}
            >
              <defs>
                <pattern id="curve-grid" width="22" height="14" patternUnits="userSpaceOnUse">
                  <path d="M 22 0 L 0 0 0 14" fill="none" stroke="#343630" strokeWidth=".5" />
                </pattern>
              </defs>
              <rect x="40" y="100" width="220" height="110" fill="url(#curve-grid)" />
              <path d="M40 210 L260 100" stroke="#777" strokeDasharray="4 4" />
              <path
                d={`M40 210 L${40 + points[0] * 220} ${210 - points[1] * 110} M260 100 L${40 + points[2] * 220} ${210 - points[3] * 110}`}
                stroke="#92948b"
                fill="none"
              />
              <path
                d={`M40 210 C${40 + points[0] * 220} ${210 - points[1] * 110} ${40 + points[2] * 220} ${210 - points[3] * 110} 260 100`}
                stroke="#ff5b2d"
                strokeWidth="3"
                fill="none"
              />
              {[0, 1].map((i) => (
                <circle
                  key={i}
                  data-handle={i}
                  cx={40 + points[i * 2] * 220}
                  cy={210 - points[i * 2 + 1] * 110}
                  r="9"
                  fill={i === 0 ? '#f1cb7a' : '#a7c6cf'}
                  stroke="#111210"
                  strokeWidth="2"
                />
              ))}
              <text x="150" y="296" textAnchor="middle">
                TIME →
              </text>
              <text x="12" y="150" transform="rotate(-90 12 150)" textAnchor="middle">
                PROGRESS →
              </text>
            </svg>
            <p className="lab-caption">
              Drag the yellow and blue handles. The dashed line is linear.
            </p>
          </div>
          <div className="lab-controls">
            {['Control 1 X', 'Control 1 Y', 'Control 2 X', 'Control 2 Y'].map((label, i) => (
              <label key={label} htmlFor={`curve-${i}`}>
                {label}
                <output>{points[i].toFixed(2)}</output>
                <input
                  id={`curve-${i}`}
                  type="range"
                  min={i % 2 ? -0.6 : 0}
                  max={i % 2 ? 1.6 : 1}
                  step="0.01"
                  value={points[i]}
                  onChange={(e) => change(i, +e.target.value)}
                />
              </label>
            ))}
            <label htmlFor="motion-duration">
              Duration <output>{duration} ms</output>
              <input
                id="motion-duration"
                type="range"
                min="200"
                max="3000"
                step="100"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="motion-preview">
          <div className="motion-lane">
            <span>Your curve</span>
            <div className="motion-track">
              <div ref={selected} className="motion-dot" style={{ left: `${value * 100}%` }} />
            </div>
          </div>
          <div className="motion-lane">
            <span>Linear</span>
            <div className="motion-track">
              <div
                ref={linear}
                className="motion-dot linear-dot"
                style={{ left: `${position}%` }}
              />
            </div>
          </div>
        </div>
        <div className="lab-buttons">
          <button className="button primary" onClick={play}>
            Play comparison
          </button>
          <button className="button secondary" onClick={stop}>
            Stop
          </button>
          <span role="status">{playing ? 'Playing one comparison…' : 'Ready to explore'}</span>
        </div>
        <p className="lab-caption">
          Playback starts only when you press Play. Pausing motion in the header stops playback. You
          can always inspect the curve with the time slider.
        </p>
        <label htmlFor="elapsed-time" className="comparison-control">
          Inspect elapsed time{' '}
          <output>
            {position}% time → {(value * 100).toFixed(1)}% progress
          </output>
          <input
            id="elapsed-time"
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(+e.target.value)}
          />
        </label>
        <div className="lab-export">
          <pre>{css}</pre>
          <CopyButton text={css} label="Copy easing CSS" />
        </div>
        <p className="lab-caption">
          Add or remove the is-moved class to trigger the transition. Adjust 200px to suit your
          layout.
        </p>
      </section>
      <section className="lesson-notes">
        <div>
          <h2>Read the curve.</h2>
          <p>
            A flatter section means less progress in the same amount of time. A steeper section
            means faster change. X coordinates stay between 0 and 1; Y coordinates can leave that
            range to create anticipation or overshoot.
          </p>
          <p>
            These are timing curves, not physical springs. Try the same curve at different durations
            before choosing a motion for your interface.
          </p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/cubic-bezier">
            Explore the cubic-bezier() reference ↗
          </a>
        </div>
        <div className="lab-challenge">
          <span className="eyebrow">03 / A SMALL CHALLENGE</span>
          <h3>Which preset starts slowly and then speeds up?</h3>
          <div className="lab-buttons">
            {['Ease in', 'Ease out', 'Linear'].map((a) => (
              <button
                className="button secondary"
                key={a}
                aria-pressed={answer === a}
                onClick={() => setAnswer(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <p role="status">
            {answer === null
              ? 'Compare the presets before choosing.'
              : answer === 'Ease in'
                ? 'Yes. Ease in begins slowly and accelerates toward the end.'
                : 'Try Ease in and watch the first part of the track. Linear stays steady; Ease out slows toward the finish.'}
          </p>
        </div>
      </section>
    </>
  );
}
