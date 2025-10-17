"use client";

import { cn } from "@/lib/utils";
import { useCompareStore } from "@/components/compare/use-compare-store";
import { type ProductSummary } from "@/types/domain";

interface CompareCTAProps {
  product: ProductSummary;
  variant?: "primary" | "ghost";
}

export function CompareCTA({ product, variant = "primary" }: CompareCTAProps) {
  const { toggleProduct, isSelected } = useCompareStore();
  const selected = isSelected(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleProduct(product)}
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition",
        variant === "primary"
          ? selected
            ? "bg-brand-600 text-white shadow-card"
            : "bg-brand-50 text-brand-700 hover:bg-brand-100"
          : selected
            ? "border border-brand-600 text-brand-700"
            : "border border-slate-200 text-slate-600 hover:border-brand-300"
      )}
    >
      {selected ? "已加入对比" : "加入对比"}
    </button>
  );
}
