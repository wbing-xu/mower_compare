import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareBar } from "@/components/compare/compare-bar";
import { mockProducts } from "@/data/mock-products";

interface ComparePageProps {
  searchParams: { ids?: string };
}

function CompareContent({ searchParams }: ComparePageProps) {
  const ids = searchParams.ids?.split(",").filter(Boolean);
  const products = ids && ids.length > 0
    ? mockProducts.filter((product) => ids.includes(product.id))
    : mockProducts.slice(0, 3);

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

export default function ComparePage(props: ComparePageProps) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CompareContent {...props} />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
