"use client";

import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { specDictionary, specGroups } from "@/data/specs-dictionary";
import { type ProductSummary } from "@/types/domain";
import { cn, formatRange } from "@/lib/utils";

interface CompareTableProps {
  products: ProductSummary[];
}

export function CompareTable({ products }: CompareTableProps) {
  const [onlyDiff, setOnlyDiff] = useState(false);

  const specsByGroup = useMemo(() => {
    return specDictionary.reduce<Record<string, typeof specDictionary>>((acc, definition) => {
      acc[definition.group] ??= [];
      acc[definition.group].push(definition);
      return acc;
    }, {});
  }, []);

  const differenceMap = useMemo(() => {
    const map = new Map<string, boolean>();
    specDictionary.forEach((definition) => {
      const normalized = products.map((product) => {
        const spec = product.specs.find((item) => item.definitionId === definition.id);
        if (!spec) return "-";
        if (Array.isArray(spec.value)) {
          return JSON.stringify(spec.value);
        }
        return `${spec.value}${spec.unit ?? ""}`;
      });
      map.set(definition.id, new Set(normalized).size > 1);
    });
    return map;
  }, [products]);

  const shouldHideRow = (definitionId: string) => {
    if (!onlyDiff) return false;
    const values = products.map((product) =>
      product.specs.find((spec) => spec.definitionId === definitionId)?.value ?? "-"
    );
    return values.every((value) => value === values[0]);
  };

  return (
    <div className="rounded-3xl bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">参数对比</h2>
          <p className="text-xs text-slate-500">支持高亮差异、折叠相同项的演示版本</p>
        </div>
        <button
          type="button"
          onClick={() => setOnlyDiff((value) => !value)}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-medium transition",
            onlyDiff ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"
          )}
        >
          {onlyDiff ? "显示全部" : "仅看差异"}
        </button>
      </div>
      <div className="relative">
        <div className="sticky left-0 top-0 z-10 hidden h-full min-w-[220px] border-r border-slate-100 bg-white p-6 text-sm font-semibold text-slate-500 lg:block">
          参数分组
        </div>
        <ScrollArea className="w-full">
          <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            <div className="hidden lg:block" />
            {products.map((product) => (
              <div key={product.id} className="border-l border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100">
                    <img src={product.coverImage} alt={product.modelName} className="h-full w-full object-contain p-2" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{product.modelName}</p>
                    <p className="text-xs text-slate-500">
                      {product.powertrain} · {product.marketPosition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {Object.entries(specsByGroup).map(([group, definitions]) => (
            <div key={group} className="border-t border-slate-100">
              <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                <div className="hidden flex-col border-r border-slate-100 bg-slate-50 px-6 py-4 lg:flex">
                  <p className="text-sm font-semibold text-slate-700">{specGroups[group]?.title ?? group}</p>
                  {specGroups[group]?.description ? (
                    <p className="mt-1 text-xs text-slate-500">{specGroups[group]?.description}</p>
                  ) : null}
                </div>
                {products.map((product) => (
                  <div key={product.id} className="border-l border-slate-100 bg-white p-6">
                    {definitions.map((definition) => {
                      const spec = product.specs.find((item) => item.definitionId === definition.id);
                      if (shouldHideRow(definition.id)) {
                        return null;
                      }
                      const value = (() => {
                        if (!spec) return "-";
                        if (Array.isArray(spec.value)) {
                          return formatRange(
                            spec.value[0] as number | undefined,
                            spec.value[1] as number | undefined,
                            spec.unit ?? definition.unit
                          );
                        }
                        if (typeof spec.value === "boolean") {
                          return spec.value ? "是" : "否";
                        }
                        return `${spec.value}${spec.unit ?? definition.unit ?? ""}`;
                      })();

                      const isDifferent = differenceMap.get(definition.id);

                      return (
                        <div
                          key={definition.id}
                          className={cn(
                            "flex flex-col gap-1 border-b border-slate-100 py-3 text-sm",
                            isDifferent && "bg-brand-50"
                          )}
                        >
                          <p className="text-xs uppercase tracking-wide text-slate-400">{definition.labelZh}</p>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isDifferent ? "text-brand-700" : "text-slate-800"
                            )}
                          >
                            {value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
