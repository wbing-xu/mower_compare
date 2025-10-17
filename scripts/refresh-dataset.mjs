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

function escapeForSvg(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildProductSvg(product, palette) {
  const title = escapeForSvg(product.modelName ?? product.id);
  const brand = product.brandName ? escapeForSvg(product.brandName) : "";
  const summary = product.summary ? escapeForSvg(product.summary) : "";
  const powertrain = product.powertrain ? escapeForSvg(product.powertrain) : "";
  const market = product.marketPosition ? escapeForSvg(product.marketPosition) : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${summary}</desc>
  <defs>
    <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette[0]}" />
      <stop offset="100%" stop-color="${palette[1]}" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="48" fill="url(#gradient)" />
  <g fill="white" font-family="'Inter', 'Source Han Sans', sans-serif">
    <text x="60" y="180" font-size="48" font-weight="600" opacity="0.85">${brand}</text>
    <text x="60" y="260" font-size="72" font-weight="700">${title}</text>
    <text x="60" y="340" font-size="24" font-weight="500" opacity="0.7">${powertrain} · ${market}</text>
    <foreignObject x="60" y="370" width="680" height="200">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:22px; line-height:1.4; color:rgba(255,255,255,0.82); font-weight:500;">
        ${summary}
      </div>
    </foreignObject>
  </g>
</svg>`;
}

async function main() {
  const sourcePath = path.join(process.cwd(), "data", "mock-products.ts");
  const output = path.join(process.cwd(), "data", "imported-products.json");
  const raw = await fs.readFile(sourcePath, "utf-8");
  const products = extractArray(raw, "mockProducts");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(products, null, 2), "utf-8");
  console.log(`已写入 ${products.length} 条产品到 ${output}`);

  const imageDir = path.join(process.cwd(), "public", "product-images");
  await fs.mkdir(imageDir, { recursive: true });
  const palette = [
    ["#134E5E", "#71B280"],
    ["#0B486B", "#F56217"],
    ["#42275A", "#734B6D"],
    ["#355C7D", "#6C5B7B"],
    ["#1D976C", "#93F9B9"],
    ["#1A2980", "#26D0CE"],
    ["#16222A", "#3A6073"],
    ["#4568DC", "#B06AB3"],
    ["#0F2027", "#203A43"],
    ["#314755", "#26A0DA"]
  ];
  const manifest = {};
  await Promise.all(
    products.map((product, index) => {
      const fileName = `${product.id}.svg`;
      const filePath = path.join(imageDir, fileName);
      const colors = palette[index % palette.length];
      const svg = buildProductSvg(product, colors);
      manifest[product.id] = `/product-images/${fileName}`;
      return fs.writeFile(filePath, svg, "utf-8");
    })
  );
  const sortedManifest = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );
  const manifestPath = path.join(process.cwd(), "data", "product-image-manifest.ts");
  const manifestSource =
    `export const productImageManifest = ${JSON.stringify(sortedManifest, null, 2)} as Record<string, string>;\n`;
  await fs.writeFile(manifestPath, manifestSource, "utf-8");
  console.log(`已生成 ${Object.keys(manifest).length} 个产品占位图到 ${imageDir}`);
}

main().catch((error) => {
  console.error("导出产品数据失败", error);
  process.exit(1);
});
