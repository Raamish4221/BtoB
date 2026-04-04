"use client";

import Dashboard from "@/components/Dashboard";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/app/context/ShopContext";
import type { Product } from "@/app/products/page";

export default function FavoritesPage() {
  const { favoriteItems } = useShop();

  // Cast stored snapshots to Product — CartProduct now includes all required fields
  const favoriteProducts = favoriteItems
    .filter(f => f.product)
    .map(f => ({
      ...f.product!,
      shortDescription: f.product!.shortDescription ?? "",
      description:      f.product!.description      ?? "",
      rating:           f.product!.rating            ?? 0,
      reviews:          f.product!.reviews           ?? 0,
    } as Product));

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <h1 className="app-title">Favorites</h1>
          <p className="app-subtitle">Quick access to products saved with the heart icon.</p>
        </section>

        {favoriteProducts.length === 0 ? (
          <section className="app-card">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {favoriteItems.length > 0
                ? "Your favorites were saved before product data was available. Browse products and re-add them."
                : "No favorite products yet. Click the heart icon on any product to add it here."}
            </p>
          </section>
        ) : (
          <section className="product-grid">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </Dashboard>
  );
}