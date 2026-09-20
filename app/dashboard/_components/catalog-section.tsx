"use client";

import { useState, useTransition } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";

import { CategorySheet } from "@/app/dashboard/_components/category-sheet";
import { ProductSheet } from "@/app/dashboard/_components/product-sheet";
import { deleteCategory, deleteProduct } from "@/app/dashboard/catalog-actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog";
import type { DashboardCategory, DashboardProduct } from "@/lib/catalog-db";

type Props = {
  products: DashboardProduct[];
  categories: DashboardCategory[];
};

function ArtBadge({ art, label }: { art: DashboardProduct["art"]; label?: string }) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[9px] font-bold tracking-wider"
      style={{ background: art.background, color: art.foreground }}
    >
      {label ?? art.label}
    </div>
  );
}

export function CatalogSection({ products: initialProducts, categories: initialCategories }: Props) {
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DashboardProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DashboardCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const openNewProduct = () => { setSelectedProduct(null); setProductSheetOpen(true); };
  const openEditProduct = (p: DashboardProduct) => { setSelectedProduct(p); setProductSheetOpen(true); };
  const openNewCategory = () => { setSelectedCategory(null); setCategorySheetOpen(true); };
  const openEditCategory = (c: DashboardCategory) => { setSelectedCategory(c); setCategorySheetOpen(true); };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setDeletingId(null);
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This will fail if products still use it.`)) return;
    startTransition(() => deleteCategory(id));
  };

  return (
    <div className="space-y-8">
      {/* ── Products ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.04em] text-[#171716]">Products</h2>
            <p className="text-sm text-[#858580]">{initialProducts.length} item{initialProducts.length !== 1 ? "s" : ""}</p>
          </div>
          <Button size="sm" onClick={openNewProduct} className="gap-1.5">
            <Plus className="size-4" /> Add product
          </Button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#deded9] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e1e1dc] bg-[#fafaf8]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Product</th>
                <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580] sm:table-cell">Category</th>
                <th className="hidden px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580] md:table-cell">Price</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ec]">
              {initialProducts.map((product) => (
                <tr
                  key={product.id}
                  className={["transition-colors hover:bg-[#fafaf8]", deletingId === product.id ? "opacity-40" : ""].join(" ")}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imageUrl} alt={product.name} className="size-9 shrink-0 rounded-xl object-cover" />
                      ) : (
                        <ArtBadge art={product.art} />
                      )}
                      <div>
                        <p className="font-medium text-[#171716]">{product.name}</p>
                        <p className="text-xs text-[#858580]">{product.format}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-[#5f5f5b] sm:table-cell">{product.categoryLabel}</td>
                  <td className="hidden px-5 py-3.5 text-right font-medium tabular-nums text-[#171716] md:table-cell">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex justify-center gap-1.5">
                      {product.featured && (
                        <span className="inline-block rounded-full bg-[#d7ec67] px-2 py-0.5 text-[11px] font-semibold text-[#263329]">
                          Featured
                        </span>
                      )}
                      {!product.isActive && (
                        <span className="inline-block rounded-full bg-[#fee2e2] px-2 py-0.5 text-[11px] font-semibold text-red-700">
                          Inactive
                        </span>
                      )}
                      {product.isActive && !product.featured && (
                        <span className="inline-block rounded-full bg-[#efefec] px-2 py-0.5 text-[11px] font-medium text-[#858580]">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                        className="flex size-8 items-center justify-center rounded-lg text-[#858580] transition hover:bg-[#f0f0ec] hover:text-[#171716]"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingId === product.id}
                        className="flex size-8 items-center justify-center rounded-lg text-[#858580] transition hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {initialProducts.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#efefec]">
                <Layers className="size-6 text-[#858580]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#31312f]">No products yet</p>
                <p className="mt-0.5 text-sm text-[#858580]">Add your first product to get started.</p>
              </div>
              <Button size="sm" onClick={openNewProduct} className="mt-1 gap-1.5">
                <Plus className="size-4" /> Add product
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.04em] text-[#171716]">Categories</h2>
            <p className="text-sm text-[#858580]">{initialCategories.length} item{initialCategories.length !== 1 ? "s" : ""}</p>
          </div>
          <Button size="sm" variant="outline" onClick={openNewCategory} className="gap-1.5">
            <Plus className="size-4" /> Add category
          </Button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#deded9] bg-white">
          {initialCategories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-[#858580]">No categories yet. Add one before creating products.</p>
              <Button size="sm" variant="outline" onClick={openNewCategory} className="gap-1.5">
                <Plus className="size-4" /> Add category
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e1e1dc] bg-[#fafaf8]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Name</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Slug</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-[#858580]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0ec]">
                {initialCategories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-[#fafaf8]">
                    <td className="px-5 py-3.5 font-medium text-[#171716]">{cat.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#858580]">{cat.slug}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          className="flex size-8 items-center justify-center rounded-lg text-[#858580] transition hover:bg-[#f0f0ec] hover:text-[#171716]"
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="flex size-8 items-center justify-center rounded-lg text-[#858580] transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Sheets ───────────────────────────────────────────── */}
      <ProductSheet
        open={productSheetOpen}
        onOpenChange={setProductSheetOpen}
        product={selectedProduct}
        categories={initialCategories}
      />
      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
        category={selectedCategory}
      />
    </div>
  );
}
