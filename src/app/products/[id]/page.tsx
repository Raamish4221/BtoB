"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useShop } from "@/app/context/ShopContext";
import { api } from "@/src/app/lib/api";
import type { Product } from "@/app/data/products";

// ─── Gradient cycle (same as products page mapper) ────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #dc2626 0%, #111827 100%)",
  "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #10b981 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
];

function mapApiToProduct(p: any): Product {
  let badge = "";
  if (p.hasCustomPrice)                                       badge = "Special Price";
  else if (p.availableCodes != null && p.availableCodes < 10) badge = "Low Stock";
  else if (p.source !== "internal")                           badge = "Live Stock";

  return {
    id:               String(p.id),
    name:             p.name     || "",
    category:         p.category || "",
    shortDescription: p.description
                        ? p.description.slice(0, 80) + (p.description.length > 80 ? "…" : "")
                        : `${p.brand || p.category || "Digital"} product — instant delivery.`,
    description:      p.description || "",
    price:            parseFloat(p.price) || 0,
    rating:           0,
    reviews:          0,
    badge,
    imageGradient:    p.images?.[0] ? "" : GRADIENTS[parseInt(p.id) % GRADIENTS.length],
  };
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.657l-8.828-8.829a4 4 0 010-5.656z" />
    </svg>
  );
}

export default function ProductDetailsPage() {
  const params  = useParams<{ id: string }>();
  const router  = useRouter();
  const { addToCart, buyNow, isFavorite, toggleFavorite } = useShop();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ─── Fetch product from API ────────────────────────────────────────────────
  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError(null);

    api.getClientProductById(params.id)
      .then(res => {
        if (!res.data) { setError("Product not found"); return; }
        setProduct(mapApiToProduct(res.data));
      })
      .catch(e => setError(e.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [params.id]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Dashboard>
        <div className="app-page">
          <section className="app-card animate-pulse space-y-4">
            <div className="h-48 sm:h-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </section>
        </div>
      </Dashboard>
    );
  }

  // ─── Error / not found ────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <Dashboard>
        <div className="app-page">
          <section className="app-card">
            <h1 className="app-title">Product not found</h1>
            <p className="app-subtitle">
              {error || "This product is not available or you don't have access to it."}
            </p>
            <div className="mt-4">
              <Link href="/products" className="app-button-primary">Back to Products</Link>
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

          {/* Hero banner */}
          <div
            className="h-48 sm:h-64 rounded-xl flex items-start p-6 mb-6"
            style={{ background: product.imageGradient || "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            {product.badge && <span className="product-badge">{product.badge}</span>}
          </div>

          <div className="product-details-content">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
            <h1 className="app-title mt-2">{product.name}</h1>
            <p className="app-subtitle mt-2">{product.description || product.shortDescription}</p>

            <div className="product-meta mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Digital product · Instant delivery
              </span>
              <strong className="text-xl">${product.price.toFixed(2)}</strong>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-8">
              <label className="flex items-center justify-center gap-2 app-input !w-24 flex-shrink-0 self-start sm:self-auto">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Qty</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-transparent outline-none text-center dark:text-white"
                />
              </label>

              <button type="button" className="app-button-primary flex-1 sm:flex-none"
                onClick={() => addToCart(product.id, quantity)}>
                Add to Cart
              </button>

              <button type="button" className="app-button-secondary flex-1 sm:flex-none"
                onClick={() => { buyNow(product.id); router.push("/cart"); }}>
                Buy Now
              </button>

              <button type="button"
                className={`app-button-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 ${
                  favorite ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800" : ""
                }`}
                onClick={() => toggleFavorite(product.id)}>
                <HeartIcon filled={favorite} />
                <span>{favorite ? "Favorited" : "Add to Favorites"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </Dashboard>
  );
}