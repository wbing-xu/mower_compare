"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CopyPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ProductSummary, type Series } from "@/types/domain";
import { useCompareStore } from "@/components/compare/use-compare-store";

interface TreeNodeProps {
  series: Series;
}

function ProductNode({ product }: { product: ProductSummary }) {
  const { toggleProduct, isSelected } = useCompareStore();
  const selected = isSelected(product.id);

  return (
    <li className="rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">{product.modelName}</p>
          <p className="mt-1 text-xs text-slate-500">
            {product.powertrain} · {product.marketPosition} · {product.releaseYear}
          </p>
          <p className="mt-2 text-xs text-slate-600 line-clamp-3">{product.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleProduct(product)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition",
            selected
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-600"
          )}
        >
          <CopyPlus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-brand-600">
        <Link href={`/compare?ids=${product.id}`} className="hover:underline">
          快速对比
        </Link>
        <span>·</span>
        <Link href={`/products/${product.id}`} className="hover:underline">
          查看详情
        </Link>
      </div>
    </li>
  );
}

function SeriesNode({ series }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {series.name}
      </button>
      {expanded ? (
        <ul className="mt-3 space-y-3 pl-6">
          {series.products.map((product) => (
            <ProductNode key={product.id} product={product} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function ProductTree({ seriesList }: { seriesList: Series[] }) {
  return (
    <ul className="space-y-4">
      {seriesList.map((series) => (
        <SeriesNode key={series.id} series={series} />
      ))}
    </ul>
  );
}
