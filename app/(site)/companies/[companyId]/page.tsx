import { notFound } from "next/navigation";
import { mockCompanies } from "@/data/mock-companies";
import { ProductTree } from "@/components/products/product-tree";
import { CompareBar } from "@/components/compare/compare-bar";

interface CompanyPageProps {
  params: { companyId: string };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = mockCompanies.find((item) => item.id === params.companyId);

  if (!company) {
    notFound();
  }

  const currentCompany = company;

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-3xl bg-slate-100">
              <img src={currentCompany.logo} alt={currentCompany.name} className="h-full w-full object-contain p-4" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">{currentCompany.name}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {currentCompany.country}
                {currentCompany.city ? ` · ${currentCompany.city}` : ""} · {currentCompany.listed ? "上市公司" : "私有企业"}
              </p>
              {currentCompany.website ? (
                <a href={currentCompany.website} className="mt-2 inline-flex text-sm text-brand-600 hover:underline">
                  官方网站 →
                </a>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 text-sm text-slate-600 md:text-right">
            <p className="font-semibold text-slate-700">公司亮点</p>
            <ul className="space-y-2">
              {currentCompany.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-slate-100 px-4 py-2">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-sm leading-6 text-slate-600">{currentCompany.description}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
          {currentCompany.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">产品矩阵</h2>
          <p className="text-sm text-slate-500">
            支持自上而下的事业部/品牌 → 品类 → 系列 → 型号结构，可直接勾选型号加入对比栏。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.35fr,0.65fr]">
          <nav className="space-y-4">
            {currentCompany.divisions.map((division) => (
              <div key={division.id} className="rounded-3xl bg-white p-6 shadow-card">
                <p className="text-sm font-semibold text-slate-700">{division.name}</p>
                <p className="mt-2 text-xs text-slate-500">{division.description}</p>
                <ul className="mt-4 space-y-3 text-xs text-slate-600">
                  {division.children.map((category) => (
                    <li key={category.id} className="rounded-2xl bg-slate-100 px-4 py-2">
                      {category.taxonomyPath.join(" / ")}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="space-y-6">
            {currentCompany.divisions.flatMap((division) =>
              division.children.map((category) => (
                <div key={category.id} className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{category.name}</p>
                    <p className="text-xs text-slate-500">{category.taxonomyPath.join(" / ")}</p>
                  </div>
                  <ProductTree seriesList={category.children} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <CompareBar />
    </div>
  );
}
