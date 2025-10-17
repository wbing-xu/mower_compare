import { NextResponse } from "next/server";
import { upsertImportedProducts } from "@/lib/server/products";
import { specDictionary } from "@/data/specs-dictionary";
import { type ProductSummary } from "@/types/domain";

const AUTH_USER = "pudu";
const AUTH_PASS = "pudu";

const specByKey = new Map(specDictionary.map((definition) => [definition.key, definition]));

const MARKET_POSITIONS: ProductSummary["marketPosition"][] = [
  "consumer",
  "prosumer",
  "professional",
  "municipal"
];
const POWERTRAINS: ProductSummary["powertrain"][] = ["ICE", "BEV", "Hybrid", "Robot"];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm=\"Import\"" }
  });
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "是"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "否"].includes(normalized)) return false;
  }
  return undefined;
}

function normalizeSpecValue(key: string, raw: unknown) {
  const definition = specByKey.get(key);
  if (!definition) return undefined;

  if (raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")) {
    return undefined;
  }

  let value: unknown = raw;
  let unit: string | undefined;

  if (typeof raw === "object" && raw !== null && "value" in raw) {
    const data = raw as { value: unknown; unit?: string };
    value = data.value;
    unit = data.unit;
  }

  switch (definition.dataType) {
    case "boolean": {
      const boolValue = parseBoolean(value);
      if (boolValue === undefined) return undefined;
      return { definitionId: definition.id, value: boolValue, unit };
    }
    case "number": {
      const numValue = typeof value === "number" ? value : Number(String(value).replace(/[^\d.\-]/g, ""));
      if (Number.isNaN(numValue)) return undefined;
      return { definitionId: definition.id, value: numValue, unit: unit ?? definition.unit };
    }
    default: {
      return { definitionId: definition.id, value: String(value).trim(), unit };
    }
  }
}

interface ImportProductInput {
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
  specs?: Record<string, unknown>;
}

function normalizeProduct(input: ImportProductInput): ProductSummary | undefined {
  if (!input.id || !input.modelName || !input.companyId || !input.divisionId || !input.categoryId || !input.seriesId) {
    return undefined;
  }

  const marketPosition = MARKET_POSITIONS.find((item) => item === input.marketPosition) ?? "professional";
  const powertrain = POWERTRAINS.find((item) => item === input.powertrain) ?? "Robot";
  const statusValue = typeof input.status === "string" ? input.status.toLowerCase() : "";
  const status = (statusValue === "discontinued" ? "discontinued" : "active") as ProductSummary["status"];
  const releaseYear = input.releaseYear ?? new Date().getFullYear();

  const priceRange =
    typeof input.priceMin === "number" && typeof input.priceMax === "number"
      ? [input.priceMin, input.priceMax]
      : undefined;

  const specs: ProductSummary["specs"] = [];
  if (input.specs) {
    for (const [key, raw] of Object.entries(input.specs)) {
      const normalized = normalizeSpecValue(key, raw);
      if (normalized) {
        specs.push(normalized);
      }
    }
  }

  const imageSpec = specs.find(
    (spec) => spec.definitionId === "product_image" && typeof spec.value === "string"
  );
  const normalizedCoverImage = (() => {
    if (typeof input.coverImage === "string" && input.coverImage.trim() !== "") {
      return input.coverImage.trim();
    }
    const specImage = typeof imageSpec?.value === "string" ? imageSpec.value.trim() : "";
    if (specImage) {
      return specImage;
    }
    if (input.brandName) {
      return `/logos/${toSlug(input.brandName)}.svg`;
    }
    return `/logos/${toSlug(input.companyId)}.svg`;
  })();

  return {
    id: input.id,
    modelName: input.modelName,
    coverImage: normalizedCoverImage,
    companyId: input.companyId,
    divisionId: input.divisionId,
    categoryId: input.categoryId,
    seriesId: input.seriesId,
    brandName: input.brandName,
    marketPosition,
    powertrain,
    releaseYear,
    status,
    summary: input.summary ?? "",
    priceRange,
    specs
  };
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }
  const encoded = authorization.replace("Basic ", "");
  const decoded = Buffer.from(encoded, "base64").toString();
  const [user, pass] = decoded.split(":");
  if (user !== AUTH_USER || pass !== AUTH_PASS) {
    return unauthorized();
  }

  let payload: { products?: ImportProductInput[] };
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!Array.isArray(payload.products) || payload.products.length === 0) {
    return NextResponse.json({ error: "products 字段不能为空" }, { status: 400 });
  }

  const normalized: ProductSummary[] = [];
  const invalid: string[] = [];

  for (const product of payload.products) {
    const result = normalizeProduct(product);
    if (!result) {
      invalid.push(product.id ?? "未提供 ID");
    } else {
      normalized.push(result);
    }
  }

  if (invalid.length > 0) {
    return NextResponse.json(
      { error: "部分产品缺少必填字段", invalid },
      { status: 400 }
    );
  }

  await upsertImportedProducts(normalized);

  return NextResponse.json({ imported: normalized.length });
}
