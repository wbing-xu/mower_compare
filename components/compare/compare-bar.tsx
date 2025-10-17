"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCompareStore } from "@/components/compare/use-compare-store";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { products, removeProduct } = useCompareStore();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 rounded-3xl border border-brand-100 bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-slate-700">对比栏（{products.length}/6）</span>
        <div className="flex flex-1 flex-wrap gap-2">
          {products.map((product) => (
            <span
              key={product.id}
              className="group flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
            >
              {product.modelName}
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="rounded-full p-1 text-slate-400 transition group-hover:bg-white group-hover:text-brand-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Link
          href={`/compare?ids=${products.map((product) => product.id).join(",")}`}
          className={cn(
            "rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-card transition",
            products.length === 1 && "bg-brand-400"
          )}
        >
          开始对比
        </Link>
      </div>
    </div>
  );
}
