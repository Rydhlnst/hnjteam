"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";

import { createUnitType, updateUnitType } from "@/app/dashboard/catalog-actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { DashboardUnitType } from "@/lib/catalog-db";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitType?: DashboardUnitType | null;
};

export function UnitTypeSheet({ open, onOpenChange, unitType }: Props) {
  const isEdit = Boolean(unitType);
  const action = isEdit ? updateUnitType.bind(null, unitType!.id) : createUnitType;
  const [state, formAction, pending] = useActionState(action, dashboardInitialState);
  const [name, setName] = useState(unitType?.name ?? "");
  const [slug, setSlug] = useState(unitType?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);

  useEffect(() => {
    setName(unitType?.name ?? "");
    setSlug(unitType?.slug ?? "");
    setSlugEdited(Boolean(unitType));
  }, [unitType]);

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
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-sm bg-white">
        <SheetHeader className="border-b border-[#e1e1dc] px-6 py-5">
          <SheetTitle className="text-lg font-semibold tracking-[-0.04em] text-[#171716]">
            {isEdit ? "Edit unit type" : "Add unit type"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#31312f]">Name</label>
              <p className="text-xs text-[#858580]">Displayed to customers — e.g. &quot;Bulan&quot;, &quot;Tahun&quot;, &quot;Sesi&quot;.</p>
              <Input
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Bulan"
                required
                className="h-10 border-[#deded9]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#31312f]">Slug</label>
              <p className="text-xs text-[#858580]">Lowercase letters, numbers, hyphens only.</p>
              <Input
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                placeholder="bulan"
                required
                className="h-10 border-[#deded9] font-mono text-sm"
              />
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
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create unit type"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
