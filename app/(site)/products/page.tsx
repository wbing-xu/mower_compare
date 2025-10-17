import { ProductCatalog } from "@/components/products/product-catalog";
import { loadAllProducts } from "@/lib/server/products";

export default async function ProductsPage() {
  const products = await loadAllProducts();
  return <ProductCatalog products={products} />;
}
