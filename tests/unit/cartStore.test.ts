import { useCartStore } from "@/lib/stores/cartStores";
import { Product } from "@/lib/types/product";
import { beforeEach, describe, expect, it } from "vitest";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "Test Description",
  price: 99.99,
  originalPrice: 129.99,
  discount: 23,
  category: "Electronics",
  brand: "TestBrand",
  rating: 4.5,
  reviewCount: 100,
  stock: 50,
  images: ["test.jpg"],
  tags: ["new"],
  createdAt: new Date().toISOString(),
};

describe("Cart store", () => {
  beforeEach(() => {
    // reset store before each test
    useCartStore.setState({ items: [] });
  });

  it("should add items to cart", () => {
    const { addItem } = useCartStore.getState();

    addItem(mockProduct, 2);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(mockProduct.id);
    expect(items[0].quantity).toBe(2);
  });

  it("should increase quantity if items already exist", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct, 2);
    addItem(mockProduct, 1);
    addItem(mockProduct, 1);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });

  it("should not exceed limit", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct, 50);
    addItem(mockProduct, 1);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(50);
  });

  it("should remove items from cart", () => {
    const { removeItem, addItem } = useCartStore.getState();
    addItem(mockProduct, 1);
    removeItem(mockProduct.id);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("should update item quantity", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockProduct, 1);
    updateQuantity(mockProduct.id, 2);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should remove item if quantity update to 0", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockProduct, 1);
    updateQuantity(mockProduct.id, 0);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("should calculate total price correctly", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct, 2);
    const { getTotalPrice } = useCartStore.getState();
    expect(getTotalPrice()).toBe(199.98);
  });

  it("should calculate total item correctly", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct, 2);
    addItem({ ...mockProduct, id: "2" }, 3);

    const { getTotalItems } = useCartStore.getState();
    expect(getTotalItems()).toBe(5);
  });

  it("should clear cart", () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(mockProduct, 2);
    clearCart();
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });
});
