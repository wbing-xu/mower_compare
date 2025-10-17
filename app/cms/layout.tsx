import Link from "next/link";
import "../globals.css";

export default function CmsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold text-brand-300">
            ← 返回前台
          </Link>
          <p className="text-sm text-slate-400">Mower Intelligence CMS</p>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="hidden w-60 flex-shrink-0 space-y-2 md:block">
          <nav className="space-y-1 text-sm">
            <Link href="/cms" className="block rounded-xl bg-slate-800 px-4 py-2">
              仪表盘
            </Link>
            <Link href="/cms/import" className="block rounded-xl px-4 py-2 text-slate-400 hover:bg-slate-800">
              批量导入
            </Link>
            <button className="block w-full rounded-xl px-4 py-2 text-left text-slate-500" disabled>
              权限与审核（规划中）
            </button>
          </nav>
        </aside>
        <section className="flex-1">{children}</section>
      </main>
    </div>
  );
}
