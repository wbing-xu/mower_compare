import { promises as fs } from "fs";
import path from "path";
function extractArray(content, exportName) {
  const regex = new RegExp(`export const ${exportName}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const match = content.match(regex);
  if (!match) {
    throw new Error(`未找到 ${exportName} 定义`);
  }
  const factory = new Function(`return ${match[1]};`);
  return factory();
}

async function main() {
  const sourcePath = path.join(process.cwd(), "data", "mock-products.ts");
  const output = path.join(process.cwd(), "data", "imported-products.json");
  const raw = await fs.readFile(sourcePath, "utf-8");
  const products = extractArray(raw, "mockProducts");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(products, null, 2), "utf-8");
  console.log(`已写入 ${products.length} 条产品到 ${output}`);
}

main().catch((error) => {
  console.error("导出产品数据失败", error);
  process.exit(1);
});
