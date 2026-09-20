export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: number;
  featured: boolean;
  format: string;
  imageUrl?: string;
  art: {
    background: string;
    foreground: string;
    accent: string;
    label: string;
  };
};

export const categories = [
  { name: "All products", slug: "all", count: 6 },
  { name: "Templates", slug: "templates", count: 2 },
  { name: "Presentations", slug: "presentations", count: 1 },
  { name: "Business", slug: "business", count: 2 },
  { name: "Creator tools", slug: "creator-tools", count: 1 },
];

export const products: Product[] = [
  {
    id: "prod-layout-launchpad",
    slug: "layout-launchpad",
    name: "Layout Launchpad",
    category: "templates",
    categoryLabel: "Templates",
    description: "A focused portfolio system for shipping your best work with clarity.",
    price: 79000,
    featured: true,
    format: "Figma + PDF",
    art: {
      background: "#e7e2d7",
      foreground: "#263329",
      accent: "#d7ec67",
      label: "LAYOUT",
    },
  },
  {
    id: "prod-studio-pitch",
    slug: "studio-pitch-deck",
    name: "Studio Pitch Deck",
    category: "presentations",
    categoryLabel: "Presentations",
    description: "A warm, editorial deck for ideas that deserve a sharper first impression.",
    price: 99000,
    featured: true,
    format: "Keynote + PPTX",
    art: {
      background: "#e2d8fa",
      foreground: "#302653",
      accent: "#a995ef",
      label: "STUDIO",
    },
  },
  {
    id: "prod-creator-kit",
    slug: "creator-content-kit",
    name: "Creator Content Kit",
    category: "creator-tools",
    categoryLabel: "Creator tools",
    description: "A flexible set of social layouts to keep your next month moving.",
    price: 59000,
    featured: true,
    format: "Canva + PNG",
    art: {
      background: "#f8dfd3",
      foreground: "#6e2f26",
      accent: "#f4a68e",
      label: "CREATE",
    },
  },
  {
    id: "prod-invoice-flow",
    slug: "invoice-flow",
    name: "Invoice Flow",
    category: "business",
    categoryLabel: "Business",
    description: "Simple, polished invoice templates that help you get paid on time.",
    price: 39000,
    featured: true,
    format: "Sheets + Docs",
    art: {
      background: "#d7ece7",
      foreground: "#194943",
      accent: "#77d3bf",
      label: "FLOW",
    },
  },
  {
    id: "prod-portfolio-pro",
    slug: "portfolio-pro",
    name: "Portfolio Pro",
    category: "templates",
    categoryLabel: "Templates",
    description: "A crisp case study framework for turning process into proof.",
    price: 69000,
    featured: false,
    format: "Notion + PDF",
    art: {
      background: "#f2e5bd",
      foreground: "#62480f",
      accent: "#edc85d",
      label: "PROOF",
    },
  },
  {
    id: "prod-notion-os",
    slug: "notion-os",
    name: "Notion OS",
    category: "business",
    categoryLabel: "Business",
    description: "A calm command center for projects, planning, and repeatable momentum.",
    price: 89000,
    featured: false,
    format: "Notion template",
    art: {
      background: "#dedfe2",
      foreground: "#34373c",
      accent: "#ffffff",
      label: "SYSTEM",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProducts({ query, category }: { query?: string; category?: string } = {}) {
  const normalizedQuery = query?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery = normalizedQuery
      ? `${product.name} ${product.description} ${product.categoryLabel}`
          .toLowerCase()
          .includes(normalizedQuery)
      : true;
    const matchesCategory = category && category !== "all" ? product.category === category : true;

    return matchesQuery && matchesCategory;
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getWhatsAppHref(product?: Product) {
  const message = product
    ? `Halo kak, saya tertarik dengan produk ${product.name} seharga ${formatPrice(product.price)}. Apakah produknya masih tersedia?`
    : "Halo kak, saya ingin bertanya tentang produk digital yang tersedia.";

  return `https://wa.me/628123456789?text=${encodeURIComponent(message)}`;
}


