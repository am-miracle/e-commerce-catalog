"use client";

import { useState } from "react";
import { Filters } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

interface ProductFiltersProps {
  filters: Partial<Filters>;
  onFiltersChange: (filters: Partial<Filters>) => void;
}

// Extract unique values from products
const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
];

const brands = [
  "TechCorp",
  "StyleMax",
  "BookHub",
  "HomeEssentials",
  "SportsPro",
  "ToyLand",
  "GlowUp",
  "AutoParts",
];

export function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange || [0, 5000],
  );

  const toggleCategory = (category: string) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, categories: updated });
  };

  const toggleBrand = (brand: string) => {
    const current = filters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFiltersChange({ ...filters, brands: updated });
  };

  const setMinRating = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeCommit = () => {
    onFiltersChange({ ...filters, priceRange });
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    onFiltersChange({
      categories: [],
      brands: [],
      priceRange: [0, 5000],
      minRating: 0,
      inStockOnly: false,
    });
  };

  const hasActiveFilters =
    (filters.categories?.length || 0) > 0 ||
    (filters.brands?.length || 0) > 0 ||
    filters.minRating ||
    filters.inStockOnly ||
    (filters.priceRange &&
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000));

  return (
    <div className="w-64 shrink-0 border-r bg-background">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories?.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands?.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Price Range</h3>
            <div className="space-y-4">
              <Slider
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMinRating(rating)}
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.minRating === rating}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-1"
                  >
                    {rating}
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    & up
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* In Stock */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, inStockOnly: !!checked })
              }
            />
            <Label
              htmlFor="in-stock"
              className="text-sm font-normal cursor-pointer"
            >
              In Stock Only
            </Label>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
