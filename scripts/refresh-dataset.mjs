import { promises as fs } from "fs";
import path from "path";

const USER_AGENT = "mower-compare-asset-sync/1.0 (+https://example.com)";
const args = new Set(process.argv.slice(2));
const skipDownload = args.has("--skip-download");

const LOGO_SOURCES = [
  { slug: "stanley-black-decker", label: "Stanley Black & Decker", url: "https://upload.wikimedia.org/wikipedia/commons/6/67/Stanley_Black_%26_Decker_logo.svg" },
  { slug: "stanley", label: "Stanley", url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Stanley_logo.svg" },
  { slug: "craftsman", label: "Craftsman", url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Craftsman_logo.svg" },
  { slug: "mtd-holdings", label: "MTD Holdings", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/MTD_Products_logo.svg" },
  { slug: "mtd", label: "MTD", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/MTD_Products_logo.svg" },
  { slug: "mtd-professional", label: "MTD Professional", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/MTD_Products_logo.svg" },
  { slug: "husqvarna-group", label: "Husqvarna Group", url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Husqvarna_logo.svg" },
  { slug: "husqvarna", label: "Husqvarna", url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Husqvarna_logo.svg" },
  { slug: "john-deere", label: "John Deere", url: "https://upload.wikimedia.org/wikipedia/en/2/21/John_Deere_logo.svg" },
  { slug: "toro", label: "Toro", url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Toro_logo.svg" },
  { slug: "exmark", label: "Exmark", url: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Exmark_logo.svg" },
  { slug: "ariensco", label: "AriensCo", url: "https://upload.wikimedia.org/wikipedia/en/a/a5/Ariens_Company_logo.svg" },
  { slug: "ariens", label: "Ariens", url: "https://upload.wikimedia.org/wikipedia/en/a/a5/Ariens_Company_logo.svg" },
  { slug: "gravely", label: "Gravely", url: "https://upload.wikimedia.org/wikipedia/commons/2/25/Gravely_logo.svg" },
  { slug: "stiga-group", label: "Stiga Group", url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Stiga_logo.svg" },
  { slug: "stiga", label: "Stiga", url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Stiga_logo.svg" },
  { slug: "swisher", label: "Swisher", url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Swisher_logo.png" },
  { slug: "doosan-bobcat", label: "Doosan Bobcat", url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bobcat_company_logo.svg" },
  { slug: "bobcat", label: "Bobcat", url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bobcat_company_logo.svg" },
  { slug: "greenworks", label: "Greenworks", url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Greenworks_logo.svg" },
  { slug: "tti", label: "TTI", url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Techtronic_Industries_logo.svg" },
  { slug: "ryobi", label: "Ryobi", url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ryobi_logo.svg" },
  { slug: "chervon", label: "Chervon", url: "https://upload.wikimedia.org/wikipedia/commons/9/99/Chervon_logo.svg" },
  { slug: "ego", label: "EGO", url: "https://upload.wikimedia.org/wikipedia/commons/3/34/EGO_Power%2B_logo.svg" },
  { slug: "scag", label: "Scag", url: "https://upload.wikimedia.org/wikipedia/en/2/2f/Scag_Power_Equipment_logo.png" },
  { slug: "wright", label: "Wright", url: "https://upload.wikimedia.org/wikipedia/en/9/93/Wright_Manufacturing_logo.png" },
  { slug: "mean-green", label: "Mean Green", url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Mean_Green_Mowers_logo.png" },
  { slug: "stihl", label: "Stihl", url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Stihl_logo.svg" },
  { slug: "textron", label: "Textron", url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Textron_logo.svg" },
  { slug: "jacobsen", label: "Jacobsen", url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Jacobsen_logo.svg" },
  { slug: "honda", label: "Honda", url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Honda_logo.svg" },
  { slug: "kubota", label: "Kubota", url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Kubota-Logo.svg" },
  { slug: "bad-boy", label: "Bad Boy", url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bad_Boy_Mowers_logo.png" },
  { slug: "bad-boy-mowers", label: "Bad Boy Mowers", url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bad_Boy_Mowers_logo.png" },
  { slug: "ditch-witch", label: "Ditch Witch", url: "https://upload.wikimedia.org/wikipedia/commons/6/68/Ditch_Witch_logo.svg" },
  { slug: "hayter", label: "Hayter", url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Hayter_logo.svg" },
  { slug: "boss", label: "Boss", url: "https://upload.wikimedia.org/wikipedia/commons/9/94/The_Boss_Snowplow_logo.png" },
  { slug: "cub-cadet", label: "Cub Cadet", url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Cub_Cadet_logo.svg" },
  { slug: "mean-green-mowers", label: "Mean Green", url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Mean_Green_Mowers_logo.png" }
];

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

function buildProductPlaceholder(product, palette) {
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

function buildLogoPlaceholder(label) {
  const safe = escapeForSvg(label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">
  <rect width="320" height="160" rx="24" fill="#1f2937" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', 'Source Han Sans', sans-serif" font-size="48" font-weight="600" fill="#f8fafc">${safe}</text>
</svg>`;
}

function guessExtension(url, contentType, fallback = ".jpg") {
  if (contentType) {
    if (contentType.includes("svg")) return ".svg";
    if (contentType.includes("png")) return ".png";
    if (contentType.includes("jpeg")) return ".jpg";
    if (contentType.includes("webp")) return ".webp";
  }
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      return `.${match[1].toLowerCase()}`;
    }
  } catch {
    // ignore
  }
  return fallback;
}

async function fetchBinary(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT },
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "";
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } finally {
    clearTimeout(timeout);
  }
}

async function writeIfChanged(filePath, data) {
  try {
    const current = await fs.readFile(filePath);
    if (Buffer.compare(current, data) === 0) {
      return;
    }
  } catch {
    // ignore missing file
  }
  await fs.writeFile(filePath, data);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function syncProductImages(products) {
  const imageDir = path.join(process.cwd(), "public", "product-images");
  await fs.rm(imageDir, { recursive: true, force: true });
  await ensureDir(imageDir);

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
  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const candidates = [];
    if (typeof product.coverImage === "string" && product.coverImage.startsWith("http")) {
      candidates.push(product.coverImage);
    }
    if (Array.isArray(product.specs)) {
      for (const spec of product.specs) {
        if (spec?.definitionId === "product_image" && typeof spec.value === "string" && spec.value.startsWith("http")) {
          candidates.push(spec.value);
        }
      }
    }

    let savedFile = null;
    if (!skipDownload) {
      for (const url of candidates) {
        try {
          const { buffer, contentType } = await fetchBinary(url);
          const ext = guessExtension(url, contentType);
          const fileName = `${product.id}${ext}`;
          const filePath = path.join(imageDir, fileName);
          await writeIfChanged(filePath, buffer);
          savedFile = fileName;
          console.log(`✓ 下载产品图片 ${product.id} <- ${url}`);
          break;
        } catch (error) {
          console.warn(`× 下载 ${url} 失败: ${error.message}`);
        }
      }
    }

    if (!savedFile) {
      const fileName = `${product.id}-placeholder.svg`;
      const filePath = path.join(imageDir, fileName);
      const svg = buildProductPlaceholder(product, palette[index % palette.length]);
      await fs.writeFile(filePath, svg, "utf-8");
      savedFile = fileName;
    }
    manifest[product.id] = `/product-images/${savedFile}`;
  }

  const sortedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  const manifestPath = path.join(process.cwd(), "data", "product-image-manifest.ts");
  const manifestSource = `export const productImageManifest = ${JSON.stringify(sortedManifest, null, 2)} as Record<string, string>;\n`;
  await fs.writeFile(manifestPath, manifestSource, "utf-8");
  console.log(`已生成产品图片清单，共 ${Object.keys(sortedManifest).length} 项`);
}

async function syncLogos() {
  const logoDir = path.join(process.cwd(), "public", "logos");
  await ensureDir(logoDir);
  const manifest = {};

  for (const entry of LOGO_SOURCES) {
    const baseName = entry.slug;
    let fileName = null;
    if (!skipDownload) {
      try {
        const { buffer, contentType } = await fetchBinary(entry.url);
        const ext = guessExtension(entry.url, contentType, ".svg");
        const resolvedName = `${baseName}${ext}`;
        const filePath = path.join(logoDir, resolvedName);
        await writeIfChanged(filePath, buffer);
        fileName = resolvedName;
        console.log(`✓ 下载 Logo ${entry.slug}`);
      } catch (error) {
        console.warn(`× 下载 Logo ${entry.slug} 失败: ${error.message}`);
      }
    }

    if (!fileName) {
      const placeholderName = `${baseName}.svg`;
      const filePath = path.join(logoDir, placeholderName);
      const svg = buildLogoPlaceholder(entry.label);
      await fs.writeFile(filePath, svg, "utf-8");
      fileName = placeholderName;
    }
    manifest[entry.slug] = `/logos/${fileName}`;
  }

  const sortedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  const manifestPath = path.join(process.cwd(), "data", "logo-manifest.ts");
  const manifestSource = `export const logoManifest = ${JSON.stringify(sortedManifest, null, 2)} as Record<string, string>;\n`;
  await fs.writeFile(manifestPath, manifestSource, "utf-8");
  console.log(`已生成 Logo 清单，共 ${Object.keys(sortedManifest).length} 项`);
}

async function main() {
  const sourcePath = path.join(process.cwd(), "data", "mock-products.ts");
  const output = path.join(process.cwd(), "data", "imported-products.json");
  const raw = await fs.readFile(sourcePath, "utf-8");
  const products = extractArray(raw, "mockProducts");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(products, null, 2), "utf-8");
  console.log(`已写入 ${products.length} 条产品到 ${output}`);

  await syncProductImages(products);
  await syncLogos();
}

main().catch((error) => {
  console.error("导出产品数据失败", error);
  process.exit(1);
});
