import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ProductSummary } from "@/types/domain";

const AVAILABLE_LOGO_SLUGS = new Set([
  "ariens",
  "badboy",
  "bobcat",
  "boss",
  "ditch-witch",
  "ego",
  "greenworks",
  "hayter",
  "honda",
  "husqvarna",
  "jacobsen",
  "john-deere",
  "kubota",
  "meangreen",
  "mtd",
  "ryobi",
  "scag",
  "stanley",
  "stiga",
  "stihl",
  "swisher",
  "toro",
  "wright"
]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "zh-CN", currency = "CNY") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatRange(min?: number, max?: number, unit?: string) {
  if (min == null && max == null) return "-";
  if (min != null && max != null) {
    return `${min}${unit ?? ""} - ${max}${unit ?? ""}`;
  }
  const value = min ?? max;
  return value != null ? `${value}${unit ?? ""}` : "-";
}

export function getProductImage(
  product: Pick<ProductSummary, "coverImage" | "specs" | "brandName" | "companyId">
) {
  const cover = typeof product.coverImage === "string" ? product.coverImage.trim() : "";
  if (cover) {
    return cover;
  }

  const imageSpec = product.specs.find(
    (spec) => spec.definitionId === "product_image" && typeof spec.value === "string"
  );
  const specImage = typeof imageSpec?.value === "string" ? imageSpec.value.trim() : "";
  if (specImage) {
    return specImage;
  }

  if (product.brandName) {
    const brandSlug = product.brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (brandSlug && AVAILABLE_LOGO_SLUGS.has(brandSlug)) {
      return `/logos/${brandSlug}.svg`;
    }
  }

  const companySlug = product.companyId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (companySlug && AVAILABLE_LOGO_SLUGS.has(companySlug)) {
    return `/logos/${companySlug}.svg`;
  }

  return "/placeholder-product.svg";
}
