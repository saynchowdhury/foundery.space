import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getAllBlogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-posts";
import { ORGANIZATION_ID } from "@/lib/schema";
import { safeJsonLd } from "@/lib/utils";
import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found — Foundery.Space" };

  const siteUrl = "https://foundery.space";
  return {
    title: `${post.title} — Foundery.Space`,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: "Foundery.Space",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author],
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);
  const allPosts = getAllBlogPosts();
  const siteUrl = "https://foundery.space";

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    inLanguage: "en",
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  // FAQ schema
  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Convert markdown content to HTML (simple parser for headings, bold, links, lists)
  const contentHtml = post.content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium text-foreground mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6 tracking-tight">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand hover:text-brand-light underline underline-offset-2 transition-colors">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="text-muted-foreground/90 leading-relaxed pl-4 border-l border-white/10 mb-2">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-muted-foreground/90 leading-relaxed pl-4 mb-2"><span class="text-brand/60 font-mono-technical text-[11px]">$1.</span> $2</li>')
    .replace(/\n\n/g, '</p><p class="text-[15px] text-muted-foreground/90 leading-relaxed mb-6 font-light">')
    .replace(/\n/g, "<br/>");

  return (
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-brand selection:text-black">
      <Header />
      {/* JSON-LD Schemas */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 font-mono-technical text-[10px] text-white/40 hover:text-brand transition-colors uppercase tracking-widest"
          >
            ← BACK_TO_BLOG
          </Link>
          <div className="h-px w-12 bg-white/5" />
          <span className="font-mono-technical text-[10px] text-brand uppercase tracking-widest">
            {post.category}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono-technical text-[8px] text-brand/70 bg-brand/5 border border-brand/10 px-2 py-0.5 uppercase tracking-wider">
              {post.category}
            </span>
            <span className="font-mono-technical text-[9px] text-white/20 uppercase tracking-widest">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="font-mono-technical text-[9px] text-white/15 uppercase tracking-widest">
              · {post.readingTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground/80 font-light leading-relaxed max-w-3xl">
            {post.description}
          </p>

          {post.updatedDate && post.updatedDate !== post.date && (
            <p className="mt-4 font-mono-technical text-[9px] text-white/15 uppercase tracking-widest">
              UPDATED_{new Date(post.updatedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).toUpperCase().replace(/,/g, "_")}
            </p>
          )}
        </header>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/5" />
          <span className="font-mono-technical text-[8px] text-white/10 uppercase tracking-[0.3em]">
            ARTICLE_START
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Article Body */}
        <article
          className="prose-custom"
          dangerouslySetInnerHTML={{
            __html: `<p class="text-[15px] text-muted-foreground/90 leading-relaxed mb-6 font-light">${contentHtml}</p>`,
          }}
        />

        {/* Internal Links */}
        {post.internalLinks.length > 0 && (
          <div className="mt-16 p-8 border border-white/5 bg-white/[0.01]">
            <span className="font-mono-technical text-[9px] text-brand uppercase tracking-[0.2em] block mb-6">
              EXPLORE_RELATED_PROTOCOLS
            </span>
            <div className="flex flex-wrap gap-3">
              {post.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono-technical text-[10px] text-white/40 hover:text-brand uppercase tracking-widest px-4 py-2 border border-white/10 hover:border-brand/40 transition-all"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono-technical text-[9px] text-brand tracking-[0.2em] uppercase">
                FREQUENTLY_ASKED
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-white/5 bg-[#0a0a0a] p-6"
                >
                  <h3 className="text-[15px] font-medium text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[14px] text-muted-foreground/80 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono-technical text-[9px] text-white/40 tracking-[0.2em] uppercase">
                RELATED_ARTICLES
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block border border-white/5 bg-[#0a0a0a] p-5 hover:border-brand/40 transition-all duration-500"
                >
                  <span className="font-mono-technical text-[8px] text-brand/70 uppercase tracking-wider">
                    {rp.category}
                  </span>
                  <h3 className="text-[15px] font-light text-foreground group-hover:text-brand transition-colors leading-snug mt-2">
                    {rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <Link
            href="/blog"
            className="font-mono-technical text-[10px] text-white/40 hover:text-brand uppercase tracking-[0.2em] transition-colors"
          >
            ← ALL_ARTICLES
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
