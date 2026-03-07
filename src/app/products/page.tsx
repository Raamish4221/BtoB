"use client";

import { useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import ProductCard from "@/components/ProductCard";
import { products } from "@/app/data/products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const queryMatch =
      query.trim().length === 0 ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  });

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <h1 className="app-title">Products</h1>
          <p className="app-subtitle">Select a product card to open details, then add to cart or buy now.</p>
        </section>

        <section className="app-card">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="app-input"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`filter-chip ${activeCategory === category ? "is-active" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
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
