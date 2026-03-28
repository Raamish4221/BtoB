"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import ProductCard from "@/components/ProductCard";
import { products } from "@/app/data/products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const queryMatch =
      query.trim().length === 0 ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    return queryMatch;
  });

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <h1 className="app-title">Products</h1>
          <p className="app-subtitle">Select a product card to open details, then add to cart or buy now.</p>
        </section>

        <section className="app-card">
          <div className="w-full">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="app-input"
            />
          </div>
        </section>

        <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </Dashboard>
  );
}
