import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductArt } from "@/components/site/product-art";
import { ProductCardActions } from "@/components/site/product-card-actions";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants.filter((v) => v.price > 0);
  const minVariantPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map((v) => v.price)) : null;

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-2xl border-[#dfdfda] bg-white py-0 shadow-none transition duration-200 hover:-translate-y-1 hover:border-[#bdbdb8] hover:shadow-[0_16px_32px_rgba(29,29,27,0.08)]">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block"><ProductArt product={product} /></Link>
      <div className="flex min-h-[205px] min-w-0 flex-col p-4 sm:min-h-[225px] sm:p-5">
        <Link href={`/products/${product.slug}`} className="block min-w-0">
          <Badge className="mb-3 border-[#e1e1dc] bg-[#f7f7f5] text-[#686864]">{product.categoryLabel}</Badge>
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.025em] text-[#171716] sm:text-base sm:leading-6">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#777773] sm:text-sm sm:leading-6">{product.description}</p>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <div className="min-w-0 truncate">
            {minVariantPrice !== null ? (
              <span className="text-sm font-semibold tracking-[-0.02em] text-[#171716] sm:text-base">
                <span className="text-xs font-normal text-[#858580]">from </span>
                {formatPrice(minVariantPrice)}
              </span>
            ) : (
              <span className="text-sm font-semibold tracking-[-0.02em] text-[#171716] sm:text-base">{formatPrice(product.price)}</span>
            )}
          </div>
          <ProductCardActions product={product} />
        </div>
      </div>
    </Card>
  );
}
