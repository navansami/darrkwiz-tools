'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Search,
  X,
  ShieldCheck,
  Zap,
  Heart,
  Sparkles,
  MoveUpRight,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { tools, type Tool } from '@/lib/tools';
const palettes = [
  ['#ff5b2d', '#e9c798', '#eae8df', '#a8b497', '#343630'],
  ['#c8a9d7', '#7f8e73', '#f1cb7a', '#eae8df', '#a0523c'],
  ['#a7c6cf', '#ff8057', '#dbd5bb', '#5e7060', '#ebc4c4'],
];
export function ToolArt({ type }: { type: Tool['icon'] }) {
  if (type === 'frame')
    return (
      <div className="art-screenshot">
        <div className="mini-window">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <div className="mini-picture">
            <span>
              Make
              <br />
              <em>something.</em>
            </span>
            <b className="art-star">✳</b>
          </div>
        </div>
        <span className="art-badge">a little glow-up ↗</span>
      </div>
    );
  if (type === 'compress')
    return (
      <div className="art-compress">
        <div className="file-stack">
          <div className="file-back" />
          <div className="file-front">
            <ImageIcon size={29} strokeWidth={1.3} />
            <span>big-idea.jpg</span>
            <b>2.4 MB</b>
          </div>
        </div>
        <span className="compression-arrow">↘</span>
        <div className="tiny-file">
          <ImageIcon size={22} />
          <b>248 KB</b>
          <span>same energy.</span>
        </div>
        <span className="saving-tag">↓ 90% lighter</span>
      </div>
    );
  if (type === 'convert')
    return (
      <div className="art-convert">
        <span className="format format-png">.png</span>
        <span className="convert-orbit">↔</span>
        <span className="format format-webp">.webp</span>
        <span className="format format-jpg">.jpg</span>
        <span className="convert-caption">NEW FORMAT. STILL YOU.</span>
      </div>
    );
  if (type === 'text')
    return (
      <div className="art-text">
        <div className="messy-text">
          a little&nbsp;&nbsp;&nbsp;messy.
          <br />
          <span>we’ve&nbsp; all&nbsp;&nbsp; been there.</span>
        </div>
        <div className="text-divider">
          <span />
          <Sparkles size={18} />
          <span />
        </div>
        <div className="clean-text">
          A little more <em>together.</em>
          <Check size={19} />
        </div>
      </div>
    );
  if (type === 'compare')
    return (
      <div className="art-compare">
        <div className="diff-line">
          <span>01</span> Big ideas start small.
        </div>
        <div className="diff-line removed">
          <span>−</span> Make it good.
        </div>
        <div className="diff-line added">
          <span>+</span> Make it <b>really</b> good.
        </div>
        <div className="diff-line">
          <span>04</span> Keep making things.
        </div>
        <span className="diff-caption">THE DETAILS MAKE THE DIFFERENCE.</span>
      </div>
    );
  return (
    <div className="art-palette">
      <div className="palette-fan">
        {['#687b59', '#b7c8a3', '#edcf92', '#df956d', '#b25b44'].map((c, i) => (
          <span key={c} style={{ background: c, transform: `rotate(${(i - 2) * 13}deg)` }}>
            <small>{c.toUpperCase()}</small>
          </span>
        ))}
      </div>
      <span className="palette-caption">a happy little discovery.</span>
    </div>
  );
}
export function Home() {
  const [category, setCategory] = useState('All tools');
  const [query, setQuery] = useState('');
  const [palette, setPalette] = useState(0);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        search.current?.focus();
        document.getElementById('tools')?.scrollIntoView();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.tool-card, .about-copy, .about-art, .principles > div',
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = 'visible';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.dataset.reveal = 'waiting';
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [category, query]);
  const filtered = tools.filter(
    (t) =>
      (category === 'All tools' || t.category === category) &&
      `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main id="main">
      <section className="hero wrap" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> THE INTERNET’S HANDY LITTLE CORNER
          </div>
          <h1>
            <span>SMALL TOOLS.</span>
            <span>
              BIG <em>possibilities.</em>
            </span>
          </h1>
          <p>
            For the little things between you and your next big thing.
            <br className="desktop-break" /> A collection of useful tools. A healthy dose of play.
          </p>
          <div className="hero-cta">
            <a href="#tools" className="button primary">
              Find your next favourite tool <ArrowDown size={18} />
            </a>
            <span>
              FREE TO USE.
              <br />
              YOURS TO EXPLORE.
            </span>
          </div>
        </div>
        <div className="hero-playground" aria-label="A playful preview of the Darrkwiz toolbox">
          <span className="playground-label">A FEW THINGS WE CAN HELP WITH ↘</span>
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <span className="floating-plus plus-one" aria-hidden="true">
            +
          </span>
          <span className="floating-plus plus-two" aria-hidden="true">
            +
          </span>
          <span className="hero-spark" aria-hidden="true">
            ✳
          </span>
          <Link href="/tools/screenshot-studio" className="hero-window">
            <div className="hero-window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>your-next-big-thing.png</span>
              <ArrowUpRight size={14} />
            </div>
            <div className="hero-window-body">
              <div className="hero-photo">
                <span>
                  LESS FRICTION.
                  <br />
                  <em>More magic.</em>
                </span>
                <span className="photo-star" aria-hidden="true">
                  ✳
                </span>
                <small>IDEAS LOOK GOOD ON YOU.</small>
              </div>
            </div>
            <div className="window-bottom">
              <span>
                <span className="status-dot" /> LOOKING SHARP
              </span>
              <span>↗</span>
            </div>
          </Link>
          <button
            className="hero-palette"
            onClick={() => setPalette((palette + 1) % palettes.length)}
            aria-label="Shuffle the preview colour palette"
          >
            <span>
              FOUND YOUR COLOURS.
              <Sparkles size={13} />
            </span>
            <div>
              {palettes[palette].map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </div>
            <small>click for a little colour therapy ↗</small>
          </button>
          <div className="hero-text-chip">
            <span className="chip-icon">
              <Check size={17} />
            </span>
            <div>
              Messy text?<strong>Consider it handled.</strong>
            </div>
            <Sparkles size={20} />
          </div>
          <span className="hand-note">
            little tools,
            <br />
            big main-character energy.<span>⤴</span>
          </span>
        </div>
        <div className="hero-foot">
          <span>
            <span className="tiny-cross">✳</span> BUILT OUT OF CURIOSITY. MADE TO BE USEFUL.
          </span>
          <span>
            SCROLL TO GET INTO IT <ArrowDown size={14} />
          </span>
        </div>
      </section>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              LESS BUSYWORK <b>✳</b> MORE MAKING <b>✳</b> NO SIGN-UPS <b>✳</b> JUST GOOD TOOLS{' '}
              <b>✳</b>
            </span>
          ))}
        </div>
      </div>
      <section id="tools" className="tools-section wrap">
        <div className="section-top">
          <div>
            <span className="eyebrow">01 / THE TOOLBOX</span>
            <h2>
              Little helpers.
              <br />
              <em>Big difference.</em>
            </h2>
          </div>
          <p>
            Pick a tool. Make a little progress.
            <br />
            Get back to the good stuff.
          </p>
        </div>
        <div className="tool-toolbar">
          <div className="category-tabs" aria-label="Filter tools">
            {['All tools', 'Images', 'Text', 'Design'].map((c) => (
              <button
                key={c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
                {c === 'All tools' && <span>06</span>}
              </button>
            ))}
          </div>
          <div className="tool-search">
            <Search size={16} />
            <input
              ref={search}
              aria-label="Search tools"
              placeholder="Find a little help…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button aria-label="Clear search" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            ) : (
              <kbd>/</kbd>
            )}
          </div>
        </div>
        <div className="tool-grid">
          {filtered.map((t) => (
            <Link
              className={`tool-card tool-${t.icon}`}
              key={t.slug}
              href={`/tools/${t.slug}`}
              style={{ '--card-accent': t.color } as React.CSSProperties}
            >
              <div className="card-art">
                <span className="card-number">{t.number} /</span>
                <ToolArt type={t.icon} />
              </div>
              <div className="card-info">
                <span className="card-category">
                  {t.category.toUpperCase()} <span>•</span> {t.tag}
                </span>
                <div className="card-title">
                  <h3>{t.name}</h3>
                  <span className="card-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <p>{t.short}</p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-search">
            <Search size={32} />
            <h3>No tools found. Try another search.</h3>
            <button
              className="button secondary"
              onClick={() => {
                setQuery('');
                setCategory('All tools');
              }}
            >
              Show all six tools
            </button>
          </div>
        )}
        <div className="toolbox-foot">
          <span>
            <span className="status-dot" /> SIX TOOLS. ZERO FUSS.
          </span>
          <p>A growing collection. A permanent work in progress.</p>
          <Sparkles size={18} />
        </div>
      </section>
      <section className="about-section" id="about">
        <div className="wrap about-inner">
          <div className="about-art" aria-hidden="true">
            <div className="about-asterisk">✳</div>
            <span>
              A SMALL OBSESSION
              <br />
              WITH MAKING THINGS BETTER.
            </span>
            <span className="about-scribble">useful feels good.</span>
          </div>
          <div className="about-copy">
            <span className="eyebrow">02 / THE IDEA</span>
            <h2>
              The little things
              <br />
              <em>add up.</em>
            </h2>
            <p>
              Another image to resize. A screenshot to dress up. That text that just won’t behave.
              Small jobs shouldn’t get in the way of big ideas.
            </p>
            <p>
              Darrkwiz is my little corner of the internet for making those jobs easier. Thoughtful
              tools, a bit of personality, and nothing between you and getting things done.
            </p>
            <a className="text-link" href="https://navansami.com" target="_blank" rel="noreferrer">
              Built by Navan. Fuelled by curiosity. <MoveUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section className="principles wrap">
        <div>
          <ShieldCheck />
          <h3>Your files. Your business.</h3>
          <p>Everything is processed in your browser. Your files and text stay on your device.</p>
        </div>
        <div>
          <Zap />
          <h3>Open it. Use it. Done.</h3>
          <p>No account to create. No hoops to jump through. Just straight to the useful bit.</p>
        </div>
        <div>
          <Heart />
          <h3>A little care goes a long way.</h3>
          <p>Made to feel good to use. Because everyday tools deserve a little personality too.</p>
        </div>
      </section>
    </main>
  );
}
