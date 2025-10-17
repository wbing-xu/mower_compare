import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
