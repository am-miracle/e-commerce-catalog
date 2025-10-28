"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductList } from "@/components/product/product-list";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductToolbar } from "@/components/product/product-toolbar";
import { useProducts } from "@/lib/hooks/useProducts";
import { Filters, SortOption } from "@/lib/types/product";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL params
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";
  const sortBy = (searchParams.get("sort") as SortOption) || "newest";

  const filters: Partial<Filters> = useMemo(() => {
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "5000");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const inStockOnly = searchParams.get("inStock") === "true";

    return {
      categories,
      brands,
      priceRange: [minPrice, maxPrice] as [number, number],
      minRating,
      inStockOnly,
    };
  }, [searchParams]);

  // Update URL when state changes
  const updateURL = useCallback(
    (
      newFilters: Partial<Filters>,
      newSort: SortOption,
      newView: "grid" | "list",
    ) => {
      const params = new URLSearchParams();

      // Add view mode
      if (newView !== "grid") {
        params.set("view", newView);
      }

      // Add sort
      if (newSort !== "newest") {
        params.set("sort", newSort);
      }

      // Add categories
      if (newFilters.categories && newFilters.categories.length > 0) {
        params.set("categories", newFilters.categories.join(","));
      }

      // Add brands
      if (newFilters.brands && newFilters.brands.length > 0) {
        params.set("brands", newFilters.brands.join(","));
      }

      // Add price range
      if (newFilters.priceRange) {
        if (newFilters.priceRange[0] !== 0) {
          params.set("minPrice", newFilters.priceRange[0].toString());
        }
        if (newFilters.priceRange[1] !== 5000) {
          params.set("maxPrice", newFilters.priceRange[1].toString());
        }
      }

      // Add rating
      if (newFilters.minRating && newFilters.minRating > 0) {
        params.set("minRating", newFilters.minRating.toString());
      }

      // Add in stock filter
      if (newFilters.inStockOnly) {
        params.set("inStock", "true");
      }

      // Update URL without page reload
      const queryString = params.toString();
      const newURL = queryString ? `/?${queryString}` : "/";
      router.push(newURL, { scroll: false });
    },
    [router],
  );

  const { data, isLoading, error } = useProducts({
    page: 1,
    limit: 24,
    filters,
    sort: sortBy,
  });

  // Handlers
  const handleFiltersChange = useCallback(
    (newFilters: Partial<Filters>) => {
      updateURL(newFilters, sortBy, viewMode);
    },
    [sortBy, viewMode, updateURL],
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      updateURL(filters, newSort, viewMode);
    },
    [filters, viewMode, updateURL],
  );

  const handleViewModeChange = useCallback(
    (mode: "grid" | "list") => {
      updateURL(filters, sortBy, mode);
    },
    [filters, sortBy, updateURL],
  );

  // Memoize the product display component
  const ProductDisplay = useMemo(() => {
    if (!data?.products || data.products.length === 0) {
      return (
        <div className="flex items-center justify-center h-[50vh] border rounded-lg bg-muted/20">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        </div>
      );
    }

    return viewMode === "grid" ? (
      <ProductGrid products={data.products} />
    ) : (
      <ProductList products={data.products} />
    );
  }, [data, viewMode]);

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <p className="text-destructive text-lg font-semibold mb-2">
                Error loading products
              </p>
              <p className="text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4  py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <ProductToolbar
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              totalProducts={data?.total || 0}
            />

            {/* Loading Overlay for Product Area Only */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">
                      Updating products...
                    </p>
                  </div>
                </div>
              )}

              {/* Product Display */}
              {ProductDisplay}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
