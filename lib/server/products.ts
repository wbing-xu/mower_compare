import { promises as fs } from "fs";
import path from "path";
import { mockProducts } from "@/data/mock-products";
import { type ProductSummary } from "@/types/domain";

const IMPORT_FILE = path.join(process.cwd(), "data", "imported-products.json");

async function ensureImportFile() {
  try {
    await fs.access(IMPORT_FILE);
  } catch {
    await fs.mkdir(path.dirname(IMPORT_FILE), { recursive: true });
    await fs.writeFile(IMPORT_FILE, "[]", "utf-8");
  }
}

export async function readImportedProducts(): Promise<ProductSummary[]> {
  await ensureImportFile();
  const raw = await fs.readFile(IMPORT_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as ProductSummary[];
    return parsed.map((item) => ({ ...item }));
  } catch {
    return [];
  }
}

export async function writeImportedProducts(products: ProductSummary[]) {
  await ensureImportFile();
  await fs.writeFile(IMPORT_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function loadAllProducts(): Promise<ProductSummary[]> {
  const imported = await readImportedProducts();
  const map = new Map<string, ProductSummary>();
  for (const product of mockProducts) {
    map.set(product.id, { ...product, specs: product.specs.map((spec) => ({ ...spec })) });
  }
  for (const product of imported) {
    map.set(product.id, product);
  }
  return Array.from(map.values());
}

export async function loadProductsByIds(ids: string[]): Promise<ProductSummary[]> {
  const products = await loadAllProducts();
  const idSet = new Set(ids);
  return products.filter((product) => idSet.has(product.id));
}

export async function loadProductById(id: string): Promise<ProductSummary | undefined> {
  const products = await loadAllProducts();
  return products.find((product) => product.id === id);
}

export async function upsertImportedProducts(newProducts: ProductSummary[]) {
  const imported = await readImportedProducts();
  const map = new Map(imported.map((product) => [product.id, product]));
  for (const product of newProducts) {
    map.set(product.id, product);
  }
  await writeImportedProducts(Array.from(map.values()));
}
