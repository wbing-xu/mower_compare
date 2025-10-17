import { NextResponse } from "next/server";
import { loadAllProducts } from "@/lib/server/products";

export async function GET() {
  const products = await loadAllProducts();
  return NextResponse.json({ products });
}
