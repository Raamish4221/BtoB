"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useShop } from "@/app/context/ShopContext";
import { api } from "@/src/app/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  wallet:              { balance: number; currency: string };
  pendingTopups:       number;
  recentTopups:        TopupRow[];
  pendingOrders:       OrderRow[];
  recentTransactions:  TxnRow[];
  recentTickets:       TicketRow[];
}

interface TopupRow {
  id: string;
  amount: number;
  currency: string;
  receiptUrl: string | null;
  status: string;
  requestedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  product: string;
  quantity: number;
  createdAt: string;
}

interface TxnRow {
  id: string;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
}

interface TicketRow {
  id: string;
  ticketNumber: string;
  title: string;
  attachmentName: string | null;
  status: string;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(raw: string | null | undefined) {
  if (!raw) return "—";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function statusPill(status: string) {
  const s = status.toLowerCase();
  if (["approved","completed","resolved"].includes(s))
    return "status-pill approved";
  if (["rejected","failed","cancelled"].includes(s))
    return "status-pill rejected";
  return "status-pill pending";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const { cartCount, favoriteCount } = useShop();

  const [data,        setData]        = useState<DashboardData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // Support ticket modal
  const [ticketModal,       setTicketModal]       = useState(false);
  const [ticketTitle,       setTicketTitle]       = useState("");
  const [ticketDesc,        setTicketDesc]        = useState("");
  const [ticketAttachment,  setTicketAttachment]  = useState<File | null>(null);
  const [ticketSubmitting,  setTicketSubmitting]  = useState(false);
  const [ticketError,       setTicketError]       = useState<string | null>(null);

  // ─── Load dashboard ────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api.getClientDashboard()
      .then(res => setData(res.data))
      .catch(e  => setError(e.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  // ─── Submit support ticket ─────────────────────────────────────────────────
  const handleTicketSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTicketError(null);
    setTicketSubmitting(true);
    try {
      const res = await api.createSupportTicket(ticketTitle, ticketDesc, ticketAttachment);
      // Prepend new ticket to local list
      setData(prev => prev ? {
        ...prev,
        recentTickets: [res.data, ...prev.recentTickets].slice(0, 5),
      } : prev);
      setTicketTitle("");
      setTicketDesc("");
      setTicketAttachment(null);
      setTicketModal(false);
    } catch (e: any) {
      setTicketError(e.message || "Failed to create ticket");
    } finally {
      setTicketSubmitting(false);
    }
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <Dashboard>
        <div className="app-page animate-pulse space-y-4">
          <div className="app-card h-24 bg-gray-100 dark:bg-gray-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="metric-card h-20 bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
          <div className="app-card h-48 bg-gray-100 dark:bg-gray-800" />
        </div>
      </Dashboard>
    );
  }

  if (error || !data) {
    return (
      <Dashboard>
        <div className="app-page">
          <div className="app-card text-center py-8">
            <p className="text-sm text-red-600 dark:text-red-400">{error || "No data"}</p>
            <button onClick={() => window.location.reload()} className="app-button-primary mt-3">
              Retry
            </button>
          </div>
        </div>
      </Dashboard>
    );
  }

  const { wallet, pendingTopups, recentTopups, pendingOrders, recentTransactions, recentTickets } = data;

  return (
    <Dashboard>
      <div className="app-page">

        {/* Hero */}
        <section className="app-card app-hero">
          <h1 className="app-title">Client Dashboard</h1>
          <p className="app-subtitle">Operational snapshot for wallet, orders, and products.</p>
        </section>

        {/* Metric cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card">
            <p className="metric-label">Wallet Balance</p>
            <p className="metric-value">
              {wallet.currency} {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Pending Top Up Requests</p>
            <p className="metric-value">{pendingTopups}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Pending Orders</p>
            <p className="metric-value">{pendingOrders.length}</p>
          </div>
        </section>

        {/* Cart / Favorites */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="app-card">
            <p className="metric-label">Cart Items</p>
            <p className="text-2xl font-bold mt-1">{cartCount}</p>
          </div>
          <div className="app-card">
            <p className="metric-label">Favorites</p>
            <p className="text-2xl font-bold mt-1">{favoriteCount}</p>
          </div>
          <div className="app-card md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="metric-label">Quick Actions</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Browse products or manage your wallet.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/favorites" className="app-button-secondary">Favorites</Link>
                <Link href="/wallet"    className="app-button-primary">Wallet</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Topup requests + Pending orders */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="app-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Topup Requests</h2>
              <Link href="/wallet" className="app-button-secondary text-xs">View All</Link>
            </div>
            {recentTopups.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No topup requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4">Request #</th>
                      <th className="py-2 pr-4">Requested At</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTopups.map((r, index) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700/60">
                        <td className="py-3 pr-4 font-medium">#{index + 1}</td>
                        <td className="py-3 pr-4">{fmt(r.requestedAt)}</td>
                        <td className="py-3 pr-4">{r.currency} {r.amount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={statusPill(r.status)}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="app-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Pending Orders</h2>
              <Link href="/orders" className="app-button-secondary text-xs">View All</Link>
            </div>
            {pendingOrders.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No pending orders.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4">Order</th>
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 pr-4">Qty</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map(o => (
                      <tr key={o.id} className="border-b border-gray-100 dark:border-gray-700/60">
                        <td className="py-3 pr-4 font-medium">{o.orderNumber}</td>
                        <td className="py-3 pr-4 max-w-[140px] truncate" title={o.product}>{o.product}</td>
                        <td className="py-3 pr-4">{o.quantity}</td>
                        <td className="py-3 pr-4">${o.total.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={statusPill(o.status)}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section className="app-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link href="/wallet" className="app-button-secondary">View All</Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Reference</th>
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(t => (
                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4">{fmt(t.timestamp)}</td>
                      <td className="py-3 pr-4 font-medium">#{t.id}</td>
                      <td className="py-3 pr-4">{t.description}</td>
                      <td className={`py-3 font-medium ${t.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {t.amount >= 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Support tickets */}
        <section className="app-card">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Support Tickets</h2>
            <button type="button" className="app-button-secondary"
              onClick={() => { setTicketModal(true); setTicketError(null); }}>
              Generate Ticket
            </button>
          </div>

          {recentTickets.length === 0 ? (
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
                  {recentTickets.map(t => (
                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700/60">
                      <td className="py-3 pr-4 font-medium">{t.ticketNumber}</td>
                      <td className="py-3 pr-4">{t.title}</td>
                      <td className="py-3 pr-4 text-gray-500">{t.attachmentName || "No attachment"}</td>
                      <td className="py-3 pr-4">{fmt(t.createdAt)}</td>
                      <td className="py-3">
                        <span className={statusPill(t.status)}>{t.status.replace("_", " ")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ── Support ticket modal ────────────────────────────────────────────── */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl app-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold">Create Support Ticket</h2>
              <button type="button" className="app-button-secondary" disabled={ticketSubmitting}
                onClick={() => setTicketModal(false)}>
                Close
              </button>
            </div>

            {ticketError && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{ticketError}</p>
              </div>
            )}

            <form className="grid gap-3" onSubmit={handleTicketSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" required value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  className="app-input" placeholder="Short issue title" disabled={ticketSubmitting} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attach File (optional)</label>
                <input type="file"
                  onChange={e => setTicketAttachment(e.target.files?.[0] || null)}
                  className="app-input"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                  disabled={ticketSubmitting} />
                {ticketAttachment && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {ticketAttachment.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea required value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  className="app-input min-h-32" placeholder="Describe the issue in detail"
                  disabled={ticketSubmitting} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="app-button-secondary" disabled={ticketSubmitting}
                  onClick={() => setTicketModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="app-button-primary" disabled={ticketSubmitting}>
                  {ticketSubmitting ? "Submitting…" : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
