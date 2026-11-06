import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="wrap not-found">
      <span className="eyebrow">404 / A LITTLE OFF TRACK</span>
      <h1>
        Nothing here.
        <br />
        <em>Yet.</em>
      </h1>
      <p>Let’s get you back to something useful.</p>
      <Link href="/" className="button primary">
        Back to the toolbox ↗
      </Link>
    </main>
  );
}
