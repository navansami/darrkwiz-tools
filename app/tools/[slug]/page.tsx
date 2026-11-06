import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { tools } from '@/lib/tools';
import { ToolWorkspace } from '@/components/tool-workspace';
import type { Metadata } from 'next';
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = tools.find((t) => t.slug === slug);
  return {
    title: t?.name || 'Tool not found',
    description: t?.description,
    alternates: { canonical: `/tools/${slug}` },
  };
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <main id="main" className="workspace-page wrap">
      <div className="workspace-breadcrumb">
        <Link href="/#tools">
          <ArrowLeft size={15} /> Back to the toolbox
        </Link>
        <span>{tool.number} / 06</span>
      </div>
      <div className="workspace-heading">
        <div>
          <span className="eyebrow">
            {tool.category.toUpperCase()} / {tool.tag}
          </span>
          <h1>
            {tool.name}
            <span>.</span>
          </h1>
          <p>{tool.description}</p>
        </div>
        <span className="workspace-stamp" aria-hidden="true">
          ✳
        </span>
      </div>
      <ToolWorkspace slug={tool.slug} />
      <div className="workspace-privacy">
        <ShieldCheck size={17} />
        <p>Just you and your browser. Your files and text never leave your device.</p>
      </div>
      <section className="more-tools">
        <span className="eyebrow">WHILE YOU’RE HERE</span>
        <h2>A little more useful.</h2>
        <div>
          {tools
            .filter((t) => t.slug !== slug)
            .slice(0, 3)
            .map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                <span>{t.name}</span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
