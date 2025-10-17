"use client";

import { useMemo, useState } from "react";
import { mockCompanies } from "@/data/mock-companies";
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

const companyNameMap = new Map(mockCompanies.map((company) => [company.id, company.name ?? company.shortName ?? company.id]));

function getBrandKey(product: ProductSummary) {
  const brandLabel = product.brandName ?? "未标注品牌";
  return `${product.companyId ?? "unknown"}::${brandLabel}`;
}

type FilterState = typeof filterDefaults;

type MultiKey = "powertrain" | "marketPosition";
type RangeKey = "releaseYear" | "cuttingWidth";
type CatalogKey = "companies" | "brands" | "products";

export function ProductCatalog({ products }: { products: ProductSummary[] }) {
  const [filters, setFilters] = useState<FilterState>(filterDefaults);
  const [catalogFilters, setCatalogFilters] = useState({
    companies: new Set<string>(),
    brands: new Set<string>(),
    products: new Set<string>()
  });

  const catalogTree = useMemo(() => {
    const companyBuckets = new Map<
      string,
      {
        id: string;
        name: string;
        brands: Map<
          string,
          {
            id: string;
            name: string;
            products: ProductSummary[];
          }
        >;
      }
    >();

    for (const product of products) {
      const companyId = product.companyId ?? "unknown";
      const companyName = companyNameMap.get(companyId) ?? product.brandName ?? "未标注公司";
      let companyEntry = companyBuckets.get(companyId);
      if (!companyEntry) {
        companyEntry = { id: companyId, name: companyName, brands: new Map() };
        companyBuckets.set(companyId, companyEntry);
      }

      const brandLabel = product.brandName ?? "未标注品牌";
      const brandId = getBrandKey(product);
      let brandEntry = companyEntry.brands.get(brandId);
      if (!brandEntry) {
        brandEntry = { id: brandId, name: brandLabel, products: [] };
        companyEntry.brands.set(brandId, brandEntry);
      }

      brandEntry.products.push(product);
    }

    return Array.from(companyBuckets.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((company) => ({
        ...company,
        brands: Array.from(company.brands.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((brand) => ({
            ...brand,
            products: brand.products.slice().sort((a, b) => a.modelName.localeCompare(b.modelName))
          }))
      }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (catalogFilters.products.size && !catalogFilters.products.has(product.id)) {
        return false;
      }
      const brandKey = getBrandKey(product);
      if (catalogFilters.brands.size && !catalogFilters.brands.has(brandKey)) {
        return false;
      }
      const companyKey = product.companyId ?? "unknown";
      if (catalogFilters.companies.size && !catalogFilters.companies.has(companyKey)) {
        return false;
      }
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
  }, [products, filters, catalogFilters]);

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

  const handleToggleCatalog = (id: CatalogKey, value: string) => {
    setCatalogFilters((prev) => {
      const next = new Set(prev[id]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [id]: next };
    });
  };

  const handleResetCatalog = () => {
    setCatalogFilters({
      companies: new Set<string>(),
      brands: new Set<string>(),
      products: new Set<string>()
    });
  };

  const hasCatalogSelection = useMemo(() => {
    return catalogFilters.companies.size + catalogFilters.brands.size + catalogFilters.products.size > 0;
  }, [catalogFilters]);

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
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-700">公司 / 品牌 / 型号</p>
              <button
                type="button"
                onClick={handleResetCatalog}
                disabled={!hasCatalogSelection}
                className={cn(
                  "text-xs font-medium transition",
                  hasCatalogSelection
                    ? "text-brand-600 hover:text-brand-700"
                    : "cursor-not-allowed text-slate-300"
                )}
              >
                重置
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {catalogTree.map((company) => {
                const companySelected = catalogFilters.companies.has(company.id);
                return (
                  <div key={company.id} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCatalog("companies", company.id)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-2 text-left text-xs font-medium transition",
                        companySelected
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-slate-200 text-slate-600 hover:border-brand-300"
                      )}
                    >
                      {company.name}
                    </button>
                    <div className="space-y-2 border-l border-slate-100 pl-4">
                      {company.brands.map((brand) => {
                        const brandSelected = catalogFilters.brands.has(brand.id);
                        return (
                          <div key={brand.id} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => handleToggleCatalog("brands", brand.id)}
                              className={cn(
                                "w-full rounded-xl border px-3 py-2 text-left text-xs font-medium transition",
                                brandSelected
                                  ? "border-brand-500 bg-brand-50 text-brand-700"
                                  : "border-slate-200 text-slate-500 hover:border-brand-300"
                              )}
                            >
                              {brand.name}
                            </button>
                            <div className="space-y-1 pl-3">
                              {brand.products.map((product) => {
                                const productSelected = catalogFilters.products.has(product.id);
                                return (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleToggleCatalog("products", product.id)}
                                    className={cn(
                                      "block w-full rounded-lg px-3 py-1.5 text-left text-[11px] transition",
                                      productSelected
                                        ? "bg-brand-100 text-brand-700"
                                        : "text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                                    )}
                                  >
                                    {product.modelName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {catalogTree.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  暂无可用的品牌目录
                </p>
              ) : null}
            </div>
          </div>
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
