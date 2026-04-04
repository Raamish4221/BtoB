"use client";

import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import { useShop } from "@/app/context/ShopContext";

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartProduct,
  } = useShop();

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <h1 className="app-title">Your Cart</h1>
          <p className="app-subtitle">Review selected items and complete purchase.</p>
        </section>

        <section className="app-card">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 dark:text-gray-300">Your cart is empty.</p>
              <Link href="/products" className="app-button-primary inline-block mt-3">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cartItems.map(item => {
                  const product = getCartProduct(item.productId);
                  const subtotal = product
                    ? (product.price * item.quantity).toFixed(2)
                    : "—";

                  return (
                    <div key={item.productId} className="cart-item">
                      <div>
                        <p className="font-semibold">
                          {product?.name ?? item.productId}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product?.category ?? ""}
                        </p>
                      </div>

                      <div className="cart-item-actions">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e =>
                            updateCartQuantity(
                              item.productId,
                              Math.max(1, Number(e.target.value) || 1)
                            )
                          }
                        />
                        <p className="font-semibold">${subtotal}</p>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-700"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-footer">
                <p>
                  Total: <strong>${cartTotal.toFixed(2)}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="app-button-secondary"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button type="button" className="app-button-primary">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </Dashboard>
  );
}