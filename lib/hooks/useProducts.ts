import { useQuery } from "@tanstack/react-query";
import { Filters, Product, SortOption } from "../types/product";

interface UseProductParams {
  page?: number;
  limit?: number;
  filters?: Partial<Filters>;
  sort?: SortOption;
  search?: string;
}

interface ProductResponse {
  products: Product[];
  page: number;
  total: number;
  totalPage: number;
}

export const useProducts = (params: UseProductParams = {}) => {
  const {
    page = 1,
    limit = 24,
    filters = {},
    sort = "newest",
    search = "",
  } = params;

  const queryString = useQuery<ProductResponse>({
    queryKey: ["products", page, limit, filters, sort, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
      });

      if (search) {
        searchParams.set("search", search);
      }

      if (filters.categories?.length) {
        searchParams.set("categories", filters.categories.join(","));
      }

      if (filters.brands?.length) {
        searchParams.set("brands", filters.brands.join(","));
      }

      if (filters.priceRange) {
        searchParams.set("minPrice", filters.priceRange[0].toString());
        searchParams.set("maxPrice", filters.priceRange[1].toString());
      }
      if (filters.minRating) {
        searchParams.set("minRating", filters.minRating.toString());
      }
      if (filters.inStockOnly) {
        searchParams.set("inStockOnly", "true");
      }

      const res = await fetch(`/api/products?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  return queryString;
};
