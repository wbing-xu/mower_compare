import { mockCompanies } from "@/data/mock-companies";
import { mockProducts } from "@/data/mock-products";

export default function CmsDashboard() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-widest text-brand-300">CMS</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">内容管理仪表盘</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          预览内容模型、导入流程与工作流规划。后续将接入身份验证、角色权限与版本管理等高级能力。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-800 p-6">
          <p className="text-sm text-slate-400">公司条目</p>
          <p className="mt-2 text-3xl font-semibold text-white">{mockCompanies.length}</p>
          <p className="mt-4 text-xs text-slate-500">同步品牌、事业部结构，并追踪更新时间。</p>
        </div>
        <div className="rounded-3xl bg-slate-800 p-6">
          <p className="text-sm text-slate-400">型号条目</p>
          <p className="mt-2 text-3xl font-semibold text-white">{mockProducts.length}</p>
          <p className="mt-4 text-xs text-slate-500">支持批量导入、参数模板校验与差异对比。</p>
        </div>
        <div className="rounded-3xl bg-slate-800 p-6">
          <p className="text-sm text-slate-400">参数字段</p>
          <p className="mt-2 text-3xl font-semibold text-white">80+</p>
          <p className="mt-4 text-xs text-slate-500">分组管理、单位换算与国际化标签。</p>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-800 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">内容模型规划</h2>
        <ul className="mt-4 space-y-2 list-disc pl-5 text-slate-400">
          <li>Company / Division / Category / Series / Product（支持多语言字段）</li>
          <li>SpecDefinition + SpecValue（参数字典 + 单位换算 + 校验规则）</li>
          <li>Media Library（Logo、产品图、PDF 手册，自动压缩与水印）</li>
          <li>ImportBatch（批量导入记录，包含错误报告与回滚）</li>
        </ul>
      </section>
    </div>
  );
}
