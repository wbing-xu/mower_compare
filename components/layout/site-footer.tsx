export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Mower Intelligence. 保留所有权利。</p>
        <div className="flex gap-4">
          <a href="mailto:hello@mower-intelligence.com" className="hover:text-brand-600">
            联系我们
          </a>
          <a href="#" className="hover:text-brand-600">
            隐私政策
          </a>
          <a href="#" className="hover:text-brand-600">
            数据说明
          </a>
        </div>
      </div>
    </footer>
  );
}
