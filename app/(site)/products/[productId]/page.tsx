import { notFound } from "next/navigation";
import { mockProducts } from "@/data/mock-products";
import { specDictionary, specGroups } from "@/data/specs-dictionary";
import { formatRange } from "@/lib/utils";
import { CompareBar } from "@/components/compare/compare-bar";
import { CompareCTA } from "@/components/compare/compare-cta";

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((item) => item.id === params.productId);

  if (!product) {
    notFound();
  }

  const groupedSpecs = specDictionary.reduce<Record<string, typeof specDictionary>>((acc, definition) => {
    acc[definition.group] ??= [];
    acc[definition.group].push(definition);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-3xl bg-slate-100">
              <img src={product.coverImage} alt={product.modelName} className="h-full w-full object-contain p-4" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">{product.modelName}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {product.powertrain} · {product.marketPosition} · 上市年份 {product.releaseYear}
              </p>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">{product.summary}</p>
            </div>
          </div>
          <CompareCTA product={product} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">参数档案</h2>
        <div className="space-y-4">
          {Object.entries(groupedSpecs).map(([group, definitions]) => (
            <div key={group} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{specGroups[group]?.title ?? group}</p>
                  {specGroups[group]?.description ? (
                    <p className="text-xs text-slate-500">{specGroups[group]?.description}</p>
                  ) : null}
                </div>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {definitions.map((definition) => {
                  const spec = product.specs.find((item) => item.definitionId === definition.id);
                  if (!spec) return null;
                  let value: string;
                  if (Array.isArray(spec.value)) {
                    value = formatRange(
                      spec.value[0] as number | undefined,
                      spec.value[1] as number | undefined,
                      spec.unit ?? definition.unit
                    );
                  } else if (typeof spec.value === "boolean") {
                    value = spec.value ? "是" : "否";
                  } else {
                    value = `${spec.value}${spec.unit ?? definition.unit ?? ""}`;
                  }
                  return (
                    <div key={definition.id} className="rounded-2xl bg-slate-100 p-4">
                      <dt className="text-xs uppercase tracking-widest text-slate-400">{definition.labelZh}</dt>
                      <dd className="mt-2 text-sm font-semibold text-slate-800">{value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      </section>
      <CompareBar />
    </div>
  );
}
