import { promises as fs } from "fs";
import { createHash } from "crypto";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const SEC_CH_UA =
  '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"';
const IMAGE_ACCEPT_HEADER =
  "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8";
const DOCUMENT_ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const skipDownload = args.has("--skip-download");
const skipOfficialScrape = args.has("--skip-official");
const forceOfficialScrape = args.has("--force-official");
const forceBrowserMode = args.has("--browser");
const preferBrowserMode = forceBrowserMode || args.has("--use-browser");
const showBrowserWindow = args.has("--show-browser");
const listingsOnlyMode = args.has("--official-listing-only");
const skipOfficialSitemaps = args.has("--official-no-sitemaps");
const effectiveSkipOfficial = skipOfficialScrape || (skipDownload && !forceOfficialScrape);

const ACCEPT_LANGUAGE_HEADER = "en-US,en;q=0.9";
const SEC_CH_UA_PLATFORM = '"macOS"';
const DEFAULT_VIEWPORT = { width: 1440, height: 900 };

let browserSession = undefined;
let browserWarningPrinted = false;

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

function parseOfficialListingArgs(tokens) {
  const map = new Map();
  for (const token of tokens) {
    if (typeof token !== "string" || !token.startsWith("--official-listing=")) {
      continue;
    }
    const payload = token.slice("--official-listing=".length).trim();
    if (!payload) {
      continue;
    }
    let brandKey = "";
    let urlValue = payload;
    const separatorIndex = payload.indexOf("::");
    if (separatorIndex >= 0) {
      brandKey = payload.slice(0, separatorIndex).trim();
      urlValue = payload.slice(separatorIndex + 2).trim();
    }
    if (!urlValue) {
      continue;
    }
    if (!brandKey) {
      brandKey = "toro";
    }
    const normalizedKey = brandKey.toLowerCase();
    const existing = map.get(normalizedKey);
    if (existing) {
      existing.push(urlValue);
    } else {
      map.set(normalizedKey, [urlValue]);
    }
  }
  return map;
}

const extraOfficialListings = parseOfficialListingArgs(rawArgs);

const OFFICIAL_SOURCES_BASE = [
  {
    idPrefix: "toro-official",
    brandName: "Toro",
    companyId: "toro",
    divisionId: "toro-turf",
    categoryId: "toro-official-catalog",
    seriesId: "toro-official-series",
    marketPosition: "consumer",
    powertrain: "ICE",
    sitemapUrls: ["https://www.toro.com/sitemap.xml", "https://www.toro.com/en/sitemap.xml"],
    listingPages: [
      "https://www.toro.com/en/product-catalog",
      "https://www.toro.com/en/homeowner/riding-mowers/timecutter-mowers",
      "https://www.toro.com/en/homeowner/riding-mowers/titan-mowers"
    ],
    includePatterns: [/https:\/\/www\.toro\.com\/en\//i],
    excludePatterns: [
      /\/dealer/i,
      /\/owner/i,
      /\/support/i,
      /\/customer/i,
      /\/financing/i,
      /\/document\//i,
      /\/manual/i,
      /\/news/i,
      /\/sds\//i,
      /\.pdf$/i
    ],
    limit: 120,
    useBrowser: true,
    transform(product, { url, browserMeta }) {
      const specs = Array.isArray(product.specs) ? [...product.specs] : [];
      const pushSpec = (definitionId, value) => {
        if (!value) {
          return;
        }
        if (specs.some((item) => item?.definitionId === definitionId && item.value === value)) {
          return;
        }
        specs.push({ definitionId, value });
      };

      let taxonomySegments = [];
      try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        const enIndex = parts.indexOf("en");
        taxonomySegments = enIndex >= 0 ? parts.slice(enIndex + 1) : parts;
      } catch {
        taxonomySegments = [];
      }
      const pathSegments = taxonomySegments.slice(0, -1);

      const breadcrumbLabels = Array.isArray(browserMeta?.breadcrumbs)
        ? browserMeta.breadcrumbs.map((item) => normalizeWhitespace(item?.text ?? "")).filter(Boolean)
        : [];
      const crumbPath = breadcrumbLabels.length >= 2 ? breadcrumbLabels.slice(1, -1) : breadcrumbLabels.slice(0, -1);
      const crumbIgnorePattern = /^(home|products?|product catalog|catalog|all products|all equipment|overview)$/i;
      const cleanedCrumbs = crumbPath.filter((label) => !crumbIgnorePattern.test(label));
      const effectiveCrumbs = cleanedCrumbs.length > 0 ? cleanedCrumbs : crumbPath;

      const fallbackFamily = pathSegments[0] ? humanizeSegment(pathSegments[0]) : "";
      const fallbackSeries = pathSegments.length > 1 ? humanizeSegment(pathSegments[pathSegments.length - 1]) : fallbackFamily;
      const pathLabel =
        effectiveCrumbs.length > 0
          ? effectiveCrumbs.join(" / ")
          : pathSegments.map((segment) => humanizeSegment(segment)).filter(Boolean).join(" / ");
      const familyLabel = effectiveCrumbs[0] || fallbackFamily;
      const seriesLabel =
        effectiveCrumbs.length > 0 ? effectiveCrumbs[effectiveCrumbs.length - 1] : fallbackSeries;

      if (familyLabel) {
        pushSpec("official_family", familyLabel);
      }
      if (seriesLabel && seriesLabel !== familyLabel) {
        pushSpec("official_series", seriesLabel);
      }
      if (pathLabel) {
        pushSpec("official_path", pathLabel);
      }

      product.specs = specs;
      return product;
    }
  }
];

const OFFICIAL_SOURCES = OFFICIAL_SOURCES_BASE.map((source) => {
  const candidateKeys = [source.companyId, source.brandName, source.idPrefix]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
  const additions = candidateKeys.flatMap((key) => extraOfficialListings.get(key) ?? []);
  const baseListings = listingsOnlyMode ? [] : source.listingPages ?? [];
  const uniqueListings = Array.from(new Set([...baseListings, ...additions]));
  const sitemapUrls = skipOfficialSitemaps ? [] : source.sitemapUrls ?? [];
  return { ...source, listingPages: uniqueListings, sitemapUrls };
});

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

function normalizeWhitespace(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\s\u00A0]+/g, " ").trim();
}

function slugify(value) {
  const normalized = normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "item";
}

function humanizeSegment(value) {
  const cleaned = normalizeWhitespace(value).replace(/[_/]+/g, "-");
  return cleaned
    .split(/-+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveUrl(base, href) {
  if (!href) {
    return null;
  }
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
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

function extractMetaContent(html, property) {
  const pattern = new RegExp(
    `<meta[^>]+property=["']${property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? normalizeWhitespace(match[1]) : "";
}

function extractMetaNameContent(html, name) {
  const pattern = new RegExp(
    `<meta[^>]+name=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? normalizeWhitespace(match[1]) : "";
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? normalizeWhitespace(match[1]) : "";
}

function extractJsonLdBlocks(html) {
  const results = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const block = match[1]?.trim();
    if (!block) {
      continue;
    }
    try {
      const parsed = JSON.parse(block);
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else {
        results.push(parsed);
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return results;
}

function pickProductNode(jsonLd) {
  for (const node of jsonLd) {
    if (!node) continue;
    const type = node["@type"];
    if (typeof type === "string" && type.toLowerCase() === "product") {
      return node;
    }
    if (Array.isArray(type) && type.map((item) => String(item).toLowerCase()).includes("product")) {
      return node;
    }
    if (node.item && typeof node.item === "object") {
      const nested = pickProductNode([node.item]);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function pickOffer(node) {
  if (!node) {
    return null;
  }
  const offers = node.offers;
  if (!offers) {
    return null;
  }
  if (Array.isArray(offers)) {
    return offers.find((offer) => offer && (offer.price || offer.priceSpecification));
  }
  return offers;
}

function parsePriceValue(raw) {
  if (raw == null) {
    return null;
  }
  const value = typeof raw === "number" ? raw : Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function tryResolveCandidate(candidate, baseUrl) {
  if (!candidate) {
    return null;
  }
  let value = String(candidate).trim();
  if (!value) {
    return null;
  }
  value = value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/gi, "/")
    .replace(/\u002F/gi, "/")
    .replace(/\u0026/gi, "&")
    .replace(/\\\//g, "/");
  value = value.replace(/^['"`(\[]+/, "");
  let attempt = value;
  for (let i = 0; i < 4; i += 1) {
    const resolved = resolveUrl(baseUrl, attempt);
    if (resolved) {
      return resolved;
    }
    if (!/[)"',.;\]]$/.test(attempt)) {
      break;
    }
    attempt = attempt.slice(0, -1);
  }
  return null;
}

function extractUrlsFromHtml(html, baseUrl) {
  if (typeof html !== "string" || html.length === 0) {
    return [];
  }
  const links = new Set();
  const addCandidate = (candidate) => {
    const resolved = tryResolveCandidate(candidate, baseUrl);
    if (resolved) {
      links.add(resolved);
    }
  };
  const anchorRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    addCandidate(match[1]);
  }
  const normalized = html.replace(/\u002F/gi, "/").replace(/\\\//g, "/");
  const absoluteRegex = /https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+/gi;
  while ((match = absoluteRegex.exec(normalized)) !== null) {
    addCandidate(match[0]);
  }
  const relativeRegex = /["'](\/[A-Za-z0-9\-._~:/?#@!$&'()*+,;=%]+)["']/g;
  while ((match = relativeRegex.exec(html)) !== null) {
    const candidate = match[1];
    if (candidate.startsWith("//")) {
      addCandidate(`https:${candidate}`);
    } else if (candidate.startsWith("/")) {
      addCandidate(candidate);
    }
  }
  return Array.from(links);
}

async function collectSitemapEntries(url, visited = new Set()) {
  if (visited.has(url)) {
    return [];
  }
  visited.add(url);
  let response;
  try {
    response = await fetchText(url);
  } catch (error) {
    console.warn(`× 获取站点地图 ${url} 失败: ${error.message}`);
    return [];
  }
  const xml = response.text ?? "";
  const entries = [];
  if (/<(?:urlset|url)>/i.test(xml)) {
    const regex = /<loc>([\s\S]*?)<\/loc>/gi;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      const loc = normalizeWhitespace(match[1]);
      if (loc) {
        entries.push(loc);
      }
    }
    return entries;
  }
  if (/<sitemapindex/i.test(xml)) {
    const regex = /<loc>([\s\S]*?)<\/loc>/gi;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      const loc = normalizeWhitespace(match[1]);
      if (loc) {
        const nested = await collectSitemapEntries(loc, visited);
        for (const item of nested) {
          entries.push(item);
        }
      }
    }
    return entries;
  }
  return entries;
}

async function collectLinksFromPage(url, source) {
  let response;
  try {
    response = await fetchText(url);
  } catch (error) {
    console.warn(`× 打开目录页 ${url} 失败: ${error.message}`);
    return [];
  }
  const html = response.text ?? "";
  const links = extractUrlsFromHtml(html, url);
  if (!source || !Array.isArray(source.listingPages)) {
    return links;
  }
  const listingSet = new Set(source.listingPages);
  return links.filter((link) => !listingSet.has(link));
}

function filterOfficialUrls(urls, source) {
  const includePatterns = Array.isArray(source.includePatterns) ? source.includePatterns : [];
  const excludePatterns = Array.isArray(source.excludePatterns) ? source.excludePatterns : [];
  return urls.filter((url) => {
    if (excludePatterns.some((pattern) => pattern.test(url))) {
      return false;
    }
    if (includePatterns.length === 0) {
      return true;
    }
    return includePatterns.some((pattern) => pattern.test(url));
  });
}

function uniqueUrls(urls) {
  const seen = new Set();
  const result = [];
  for (const url of urls) {
    if (!url || seen.has(url)) {
      continue;
    }
    seen.add(url);
    result.push(url);
  }
  return result;
}

async function loadPlaywrightModule() {
  try {
    return await import("playwright");
  } catch {
    try {
      return await import("playwright-core");
    } catch {
      const message =
        "未安装 Playwright。请运行 `npm install --save-dev playwright` 并执行 `npx playwright install chromium`，即可启用浏览器抓取模式。";
      if (forceBrowserMode) {
        throw new Error(message);
      }
      if (!browserWarningPrinted && (preferBrowserMode || browserSession === undefined)) {
        console.warn(`⚠️ ${message}`);
        browserWarningPrinted = true;
      }
      return null;
    }
  }
}

async function ensureBrowserSession() {
  if (browserSession !== undefined) {
    return browserSession;
  }
  const playwright = await loadPlaywrightModule();
  if (!playwright) {
    browserSession = null;
    return null;
  }
  const { chromium } = playwright;
  if (!chromium) {
    const message = "Playwright 未提供 chromium 驱动，无法启动浏览器模式。";
    if (!browserWarningPrinted) {
      console.warn(`⚠️ ${message}`);
      browserWarningPrinted = true;
    }
    browserSession = null;
    return null;
  }
  const browser = await chromium.launch({ headless: !showBrowserWindow });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: DEFAULT_VIEWPORT,
    locale: "en-US",
    extraHTTPHeaders: {
      Accept: DOCUMENT_ACCEPT_HEADER,
      "Accept-Language": ACCEPT_LANGUAGE_HEADER,
      "Sec-CH-UA": SEC_CH_UA,
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": SEC_CH_UA_PLATFORM,
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": USER_AGENT
    }
  });
  context.setDefaultTimeout(45000);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined
    });
  });
  browserSession = { playwright, browser, context };
  return browserSession;
}

async function closeBrowserSession() {
  if (browserSession && browserSession.browser) {
    try {
      await browserSession.browser.close();
    } catch {
      // ignore shutdown errors
    }
  }
  browserSession = null;
}

const shutdownBrowser = () => {
  if (browserSession) {
    closeBrowserSession().catch(() => {});
  }
};

process.once("exit", shutdownBrowser);
process.once("SIGINT", () => {
  shutdownBrowser();
  process.exit(130);
});
process.once("SIGTERM", () => {
  shutdownBrowser();
  process.exit(143);
});

async function withBrowserPage(handler) {
  const session = await ensureBrowserSession();
  if (!session) {
    return null;
  }
  const page = await session.context.newPage();
  try {
    return await handler(page);
  } finally {
    await page.close();
  }
}

async function autoScrollPage(page) {
  try {
    await page.evaluate(async () => {
      const scrollElement = document.scrollingElement || document.documentElement;
      if (!scrollElement) {
        return;
      }
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let previousHeight = -1;
      for (let iteration = 0; iteration < 20; iteration += 1) {
        const currentHeight = scrollElement.scrollHeight;
        window.scrollTo(0, currentHeight);
        await wait(250);
        if (currentHeight === previousHeight) {
          break;
        }
        previousHeight = currentHeight;
      }
      window.scrollTo(0, 0);
    });
  } catch {
    // ignore
  }
}

async function collectLinksWithBrowser(url, source) {
  const result = await withBrowserPage(async (page) => {
    await page.route("**/*", (route) => {
      const request = route.request();
      const resourceType = request.resourceType();
      if (["image", "media", "font"].includes(resourceType)) {
        return route.abort();
      }
      return route.continue();
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await autoScrollPage(page);
    await page.waitForTimeout(500);
    const anchorLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      return anchors
        .map((anchor) => anchor.href)
        .filter((href) => typeof href === "string" && href.startsWith("http"));
    });
    const html = await page.content();
    const embeddedLinks = extractUrlsFromHtml(html, url);
    const combined = Array.from(new Set([...(anchorLinks ?? []), ...embeddedLinks]));
    if (!source || !Array.isArray(source.listingPages)) {
      return combined;
    }
    const listingSet = new Set(source.listingPages);
    return combined.filter((link) => !listingSet.has(link));
  });
  return Array.isArray(result) ? result : [];
}

async function fetchWithBrowser(url) {
  const result = await withBrowserPage(async (page) => {
    await page.goto(url, { waitUntil: "networkidle" });
    await autoScrollPage(page);
    await page.waitForTimeout(600);
    const html = await page.content();
    const meta = await page.evaluate(() => {
      const getContent = (selector) => {
        const element = document.querySelector(selector);
        const value = element?.getAttribute("content") ?? "";
        return value.trim();
      };
      const heading = document.querySelector("h1")?.textContent?.trim() ?? "";
      const title = document.title?.trim() || getContent('meta[property="og:title"]');
      const description =
        getContent('meta[name="description"]') || getContent('meta[property="og:description"]');
      const image =
        getContent('meta[property="og:image"]') || getContent('meta[property="og:image:url"]');
      const images = Array.from(document.querySelectorAll('img'))
        .map((img) => img.currentSrc || img.src || "")
        .filter(Boolean);
      const breadcrumbAnchors = Array.from(
        document.querySelectorAll(
          'nav[aria-label="breadcrumb"] a, .breadcrumb a, .breadcrumbs a, [data-automation-id="breadcrumbs"] a'
        )
      );
      const breadcrumbs = breadcrumbAnchors
        .map((anchor) => ({
          text: anchor.textContent?.trim() ?? "",
          href: anchor.href
        }))
        .filter((item) => item.text && item.href);
      return { heading, title, description, image, images, breadcrumbs };
    });
    return { text: html, meta };
  });
  return result ?? { text: "", meta: null };
}

async function gatherOfficialCandidates(source) {
  const urlBuckets = [];
  if (Array.isArray(source.sitemapUrls)) {
    for (const sitemapUrl of source.sitemapUrls) {
      const entries = await collectSitemapEntries(sitemapUrl);
      urlBuckets.push(...entries);
    }
  }
  if (Array.isArray(source.listingPages)) {
    for (const pageUrl of source.listingPages) {
      const links = await collectLinksFromPage(pageUrl, source);
      urlBuckets.push(...links);
    }
  }
  let filtered = filterOfficialUrls(urlBuckets, source);
  let unique = uniqueUrls(filtered);
  if (Array.isArray(source.listingPages) && source.listingPages.length > 0) {
    const listingSet = new Set(source.listingPages);
    unique = unique.filter((link) => !listingSet.has(link));
  }

  const shouldTryBrowser = (source.useBrowser ?? false) || preferBrowserMode || forceBrowserMode;
  if (shouldTryBrowser && Array.isArray(source.listingPages)) {
    const missingAll = unique.length === 0;
    if (missingAll) {
      console.log(`HTTP 抓取 ${source.brandName} 目录为空，尝试浏览器模式…`);
    }
    if (missingAll || source.useBrowser) {
      const browserLinks = [];
      for (const pageUrl of source.listingPages) {
        try {
          const links = await collectLinksWithBrowser(pageUrl, source);
          browserLinks.push(...links);
        } catch (error) {
          console.warn(
            `× 浏览器模式解析目录 ${pageUrl} 失败: ${error instanceof Error ? error.message : String(error)}`
          );
          if (forceBrowserMode) {
            throw error instanceof Error ? error : new Error(String(error));
          }
        }
      }
      if (browserLinks.length > 0) {
        filtered = filterOfficialUrls(urlBuckets.concat(browserLinks), source);
        unique = uniqueUrls(filtered);
      }
    }
  }

  if (source.limit && unique.length > source.limit) {
    return unique.slice(0, source.limit);
  }
  return unique;
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function extractYear(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{4})/);
  if (!match) return null;
  const year = Number(match[1]);
  return year >= 1990 && year <= new Date().getFullYear() + 1 ? year : null;
}

function ensureAbsoluteImage(url, pageUrl) {
  const resolved = resolveUrl(pageUrl, url);
  if (!resolved) {
    return null;
  }
  return resolved.replace(/\s/g, "%20");
}

async function scrapeOfficialProduct(url, source) {
  let html = "";
  let browserMeta = null;
  let httpError = null;
  try {
    const response = await fetchText(url);
    html = response.text ?? "";
  } catch (error) {
    httpError = error instanceof Error ? error : new Error(String(error));
  }

  const shouldTryBrowser = (source.useBrowser ?? false) || preferBrowserMode || forceBrowserMode;
  if ((!html || html.length === 0) && shouldTryBrowser) {
    try {
      const browserResponse = await fetchWithBrowser(url);
      html = browserResponse.text ?? html;
      browserMeta = browserResponse.meta ?? null;
    } catch (browserError) {
      const reason = browserError instanceof Error ? browserError.message : String(browserError);
      console.warn(`× 浏览器模式访问产品页面 ${url} 失败: ${reason}`);
    }
  }

  if (!html) {
    const message = httpError ? httpError.message : "未能获取页面内容";
    console.warn(`× 访问产品页面 ${url} 失败: ${message}`);
    if (forceBrowserMode) {
      throw httpError ?? new Error(message);
    }
    return null;
  }
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const productNode = pickProductNode(jsonLdBlocks);
  const metaTitle = extractMetaContent(html, "og:title") || extractTitle(html);
  const browserTitle = browserMeta?.title ? normalizeWhitespace(browserMeta.title) : "";
  const browserHeading = browserMeta?.heading ? normalizeWhitespace(browserMeta.heading) : "";
  const nodeName = productNode?.name ? normalizeWhitespace(productNode.name) : "";
  const modelName = [nodeName, metaTitle, browserHeading, browserTitle].find((value) => value) || "";
  if (!modelName) {
    console.warn(`× 无法解析产品名称: ${url}`);
    return null;
  }
  const metaDescription =
    productNode?.description
      ? normalizeWhitespace(productNode.description)
      : extractMetaContent(html, "og:description") ||
        extractMetaNameContent(html, "description") ||
        (browserMeta?.description ? normalizeWhitespace(browserMeta.description) : "");
  const imageSources = [];
  const nodeImage = productNode?.image;
  if (typeof nodeImage === "string") {
    imageSources.push(nodeImage);
  } else if (Array.isArray(nodeImage)) {
    imageSources.push(...nodeImage.filter((item) => typeof item === "string"));
  }
  const metaImage = extractMetaContent(html, "og:image") || extractMetaContent(html, "og:image:url");
  if (metaImage) {
    imageSources.push(metaImage);
  }
  if (browserMeta?.image) {
    imageSources.push(browserMeta.image);
  }
  if (Array.isArray(browserMeta?.images)) {
    imageSources.push(...browserMeta.images);
  }
  const coverImage = imageSources
    .map((value) => ensureAbsoluteImage(value, url))
    .find((value) => typeof value === "string" && value.startsWith("http"));

  const sku = normalizeWhitespace(productNode?.sku || productNode?.mpn || productNode?.productID || "");
  const offer = pickOffer(productNode);
  const price = offer ? parsePriceValue(offer.price ?? offer.priceSpecification?.price) : null;
  const currency = offer?.priceCurrency || offer?.priceSpecification?.priceCurrency || offer?.priceSpecification?.priceCurrency?.code;
  const releaseYear = extractYear(productNode?.releaseDate) ?? extractYear(productNode?.productionDate) ?? new Date().getFullYear();
  const summary = metaDescription || `${source.brandName} ${modelName}`;
  const slugFromUrl = (() => {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts.slice(-2).join("-") || parts.slice(-1)[0] || modelName;
    } catch {
      return modelName;
    }
  })();
  const id = `${source.idPrefix}-${slugify(slugFromUrl)}`;

  const specs = [];
  if (coverImage) {
    specs.push({ definitionId: "product_image", value: coverImage });
  }
  specs.push({ definitionId: "official_url", value: url });
  if (summary) {
    specs.push({ definitionId: "official_summary", value: summary });
  }
  if (sku) {
    specs.push({ definitionId: "official_sku", value: sku });
  }
  if (price != null) {
    specs.push({ definitionId: "official_price", value: price, unit: typeof currency === "string" ? currency : undefined });
  }
  if (offer?.availability) {
    specs.push({ definitionId: "market_availability", value: normalizeWhitespace(offer.availability) });
  }

  const product = {
    id,
    modelName,
    sku: sku || undefined,
    coverImage: coverImage || "",
    companyId: source.companyId,
    divisionId: source.divisionId,
    categoryId: source.categoryId,
    seriesId: source.seriesId,
    brandName: source.brandName,
    marketPosition: source.marketPosition,
    powertrain: source.powertrain,
    releaseYear,
    status: "active",
    summary,
    priceRange: price != null ? [price, price] : undefined,
    specs
  };

  if (typeof source.transform === "function") {
    return (
      source.transform(product, {
        url,
        productNode,
        metaDescription,
        coverImage,
        sku,
        price,
        currency,
        browserMeta
      }) ?? product
    );
  }
  return product;
}

async function collectOfficialProducts() {
  if (!Array.isArray(OFFICIAL_SOURCES) || OFFICIAL_SOURCES.length === 0) {
    return [];
  }
  const results = [];
  for (const source of OFFICIAL_SOURCES) {
    console.log(`开始抓取 ${source.brandName} 官网数据…`);
    let urls = [];
    try {
      urls = await gatherOfficialCandidates(source);
    } catch (error) {
      console.warn(`× 收集 ${source.brandName} 目录失败: ${error instanceof Error ? error.message : String(error)}`);
      if (forceBrowserMode) {
        throw error instanceof Error ? error : new Error(String(error));
      }
      continue;
    }
    console.log(`找到 ${urls.length} 个候选页面，逐条解析…`);
    let success = 0;
    for (const url of urls) {
      const product = await scrapeOfficialProduct(url, source);
      if (product) {
        results.push(product);
        success += 1;
      }
      const wait = 400 + Math.random() * 600;
      await delay(wait);
    }
    console.log(`完成 ${source.brandName} 抓取，成功 ${success} 条。`);
  }
  return results;
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
  const variations = [];
  const seen = new Set();
  const push = (value) => {
    if (!value || seen.has(value)) {
      return;
    }
    seen.add(value);
    variations.push(value);
  };
  push(url);
  try {
    const parsed = new URL(url);
    const base = `${parsed.origin}${parsed.pathname}`;
    const pathnameLower = parsed.pathname.toLowerCase();
    const searchParams = new URLSearchParams(parsed.search);
    if (parsed.search) {
      push(base);
    }

    const ensureVariant = (mutator) => {
      const params = new URLSearchParams(parsed.search);
      mutator(params);
      const query = params.toString();
      push(query ? `${base}?${query}` : base);
    };

    if (pathnameLower.includes("/is/image/")) {
      if (!searchParams.has("wid")) {
        ensureVariant((params) => {
          params.set("wid", "1600");
          if (!params.has("hei")) {
            params.set("hei", "1600");
          }
        });
      }
      if (!searchParams.has("fmt")) {
        ensureVariant((params) => {
          params.set("fmt", "png-alpha");
          if (!params.has("qlt")) {
            params.set("qlt", "90");
          }
        });
      }
    }

    if (pathnameLower.includes("/on/demandware.static/")) {
      ensureVariant((params) => {
        if (!params.has("sw")) params.set("sw", "1600");
        if (!params.has("sh")) params.set("sh", params.get("sw") ?? "1600");
        if (!params.has("sm")) params.set("sm", "fit");
      });
    }

    if (
      parsed.hostname.includes("globalassets") ||
      pathnameLower.includes("/media/") ||
      pathnameLower.includes("/wp-content/")
    ) {
      ensureVariant((params) => {
        if (!params.has("width")) params.set("width", "1600");
        if (!params.has("quality")) params.set("quality", "90");
      });
    }

    if (pathnameLower.endsWith(".svg") && !searchParams.has("raw")) {
      ensureVariant((params) => {
        params.set("raw", "1");
      });
    }

    if (parsed.hostname.endsWith("wikimedia.org")) {
      const rawName = parsed.pathname.split("/").pop() ?? "";
      if (rawName) {
        const specialFilePath = `https://commons.wikimedia.org/wiki/Special:FilePath/${rawName}`;
        push(specialFilePath);
        const md5 = createHash("md5").update(rawName).digest("hex");
        const commonsPath = `https://upload.wikimedia.org/wikipedia/commons/${md5.slice(0, 1)}/${md5.slice(0, 2)}/${rawName}`;
        push(commonsPath);
      }
    }
  } catch {
    // ignore invalid url
  }
  return variations;
}

function getApexDomain(hostname) {
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length <= 2) {
    return hostname;
  }
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  if (secondLast.length <= 3 && last.length === 2 && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

function determineFetchSite(resourceHost, refererHost) {
  if (!refererHost) {
    return "none";
  }
  if (resourceHost === refererHost) {
    return "same-origin";
  }
  const resourceApex = getApexDomain(resourceHost);
  const refererApex = getApexDomain(refererHost);
  return resourceApex === refererApex ? "same-site" : "cross-site";
}

function collectHeaderScenarios(url) {
  const scenarios = [];
  const seen = new Set();
  const push = (referer, site) => {
    const key = `${referer ?? "<none>"}|${site}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    scenarios.push({ referer, site });
  };

  try {
    const parsed = new URL(url);
    const originReferer = `${parsed.origin}/`;
    push(originReferer, "same-origin");

    const host = parsed.hostname;
    const apex = getApexDomain(host);
    const altHosts = new Set();
    if (apex && apex !== host) {
      altHosts.add(apex);
      altHosts.add(`www.${apex}`);
    }
    const strippedHost = host.replace(/^(?:cdn|assets|images|img|static|media|content)\./, "");
    if (strippedHost && strippedHost !== host) {
      altHosts.add(strippedHost);
      altHosts.add(`www.${strippedHost}`);
    }
    if (host.includes("wikimedia")) {
      altHosts.add("commons.wikimedia.org");
    }

    for (const candidate of altHosts) {
      try {
        const candidateUrl = new URL(parsed.protocol + "//" + candidate + "/");
        push(candidateUrl.toString(), determineFetchSite(host, candidateUrl.hostname));
      } catch {
        // ignore invalid candidates
      }
    }
  } catch {
    // ignore invalid url when constructing referer list
  }

  push(null, "none");
  return scenarios;
}

function buildHeaderSets(url, options = {}) {
  const { accept = IMAGE_ACCEPT_HEADER, fetchDest = "image", fetchMode = "no-cors", includeUpgrade = fetchDest === "document", extraHeaders = [] } = options;
  const scenarios = collectHeaderScenarios(url);
  const headerSets = [];
  const seen = new Set();
  for (const scenario of scenarios) {
    const headers = [
      ["user-agent", USER_AGENT],
      ["accept", accept],
      ["accept-language", "en-US,en;q=0.9,zh-CN;q=0.8"],
      ["cache-control", "no-cache"],
      ["pragma", "no-cache"],
      ["sec-ch-ua", SEC_CH_UA],
      ["sec-ch-ua-mobile", "?0"],
      ["sec-ch-ua-platform", '"Windows"'],
      ["sec-fetch-dest", fetchDest],
      ["sec-fetch-mode", fetchMode],
      ["sec-fetch-site", scenario.site],
      ["dnt", "1"]
    ];
    if (includeUpgrade) {
      headers.push(["upgrade-insecure-requests", "1"]);
    }
    if (fetchDest === "document") {
      headers.push(["sec-fetch-user", "?1"]);
    }
    if (scenario.referer) {
      headers.push(["referer", scenario.referer]);
    }
    for (const [name, value] of extraHeaders) {
      headers.push([name, value]);
    }
    const key = headers.map(([name, value]) => `${name}:${value}`).join("| ");
    if (!seen.has(key)) {
      seen.add(key);
      headerSets.push(headers);
    }
  }
  return headerSets;
}

function parseCurlError(error) {
  const stderr =
    error.stderr && typeof error.stderr !== "string"
      ? error.stderr.toString("utf-8")
      : error.stderr;
  const details = (stderr ?? error.message ?? "未知错误").toString().trim();
  return new Error(details || "curl 调用失败");
}

function parseCurlOutput(buffer) {
  const delimiter = Buffer.from("\r\n\r\n");
  let headerEnd = buffer.lastIndexOf(delimiter);
  let bodyOffset = delimiter.length;
  if (headerEnd === -1) {
    const lfDelimiter = Buffer.from("\n\n");
    headerEnd = buffer.lastIndexOf(lfDelimiter);
    bodyOffset = lfDelimiter.length;
  }
  if (headerEnd === -1) {
    throw new Error("未能解析响应头");
  }
  const headerBuffer = buffer.slice(0, headerEnd);
  const body = buffer.slice(headerEnd + bodyOffset);
  const headerSections = headerBuffer
    .toString("utf-8")
    .split(/\r?\n\r?\n/)
    .filter(Boolean);
  const lastHeader = headerSections[headerSections.length - 1] ?? "";
  const statusLine = lastHeader.split(/\r?\n/)[0] ?? "";
  const statusMatch = statusLine.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/i);
  const status = statusMatch ? Number(statusMatch[1]) : 200;
  const contentTypeMatch = lastHeader.match(/content-type:\s*([^\r\n]+)/i);
  const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "";
  return { status, body, contentType };
}

function detectCharset(contentType) {
  if (!contentType) {
    return "utf-8";
  }
  const match = contentType.match(/charset=([^;]+)/i);
  if (!match) {
    return "utf-8";
  }
  const charset = match[1].trim().toLowerCase();
  if (!charset) {
    return "utf-8";
  }
  return charset;
}

function decodeBuffer(buffer, contentType) {
  const charset = detectCharset(contentType);
  try {
    return buffer.toString(charset === "utf-8" ? "utf-8" : charset);
  } catch {
    return buffer.toString("utf-8");
  }
}

async function fetchResource(url, { accept = IMAGE_ACCEPT_HEADER, binary = false, headerOptions = {} } = {}) {
  const headerSets = buildHeaderSets(url, { accept, ...headerOptions });
  let lastError = null;
  for (const headers of headerSets) {
    const args = [
      "--silent",
      "--show-error",
      "--location",
      "--compressed",
      "--dump-header",
      "-"
    ];
    for (const [name, value] of headers) {
      if (!value) continue;
      args.push("-H", `${name}: ${value}`);
    }
    args.push(url);

    let stdout;
    try {
      ({ stdout } = await execFileAsync("curl", args, {
        encoding: "buffer",
        maxBuffer: 50 * 1024 * 1024
      }));
    } catch (error) {
      lastError = parseCurlError(error);
      continue;
    }

    let parsed;
    try {
      parsed = parseCurlOutput(stdout);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
    if (parsed.status >= 400) {
      lastError = new Error(`HTTP ${parsed.status}`);
      continue;
    }
    if (binary) {
      return { buffer: parsed.body, contentType: parsed.contentType };
    }
    const text = decodeBuffer(parsed.body, parsed.contentType);
    return { buffer: parsed.body, contentType: parsed.contentType, text };
  }
  throw lastError ?? new Error("curl 调用失败");
}

async function fetchBinary(url) {
  return fetchResource(url, {
    binary: true,
    accept: IMAGE_ACCEPT_HEADER,
    headerOptions: { fetchDest: "image", fetchMode: "no-cors", includeUpgrade: false }
  });
}

async function fetchText(url) {
  return fetchResource(url, {
    binary: false,
    accept: DOCUMENT_ACCEPT_HEADER,
    headerOptions: { fetchDest: "document", fetchMode: "navigate", includeUpgrade: true }
  });
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

function mergeProducts(base, additions) {
  const result = [];
  const seen = new Set();
  for (const item of base) {
    if (item?.id && !seen.has(item.id)) {
      result.push(item);
      seen.add(item.id);
    }
  }
  const extras = [];
  for (const item of additions) {
    if (item?.id && !seen.has(item.id)) {
      extras.push(item);
      seen.add(item.id);
    }
  }
  extras.sort((a, b) => a.id.localeCompare(b.id));
  return result.concat(extras);
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
  try {
  const sourcePath = path.join(process.cwd(), "data", "mock-products.ts");
  const output = path.join(process.cwd(), "data", "imported-products.json");
  const raw = await fs.readFile(sourcePath, "utf-8");
  const mockProducts = extractArray(raw, "mockProducts");
  let officialProducts = [];
  if (effectiveSkipOfficial) {
    console.log(
      skipOfficialScrape
        ? "已跳过官网数据抓取 (--skip-official)"
        : "检测到 --skip-download，默认跳过官网抓取。若需要同步官网数据请添加 --force-official。"
    );
  } else {
    officialProducts = await collectOfficialProducts();
  }
  const products = mergeProducts(mockProducts, officialProducts);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(products, null, 2), "utf-8");
  console.log(`已写入 ${products.length} 条产品到 ${output}`);

  await syncProductImages(products);
  await syncLogos();
  } finally {
    await closeBrowserSession();
  }
}

main().catch((error) => {
  console.error("导出产品数据失败", error);
  process.exit(1);
});
