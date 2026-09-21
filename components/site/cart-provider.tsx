"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Product, ProductVariant } from "@/lib/catalog";
import type { WhatsAppSettings } from "@/lib/whatsapp";

export type CartItem = Pick<Product, "id" | "name" | "slug" | "categoryLabel"> & {
  price: number;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  settings: WhatsAppSettings;
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  setOpen: (open: boolean) => void;
};

const CART_STORAGE_KEY = "hnj-cart";
const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.slug === "string" && typeof item.price === "number" && typeof item.categoryLabel === "string" && typeof item.quantity === "number" && item.quantity > 0;
}

export function CartProvider({ children, settings }: { children: ReactNode; settings: WhatsAppSettings }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) window.setTimeout(() => setItems(parsed.filter(isCartItem)), 0);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      window.setTimeout(() => setHasLoaded(true), 0);
    }
  }, []);

  useEffect(() => {
    if (hasLoaded) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hasLoaded, items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, variant?: ProductVariant) => {
      const cartId = variant ? `${product.id}:${variant.id}` : product.id;
      const price = variant ? variant.price : product.price;
      const variantLabel = variant ? `${variant.quantity} ${variant.unitTypeName}` : undefined;
      setItems((current) => {
        const existing = current.find((item) => item.id === cartId);
        if (existing) return current.map((item) => item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { id: cartId, name: product.name, slug: product.slug, price, categoryLabel: product.categoryLabel, quantity: 1, variantId: variant?.id, variantLabel }];
      });
    };
    const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
    const setQuantity = (id: string, quantity: number) => setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, itemCount, subtotal, isOpen, settings, addItem, removeItem, setQuantity, setOpen };
  }, [isOpen, items, settings]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
