"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";

import { createProduct, updateProduct } from "@/app/dashboard/catalog-actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { ImageDropzone } from "@/app/dashboard/_components/image-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { DashboardCategory, DashboardProduct } from "@/lib/catalog-db";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#31312f]">{label}</label>
      {hint && <p className="text-xs text-[#858580]">{hint}</p>}
      {children}
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: DashboardProduct | null;
  categories: DashboardCategory[];
};

export function ProductSheet({ open, onOpenChange, product, categories }: Props) {
  const isEdit = Boolean(product);
  const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;

  const [state, formAction, pending] = useActionState(action, dashboardInitialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.isActive ?? true);

  // Reset form when the product changes (switching between edit/create)
  useEffect(() => {
    setName(product?.name ?? "");
    setSlug(product?.slug ?? "");
    setSlugEdited(Boolean(product));
    setFeatured(product?.featured ?? false);
    setActive(product?.isActive ?? true);
  }, [product]);

  // Close sheet on success
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg bg-white"
      >
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
              <Input
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Creator Content Kit"
                required
                className="h-10 border-[#deded9]"
              />
            </Field>

            <Field label="Slug" hint="URL-safe identifier — auto-generated from name.">
              <Input
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                placeholder="creator-content-kit"
                required
                className="h-10 border-[#deded9] font-mono text-sm"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                defaultValue={product?.description}
                rows={3}
                required
                className="w-full resize-y rounded-xl border border-[#deded9] bg-white px-3 py-2.5 text-sm leading-6 text-[#171716] outline-none transition focus:border-[#171716] focus:ring-2 focus:ring-[#171716]/10"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (IDR)">
                <Input
                  name="price"
                  type="number"
                  defaultValue={product?.price}
                  min={1}
                  required
                  placeholder="79000"
                  className="h-10 border-[#deded9]"
                />
              </Field>

              <Field label="Category">
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId}
                  required
                  className="h-10 w-full rounded-xl border border-[#deded9] bg-white px-3 text-sm text-[#171716] outline-none transition focus:border-[#171716] focus:ring-2 focus:ring-[#171716]/10"
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="hidden"
                  name="isFeatured"
                  value={featured ? "true" : "false"}
                />
                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured((v) => !v)}
                  className={[
                    "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none",
                    featured ? "bg-[#171716]" : "bg-[#deded9]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
                      featured ? "translate-x-4" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
                <span className="text-sm font-medium text-[#31312f]">Featured</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="hidden"
                  name="isActive"
                  value={active ? "true" : "false"}
                />
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() => setActive((v) => !v)}
                  className={[
                    "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none",
                    active ? "bg-[#171716]" : "bg-[#deded9]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
                      active ? "translate-x-4" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
                <span className="text-sm font-medium text-[#31312f]">Active</span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#e1e1dc] px-6 py-4">
            {state.status === "error" && (
              <p className="mb-3 text-sm text-red-600">{state.message}</p>
            )}
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
