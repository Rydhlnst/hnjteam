import Link from "next/link";
import { ArrowUpRight, LogOut, Settings2 } from "lucide-react";

import { signOutDashboard } from "@/app/dashboard/actions";
import { DashboardLoginForm } from "@/app/dashboard/_components/dashboard-login-form";
import { StorefrontSettingsForm } from "@/app/dashboard/_components/storefront-settings-form";
import { Button } from "@/components/ui/button";
import { hasDashboardCredentials, isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { getPublicSettings } from "@/lib/catalog-db";
import { hasDatabaseConfig } from "@/lib/env";

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f7f7f5] px-4 py-5 text-[#171716] sm:px-6 sm:py-8"><div className="mx-auto max-w-5xl">{children}</div></main>;
}

function SetupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <DashboardShell><div className="mx-auto max-w-md rounded-3xl border border-[#deded9] bg-white p-6 shadow-sm sm:p-8"><div className="flex size-11 items-center justify-center rounded-2xl bg-[#171716] text-white"><Settings2 className="size-5" /></div><p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">HnJ dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.07em]">{title}</h1>{children}</div></DashboardShell>;
}

export default async function DashboardPage() {
  if (!hasDatabaseConfig()) {
    return <SetupCard title="Connect your database"><p className="mt-4 text-sm leading-6 text-[#6c6c68]">Add DATABASE_URL, run the database migration, then return here to edit promotion settings.</p></SetupCard>;
  }

  if (!hasDashboardCredentials()) {
    return <SetupCard title="Secure the dashboard"><p className="mt-4 text-sm leading-6 text-[#6c6c68]">Add DASHBOARD_PASSWORD and DASHBOARD_SESSION_SECRET to your environment before opening the editor.</p></SetupCard>;
  }

  if (!(await isDashboardAuthenticated())) {
    return <SetupCard title="Sign in"><p className="mt-4 text-sm leading-6 text-[#6c6c68]">Use the dashboard password configured for this store.</p><DashboardLoginForm /></SetupCard>;
  }

  const settings = await getPublicSettings();
  return <DashboardShell>
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1e1dc] pb-5">
      <div><p className="text-sm font-semibold tracking-[-0.04em]">HnJ.</p><h1 className="mt-4 text-3xl font-semibold tracking-[-0.07em] sm:text-4xl">Storefront settings</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#6c6c68]">Edit three sales banners, collection copy, and the WhatsApp order destination. Saving updates the public storefront.</p></div>
      <div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><Link href="/" target="_blank">View store <ArrowUpRight /></Link></Button><form action={signOutDashboard}><Button type="submit" variant="ghost" size="sm"><LogOut />Sign out</Button></form></div>
    </header>
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="rounded-3xl border border-[#deded9] bg-white p-5 shadow-sm sm:p-7"><StorefrontSettingsForm initialSettings={settings} /></div>
      <aside className="h-fit rounded-3xl border border-[#deded9] bg-[#efefec] p-5 lg:sticky lg:top-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">What changes</p><ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f5f5b]"><li>Three switchable promotion banners and their CTAs.</li><li>Featured collection heading.</li><li>Every WhatsApp product and cart checkout link.</li></ul></aside>
    </div>
  </DashboardShell>;
}
