import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { PromoBanner } from "@/components/site/promo-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";
import { Input } from "@/components/ui/input";
import { getPublicCategories, getPublicProducts, getPublicSettings } from "@/lib/catalog-db";

export default async function Home() {
  const [products, categories, settings] = await Promise.all([getPublicProducts(), getPublicCategories(), getPublicSettings()]);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#171716]">
      <SiteNavbar />
      <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-4 sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
        <PromoBanner settings={settings} />

        <section className="mt-6 border-y border-[#e1e1dc] py-4" aria-label="Product filters">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <SlidersHorizontal className="size-4 shrink-0 text-[#858580]" aria-hidden="true" />
              {categories.map((category) => (
                <Link key={category.slug} href={category.slug === "all" ? "/#collection" : `/products?category=${category.slug}`} className="shrink-0 rounded-full border border-[#deded9] bg-white px-3.5 py-2 text-xs font-medium text-[#5f5f5b] transition hover:border-[#171716] hover:bg-[#171716] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2">
                  {category.name}
                </Link>
              ))}
            </div>
            <form className="relative w-full lg:max-w-xs" action="/products">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#999995]" aria-hidden="true" />
              <Input name="q" placeholder="Search products" className="h-10 border-[#deded9] bg-white pl-10 text-sm shadow-none" aria-label="Search products" />
            </form>
          </div>
        </section>

        <section id="collection" className="scroll-mt-24 pt-10 sm:pt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b8b86]">{settings.collectionEyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.07em] sm:text-4xl">{settings.collectionTitle}</h2></div>
            <p className="pb-1 text-xs text-[#8b8b86]">{products.length} items</p>
          </div>
          {products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl border border-dashed border-[#cfcfca] bg-white px-6 py-16 text-center text-sm text-[#777773]">New products are being prepared. Check back soon.</div>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}