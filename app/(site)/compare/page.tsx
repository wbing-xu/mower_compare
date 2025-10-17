import { redirect } from "next/navigation";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareBar } from "@/components/compare/compare-bar";
import { loadAllProducts, loadProductsByIds } from "@/lib/server/products";

interface ComparePageProps {
  searchParams: { ids?: string };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const ids = searchParams.ids?.split(",").filter(Boolean);
  let products = [];
  if (ids && ids.length > 0) {
    products = await loadProductsByIds(ids);
  } else {
    const all = await loadAllProducts();
    products = all.slice(0, 3);
  }

  if (products.length === 0) {
    redirect("/products");
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-widest text-brand-600">Compare</p>
        <h1 className="text-3xl font-semibold text-slate-800">型号参数对比</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          选择多款割草机型号进行横向对比，可通过“仅看差异”快速定位关键区别。后续将加入导出、对比模板与差异排序等高级能力。
        </p>
      </header>
      <CompareTable products={products} />
      <CompareBar />
    </div>
  );
}

export const dynamic = "force-dynamic";
