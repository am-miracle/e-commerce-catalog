"use client";
import React, { memo, useCallback } from "react";
import { Product } from "@/lib/types/product";
import { CartStore, useCartStore } from "@/lib/stores/cartStores";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const addItem = useCartStore((state: CartStore) => state.addItem);
  const totalItems = useCartStore((state) => state.totalItems);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      addItem(product);
    },
    [addItem, product],
  );
  console.log("clicked", totalItems);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-shadow">
        <div className="relative h-[200px] w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute top-2 left-2 flex gap-2">
            {product.discount > 0 && (
              <Badge variant="destructive">
                -{product.discount.toFixed(2)}%
              </Badge>
            )}
            {product.tags.includes("new") && <Badge>New</Badge>}
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full cursor-pointer"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
