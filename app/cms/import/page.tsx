"use client";

import { useMemo, useState } from "react";
import { specDictionary } from "@/data/specs-dictionary";

interface DraftProduct {
  id: string;
  modelName: string;
  coverImage?: string;
  companyId: string;
  divisionId: string;
  categoryId: string;
  seriesId: string;
  brandName?: string;
  marketPosition?: string;
  powertrain?: string;
  releaseYear?: number;
  status?: string;
  summary?: string;
  priceMin?: number;
  priceMax?: number;
  specs: Record<string, unknown>;
}

const PRODUCT_FIELDS = new Set([
  "id",
  "modelName",
  "coverImage",
  "companyId",
  "divisionId",
  "categoryId",
  "seriesId",
  "brandName",
  "marketPosition",
  "powertrain",
  "releaseYear",
  "status",
  "summary",
  "priceMin",
  "priceMax"
]);

const NUMERIC_FIELDS = new Set(["releaseYear", "priceMin", "priceMax"]);

function parseBoolean(value: string) {
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y", "是"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "否"].includes(normalized)) return false;
  return value;
}

function coerceValue(key: string, raw: string): unknown {
  if (raw === undefined) return undefined;
  const value = raw.trim();
  if (value === "") return undefined;
  if (NUMERIC_FIELDS.has(key)) {
    const num = Number(value.replace(/[^\d.\-]/g, ""));
    return Number.isNaN(num) ? undefined : num;
  }
  if (value.includes("||")) {
    const [val, unit] = value.split("||").map((part) => part.trim());
    return { value: val, unit };
  }
  return parseBoolean(value);
}

function parseCsv(text: string): DraftProduct[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((header) => header.trim());
  const rows = lines.slice(1);
  return rows.map((row) => {
    const cells = row.split(",");
    const product: DraftProduct = {
      id: "",
      modelName: "",
      companyId: "",
      divisionId: "",
      categoryId: "",
      seriesId: "",
      specs: {}
    } as DraftProduct;
    headers.forEach((header, index) => {
      const raw = cells[index] ?? "";
      const value = coerceValue(header, raw);
      if (value === undefined) return;
      if (PRODUCT_FIELDS.has(header)) {
        (product as Record<string, unknown>)[header] = value;
      } else {
        product.specs[header] = value;
      }
    });
    return product;
  });
}

function parseJson(text: string): DraftProduct[] {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      return data.map((item) => ({ specs: {}, ...item } as DraftProduct));
    }
    if (data && typeof data === "object" && Array.isArray((data as { products?: DraftProduct[] }).products)) {
      return ((data as { products: DraftProduct[] }).products ?? []).map((item) => ({ specs: {}, ...item }));
    }
  } catch (error) {
    console.error("parse json error", error);
  }
  return [];
}

export default function ImportPage() {
  const [username, setUsername] = useState("pudu");
  const [password, setPassword] = useState("pudu");
  const [drafts, setDrafts] = useState<DraftProduct[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const specKeySet = useMemo(() => new Set(specDictionary.map((definition) => definition.key)), []);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const trimmed = text.trim();
    let parsed: DraftProduct[] = [];
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      parsed = parseJson(trimmed);
    }
    if (parsed.length === 0) {
      parsed = parseCsv(trimmed);
    }
    setDrafts(
      parsed.map((item) => ({
        ...item,
        specs: Object.fromEntries(
          Object.entries(item.specs ?? {}).filter(([key]) => specKeySet.has(key))
        )
      }))
    );
    setMessage(`已解析 ${parsed.length} 条记录`);
    setError(null);
  };

  const handleImport = async () => {
    if (drafts.length === 0) {
      setError("请先导入 CSV 或 JSON 数据");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`
        },
        body: JSON.stringify({ products: drafts })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "导入失败");
      } else {
        setMessage(`成功导入 ${data.imported} 条产品`);
      }
    } catch (importError) {
      setError("网络请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-200">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand-300">Import</p>
        <h1 className="text-3xl font-semibold text-white">批量导入工具</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          支持上传 CSV / JSON，字段名称与参数字典保持一致。CSV 中如需自定义单位，可使用 "值||单位" 的格式表示。
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-slate-800 p-6 shadow-lg shadow-slate-950/30">
          <h2 className="text-lg font-semibold text-white">认证信息</h2>
          <p className="text-sm text-slate-400">默认演示账号：pudu / pudu，可自行修改。</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-xs uppercase tracking-widest text-slate-500">
              用户名
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-400 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-xs uppercase tracking-widest text-slate-500">
              密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-400 focus:outline-none"
              />
            </label>
          </div>
          <label className="block rounded-2xl border border-dashed border-slate-600 p-6 text-center text-sm text-slate-400">
            <span className="block text-sm font-semibold text-white">上传 CSV / JSON 文件</span>
            <span className="mt-2 block text-xs text-slate-500">字段示例：cutting_width、runtime、navigation_obstacle...</span>
            <input
              type="file"
              accept=".csv,.json,.txt"
              className="mt-4 hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleFile(file);
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-800"
          >
            {loading ? "导入中..." : "开始导入"}
          </button>
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        </div>

        <div className="space-y-4 rounded-3xl bg-slate-800 p-6 shadow-lg shadow-slate-950/30">
          <h2 className="text-lg font-semibold text-white">字段对照</h2>
          <p className="text-sm text-slate-400">以下为支持的参数字段键值，导入时请与 key 对应：</p>
          <div className="grid max-h-80 grid-cols-2 gap-3 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-300">
            {specDictionary.map((definition) => (
              <div key={definition.id}>
                <p className="font-semibold text-white/90">{definition.key}</p>
                <p className="text-[11px] text-slate-500">{definition.labelZh}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-900 p-4 text-xs text-slate-400">
            <p>CSV 示例：</p>
            <pre className="mt-2 whitespace-pre-wrap text-[11px] text-slate-300">
{`id,modelName,companyId,divisionId,categoryId,seriesId,marketPosition,powertrain,cutting_width,runtime
new-robot,演示机型,toro,toro-hayter,hayter-robotic,hayter-oaspire,prosumer,Robot,55||cm,120 分钟`}
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">预览（共 {drafts.length} 条）</h2>
        <div className="overflow-hidden rounded-3xl bg-slate-800">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">型号</th>
                <th className="px-4 py-3">公司 / 品牌</th>
                <th className="px-4 py-3">定位</th>
                <th className="px-4 py-3">参数数</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((draft) => (
                <tr key={draft.id} className="border-t border-slate-700/40">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{draft.id}</td>
                  <td className="px-4 py-3 text-white">{draft.modelName}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {draft.companyId}
                    {draft.brandName ? ` / ${draft.brandName}` : ""}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{draft.marketPosition ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-400">{Object.keys(draft.specs ?? {}).length}</td>
                </tr>
              ))}
              {drafts.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                    尚未导入数据。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
