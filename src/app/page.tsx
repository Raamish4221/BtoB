"use client";

import { useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";

interface DashboardTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

interface Product {
  id: string;
  name: string;
  category: string;
  sold: number;
}

interface TopupRequestRow {
  id: string;
  requestedAt: string;
  amount: number;
  method: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface PendingOrderRow {
  id: string;
  createdAt: string;
  product: string;
  quantity: number;
  total: number;
  status: "Pending" | "Processing";
}

const recentTransactions: DashboardTransaction[] = [
  { id: "TXN-1005", date: "2026-02-26 10:12", description: "Top-up approved", amount: 1200, status: "Completed" },
  { id: "TXN-1004", date: "2026-02-25 17:22", description: "Order #ORD-3002", amount: -280, status: "Completed" },
  { id: "TXN-1003", date: "2026-02-25 09:10", description: "Refund #RF-90", amount: 40, status: "Completed" },
  { id: "TXN-1002", date: "2026-02-24 15:01", description: "Top-up request", amount: 500, status: "Pending" },
  { id: "TXN-1001", date: "2026-02-23 11:44", description: "Order #ORD-2998", amount: -120, status: "Completed" },
];

const bestSellingProducts: Product[] = [
  { id: "P1", name: "Amazon Gift Card", category: "Gift Cards", sold: 480 },
  { id: "P2", name: "Netflix Premium", category: "Subscriptions", sold: 365 },
  { id: "P3", name: "Google Play Voucher", category: "Gift Cards", sold: 290 },
  { id: "P4", name: "Spotify Annual", category: "Subscriptions", sold: 205 },
];

const favoriteCandidates: Product[] = [
  { id: "F1", name: "Steam Wallet Code", category: "Gaming", sold: 140 },
  { id: "F2", name: "Apple Gift Card", category: "Gift Cards", sold: 222 },
  { id: "F3", name: "Xbox Subscription", category: "Gaming", sold: 178 },
  { id: "F4", name: "Canva Pro", category: "Productivity", sold: 130 },
];

const topupRequests: TopupRequestRow[] = [
  { id: "REQ-1210", requestedAt: "2026-02-25 09:40", amount: 900, method: "Bank Transfer", status: "Pending" },
  { id: "REQ-1209", requestedAt: "2026-02-24 14:20", amount: 450, method: "UPI", status: "Pending" },
  { id: "REQ-1208", requestedAt: "2026-02-23 12:10", amount: 500, method: "Bank Transfer", status: "Approved" },
];

const pendingOrdersTable: PendingOrderRow[] = [
  { id: "ORD-3002", createdAt: "2026-02-25 17:22", product: "Netflix Premium", quantity: 4, total: 280, status: "Pending" },
  { id: "ORD-3001", createdAt: "2026-02-25 10:04", product: "Amazon Gift Card", quantity: 10, total: 500, status: "Processing" },
  { id: "ORD-3000", createdAt: "2026-02-24 16:18", product: "Spotify Annual", quantity: 2, total: 120, status: "Pending" },
];

function statusBadge(status: DashboardTransaction["status"]) {
  if (status === "Completed") return "status-pill approved";
  if (status === "Failed") return "status-pill rejected";
  return "status-pill pending";
}

function queueStatusBadge(status: TopupRequestRow["status"] | PendingOrderRow["status"]) {
  if (status === "Approved") return "status-pill approved";
  if (status === "Rejected") return "status-pill rejected";
  return "status-pill pending";
}

export default function Page() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["F2", "F4"]);
  const lastLogin = "February 26, 2026 09:31 AM";

  const pendingTopups = 2;
  const pendingOrders = 3;
  const walletBalance = 2850;

  const favorites = useMemo(
    () => favoriteCandidates.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds]
  );

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <h1 className="app-title">Client Dashboard</h1>
          <p className="app-subtitle">Operational snapshot for wallet, orders, and products.</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Last login: <span className="font-semibold">{lastLogin}</span>
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card">
            <p className="metric-label">Wallet Balance</p>
            <p className="metric-value">${walletBalance.toLocaleString()}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Pending Top Up Requests</p>
            <p className="metric-value">{pendingTopups}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Pending Orders</p>
            <p className="metric-value">{pendingOrders}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="app-card">
            <h2 className="text-lg font-semibold mb-3">Topup Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Request ID</th>
                    <th className="py-2 pr-4">Requested At</th>
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topupRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4 font-medium">{request.id}</td>
                      <td className="py-3 pr-4">{request.requestedAt}</td>
                      <td className="py-3 pr-4">{request.method}</td>
                      <td className="py-3 pr-4">${request.amount}</td>
                      <td className="py-3">
                        <span className={queueStatusBadge(request.status)}>{request.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="app-card">
            <h2 className="text-lg font-semibold mb-3">Pending Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 pr-4">Created At</th>
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrdersTable.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4 font-medium">{order.id}</td>
                      <td className="py-3 pr-4">{order.createdAt}</td>
                      <td className="py-3 pr-4">{order.product}</td>
                      <td className="py-3 pr-4">{order.quantity}</td>
                      <td className="py-3 pr-4">${order.total}</td>
                      <td className="py-3">
                        <span className={queueStatusBadge(order.status)}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="app-card">
            <h2 className="text-lg font-semibold mb-3">Best-Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellingProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4 font-medium">{product.name}</td>
                      <td className="py-3 pr-4">{product.category}</td>
                      <td className="py-3 pr-4">{product.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="app-card">
            <h2 className="text-lg font-semibold mb-3">Favorite Products</h2>
            <div className="grid grid-cols-1 gap-3">
              {favoriteCandidates.map((product) => {
                const isFavorite = favoriteIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    className={`text-left rounded-lg border p-3 transition ${
                      isFavorite
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                    <p className="text-xs mt-1">{isFavorite ? "Favorited" : "Click to favorite"}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
              Selected favorites: {favorites.map((item) => item.name).join(", ") || "None"}
            </p>
          </div>
        </section>

        <section className="app-card">
          <h2 className="text-lg font-semibold mb-3">Reorder Shortcut</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="app-button-primary">Reorder Amazon Gift Card</button>
            <button className="app-button-primary">Reorder Netflix Premium</button>
            <button className="app-button-primary">Reorder Google Play Voucher</button>
          </div>
        </section>

        <section className="app-card">
          <h2 className="text-lg font-semibold mb-3">Recent Transactions (Last 5)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 dark:border-gray-700/60">
                    <td className="py-3 pr-4">{txn.date}</td>
                    <td className="py-3 pr-4">{txn.id}</td>
                    <td className="py-3 pr-4">{txn.description}</td>
                    <td className={`py-3 pr-4 font-medium ${txn.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount)}
                    </td>
                    <td className="py-3">
                      <span className={statusBadge(txn.status)}>{txn.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Dashboard>
  );
}
