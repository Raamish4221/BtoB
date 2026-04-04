"use client";

import Link from "next/link";
// Import the Product type from the products page which now reflects the API shape
import type { Product } from "@/app/products/page";
import { useShop } from "@/app/context/ShopContext";

interface ProductCardProps {
  product: Product;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.657l-8.828-8.829a4 4 0 010-5.656z" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const favorite = isFavorite(product.id);

  const snapshot = {
    id:               product.id,
    name:             product.name,
    category:         product.category,
    price:            product.price,
    imageGradient:    product.imageGradient,
    badge:            product.badge,
    shortDescription: product.shortDescription,
    description:      product.description,
    rating:           product.rating,
    reviews:          product.reviews,
  };

  return (
    <article className="product-card group">
      <Link href={`/products/${product.id}`} className="block">
        <div
          className="product-visual flex items-start justify-between p-3"
          style={{ background: product.imageGradient || "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <span className="product-category">{product.category}</span>
        </div>
      </Link>

      <div className="product-content">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Link href={`/products/${product.id}`} className="product-name">
              {product.name}
            </Link>
            <p className="product-description">{product.shortDescription}</p>
          </div>
          <button
            type="button"
            className={`favorite-button ${favorite ? "is-active" : ""}`}
            onClick={() => toggleFavorite(product.id, snapshot)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon filled={favorite} />
          </button>
        </div>

        <div className="product-meta mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Instant delivery
          </span>
          <strong>${product.price.toFixed(2)}</strong>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button type="button" className="app-button-primary flex-1"
            onClick={() => addToCart(product.id, 1, snapshot)}>
            Add to Cart
          </button>
          <Link href={`/products/${product.id}`} className="app-button-secondary flex-1 text-center">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}