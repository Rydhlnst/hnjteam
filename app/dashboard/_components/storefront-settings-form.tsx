"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "@tanstack/react-form";
import { Check, Save } from "lucide-react";
import { z } from "zod";

import { updateStorefrontSettings } from "@/app/dashboard/actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicSettings } from "@/lib/storefront";

const BRAND_PRESETS = [
  { color: "#171716", label: "HnJ Black" },
  { color: "#0d1b2a", label: "Navy" },
  { color: "#1a2e1f", label: "Forest" },
  { color: "#1e293b", label: "Slate" },
  { color: "#2d1535", label: "Plum" },
  { color: "#3b1a1a", label: "Burgundy" },
  { color: "#1c1c14", label: "Olive" },
  { color: "#2a2520", label: "Walnut" },
];

const dashboardSettingsSchema = z.object({
  heroEyebrow: z.string().trim().min(2).max(80),
  heroTitle: z.string().trim().min(5).max(120),
  heroDescription: z.string().trim().min(10).max(360),
  heroCtaLabel: z.string().trim().min(2).max(40),
  promoTwoEyebrow: z.string().trim().min(2).max(80),
  promoTwoTitle: z.string().trim().min(5).max(120),
  promoTwoDescription: z.string().trim().min(10).max(360),
  promoTwoCtaLabel: z.string().trim().min(2).max(40),
  promoThreeEyebrow: z.string().trim().min(2).max(80),
  promoThreeTitle: z.string().trim().min(5).max(120),
  promoThreeDescription: z.string().trim().min(10).max(360),
  promoThreeCtaLabel: z.string().trim().min(2).max(40),
  collectionEyebrow: z.string().trim().min(2).max(80),
  collectionTitle: z.string().trim().min(2).max(80),
  whatsappNumber: z.string().trim().regex(/^\d{8,20}$/),
  whatsappMessageTemplate: z.string().trim().min(12).max(500),
  brandColor: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/).default("#171716"),
});

type StorefrontSettingsFormProps = { initialSettings: PublicSettings };

function FieldLabel({ children, htmlFor, hint }: { children: string; htmlFor: string; hint?: string }) {
  return <div><label htmlFor={htmlFor} className="text-sm font-medium text-[#31312f]">{children}</label>{hint ? <p className="mt-1 text-xs leading-5 text-[#858580]">{hint}</p> : null}</div>;
}

function TextArea({ id, value, onChange, rows = 3 }: { id: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <textarea id={id} value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-xl border border-[#deded9] bg-white px-3 py-2.5 text-sm leading-6 text-[#171716] outline-none transition focus:border-[#171716] focus:ring-2 focus:ring-[#171716]/10" />;
}

export function StorefrontSettingsForm({ initialSettings }: StorefrontSettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateStorefrontSettings, dashboardInitialState);
  const form = useForm({
    defaultValues: initialSettings,
    validators: { onSubmit: ({ value }) => { const result = dashboardSettingsSchema.safeParse(value); return result.success ? undefined : result.error.flatten().fieldErrors; } },
    onSubmit: ({ value }) => { const formData = new FormData(); for (const [name, fieldValue] of Object.entries(value)) formData.set(name, String(fieldValue)); startTransition(() => formAction(formData)); },
  });

  return (
    <form onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }} className="space-y-8">

      {/* Brand color */}
      <section className="space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Brand</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Theme color</h2><p className="mt-1 text-sm text-[#6c6c68]">Applied to the storefront banner, dashboard sidebar, and buttons.</p></div>
        <form.Field name="brandColor">
          {(field) => (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {BRAND_PRESETS.map(({ color, label }) => (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    onClick={() => field.handleChange(color)}
                    className={[
                      "size-8 rounded-full border-2 transition",
                      field.state.value === color ? "border-[#171716] ring-2 ring-[#171716]/20" : "border-transparent hover:border-[#888884]",
                    ].join(" ")}
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="size-9 shrink-0 rounded-xl border border-[#deded9]"
                  style={{ background: field.state.value }}
                />
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="#171716"
                  className="h-9 w-36 border-[#deded9] bg-white font-mono text-sm"
                />
              </div>
            </div>
          )}
        </form.Field>
      </section>

      <section className="border-t border-[#e1e1dc] pt-8 space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Promotion 01</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Primary banner</h2><p className="mt-1 text-sm text-[#6c6c68]">Shown first and linked to the collection.</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="heroEyebrow">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Eyebrow</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
          <form.Field name="heroCtaLabel">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>CTA label</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        </div>
        <form.Field name="heroTitle">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Headline</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        <form.Field name="heroDescription">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Short description</FieldLabel><TextArea id={field.name} value={field.state.value} onChange={field.handleChange} /></div>}</form.Field>
      </section>

      <section className="border-t border-[#e1e1dc] pt-8 space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Promotion 02</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Second banner</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="promoTwoEyebrow">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Eyebrow</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
          <form.Field name="promoTwoCtaLabel">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>CTA label</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        </div>
        <form.Field name="promoTwoTitle">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Headline</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        <form.Field name="promoTwoDescription">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Short description</FieldLabel><TextArea id={field.name} value={field.state.value} onChange={field.handleChange} /></div>}</form.Field>
      </section>

      <section className="border-t border-[#e1e1dc] pt-8 space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Promotion 03</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Help banner</h2><p className="mt-1 text-sm text-[#6c6c68]">Its CTA opens WhatsApp.</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="promoThreeEyebrow">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Eyebrow</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
          <form.Field name="promoThreeCtaLabel">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>CTA label</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        </div>
        <form.Field name="promoThreeTitle">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Headline</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        <form.Field name="promoThreeDescription">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Short description</FieldLabel><TextArea id={field.name} value={field.state.value} onChange={field.handleChange} /></div>}</form.Field>
      </section>

      <section className="border-t border-[#e1e1dc] pt-8 space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Catalog</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Collection heading</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="collectionEyebrow">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Eyebrow</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
          <form.Field name="collectionTitle">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name}>Title</FieldLabel><Input id={field.name} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        </div>
      </section>

      <section className="border-t border-[#e1e1dc] pt-8 space-y-5">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">WhatsApp</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#171716]">Order destination</h2></div>
        <form.Field name="whatsappNumber">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name} hint="International format, digits only. Example: 628123456789.">Admin number</FieldLabel><Input id={field.name} inputMode="numeric" value={field.state.value} onChange={(event) => field.handleChange(event.target.value.replace(/\D/g, ""))} className="h-11 border-[#deded9] bg-white" /></div>}</form.Field>
        <form.Field name="whatsappMessageTemplate">{(field) => <div className="space-y-2"><FieldLabel htmlFor={field.name} hint="Use {product_name} and {product_price} to include product details.">Product chat message</FieldLabel><TextArea id={field.name} value={field.state.value} onChange={field.handleChange} rows={5} /></div>}</form.Field>
      </section>

      <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#deded9] bg-white/95 p-3 shadow-lg backdrop-blur">
        <p aria-live="polite" className={state.status === "error" ? "text-sm text-red-600" : "text-sm text-[#6c6c68]"}>{state.status === "success" ? <span className="inline-flex items-center gap-1.5 text-[#3d5a40]"><Check className="size-4" />{state.message}</span> : state.message}</p>
        <Button type="submit" size="lg" disabled={pending}><Save />{pending ? "Saving…" : "Save changes"}</Button>
      </div>
    </form>
  );
}
