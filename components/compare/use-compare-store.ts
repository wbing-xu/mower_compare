"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ProductSummary } from "@/types/domain";

interface CompareState {
  products: ProductSummary[];
  maxItems: number;
  toggleProduct: (product: ProductSummary) => void;
  removeProduct: (id: string) => void;
  reset: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      maxItems: 6,
      toggleProduct: (product) => {
        const { products, maxItems } = get();
        const exists = products.find((item) => item.id === product.id);
        if (exists) {
          set({ products: products.filter((item) => item.id !== product.id) });
        } else if (products.length < maxItems) {
          set({ products: [...products, product] });
        }
      },
      removeProduct: (id) => set({ products: get().products.filter((item) => item.id !== id) }),
      reset: () => set({ products: [] }),
      isSelected: (id) => get().products.some((item) => item.id === id)
    }),
    {
      name: "compare-storage"
    }
  )
);
