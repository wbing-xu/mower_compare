const steps = [
  {
    title: "下载模板",
    description: "选择导入类型（公司 / 产品 / 参数值）并下载 CSV/Excel/JSON 模板文件。"
  },
  {
    title: "映射字段",
    description: "上传文件后匹配系统字段，支持保存映射配置。"
  },
  {
    title: "预检与校验",
    description: "执行枚举、单位、数据类型校验，生成错误报告与修复建议。"
  },
  {
    title: "差异预览",
    description: "展示将创建/更新/删除的条目，支持与上一个版本对比。"
  },
  {
    title: "提交发布",
    description: "导入成功后生成 ImportBatch 记录，可回滚并关联审计日志。"
  }
];

export default function ImportPage() {
  return (
    <div className="space-y-8 text-slate-200">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand-300">Import</p>
        <h1 className="text-3xl font-semibold text-white">批量导入流程设计</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          通过可配置的模板与校验规则，确保大批量数据导入的准确性与可追溯性。
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-3xl bg-slate-800 p-6 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-widest text-slate-500">Step {index + 1}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{step.title}</h2>
            <p className="mt-3 text-sm text-slate-400">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">示例接口规划</h2>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-300">
{`POST /api/import
{
  "type": "product",
  "fileUrl": "https://storage/imports/batch-20240412.xlsx",
  "mapping": {
    "model": "型号",
    "brand": "品牌",
    "release_year": "上市年份",
    "cutting_width": "割幅"
  },
  "options": {
    "validateOnly": false,
    "publish": true
  }
}`}
        </pre>
      </section>
    </div>
  );
}
