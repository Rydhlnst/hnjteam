import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/product-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/site/fade-in";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog-db";

export const metadata = { title: "Catalog", description: "Browse HnJ digital products for clearer work and better systems." };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const category = params.category ?? "all";
  const [filteredProducts, categories] = await Promise.all([getPublicProducts({ query, category }), getPublicCategories()]);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#171716]">
      <SiteNavbar />
      <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
        <FadeIn delay={0.05}>
          <header className="max-w-3xl border-b border-[#e1e1dc] pb-10">
            <Badge className="border-[#deded9] bg-white text-[#666662]">HnJ / shop</Badge>
            <h1 className="mt-5 text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.09em]">Find a better starting point.</h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-[#6c6c68] sm:text-base sm:leading-7">Practical digital products for your next presentation, project, or good idea.</p>
          </header>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="mt-6 border-b border-[#e1e1dc] pb-5" aria-label="Catalog filters">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <form className="relative w-full lg:max-w-sm" action="/products">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#999995]" aria-hidden="true" />
                <Input name="q" defaultValue={query} placeholder="Search products" className="h-10 border-[#deded9] bg-white pl-10 shadow-none" aria-label="Search products" />
                <input type="hidden" name="category" value={category} />
              </form>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <SlidersHorizontal className="size-4 shrink-0 text-[#858580]" aria-hidden="true" />
                {categories.map((item) => <Link key={item.slug} href={`/products?${new URLSearchParams({ ...(item.slug === "all" ? {} : { category: item.slug }), ...(query ? { q: query } : {}) }).toString()}`} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2 ${category === item.slug ? "border-[#171716] bg-[#171716] text-white" : "border-[#deded9] bg-white text-[#5f5f5b] hover:border-[#171716] hover:text-[#171716]"}`}>{item.name}</Link>)}
              </div>
            </div>
          </section>
        </FadeIn>

        {filteredProducts.length ? (
          <section className="pt-10 sm:pt-12">
            <FadeIn className="mb-6 flex items-end justify-between gap-4">
              <p className="text-sm text-[#777773]">Showing <span className="font-semibold text-[#171716]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}{query ? <> for &quot;{query}&quot;</> : null}</p>
              <p className="hidden text-xs text-[#999995] sm:block">Updated monthly</p>
            </FadeIn>
            <FadeInStagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => <FadeInItem key={product.id}><ProductCard product={product} /></FadeInItem>)}
            </FadeInStagger>
          </section>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cfcfca] bg-white px-6 py-20 text-center"><div className="mx-auto max-w-sm"><p className="text-lg font-semibold text-[#171716]">No products found.</p><p className="mt-2 text-sm leading-6 text-[#777773]">Try another search or category.</p><Button asChild variant="outline" className="mt-6"><Link href="/products">Clear filters <ArrowRight className="size-4" /></Link></Button></div></div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}


