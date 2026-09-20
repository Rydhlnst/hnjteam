import Image from "next/image";
import { ImageOff } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProductArt({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("relative h-64 overflow-hidden bg-[#efefec] sm:h-72 lg:h-80", className)}>
      {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" /> : <><Skeleton className="absolute inset-0 rounded-none bg-[#e9e9e7]" /><div className="absolute inset-0 flex items-center justify-center"><span className="inline-flex size-11 items-center justify-center rounded-xl border border-[#deded9] bg-white/80 text-[#858580]"><ImageOff className="size-5" aria-hidden="true" /><span className="sr-only">No image available</span></span></div></>}
    </div>
  );
}
