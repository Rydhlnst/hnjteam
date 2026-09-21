"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Check, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { createProduct, updateProduct } from "@/app/dashboard/catalog-actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { ImageDropzone } from "@/app/dashboard/_components/image-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { DashboardCategory, DashboardProduct, DashboardUnitType } from "@/lib/catalog-db";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#31312f]">{label}</label>
      {hint && <p className="text-xs text-[#858580]">{hint}</p>}
      {children}
    </div>
  );
}

type VariantRow = { id: string; quantity: string; unitTypeId: string; price: string };

function newVariantRow(): VariantRow {
  return { id: crypto.randomUUID(), quantity: "", unitTypeId: "", price: "" };
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: DashboardProduct | null;
  categories: DashboardCategory[];
  unitTypes: DashboardUnitType[];
};

export function ProductSheet({ open, onOpenChange, product, categories, unitTypes }: Props) {
  const isEdit = Boolean(product);
  const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;

  const [state, formAction, pending] = useActionState(action, dashboardInitialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.isActive ?? true);
  const [variants, setVariants] = useState<VariantRow[]>(() =>
    product?.variants.map((v) => ({
      id: v.id,
      quantity: String(v.quantity),
      unitTypeId: v.unitTypeId ?? "",
      price: String(v.price),
    })) ?? []
  );

  useEffect(() => {
    setName(product?.name ?? "");
    setSlug(product?.slug ?? "");
    setSlugEdited(Boolean(product));
    setFeatured(product?.featured ?? false);
    setActive(product?.isActive ?? true);
    setVariants(
      product?.variants.map((v) => ({
        id: v.id,
        quantity: String(v.quantity),
        unitTypeId: v.unitTypeId ?? "",
        price: String(v.price),
      })) ?? []
    );
  }, [product]);

  useEffect(() => {
    if (state.status === "success") {
      const t = setTimeout(() => onOpenChange(false), 800);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const updateVariant = (id: string, field: keyof VariantRow, value: string) => {
    setVariants((rows) => rows.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeVariant = (id: string) => setVariants((rows) => rows.filter((r) => r.id !== id));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validVariants = variants
      .filter((v) => v.quantity && v.unitTypeId && v.price)
      .map((v, i) => ({ quantity: Number(v.quantity), unitTypeId: v.unitTypeId, price: Number(v.price), sortOrder: i }));
    fd.set("variants", JSON.stringify(validVariants));
    startTransition(() => formAction(fd));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg bg-white">
        <SheetHeader className="border-b border-[#e1e1dc] px-6 py-5">
          <SheetTitle className="text-lg font-semibold tracking-[-0.04em] text-[#171716]">
            {isEdit ? "Edit product" : "Add product"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field label="Product image">
              <ImageDropzone existingUrl={product?.imageUrl} />
            </Field>

            <Field label="Name">
              <Input name="name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Creator Content Kit" required className="h-10 border-[#deded9]" />
            </Field>

            <Field label="Slug" hint="URL-safe identifier — auto-generated from name.">
              <Input name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }} placeholder="creator-content-kit" required className="h-10 border-[#deded9] font-mono text-sm" />
            </Field>

            <Field label="Description">
              <textarea name="description" defaultValue={product?.description} rows={3} required className="w-full resize-y rounded-xl border border-[#deded9] bg-white px-3 py-2.5 text-sm leading-6 text-[#171716] outline-none transition focus:border-[#171716] focus:ring-2 focus:ring-[#171716]/10" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Base price (IDR)" hint="Used when no variants are active.">
                <Input name="price" type="number" defaultValue={product?.price} min={1} required placeholder="79000" className="h-10 border-[#deded9]" />
              </Field>

              <Field label="Category">
                <select name="categoryId" defaultValue={product?.categoryId} required className="h-10 w-full rounded-xl border border-[#deded9] bg-white px-3 text-sm text-[#171716] outline-none transition focus:border-[#171716] focus:ring-2 focus:ring-[#171716]/10">
                  <option value="">Select…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
            </div>

            {/* ── Variants ──────────────────────────────────── */}
            <div className="space-y-3 rounded-2xl border border-[#e1e1dc] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#31312f]">Variants</p>
                  <p className="text-xs text-[#858580]">Each variant overrides the base price.</p>
                </div>
                {unitTypes.length > 0 && (
                  <Button type="button" size="sm" variant="outline" onClick={() => setVariants((r) => [...r, newVariantRow()])} className="gap-1">
                    <Plus className="size-3.5" /> Add
                  </Button>
                )}
              </div>
              {unitTypes.length === 0 && (
                <p className="text-xs text-[#858580]">Create unit types in the Catalog tab first.</p>
              )}
              {variants.map((v) => (
                <div key={v.id} className="grid grid-cols-[5rem_1fr_7rem_2rem] items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={v.quantity}
                    onChange={(e) => updateVariant(v.id, "quantity", e.target.value)}
                    placeholder="Qty"
                    className="h-9 border-[#deded9] text-sm"
                  />
                  <select
                    value={v.unitTypeId}
                    onChange={(e) => updateVariant(v.id, "unitTypeId", e.target.value)}
                    className="h-9 w-full rounded-xl border border-[#deded9] bg-white px-2 text-sm text-[#171716] outline-none transition focus:border-[#171716]"
                  >
                    <option value="">Unit…</option>
                    {unitTypes.map((ut) => <option key={ut.id} value={ut.id}>{ut.name}</option>)}
                  </select>
                  <Input
                    type="number"
                    min={1}
                    value={v.price}
                    onChange={(e) => updateVariant(v.id, "price", e.target.value)}
                    placeholder="Price"
                    className="h-9 border-[#deded9] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-[#858580] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="hidden" name="isFeatured" value={featured ? "true" : "false"} />
                <button type="button" role="switch" aria-checked={featured} onClick={() => setFeatured((v) => !v)} className={["relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none", featured ? "bg-[#171716]" : "bg-[#deded9]"].join(" ")}>
                  <span className={["pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform", featured ? "translate-x-4" : "translate-x-0"].join(" ")} />
                </button>
                <span className="text-sm font-medium text-[#31312f]">Featured</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="hidden" name="isActive" value={active ? "true" : "false"} />
                <button type="button" role="switch" aria-checked={active} onClick={() => setActive((v) => !v)} className={["relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none", active ? "bg-[#171716]" : "bg-[#deded9]"].join(" ")}>
                  <span className={["pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform", active ? "translate-x-4" : "translate-x-0"].join(" ")} />
                </button>
                <span className="text-sm font-medium text-[#31312f]">Active</span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#e1e1dc] px-6 py-4">
            {state.status === "error" && <p className="mb-3 text-sm text-red-600">{state.message}</p>}
            {state.status === "success" && (
              <p className="mb-3 flex items-center gap-1.5 text-sm text-emerald-700">
                <Check className="size-4" /> {state.message}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
