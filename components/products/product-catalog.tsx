"use client";

import { useMemo, useState } from "react";
import { productFilters } from "@/data/mock-products";
import { CompareBar } from "@/components/compare/compare-bar";
import { CompareCTA } from "@/components/compare/compare-cta";
import { cn, formatCurrency, getProductImage } from "@/lib/utils";
import { type ProductSummary } from "@/types/domain";

const filterDefaults = {
  powertrain: new Set<string>(),
  marketPosition: new Set<string>(),
  releaseYear: [2018, 2024] as [number, number],
  cuttingWidth: [0, 220] as [number, number]
};

type FilterState = typeof filterDefaults;

type MultiKey = "powertrain" | "marketPosition";
type RangeKey = "releaseYear" | "cuttingWidth";

export function ProductCatalog({ products }: { products: ProductSummary[] }) {
  const [filters, setFilters] = useState<FilterState>(filterDefaults);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.powertrain.size && !filters.powertrain.has(product.powertrain)) {
        return false;
      }
      if (filters.marketPosition.size && !filters.marketPosition.has(product.marketPosition)) {
        return false;
      }
      if (product.releaseYear < filters.releaseYear[0] || product.releaseYear > filters.releaseYear[1]) {
        return false;
      }
      const cuttingWidth = product.specs.find((spec) => spec.definitionId === "cutting_width");
      if (cuttingWidth && typeof cuttingWidth.value === "number") {
        if (cuttingWidth.value < filters.cuttingWidth[0] || cuttingWidth.value > filters.cuttingWidth[1]) {
          return false;
        }
      }
      return true;
    });
  }, [products, filters]);

  const handleToggleMulti = (id: MultiKey, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[id]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [id]: set };
    });
  };

  const handleRangeChange = (id: RangeKey, value: [number, number]) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-widest text-brand-600">Product Atlas</p>
        <h1 className="text-3xl font-semibold text-slate-800">产品目录</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          根据动力、定位、割幅等维度筛选割草机型号，支持勾选加入底部对比栏并快速跳转。
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.32fr,0.68fr]">
        <aside className="space-y-6">
          {productFilters.map((filter) => (
            <div key={filter.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-sm font-semibold text-slate-700">{filter.label}</p>
              {filter.type === "multi-select" && filter.values ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filter.values.map((option) => {
                    const active = filters[filter.id as MultiKey] as Set<string>;
                    const selected = active.has(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleToggleMulti(filter.id as MultiKey, option.value)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-medium transition",
                          selected
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-slate-200 text-slate-600 hover:border-brand-300"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {filter.type === "range" && filter.range ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <input
                    type="number"
                    value={filters[filter.id as RangeKey][0] as number}
                    onChange={(event) => {
                      const min = Number(event.target.value);
                      const [, max] = filters[filter.id as RangeKey] as [number, number];
                      handleRangeChange(filter.id as RangeKey, [min, max]);
                    }}
                    className="w-20 rounded-xl border border-slate-200 px-3 py-2"
                  />
                  <span>~</span>
                  <input
                    type="number"
                    value={filters[filter.id as RangeKey][1] as number}
                    onChange={(event) => {
                      const max = Number(event.target.value);
                      const [min] = filters[filter.id as RangeKey] as [number, number];
                      handleRangeChange(filter.id as RangeKey, [min, max]);
                    }}
                    className="w-20 rounded-xl border border-slate-200 px-3 py-2"
                  />
                  {filter.range.unit ? <span>{filter.range.unit}</span> : null}
                </div>
              ) : null}
            </div>
          ))}
        </aside>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const cuttingWidth = product.specs.find((spec) => spec.definitionId === "cutting_width");
            const imageSrc = getProductImage(product);
            return (
              <div key={product.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100">
                    <img src={imageSrc} alt={product.modelName} className="h-full w-full object-contain p-2" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{product.modelName}</p>
                    <p className="text-xs text-slate-500">
                      {product.brandName ? `${product.brandName} · ` : ""}
                      {product.powertrain} · {product.marketPosition}
                    </p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-4 text-xs text-slate-600">{product.summary}</p>
                <dl className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <dt>上市年份</dt>
                    <dd>{product.releaseYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>割幅</dt>
                    <dd>
                      {cuttingWidth && typeof cuttingWidth.value === "number"
                        ? `${cuttingWidth.value}${cuttingWidth.unit ?? "cm"}`
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>价格区间</dt>
                    <dd>
                      {product.priceRange
                        ? `${formatCurrency(product.priceRange[0])} - ${formatCurrency(product.priceRange[1])}`
                        : "面议"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex items-center justify-between text-xs">
                  <CompareCTA product={product} variant="ghost" />
                  <a href={`/products/${product.id}`} className="text-brand-600 hover:text-brand-700">
                    型号详情 →
                  </a>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              暂无满足条件的型号，请调整筛选条件。
            </div>
          ) : null}
        </div>
      </section>
      <CompareBar />
    </div>
  );
}
