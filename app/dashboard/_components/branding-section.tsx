"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { Check, ImageIcon, Upload, X } from "lucide-react";

import { updateBrandingAssets } from "@/app/dashboard/actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicSettings } from "@/lib/storefront";

function AssetDropzone({ name, label, hint, existingUrl }: { name: string; label: string; hint: string; existingUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [removed, setRemoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setRemoved(false);
    setPreview(URL.createObjectURL(file));
    const dt = new DataTransfer();
    dt.items.add(file);
    if (inputRef.current) inputRef.current.files = dt.files;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#31312f]">{label}</p>
      <p className="text-xs text-[#858580]">{hint}</p>
      <input ref={inputRef} type="file" name={name} accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) applyFile(f); }} />
      <input type="hidden" name={`_remove_${name}`} value={removed ? "true" : "false"} />
      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="h-20 w-auto rounded-xl border border-[#deded9] object-contain bg-[#fafaf8] p-2" />
          <button type="button" onClick={() => { setPreview(null); setRemoved(true); if (inputRef.current) inputRef.current.value = ""; }} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-[#171716] text-white shadow">
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) applyFile(f); }}
          className={["flex h-20 w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors", dragging ? "border-[#171716] bg-[#f0f0ec]" : "border-[#deded9] bg-[#fafaf8] hover:border-[#c0c0bc]"].join(" ")}
        >
          {dragging ? <ImageIcon className="size-4 text-[#171716]" /> : <Upload className="size-4 text-[#858580]" />}
          <span className="text-sm text-[#858580]">{dragging ? "Drop here" : "Upload image"}</span>
        </button>
      )}
    </div>
  );
}

export function BrandingSection({ initialSettings, logoPublicUrl, faviconPublicUrl }: { initialSettings: PublicSettings; logoPublicUrl?: string; faviconPublicUrl?: string }) {
  const [state, action, pending] = useActionState(updateBrandingAssets, dashboardInitialState);

  return (
    <section className="space-y-5 rounded-2xl border border-[#e1e1dc] bg-white p-5 sm:p-7">
      <div>
        <h2 className="text-base font-semibold text-[#171716]">Branding</h2>
        <p className="mt-1 text-sm text-[#858580]">Site name, logo, and favicon shown across the storefront.</p>
      </div>
      <form
        action={(fd) => startTransition(() => action(fd))}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#31312f]" htmlFor="siteName">Site name</label>
          <Input id="siteName" name="siteName" defaultValue={initialSettings.siteName} maxLength={60} className="h-11 border-[#deded9] bg-white" placeholder="HnJ" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <AssetDropzone name="logo" label="Logo" hint="Shown in the navbar. Recommended: PNG or SVG, transparent background, max 512×512." existingUrl={logoPublicUrl} />
          <AssetDropzone name="favicon" label="Favicon" hint="Browser tab icon. Square PNG or ICO, at least 32×32 px." existingUrl={faviconPublicUrl} />
        </div>

        <div className="flex items-center justify-between gap-3">
          {state.message ? (
            <p aria-live="polite" className={state.status === "error" ? "text-sm text-red-600" : "text-sm text-[#6c6c68]"}>
              {state.status === "success" ? <span className="inline-flex items-center gap-1.5 text-[#3d5a40]"><Check className="size-4" />{state.message}</span> : state.message}
            </p>
          ) : <span />}
          <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : "Save branding"}</Button>
        </div>
      </form>
    </section>
  );
}
