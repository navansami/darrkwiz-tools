'use client';
import { useMemo, useState } from 'react';
import { Download, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { CopyButton } from '@/components/tool-shared';
import { cleanText, defaultCleanOptions, type CleanOptions, wordCount } from '@/lib/text';
import { downloadBlob } from '@/lib/image';
const sample =
  '  Small   tools.    Big possibilities.  \n\n  A little less   busywork.  \nA lot more   making.\nA lot more   making.\n\n“Make something you wish existed.”  ';
const options: { key: Exclude<keyof CleanOptions, 'case'>; label: string; hint: string }[] = [
  {
    key: 'trim',
    label: 'Trim edges',
    hint: 'Remove whitespace at the start and end of each line.',
  },
  {
    key: 'spaces',
    label: 'Fix extra spaces',
    hint: 'Turn tabs and repeated spaces into a single space.',
  },
  {
    key: 'lines',
    label: 'Join broken lines',
    hint: 'Reconnect wrapped text while preserving blank paragraphs.',
  },
  {
    key: 'empty',
    label: 'Remove empty lines',
    hint: 'Keep only the lines that have something to say.',
  },
  {
    key: 'duplicates',
    label: 'Remove duplicate lines',
    hint: 'Keep the first occurrence of each identical line.',
  },
  {
    key: 'quotes',
    label: 'Straighten quotes',
    hint: 'Replace curly quotes and non-breaking spaces.',
  },
];
export default function TextCleaner() {
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<CleanOptions>(defaultCleanOptions);
  const output = useMemo(() => cleanText(input, settings), [input, settings]);
  return (
    <div className="workspace-panel text-panel">
      <div className="text-workbench">
        <div className="text-pane">
          <div className="pane-heading">
            <label htmlFor="messy-text">01 / THE BEFORE</label>
            <button className="text-link" onClick={() => setInput(sample)}>
              <Sparkles size={14} /> Try a sample
            </button>
          </div>
          <textarea
            id="messy-text"
            value={input}
            maxLength={250000}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your slightly chaotic text here…"
            spellCheck={false}
          />
          <div className="text-stats">
            <span>
              {wordCount(input)} words · {input.length.toLocaleString()} characters
            </span>
            <button disabled={!input} className="text-link" onClick={() => setInput('')}>
              Clear
            </button>
          </div>
        </div>
        <div className="text-pane output-pane">
          <div className="pane-heading">
            <label htmlFor="clean-text">02 / A FRESH START</label>
            <ArrowRight size={16} />
          </div>
          <textarea
            id="clean-text"
            readOnly
            value={output}
            placeholder="Your cleaned-up text will appear here. Ah, better."
            spellCheck={false}
          />
          <div className="text-stats" role="status">
            <span>
              {wordCount(output)} words · {output.length.toLocaleString()} characters
            </span>
            <span>
              {Math.max(0, input.length - output.length).toLocaleString()} characters tidied
            </span>
          </div>
        </div>
      </div>
      <div className="cleaner-settings">
        <div className="panel-label">A LITTLE HOUSEKEEPING · UPDATES AS YOU TYPE</div>
        <div className="clean-options">
          {options.map((o) => (
            <label key={o.key} title={o.hint} className="clean-option">
              <input
                type="checkbox"
                checked={settings[o.key]}
                onChange={(e) => setSettings({ ...settings, [o.key]: e.target.checked })}
              />
              <span>
                {o.label}
                <small>{o.hint}</small>
              </span>
            </label>
          ))}
        </div>
        <div className="cleaner-bottom">
          <label className="inline-setting">
            Letter case
            <select
              value={settings.case}
              onChange={(e) =>
                setSettings({ ...settings, case: e.target.value as CleanOptions['case'] })
              }
            >
              <option value="unchanged">Leave it as it is</option>
              <option value="lower">lowercase</option>
              <option value="upper">UPPERCASE</option>
              <option value="sentence">Sentence case</option>
            </select>
          </label>
          <button className="text-link" onClick={() => setSettings(defaultCleanOptions)}>
            <RotateCcw size={14} /> Reset options
          </button>
          <div className="action-group">
            <button
              className="button secondary"
              disabled={!output}
              onClick={() =>
                downloadBlob(
                  new Blob([output], { type: 'text/plain;charset=utf-8' }),
                  'darrkwiz-clean-text.txt',
                )
              }
            >
              <Download size={16} /> Save .txt
            </button>
            <CopyButton text={output} label="Copy clean text" className="button primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
