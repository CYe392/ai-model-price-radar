import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductShell } from "../../product-shell";
import { getProductUpdate, PRODUCT_UPDATES } from "../../../lib/updates";

export function generateStaticParams() {
  return PRODUCT_UPDATES.map((update) => ({ slug: update.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const update = getProductUpdate((await params).slug);
  if (!update) return { title: "Update not found" };
  return {
    title: update.title,
    description: update.summary,
    alternates: { canonical: `/updates/${update.slug}` },
  };
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const update = getProductUpdate((await params).slug);
  if (!update) notFound();
  return (
    <ProductShell eyebrow={`${update.category.toUpperCase()} · ${update.publishedAt}`} title={update.title} lede={update.summary}>
      <article className="updateArticle">
        <p className="updateMeta">Published {update.publishedAt} · {update.readingMinutes} minute read</p>
        {update.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <p><Link href="/updates">← All updates</Link></p>
      </article>
    </ProductShell>
  );
}
