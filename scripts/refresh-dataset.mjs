import { promises as fs } from "fs";
import { createHash } from "crypto";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const args = new Set(process.argv.slice(2));
const skipDownload = args.has("--skip-download");

const LOGO_SOURCES = [
  {
    slug: "stanley-black-decker",
    label: "Stanley Black & Decker",
    url: "https://www.stanleyblackanddecker.com/themes/custom/sbd/img/logo.svg"
  },
  {
    slug: "stanley",
    label: "Stanley",
    url: "https://www.stanleytools.com/on/demandware.static/-/Sites-STS-Library/default/dwb3a178eb/images/logos/stanley-logo.svg"
  },
  {
    slug: "craftsman",
    label: "Craftsman",
    url: "https://www.craftsman.com/on/demandware.static/-/Sites-craftsman-Library/default/dw6d0da7f4/images/logos/craftsman-logo.svg"
  },
  {
    slug: "mtd-holdings",
    label: "MTD Holdings",
    url: "https://www.mtdproducts.com/-/media/project/mtd/images/logos/mtd-products-logo.svg"
  },
  {
    slug: "mtd",
    label: "MTD",
    url: "https://www.mtdproducts.com/-/media/project/mtd/images/logos/mtd-logo.svg"
  },
  {
    slug: "mtd-professional",
    label: "MTD Professional",
    url: "https://www.cubcadet.com/on/demandware.static/-/Library-Sites-cubcadet-shared/default/dw55fdf1a6/images/logos/mtd-pro-logo.svg"
  },
  {
    slug: "husqvarna-group",
    label: "Husqvarna Group",
    url: "https://www.husqvarna.com/globalassets/media/shared/logos/husqvarna-group-logo.svg"
  },
  {
    slug: "husqvarna",
    label: "Husqvarna",
    url: "https://www.husqvarna.com/globalassets/media/shared/logos/husqvarna-logo.svg"
  },
  {
    slug: "john-deere",
    label: "John Deere",
    url: "https://www.deere.com/assets/images/common/logos/john-deere-logo.svg"
  },
  {
    slug: "toro",
    label: "Toro",
    url: "https://www.toro.com/-/media/Images/Toro/logos/toro-logo.svg"
  },
  {
    slug: "exmark",
    label: "Exmark",
    url: "https://www.exmark.com/-/media/Exmark/Images/Logos/exmark-logo.svg"
  },
  {
    slug: "ariensco",
    label: "AriensCo",
    url: "https://www.ariensco.com/-/media/ariensco/logos/ariensco-logo.svg"
  },
  {
    slug: "ariens",
    label: "Ariens",
    url: "https://www.ariens.com/-/media/ariens/logos/ariens-logo.svg"
  },
  {
    slug: "gravely",
    label: "Gravely",
    url: "https://www.gravely.com/-/media/gravely/logos/gravely-logo.svg"
  },
  {
    slug: "stiga-group",
    label: "Stiga Group",
    url: "https://corporate.stiga.com/wp-content/uploads/2021/03/stiga-group-logo.svg"
  },
  {
    slug: "stiga",
    label: "Stiga",
    url: "https://www.stiga.com/media/logo/stiga-logo.svg"
  },
  {
    slug: "swisher",
    label: "Swisher",
    url: "https://www.swisherinc.com/wp-content/uploads/2020/01/swisher-logo.svg"
  },
  {
    slug: "doosan-bobcat",
    label: "Doosan Bobcat",
    url: "https://www.doosanbobcat.com/sites/default/files/2022-03/doosan-bobcat-logo.svg"
  },
  {
    slug: "bobcat",
    label: "Bobcat",
    url: "https://www.bobcat.com/_assets/bobcat-logo.svg"
  },
  {
    slug: "greenworks",
    label: "Greenworks",
    url: "https://www.greenworkstools.com/on/demandware.static/-/Sites-greenworks-Library/default/dw3316d8df/images/brand/greenworks-logo.svg"
  },
  {
    slug: "tti",
    label: "TTI",
    url: "https://www.ttigroup.com/wp-content/uploads/2021/07/tti-logo.svg"
  },
  {
    slug: "ryobi",
    label: "Ryobi",
    url: "https://www.ryobitools.com/assets/images/ryobi-logo.svg"
  },
  {
    slug: "chervon",
    label: "Chervon",
    url: "https://www.chervongroup.com/wp-content/uploads/2021/06/chervon-logo.svg"
  },
  {
    slug: "ego",
    label: "EGO",
    url: "https://egopowerplus.com/assets/images/ego-logo.svg"
  },
  {
    slug: "scag",
    label: "Scag",
    url: "https://www.scag.com/images/scag-logo.svg"
  },
  {
    slug: "wright",
    label: "Wright",
    url: "https://www.wrightmfg.com/images/logo.svg"
  },
  {
    slug: "mean-green",
    label: "Mean Green",
    url: "https://www.meangreenproducts.com/wp-content/themes/meangreen/images/logo.png"
  },
  {
    slug: "stihl",
    label: "Stihl",
    url: "https://www.stihl.com/p/content/dam/stihl/stihl-logo.svg"
  },
  {
    slug: "textron",
    label: "Textron",
    url: "https://www.textron.com/sites/default/files/2020-09/Textron-logo-blue.svg"
  },
  {
    slug: "jacobsen",
    label: "Jacobsen",
    url: "https://www.jacobsen.com/sites/default/files/2021-04/Jacobsen_logo.svg"
  },
  {
    slug: "honda",
    label: "Honda",
    url: "https://global.honda/content/dam/site/global/top-page/design/logo_honda.svg"
  },
  {
    slug: "kubota",
    label: "Kubota",
    url: "https://www.kubota.com/assets/images/global/common/kubota-logo.svg"
  },
  {
    slug: "bad-boy",
    label: "Bad Boy",
    url: "https://badboymowers.com/wp-content/uploads/2021/01/bad-boy-mowers-logo.svg"
  },
  {
    slug: "bad-boy-mowers",
    label: "Bad Boy Mowers",
    url: "https://badboymowers.com/wp-content/uploads/2021/01/bad-boy-mowers-logo.svg"
  },
  {
    slug: "ditch-witch",
    label: "Ditch Witch",
    url: "https://www.ditchwitch.com/sites/default/files/dw-logo.svg"
  },
  {
    slug: "hayter",
    label: "Hayter",
    url: "https://www.hayter.co.uk/wp-content/themes/hayter/assets/img/logo.svg"
  },
  {
    slug: "boss",
    label: "Boss",
    url: "https://www.bossplow.com/-/media/project/boss/logos/boss-logo.svg"
  },
  {
    slug: "cub-cadet",
    label: "Cub Cadet",
    url: "https://www.cubcadet.com/on/demandware.static/-/Library-Sites-cubcadet-shared/default/dw5e3de3e4/images/logos/cub-cadet-logo.svg"
  },
  {
    slug: "mean-green-mowers",
    label: "Mean Green",
    url: "https://www.meangreenproducts.com/wp-content/themes/meangreen/images/logo.png"
  }
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

function expandDownloadUrls(url) {
  const variations = [url];
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("wikimedia.org")) {
      const rawName = parsed.pathname.split("/").pop() ?? "";
      const fileName = decodeURIComponent(rawName);
      if (rawName) {
        const specialFilePath = `https://commons.wikimedia.org/wiki/Special:FilePath/${rawName}`;
        if (!variations.includes(specialFilePath)) {
          variations.push(specialFilePath);
        }
        const md5 = createHash("md5").update(rawName).digest("hex");
        const commonsPath = `https://upload.wikimedia.org/wikipedia/commons/${md5.slice(0, 1)}/${md5.slice(0, 2)}/${rawName}`;
        if (!variations.includes(commonsPath)) {
          variations.push(commonsPath);
        }
      }
    }
  } catch {
    // ignore invalid url
  }
  return variations;
}

async function fetchBinary(url) {
  const args = [
    "--silent",
    "--show-error",
    "--location",
    "--compressed",
    "--dump-header",
    "-"
  ];
  args.push("-H", `user-agent: ${USER_AGENT}`);
  args.push(
    "-H",
    "accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
  );
  args.push("-H", "accept-language: en-US,en;q=0.9");
  try {
    const referer = new URL(url);
    args.push("-H", `referer: ${referer.origin}/`);
  } catch {
    // ignore invalid url when constructing referer
  }
  args.push(url);

  let stdout;
  try {
    ({ stdout } = await execFileAsync("curl", args, {
      encoding: "buffer",
      maxBuffer: 50 * 1024 * 1024
    }));
  } catch (error) {
    const stderr =
      error.stderr && typeof error.stderr !== "string"
        ? error.stderr.toString("utf-8")
        : error.stderr;
    const details = (stderr ?? error.message ?? "未知错误").trim();
    throw new Error(details || "curl 调用失败");
  }

  const delimiter = Buffer.from("\r\n\r\n");
  let headerEnd = stdout.lastIndexOf(delimiter);
  let bodyOffset = delimiter.length;
  if (headerEnd === -1) {
    const lfDelimiter = Buffer.from("\n\n");
    headerEnd = stdout.lastIndexOf(lfDelimiter);
    bodyOffset = lfDelimiter.length;
  }
  if (headerEnd === -1) {
    throw new Error("未能解析响应头");
  }
  const headerBuffer = stdout.slice(0, headerEnd);
  const body = stdout.slice(headerEnd + bodyOffset);
  const headerSections = headerBuffer
    .toString("utf-8")
    .split(/\r?\n\r?\n/)
    .filter(Boolean);
  const lastHeader = headerSections[headerSections.length - 1] ?? "";
  const statusLine = lastHeader.split(/\r?\n/)[0] ?? "";
  const statusMatch = statusLine.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/i);
  const status = statusMatch ? Number(statusMatch[1]) : 200;
  if (status >= 400) {
    throw new Error(`HTTP ${status}`);
  }
  const contentTypeMatch = lastHeader.match(/content-type:\s*([^\r\n]+)/i);
  const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "";
  return { buffer: body, contentType };
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
      for (const rawUrl of candidates) {
        const downloadQueue = expandDownloadUrls(rawUrl);
        for (const url of downloadQueue) {
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
        if (savedFile) {
          break;
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
      const variations = expandDownloadUrls(entry.url);
      for (const url of variations) {
        try {
          const { buffer, contentType } = await fetchBinary(url);
          const ext = guessExtension(url, contentType, ".svg");
          const resolvedName = `${baseName}${ext}`;
          const filePath = path.join(logoDir, resolvedName);
          await writeIfChanged(filePath, buffer);
          fileName = resolvedName;
          console.log(`✓ 下载 Logo ${entry.slug} <- ${url}`);
          break;
        } catch (error) {
          console.warn(`× 下载 Logo ${entry.slug} <- ${url} 失败: ${error.message}`);
        }
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
