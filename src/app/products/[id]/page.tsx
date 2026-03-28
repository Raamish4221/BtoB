"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { getProductById, products } from "@/app/data/products";
import { useShop } from "@/app/context/ShopContext";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.657l-8.828-8.829a4 4 0 010-5.656z"
      />
    </svg>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(params.id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow, isFavorite, toggleFavorite } = useShop();

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <Dashboard>
        <div className="app-page">
          <section className="app-card">
            <h1 className="app-title">Product not found</h1>
            <p className="app-subtitle">The selected product no longer exists.</p>
            <div className="mt-4">
              <Link href="/products" className="app-button-primary">
                Back to Products
              </Link>
            </div>
          </section>
        </div>
      </Dashboard>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <Dashboard>
      <div className="app-page">
        <section className="product-details app-card">
          <div className="h-48 sm:h-64 rounded-xl flex items-start p-6 mb-6" style={{ background: product.imageGradient }}>
            <span className="product-badge">{product.badge}</span>
          </div>

          <div className="product-details-content">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{product.category}</p>
            <h1 className="app-title mt-2">{product.name}</h1>
            <p className="app-subtitle mt-2">{product.description}</p>

            <div className="product-meta mt-4">
              <span>
                {product.rating.toFixed(1)} / 5 ({product.reviews.toLocaleString()} reviews)
              </span>
              <strong>${product.price}</strong>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-8">
              <label className="flex items-center justify-center gap-2 app-input !w-24 flex-shrink-0 self-start sm:self-auto">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Qty</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="w-full bg-transparent outline-none text-center dark:text-white"
                />
              </label>

              <button type="button" className="app-button-primary flex-1 sm:flex-none" onClick={() => addToCart(product.id, quantity)}>
                Add to Cart
              </button>
              <button
                type="button"
                className="app-button-secondary flex-1 sm:flex-none"
                onClick={() => {
                  buyNow(product.id);
                  router.push("/cart");
                }}
              >
                Buy Now
              </button>
              <button
                type="button"
                className={`app-button-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 ${favorite ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800" : ""}`}
                onClick={() => toggleFavorite(product.id)}
              >
                <HeartIcon filled={favorite} />
                <span>{favorite ? "Favorited" : "Add to Favorites"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 
        <section className="app-card">
          <h2 className="text-lg font-semibold mb-3">Related Products</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((item) => (
              <Link key={item.id} href={`/products/${item.id}`} className="related-product-link">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
        */}
      </div>
    </Dashboard>
  );
}
