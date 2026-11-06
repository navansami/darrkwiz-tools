'use client';
import { useMemo, useState } from 'react';
import { diffWordsWithSpace, diffLines } from 'diff';
import { ArrowLeftRight, Sparkles, Download } from 'lucide-react';
import { CopyButton } from '@/components/tool-shared';
import { downloadBlob } from '@/lib/image';
export default function TextCompare() {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [mode, setMode] = useState('words');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreSpace, setIgnoreSpace] = useState(false);
  const [compared, setCompared] = useState<{
    before: string;
    after: string;
    mode: string;
    ignoreCase: boolean;
    ignoreSpace: boolean;
  } | null>(null);
  const result = useMemo(() => {
    if (!compared) return null;
    function normalize(t: string) {
      let s = t.replace(/\r\n?/g, '\n');
      if (compared!.ignoreSpace)
        s = s
          .split('\n')
          .map((l) => l.trim().replace(/[\t ]+/g, ' '))
          .join('\n');
      return s;
    }
    const a = normalize(compared.before),
      b = normalize(compared.after);
    const opts = { ignoreCase: compared.ignoreCase, timeout: 1500, maxEditLength: 10000 };
    return compared.mode === 'lines' ? diffLines(a, b, opts) : diffWordsWithSpace(a, b, opts);
  }, [compared]);
  const stale =
    !!compared &&
    (compared.before !== before ||
      compared.after !== after ||
      compared.mode !== mode ||
      compared.ignoreCase !== ignoreCase ||
      compared.ignoreSpace !== ignoreSpace);
  const added = result?.filter((c) => c.added).reduce((n, c) => n + c.count, 0) || 0;
  const removed = result?.filter((c) => c.removed).reduce((n, c) => n + c.count, 0) || 0;
  const changed = added + removed > 0;
  const patch =
    result?.map((c) => `${c.added ? '+ ' : c.removed ? '- ' : '  '}${c.value}`).join('') || '';
  return (
    <div className="workspace-panel text-panel">
      <div className="compare-actions">
        <button
          className="text-link"
          onClick={() => {
            setBefore('Small tools. Big possibilities.\nMake it good.\nKeep making things.');
            setAfter(
              'Small tools. Endless possibilities.\nMake it really good.\nKeep making things.\nA little progress, every day.',
            );
            setCompared(null);
          }}
        >
          <Sparkles size={15} /> Try a sample
        </button>
        <button
          className="text-link"
          disabled={!before && !after}
          onClick={() => {
            setBefore(after);
            setAfter(before);
            setCompared(null);
          }}
        >
          <ArrowLeftRight size={15} /> Swap versions
        </button>
        <button
          className="text-link"
          onClick={() => {
            setBefore('');
            setAfter('');
            setCompared(null);
          }}
        >
          Clear both
        </button>
      </div>
      <div className="text-workbench">
        <div className="text-pane">
          <div className="pane-heading">
            <label htmlFor="original-text">01 / ORIGINAL TEXT</label>
            <span>− BEFORE</span>
          </div>
          <textarea
            id="original-text"
            placeholder="The first version goes here…"
            value={before}
            maxLength={50000}
            onChange={(e) => setBefore(e.target.value)}
            spellCheck={false}
          />
          <div className="text-stats">{before.length.toLocaleString()} / 50,000 characters</div>
        </div>
        <div className="text-pane">
          <div className="pane-heading">
            <label htmlFor="updated-text">02 / UPDATED TEXT</label>
            <span>+ AFTER</span>
          </div>
          <textarea
            id="updated-text"
            placeholder="The new version goes here…"
            value={after}
            maxLength={50000}
            onChange={(e) => setAfter(e.target.value)}
            spellCheck={false}
          />
          <div className="text-stats">{after.length.toLocaleString()} / 50,000 characters</div>
        </div>
      </div>
      <div className="compare-controls">
        <label className="inline-setting">
          Compare by
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="words">Words</option>
            <option value="lines">Lines</option>
          </select>
        </label>
        <label className="check-setting">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
          />{' '}
          Ignore case
        </label>
        <label className="check-setting">
          <input
            type="checkbox"
            checked={ignoreSpace}
            onChange={(e) => setIgnoreSpace(e.target.checked)}
          />{' '}
          Ignore extra spaces
        </label>
        <button
          className="button primary"
          disabled={!before && !after}
          onClick={() => setCompared({ before, after, mode, ignoreCase, ignoreSpace })}
        >
          Find the difference <ArrowLeftRight size={16} />
        </button>
      </div>
      {compared && (
        <div className="comparison-result">
          <div className="results-header">
            <div>
              <span className="eyebrow">03 / THE DIFFERENCE</span>
              <h3>
                {!result
                  ? 'That’s a lot of changes.'
                  : changed
                    ? 'The little changes, revealed.'
                    : 'A perfect match.'}
              </h3>
            </div>
            {!!result && (
              <div className="diff-legend">
                <span className="added-label">+ {added} added</span>
                <span className="removed-label">− {removed} removed</span>
              </div>
            )}
          </div>
          {stale && (
            <p role="status" className="stale-note">
              Your inputs have changed. Compare again to refresh the result.
            </p>
          )}
          {!result ? (
            <p role="alert">
              This comparison exceeded the processing limit. Try smaller sections or compare by
              lines.
            </p>
          ) : (
            <>
              <div className="diff-output" aria-label="Text comparison result">
                {result.map((c, i) => (
                  <span
                    key={i}
                    className={c.added ? 'diff-added' : c.removed ? 'diff-removed' : ''}
                  >
                    {c.added && <span className="sr-only">[Added] </span>}
                    {c.removed && <span className="sr-only">[Removed] </span>}
                    {c.value}
                  </span>
                ))}
              </div>
              <div className="diff-export">
                <CopyButton text={patch} label="Copy comparison" />
                <button
                  className="button secondary"
                  onClick={() =>
                    downloadBlob(
                      new Blob([patch], { type: 'text/plain;charset=utf-8' }),
                      'darrkwiz-comparison.txt',
                    )
                  }
                >
                  <Download size={15} /> Save .txt
                </button>
                <span>+ added · − removed · Case and spacing follow your settings.</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
