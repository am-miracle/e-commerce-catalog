import { NextRequest, NextResponse } from "next/server";
import products from "@/data/products.json";
import { Product } from "@/lib/types/product";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");

  // filters
  const categories = searchParams.get("categories")?.split(",") || [];
  const brands = searchParams.get("brands")?.split(",") || [];
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const search = searchParams.get("search") || "";

  // sort
  const sort = searchParams.get("sort") || "newest";

  let filtered = products as Product[];

  // apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower),
    );
  }

  // apply category filter
  if (categories.length > 0) {
    filtered = filtered.filter((product: Product) =>
      categories.includes(product.category),
    );
  }
  // apply brand filter
  if (brands.length > 0) {
    filtered = filtered.filter((product: Product) =>
      brands.includes(product.brand),
    );
  }

  filtered = filtered.filter(
    (product: Product) =>
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= minRating &&
      (!inStockOnly || product.stock > 0),
  );

  // apply sort
  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "popular":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break;
  }

  // pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return NextResponse.json({
    products: paginated,
    page,
    total,
    totalPage: Math.ceil(total / limit),
  });
}
