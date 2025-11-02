import { useCartStore } from "@/lib/stores/cartStores";
import { Product } from "@/lib/types/product";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "@/components/product/product-card";

vi.mock("@/lib/stores/cartStores");

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

describe("ProductCard", () => {
  it("should render Product information", () => {
    const mockAddItem = vi.fn();
    vi.mocked(useCartStore).mockReturnValue(mockAddItem);

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("$129.99")).toBeInTheDocument();
  });

  it("should show new badge", () => {
    const mockAddItem = vi.fn();
    vi.mocked(useCartStore).mockReturnValue(mockAddItem);

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should show out of stock in quantity is 0", () => {
    const mockAddItem = vi.fn();
    vi.mocked(useCartStore).mockReturnValue(mockAddItem);

    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeDisabled();
  });

  it("should addItem when clicking add to cart", () => {
    const mockAddItem = vi.fn();
    vi.mocked(useCartStore).mockReturnValue(mockAddItem);

    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAddItem).toBeCalledWith(mockProduct);
  });
});
