import Link from "next/link";
import { mockCompanies } from "@/data/mock-companies";

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-widest text-brand-600">Industry Map</p>
        <h1 className="text-3xl font-semibold text-slate-800">公司矩阵</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          按公司、品牌与事业部梳理行业玩家概况，并提供快速进入产品矩阵与对比的入口。后续将支持搜索、筛选与分页功能。
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className="group flex flex-col rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-100">
                <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-3" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">{company.name}</p>
                <p className="text-xs text-slate-500">
                  {company.country} · {company.tags.slice(0, 3).join(" / ")}
                </p>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-slate-600">{company.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {company.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1">
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-brand-600">
              <span>查看产品矩阵</span>
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
