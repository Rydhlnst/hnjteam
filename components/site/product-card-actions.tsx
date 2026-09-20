"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/site/cart-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";

export function ProductCardActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return <Button variant="secondary" size="sm" onClick={handleAdd} className="h-9 shrink-0 px-2.5" aria-label={`Add ${product.name} to cart`}>{added ? <Check className="size-4" /> : <Plus className="size-4" />}{added ? "Added" : "Add"}</Button>;
}
