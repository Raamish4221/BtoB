"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { getFavoriteProducts, useShop } from "@/app/context/ShopContext";

interface DashboardTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

interface ProductStat {
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

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  attachmentName: string;
  createdAt: string;
  status: "Pending" | "In Progress" | "Resolved";
}

const recentTransactions: DashboardTransaction[] = [
  { id: "TXN-1005", date: "2026-02-26 10:12", description: "Top-up approved", amount: 1200, status: "Completed" },
  { id: "TXN-1004", date: "2026-02-25 17:22", description: "Order #ORD-3002", amount: -280, status: "Completed" },
  { id: "TXN-1003", date: "2026-02-25 09:10", description: "Refund #RF-90", amount: 40, status: "Completed" },
  { id: "TXN-1002", date: "2026-02-24 15:01", description: "Top-up request", amount: 500, status: "Pending" },
  { id: "TXN-1001", date: "2026-02-23 11:44", description: "Order #ORD-2998", amount: -120, status: "Completed" },
];

const bestSellingProducts: ProductStat[] = [
  { id: "P1", name: "Amazon Gift Card", category: "Gift Cards", sold: 480 },
  { id: "P2", name: "Netflix Premium", category: "Subscriptions", sold: 365 },
  { id: "P3", name: "Google Play Voucher", category: "Gift Cards", sold: 290 },
  { id: "P4", name: "Spotify Annual", category: "Subscriptions", sold: 205 },
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

function ticketStatusBadge(status: SupportTicket["status"]) {
  if (status === "Resolved") return "status-pill approved";
  if (status === "In Progress") return "status-pill rejected";
  return "status-pill pending";
}

export default function Page() {
  const { cartCount, favoriteCount, favoriteIds } = useShop();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportTitle, setSupportTitle] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportAttachment, setSupportAttachment] = useState<File | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  const favorites = getFavoriteProducts(favoriteIds);
  const lastLogin = "February 26, 2026 09:31 AM";
  const pendingTopups = topupRequests.filter((req) => req.status === "Pending").length;
  const pendingOrders = pendingOrdersTable.filter((order) => order.status === "Pending").length;
  const walletBalance = 2850;

  const handleSupportSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      title: supportTitle.trim(),
      description: supportDescription.trim(),
      attachmentName: supportAttachment?.name || "No attachment",
      createdAt: new Date().toLocaleString(),
      status: "Pending",
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    setSupportTitle("");
    setSupportDescription("");
    setSupportAttachment(null);
    setIsSupportModalOpen(false);
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

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="app-card">
            <p className="metric-label">Cart Items</p>
            <p className="text-2xl font-bold mt-1">{cartCount}</p>
          </div>
          <div className="app-card">
            <p className="metric-label">Favorites</p>
            <p className="text-2xl font-bold mt-1">{favoriteCount}</p>
          </div>
          <div className="app-card md:col-span-2 xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="metric-label">Favorite Products</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {favorites.length === 0
                    ? "No favorites yet."
                    : favorites.slice(0, 3).map((item) => item.name).join(", ")}
                </p>
              </div>
              <Link href="/favorites" className="app-button-secondary">
                Open Favorites
              </Link>
            </div>
          </div>
          <div className="app-card md:col-span-2 xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="metric-label">Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Raise a ticket for billing, wallet, or order issues.
                </p>
              </div>
              <button
                type="button"
                className="app-button-primary"
                onClick={() => setIsSupportModalOpen(true)}
              >
                Open Support
              </button>
            </div>
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
            <h2 className="text-lg font-semibold mb-3">Reorder Shortcut</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/products/amazon-gift-card" className="app-button-primary text-center">
                Reorder Amazon Gift Card
              </Link>
              <Link href="/products/netflix-premium" className="app-button-primary text-center">
                Reorder Netflix Premium
              </Link>
              <Link href="/products/google-play-voucher" className="app-button-primary text-center">
                Reorder Google Play Voucher
              </Link>
              <Link href="/products/spotify-annual" className="app-button-primary text-center">
                Reorder Spotify Annual
              </Link>
            </div>
          </div>
        </section>

        <section className="app-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Recent Transactions (Last 5)</h2>
            <Link href="/products" className="app-button-secondary">
              Browse Products
            </Link>
          </div>
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

        <section className="app-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Support Tickets</h2>
            <button
              type="button"
              className="app-button-secondary"
              onClick={() => setIsSupportModalOpen(true)}
            >
              Generate Ticket
            </button>
          </div>

          {supportTickets.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No tickets yet. Click &quot;Generate Ticket&quot; to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Ticket ID</th>
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Attachment</th>
                    <th className="py-2 pr-4">Created At</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4 font-medium">{ticket.id}</td>
                      <td className="py-3 pr-4">{ticket.title}</td>
                      <td className="py-3 pr-4">{ticket.attachmentName}</td>
                      <td className="py-3 pr-4">{ticket.createdAt}</td>
                      <td className="py-3">
                        <span className={ticketStatusBadge(ticket.status)}>{ticket.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl app-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold">Create Support Ticket</h2>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="app-button-secondary"
              >
                Close
              </button>
            </div>

            <form className="grid gap-3" onSubmit={handleSupportSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={supportTitle}
                  onChange={(e) => setSupportTitle(e.target.value)}
                  className="app-input"
                  placeholder="Short issue title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attach Image or File</label>
                <input
                  type="file"
                  onChange={(e) => setSupportAttachment(e.target.files?.[0] || null)}
                  className="app-input"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                />
                {supportAttachment && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {supportAttachment.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Problem Description</label>
                <textarea
                  required
                  value={supportDescription}
                  onChange={(e) => setSupportDescription(e.target.value)}
                  className="app-input min-h-32"
                  placeholder="Describe the issue in detail"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(false)}
                  className="app-button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="app-button-primary">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
