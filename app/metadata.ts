import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search as string;
  const categories = params.categories as string;

  // Build dynamic title based on filters
  let title = "Product Catalog";
  if (search) {
    title = `Search: ${search} - Product Catalog`;
  } else if (categories) {
    title = `${categories} - Product Catalog`;
  }

  return {
    title,
    description:
      "Discover our amazing collection of products with advanced filtering and search",
  };
}
