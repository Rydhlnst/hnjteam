import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, LogOut, Megaphone, Menu, Package, Settings2, UserCog } from "lucide-react";

import { signOutDashboard } from "@/app/dashboard/actions";
import { AccountSection } from "@/app/dashboard/_components/account-section";
import { CatalogSection } from "@/app/dashboard/_components/catalog-section";
import { DashboardLoginForm } from "@/app/dashboard/_components/dashboard-login-form";
import { SetupAdminForm } from "@/app/dashboard/_components/setup-admin-form";
import { StorefrontSettingsForm } from "@/app/dashboard/_components/storefront-settings-form";
import { BrandingSection } from "@/app/dashboard/_components/branding-section";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hasAdminUser, isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { getDashboardCategories, getDashboardProducts, getDashboardUnitTypes, getPublicSettings } from "@/lib/catalog-db";
import { getPublicAssetUrl } from "@/lib/r2";
import { hasDatabaseConfig, isPreviewMode } from "@/lib/env";

export const dynamic = "force-dynamic";

const NAV = [
  { tab: "storefront", label: "Storefront", icon: Megaphone },
  { tab: "catalog", label: "Catalog", icon: Package },
  { tab: "account", label: "Account", icon: UserCog },
] as const;

type Tab = (typeof NAV)[number]["tab"];

const TAB_META: Record<Tab, { title: string; description: string }> = {
  storefront: {
    title: "Storefront",
    description: "Edit promotion banners, collection heading, and WhatsApp settings.",
  },
  catalog: {
    title: "Catalog",
    description: "Products, categories, and unit types available in your storefront.",
  },
  account: {
    title: "Account",
    description: "Change your admin password.",
  },
};

function SetupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#f7f7f5] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#deded9] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--brand,#171716)] text-white">
          <Settings2 className="size-5" />
        </div>
        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">HnJ dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.07em]">{title}</h1>
        {children}
      </div>
    </div>
  );
}

function SidebarContent({ activeTab, preview }: { activeTab: Tab; preview: boolean }) {
  return (
    <>
      <div className="px-5 pb-4 pt-6">
        <p className="text-lg font-semibold tracking-[-0.05em]">HnJ.</p>
        <p className="mt-0.5 text-[11px] font-medium text-[#6c6c68]">Dashboard</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        {NAV.map(({ tab, label, icon: Icon }) => (
          <Link
            key={tab}
            href={`/dashboard?tab=${tab}`}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-[#858580] hover:bg-white/5 hover:text-[#c8c8c4]"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-[#232320] p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#858580] transition-colors hover:bg-white/5 hover:text-[#c8c8c4]"
        >
          <ArrowUpRight className="size-4 shrink-0" />
          View store
        </Link>
        {!preview && (
          <form action={signOutDashboard}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#858580] transition-colors hover:bg-white/5 hover:text-[#c8c8c4]"
            >
              <LogOut className="size-4 shrink-0" />
              Sign out
            </button>
          </form>
        )}
      </div>
    </>
  );
}

function Sidebar({ activeTab, preview }: { activeTab: Tab; preview: boolean }) {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-[#232320] bg-[var(--brand,#171716)] text-white">
      <SidebarContent activeTab={activeTab} preview={preview} />
    </aside>
  );
}

function MobileSidebar({ activeTab, preview }: { activeTab: Tab; preview: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex size-9 items-center justify-center rounded-xl text-[#858580] transition hover:bg-[#f0f0ec] hover:text-[#171716] md:hidden">
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 border-r border-[#232320] bg-[var(--brand,#171716)] p-0 text-white [&>button]:text-[#858580] [&>button]:hover:text-white">
        <SidebarContent activeTab={activeTab} preview={preview} />
      </SheetContent>
    </Sheet>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const preview = isPreviewMode();

  if (!preview && !hasDatabaseConfig()) {
    return (
      <SetupCard title="Connect your database">
        <p className="mt-4 text-sm leading-6 text-[#6c6c68]">
          Add DATABASE_URL, run the database migration, then return here to edit promotion settings.
        </p>
      </SetupCard>
    );
  }

  if (!preview && !(await hasAdminUser())) {
    return (
      <SetupCard title="Create admin account">
        <p className="mt-4 text-sm leading-6 text-[#6c6c68]">
          Set up your username and password to secure the dashboard.
        </p>
        <SetupAdminForm />
      </SetupCard>
    );
  }

  if (!preview && !(await isDashboardAuthenticated())) {
    return (
      <SetupCard title="Sign in">
        <p className="mt-4 text-sm leading-6 text-[#6c6c68]">
          Enter your admin credentials to open the dashboard.
        </p>
        <DashboardLoginForm />
      </SetupCard>
    );
  }

  const { tab } = await searchParams;
  const activeTab: Tab = NAV.some((n) => n.tab === tab) ? (tab as Tab) : "storefront";

  const [settings, products, categories, unitTypes] = await Promise.all([
    getPublicSettings(),
    getDashboardProducts(),
    getDashboardCategories(),
    getDashboardUnitTypes(),
  ]);

  const { title, description } = TAB_META[activeTab];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7f7f5] text-[#171716]">
      <Sidebar activeTab={activeTab} preview={preview} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {preview && (
          <div className="shrink-0 border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-800">
            Preview mode — changes cannot be saved without a database connection.
          </div>
        )}

        <header className="shrink-0 border-b border-[#e1e1dc] bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar activeTab={activeTab} preview={preview} />
            <div>
              <h1 className="text-xl font-semibold tracking-[-0.05em]">{title}</h1>
              <p className="mt-0.5 text-sm text-[#6c6c68]">{description}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "storefront" && (
            <div className="space-y-6">
              <BrandingSection
                initialSettings={settings}
                logoPublicUrl={settings.logoKey ? getPublicAssetUrl(settings.logoKey) : undefined}
                faviconPublicUrl={settings.faviconKey ? getPublicAssetUrl(settings.faviconKey) : undefined}
              />
              <div className="rounded-3xl border border-[#deded9] bg-white p-5 shadow-sm sm:p-7">
                <StorefrontSettingsForm initialSettings={settings} />
              </div>
            </div>
          )}

          {activeTab === "catalog" && (
            <CatalogSection products={products} categories={categories} unitTypes={unitTypes} />
          )}

          {activeTab === "account" && (
            <AccountSection />
          )}
        </main>
      </div>
    </div>
  );
}
