"use client";

import { CartItem as CartItemType } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartStore, useCartStore } from "@/lib/stores/cartStores";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state: CartStore) => state.removeItem);
  const updateQuantity = useCartStore(
    (state: CartStore) => state.updateQuantity,
  );
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const itemTotal = product.price * quantity;

  return (
    <div className="flex gap-4">
      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md bg-gray-100"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${product.id}`}
          className="font-medium line-clamp-2 hover:underline"
        >
          {product.name}
        </Link>

        <p className="text-sm text-muted-foreground mt-1">
          ${product.price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              className="h-8 w-12 text-center border-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={1}
              max={product.stock}
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock Warning */}
        {quantity >= product.stock && (
          <p className="text-xs text-orange-600 mt-1">Max quantity reached</p>
        )}
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
