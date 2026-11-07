'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Pause, Play, ArrowUp, X, Menu } from 'lucide-react';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [motion, setMotion] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const stored = localStorage.getItem('darrkwiz-motion');
    setMotion(stored === 'off' ? false : !reduced.matches);
    const update = () => {
      if (reduced.matches) setMotion(false);
    };
    reduced.addEventListener('change', update);
    return () => reduced.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
  }, [motion]);
  useEffect(() => {
    setMenu(false);
  }, [path]);
  function toggleMotion() {
    setMotion(!motion);
    localStorage.setItem('darrkwiz-motion', motion ? 'off' : 'on');
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <Link className="wordmark" href="/" aria-label="Darrkwiz home">
          darrkwiz
          <span className="brand-star" aria-hidden="true">
            ✳
          </span>
        </Link>
        <nav className={menu ? 'site-nav open' : 'site-nav'} aria-label="Main navigation">
          <Link href="/#tools" onClick={() => setMenu(false)}>
            <span className="nav-dot" /> Tools <span className="nav-count">06</span>
          </Link>
          <Link href="/learn" onClick={() => setMenu(false)}>
            Learn
          </Link>
          <Link href="/playground" onClick={() => setMenu(false)}>
            Playground
          </Link>
        </nav>
        <div className="header-actions">
          <button
            className="motion-toggle"
            onClick={toggleMotion}
            aria-pressed={motion}
            aria-label={motion ? 'Pause animations' : 'Enable animations'}
          >
            {motion ? <Pause size={13} fill="currentColor" /> : <Play size={13} />}
            <span>Motion {motion ? 'on' : 'off'}</span>
          </button>
          <button
            className="menu-toggle icon-button"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {children}
      <footer className="footer wrap">
        <div className="footer-top">
          <Link className="wordmark" href="/">
            darrkwiz
            <span className="brand-star" aria-hidden="true">
              ✳
            </span>
          </Link>
          <p>
            Tools. Learn. Playground.
            <br />
            Make something. Understand more. Stay curious.
          </p>
          <a href="https://navansami.com" target="_blank" rel="noreferrer">
            A side of Navan Sami <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Darrkwiz. Made with curiosity.</span>
          <span>YOUR FILES STAY YOURS.</span>
          <a
            href="#top"
            onClick={() => window.scrollTo({ top: 0, behavior: motion ? 'smooth' : 'instant' })}
          >
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}
