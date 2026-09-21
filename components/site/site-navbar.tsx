import { NavbarInner } from "@/components/site/navbar-inner";
import { getPublicAssetUrl } from "@/lib/r2";
import { getPublicSettings } from "@/lib/catalog-db";

export async function SiteNavbar() {
  const settings = await getPublicSettings();
  const logoPublicUrl = settings.logoKey ? getPublicAssetUrl(settings.logoKey) : undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-[#deded9]/90 bg-[#f7f7f5]/90 backdrop-blur-xl">
      <NavbarInner siteName={settings.siteName} logoPublicUrl={logoPublicUrl} />
    </header>
  );
}
