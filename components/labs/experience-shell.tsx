import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { experiences } from '@/lib/experiences';
export function ExperienceShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const item = experiences.find((e) => e.slug === slug)!;
  const url = `https://darrkwiz.com/${item.section}/${item.slug}`;
  return (
    <main id="main" className="experience-page wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: item.title,
            description: item.description,
            url,
            author: { '@type': 'Person', name: 'Navan Sami', url: 'https://navansami.com' },
            isPartOf: { '@type': 'WebSite', name: 'Darrkwiz', url: 'https://darrkwiz.com' },
          }),
        }}
      />
      <Link className="text-link" href={`/${item.section}`}>
        <ArrowLeft size={16} /> Back to {item.section === 'learn' ? 'Learn' : 'Playground'}
      </Link>
      <header className="experience-heading">
        <span className="eyebrow">
          {item.section.toUpperCase()} / {item.tag}
        </span>
        <h1>
          {item.title}
          <span>.</span>
        </h1>
        <p>{item.description}</p>
        <a
          className="experience-author"
          href="https://navansami.com"
          target="_blank"
          rel="noreferrer"
        >
          Created by Navan Sami <ArrowUpRight size={14} />
        </a>
      </header>
      {children}
      <section className="experience-next">
        <span className="eyebrow">KEEP YOUR CURIOSITY GOING</span>
        {experiences
          .filter((e) => e.slug !== slug)
          .map((e) => (
            <Link key={e.slug} href={`/${e.section}/${e.slug}`}>
              {e.title} <ArrowUpRight size={18} />
            </Link>
          ))}
      </section>
    </main>
  );
}
export function ExperienceIndex({ section }: { section: 'learn' | 'playground' }) {
  return (
    <main id="main" className="experience-page wrap">
      <header className="experience-heading">
        <span className="eyebrow">DARRKWIZ / {section.toUpperCase()}</span>
        <h1>{section === 'learn' ? 'Understand more.' : 'Try something new.'}</h1>
        <p>
          {section === 'learn'
            ? 'Short explanations. Real experiments. Learn colour and image fundamentals by changing things and seeing what happens.'
            : 'A little room to experiment with design and code. Start with motion, then take the CSS with you.'}
        </p>
        <a className="experience-author" href="https://navansami.com">
          Interactive experiences by Navan Sami <ArrowUpRight size={14} />
        </a>
      </header>
      <div className="experience-index-grid">
        {experiences
          .filter((e) => e.section === section)
          .map((e) => (
            <Link
              className={`experience-index-card index-${e.slug}`}
              href={`/${e.section}/${e.slug}`}
              key={e.slug}
            >
              <span className="eyebrow">
                {e.number} / {e.tag}
              </span>
              <div className="index-art" aria-hidden="true">
                {e.slug === 'colour-theory' ? '◉' : e.slug === 'image-compression' ? '▧' : '↗'}
              </div>
              <h2>{e.title}</h2>
              <p>{e.description}</p>
              <span className="text-link">
                Open the {section === 'learn' ? 'lab' : 'playground'} <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
      </div>
    </main>
  );
}
