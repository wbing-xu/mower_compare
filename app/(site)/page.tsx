import Link from "next/link";
import { mockCompanies } from "@/data/mock-companies";
import { formatCurrency, getProductImage } from "@/lib/utils";
import { loadAllProducts } from "@/lib/server/products";

export default async function HomePage() {
  const featuredCompanies = mockCompanies.slice(0, 3);
  const allProducts = await loadAllProducts();
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500 p-10 text-white shadow-card">
          <p className="text-sm uppercase tracking-widest text-white/80">行业洞察</p>
          <h1 className="mt-4 text-3xl font-semibold">割草机行业情报中枢</h1>
          <p className="mt-4 max-w-xl text-base text-white/90">
            探索全球割草机与割草机器人品牌的公司画像、产品矩阵与技术参数。通过横向对比与数据导出，帮助团队快速做出战略判断。
          </p>
          <div className="mt-10 flex flex-wrap gap-4 text-sm font-medium">
            <Link
              href="/companies"
              className="rounded-full bg-white px-5 py-2 text-brand-700 shadow-card"
            >
              浏览公司矩阵
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-white/60 px-5 py-2 text-white hover:bg-white/10"
            >
              快速对比型号
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h2 className="text-lg font-semibold text-slate-800">平台指标（示例数据）</h2>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-100 p-4">
              <dt className="text-xs text-slate-500">收录公司</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-800">{mockCompanies.length}+</dd>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <dt className="text-xs text-slate-500">覆盖型号</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-800">{allProducts.length * 5}+</dd>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <dt className="text-xs text-slate-500">参数字段</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-800">80+</dd>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <dt className="text-xs text-slate-500">最近更新</dt>
              <dd className="mt-2 text-sm text-slate-800">2024 年 4 月</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">重点公司</h2>
            <p className="text-sm text-slate-500">根据市场影响力与产品覆盖度精选</p>
          </div>
          <Link href="/companies" className="text-sm text-brand-600 hover:text-brand-700">
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="group rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-100">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800">{company.name}</p>
                  <p className="text-xs text-slate-500">
                    {company.country} · {company.tags.slice(0, 2).join(" / ")}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-600">{company.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                {company.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-full bg-slate-100 px-3 py-1">
                    {highlight}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">热门对比</h2>
            <p className="text-sm text-slate-500">市场关注度最高的割草机组合</p>
          </div>
          <Link href="/compare" className="text-sm text-brand-600 hover:text-brand-700">
            开始对比
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => {
            const imageSrc = getProductImage(product);
            return (
              <div key={product.id} className="rounded-3xl bg-white p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100">
                    <img src={imageSrc} alt={product.modelName} className="h-full w-full object-contain p-2" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{product.modelName}</p>
                    <p className="text-xs text-slate-500">
                      {product.marketPosition} · {product.powertrain}
                    </p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{product.summary}</p>
                {product.priceRange ? (
                  <p className="mt-4 text-sm font-semibold text-brand-600">
                    {formatCurrency(product.priceRange[0])} - {formatCurrency(product.priceRange[1])}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
