"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Product } from "@/lib/types/product";
import { useCartStore } from "@/lib/stores/cartStores";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div ref={parentRef} className="h-[calc(100vh-200px)] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const product = products[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="group mx-6 mb-4 flex gap-4 overflow-hidden rounded-lg border bg-card hover:shadow-md transition-shadow p-4">
                  {/* Image */}
                  <div className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="150px"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{Math.round(product.discount)}%
                            </Badge>
                          )}
                          {product.tags.includes("new") && (
                            <Badge className="text-xs">New</Badge>
                          )}
                          {product.tags.includes("popular") && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {product.brand}
                        </span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">
                            {product.rating.toFixed(1)}
                          </span>
                          <span>({product.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom section */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {product.stock > 0 ? (
                            <span className="text-green-600">
                              {product.stock} in stock
                            </span>
                          ) : (
                            <span className="text-destructive">
                              Out of stock
                            </span>
                          )}
                        </span>
                      </div>

                      <Button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        size="default"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
