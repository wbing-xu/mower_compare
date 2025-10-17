import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { logoManifest } from "@/data/logo-manifest";
import { productImageManifest } from "@/data/product-image-manifest";
import { type ProductSummary } from "@/types/domain";

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
  product: Pick<ProductSummary, "id" | "coverImage" | "specs" | "brandName" | "companyId">
) {
  const manifestPath = productImageManifest[product.id];
  if (manifestPath) {
    return manifestPath;
  }

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
    if (brandSlug && logoManifest[brandSlug]) {
      return logoManifest[brandSlug];
    }
  }

  const companySlug = product.companyId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (companySlug && logoManifest[companySlug]) {
    return logoManifest[companySlug];
  }

  return "/placeholder-product.svg";
}
