import fs from "fs";
import { faker } from "@faker-js/faker";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  createdAt: string;
}

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

const generateProducts = (count: number): Product[] => {
  const product: Product[] = [];

  for (let i = 0; i < count; i++) {
    const originalPrice = faker.number.float({
      min: 10,
      max: 5000,
      fractionDigits: 2,
    });
    const discount = faker.number.float({ min: 0, max: 70 });
    const price = originalPrice * (1 - discount / 100);

    product.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(price.toFixed(2)),
      originalPrice: parseFloat(originalPrice.toFixed(2)),
      discount: discount,
      category: faker.helpers.arrayElement(categories),
      brand: faker.helpers.arrayElement(brands),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 1000 }),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: Array.from(
        { length: 4 },
        () => `https://picsum.photos/seed/${faker.string.uuid()}/800/800`,
      ),
      tags: faker.helpers.arrayElements(
        ["new", "sale", "trending", "popular", "limited"],
        { min: 0, max: 3 },
      ),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    });
  }

  return product;
};

const products = generateProducts(10000);

// Save to json
fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2));

console.log(`Generate ${products.length} products`);
