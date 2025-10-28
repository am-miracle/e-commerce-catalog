import { create } from "zustand";
import { CartItem, Product } from "../types/product";
import { persist } from "zustand/middleware";

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item: CartItem): boolean => item.product.id == product.id,
        );

        if (existingItem) {
          set({
            items: items.map((item: CartItem) =>
              item.product.id == product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(
            (item: CartItem) => item.product.id != productId,
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item: CartItem) =>
            item.product.id == productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
    },
  ),
);
