"use client";

import Dashboard from "@/components/Dashboard";
import ProductCard from "@/components/ProductCard";
import { getFavoriteProducts, useShop } from "@/app/context/ShopContext";

export default function FavoritesPage() {
  const { favoriteIds } = useShop();
  const favoriteProducts = getFavoriteProducts(favoriteIds);

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
              No favorite products yet. Click the heart icon on any product to add it here.
            </p>
          </section>
        ) : (
          <section className="product-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </Dashboard>
  );
}
