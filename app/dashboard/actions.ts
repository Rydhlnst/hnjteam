"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { DashboardFormState } from "@/app/dashboard/_components/form-state";
import { settings } from "@/db/schema";
import { getAuth } from "@/lib/auth";
import { requireDashboardAuthentication } from "@/lib/dashboard-auth";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig, isPreviewMode } from "@/lib/env";

const promotionSchema = {
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
};

const storefrontSettingsSchema = z.object({
  ...promotionSchema,
  collectionEyebrow: z.string().trim().min(2).max(80),
  collectionTitle: z.string().trim().min(2).max(80),
  whatsappNumber: z.string().trim().regex(/^\d{8,20}$/, "Use a WhatsApp number with digits only."),
  whatsappMessageTemplate: z.string().trim().min(12).max(500),
  brandColor: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/, "Enter a valid hex color.").default("#171716"),
});

function parseFormData(formData: FormData) {
  return storefrontSettingsSchema.safeParse(Object.fromEntries(formData));
}

export async function signOutDashboard() {
  await getAuth().api.signOut({ headers: await headers() });
  redirect("/dashboard");
}

export async function updateStorefrontSettings(_: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  if (isPreviewMode()) return { status: "error", message: "Preview mode — connect a database to save changes." };

  try {
    await requireDashboardAuthentication();
  } catch {
    return { status: "error", message: "Your dashboard session has expired. Please sign in again." };
  }

  if (!hasDatabaseConfig()) return { status: "error", message: "DATABASE_URL is required before settings can be saved." };

  const parsed = parseFormData(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the highlighted settings." };

  const values = parsed.data;
  await getDb().insert(settings).values({ id: 1, ...values }).onConflictDoUpdate({
    target: settings.id,
    set: { ...values, updatedAt: new Date() },
    where: eq(settings.id, 1),
  });

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  return { status: "success", message: "Storefront settings saved." };
}
