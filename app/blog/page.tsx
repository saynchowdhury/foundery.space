import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { ORGANIZATION_ID } from "@/lib/schema";
import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { safeJsonLd } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Foundery.Space | Guides on Fellowships, Grants & Startup Funding",
  description:
    "Expert guides on finding fellowships, winning grants, choosing accelerators, and tracking deadlines. Actionable advice for ambitious founders and builders.",
  alternates: { canonical: "https://foundery.space/blog" },
  openGraph: {
    title: "Blog — Foundery.Space",
    description:
      "Expert guides on fellowships, grants, accelerators, and startup funding.",
    url: "https://foundery.space/blog",
    siteName: "Foundery.Space",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Foundery.Space Blog",
    description:
      "Expert guides on finding fellowships, winning grants, choosing accelerators, and tracking deadlines.",
    url: "https://foundery.space/blog",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: `https://foundery.space/blog/${post.slug}`,
          datePublished: post.date,
          dateModified: post.updatedDate || post.date,
          author: {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
          },
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground">
      <Header />
      <Script
        id="blog-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogListSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-mono-technical text-[10px] text-white/40 hover:text-brand uppercase tracking-[0.2em] transition-colors"
          >
            HOME
          </Link>
          <span className="text-white/20">/</span>
          <span className="font-mono-technical text-[10px] text-brand uppercase tracking-[0.2em]">
            BLOG
          </span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono-technical text-[10px] text-brand tracking-[0.3em] uppercase">
              KNOWLEDGE_BASE_V1.0
            </span>
            <div className="h-px flex-1 bg-white/5" />
            <span className="font-mono-technical text-[10px] text-white/20 uppercase tracking-widest">
              {posts.length}_ARTICLES
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            Guides &amp; <span className="text-brand">Insights</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light max-w-2xl">
            Actionable guides on fellowships, grants, accelerators, and startup
            funding. Written by builders, for builders.
          </p>
        </div>

        {/* Post List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-white/5 bg-[#0a0a0a] p-6 md:p-8 hover:border-brand/40 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-brand/40 transition-colors" />

              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono-technical text-[8px] text-brand/70 bg-brand/5 border border-brand/10 px-2 py-0.5 uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="font-mono-technical text-[9px] text-white/20 uppercase tracking-widest">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="font-mono-technical text-[9px] text-white/15 uppercase tracking-widest">
                  · {post.readingTime}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-light text-foreground group-hover:text-brand transition-colors leading-snug mb-3">
                {post.title}
              </h2>

              <p className="text-[14px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-light">
                {post.description}
              </p>

              <div className="mt-4 flex items-center gap-2 font-mono-technical text-[10px] text-white/30 group-hover:text-brand/60 transition-colors uppercase tracking-widest">
                READ_GUIDE →
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center border border-white/5 bg-white/[0.01] p-10">
          <p className="font-mono-technical text-[10px] text-brand uppercase tracking-[0.3em] mb-3">
            READY_TO_EXPLORE
          </p>
          <h2 className="text-2xl font-light mb-4">
            Browse All <span className="text-brand">Opportunities</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Track deadlines, filter by category, and find the programs that match
            your profile.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 font-mono-technical text-[10px] text-white/40 hover:text-brand transition-colors uppercase tracking-[0.2em] px-6 py-3 border border-white/10 hover:border-brand/40"
          >
            EXPLORE_DIRECTORY →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
