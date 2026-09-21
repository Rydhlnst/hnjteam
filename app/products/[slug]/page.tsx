import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { ProductDetailCard } from "@/components/site/product-detail-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";
import { FadeIn, FadeInItem, FadeInStagger, MountFadeIn } from "@/components/site/fade-in";
import { getPublicProductBySlug, getPublicProducts, getPublicSettings } from "@/lib/catalog-db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();

  const [relatedProducts, settings] = await Promise.all([getPublicProducts({ category: product.category }), getPublicSettings()]);
  const structuredData = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, offers: { "@type": "Offer", price: product.price, priceCurrency: "IDR" } };
  const related = relatedProducts.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#171716]">
      <SiteNavbar />
      <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-7 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        <MountFadeIn delay={0.05}><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#858580]"><Link href="/products" className="transition hover:text-[#171716]">Shop</Link><ChevronRight className="size-3" aria-hidden="true" /><span className="max-w-[18rem] truncate text-[#5f5f5b]">{product.name}</span></nav></MountFadeIn>
        <MountFadeIn delay={0.1} className="mt-6 sm:mt-8"><ProductDetailCard product={product} settings={settings} /></MountFadeIn>
        <MountFadeIn delay={0.15}><Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#6c6c68] transition hover:text-[#171716]"><ArrowLeft className="size-4" /> Back to shop</Link></MountFadeIn>
        {related.length ? (
          <FadeIn className="mt-16 border-t border-[#e1e1dc] pt-10 sm:mt-20 sm:pt-12">
            <div className="flex items-end justify-between gap-6">
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999995]">Keep exploring</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">You might also like</h2></div>
              <Link href={`/products?category=${product.category}`} className="hidden items-center gap-2 text-sm font-semibold text-[#171716] transition hover:text-[#666662] sm:inline-flex">View category <ChevronRight className="size-4" /></Link>
            </div>
            <FadeInStagger className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {related.map((item) => <FadeInItem key={item.id}><ProductCard product={item} /></FadeInItem>)}
            </FadeInStagger>
          </FadeIn>
        ) : null}
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteFooter />
    </div>
  );
}


