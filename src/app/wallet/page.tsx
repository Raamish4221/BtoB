"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { api } from "@/src/app/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopupRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: string;
  amount: number;
  receiptUrl: string | null;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Transaction {
  performedBy: ReactNode;
  company: any;
  userName: any;
  id: string;
  type: "credit" | "debit";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  processedByName?: string;
}

export interface WalletData {
  wallet_id: string;
  balance: number;
  currency: string;
  status: string;
  total_topups: number;
  total_spent: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusPillCls(status: TopupRequest["status"]) {
  if (status === "approved") return "inline-block px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  if (status === "rejected") return "inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  return "inline-block px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
}
function formatDateTime(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString(undefined, {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function mapRequest(r: any): TopupRequest {
  return {
    id:              String(r.id),
    userId:          String(r.user_id || ""),
    userName:        r.userName  || "",
    userEmail:       r.userEmail || "",
    company:         r.company   || "",
    amount:          parseFloat(r.amount),
    receiptUrl:      r.receiptUrl || null,
    requestDate:     r.requestDate || r.created_at || "",
    status:          r.status,
    reviewedBy:      r.reviewedBy      || undefined,
    reviewedAt:      r.reviewedAt      || undefined,
    rejectionReason: r.rejectionReason || undefined,
  };
}

function mapTransaction(t: any): Transaction {
  return {
  id: String(t.id),
  type: t.type || t.transaction_type,
  amount: parseFloat(t.amount),
  balanceBefore: parseFloat(t.balance_before || t.balanceBefore || 0),
  balanceAfter: parseFloat(t.balance_after || t.balanceAfter || 0),
  description: t.description || "",
  timestamp: t.created_at || t.timestamp || "",
  processedByName: t.processedByName || undefined,
  performedBy: undefined,
  company: undefined,
  userName: undefined,
  
};
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"topup" | "history">("topup");

  // Data
  const [wallet,        setWallet]        = useState<WalletData | null>(null);
  const [requests,      setRequests]      = useState<TopupRequest[]>([]);
  const [transactions,  setTransactions]  = useState<Transaction[]>([]);
  const [reqPage,       setReqPage]       = useState(1);
  const [txnPage,       setTxnPage]       = useState(1);
  const [reqTotal,      setReqTotal]      = useState(0);
  const [txnTotal,      setTxnTotal]      = useState(0);
  const [reqTotalPages, setReqTotalPages] = useState(1);
  const [txnTotalPages, setTxnTotalPages] = useState(1);

  // Loading / error
  const [loadingWallet,   setLoadingWallet]   = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingTxns,     setLoadingTxns]     = useState(true);
  const [error,           setError]           = useState<string | null>(null);

  // Topup modal
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [amount,         setAmount]         = useState("");
  const [receiptFile,    setReceiptFile]    = useState<File | null>(null);
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState<string | null>(null);
  const [submitSuccess,  setSubmitSuccess]  = useState<string | null>(null);

  // ─── Loaders ────────────────────────────────────────────────────────────────

  const loadWallet = useCallback(async () => {
    try {
      setLoadingWallet(true);
      const res = await api.getWalletBalance();
      setWallet(res.data);
    } catch (e: any) {
      setError(e.message || "Failed to load wallet");
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      setLoadingRequests(true);
      const res = await api.getMyTopupRequests(undefined, reqPage, 10);
      setRequests((res.data || []).map(mapRequest));
      setReqTotal(res.pagination?.total || 0);
      setReqTotalPages(res.pagination?.totalPages || 1);
    } catch (e: any) {
      setError(e.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  }, [reqPage]);

  const loadTransactions = useCallback(async () => {
    try {
      setLoadingTxns(true);
      const res = await api.getWalletTransactions(txnPage, 20);
      setTransactions((res.data || []).map(mapTransaction));
      setTxnTotal(res.pagination?.total || 0);
      setTxnTotalPages(res.pagination?.totalPages || 1);
    } catch (e: any) {
      setError(e.message || "Failed to load transactions");
    } finally {
      setLoadingTxns(false);
    }
  }, [txnPage]);

  useEffect(() => { loadWallet(); },       [loadWallet]);
  useEffect(() => { loadRequests(); },     [loadRequests]);
  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  // ─── Derived ────────────────────────────────────────────────────────────────

  const pendingRequests = useMemo(() => requests.filter(r => r.status === "pending"), [requests]);
  const pendingAmount   = useMemo(() => pendingRequests.reduce((s, r) => s + r.amount, 0), [pendingRequests]);
  const balance         = wallet ? parseFloat(String(wallet.balance)) : 0;
  const currency        = wallet?.currency || "USD";

  // ─── Submit topup ────────────────────────────────────────────────────────────

  const handleSubmitTopup = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const num = parseFloat(amount);
    if (!num || num <= 0) { setSubmitError("Please enter a valid amount."); return; }
    if (!receiptFile)     { setSubmitError("Please attach a receipt file."); return; }

    setSubmitting(true);
    try {
      const res = await api.requestTopup(num, receiptFile);
      setSubmitSuccess(`Request #${res.data?.requestId} submitted! Awaiting admin approval.`);
      setShowTopupModal(false);
      setAmount("");
      setReceiptFile(null);
      await Promise.all([loadWallet(), loadRequests()]);
    } catch (e: any) {
      setSubmitError(e.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dashboard>
      <div className="app-page">

        {/* Hero */}
        <section className="app-card app-hero">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="app-title">Wallet</h1>
              <p className="app-subtitle">Track your balance, submit top-up requests, and view transaction history.</p>
            </div>
            <button
              onClick={() => { setShowTopupModal(true); setSubmitError(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request Top Up
            </button>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex justify-between items-center">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button onClick={() => { setError(null); loadWallet(); loadRequests(); loadTransactions(); }}
              className="text-sm text-red-600 dark:text-red-400 underline ml-4">Retry</button>
          </div>
        )}

        {/* Success banner */}
        {submitSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex justify-between items-center">
            <p className="text-sm text-green-700 dark:text-green-300">{submitSuccess}</p>
            <button onClick={() => setSubmitSuccess(null)} className="text-green-500 text-xl leading-none ml-4">×</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Balance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            {loadingWallet ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {currency} {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Available to spend</p>
              </>
            )}
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            {loadingRequests ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 mt-1">
                  {pendingRequests.length}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {currency} {pendingAmount.toLocaleString()} awaiting approval
                </p>
              </>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            {loadingTxns ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{txnTotal}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">All recorded wallet activity</p>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6">
            <nav className="flex -mb-px">
              {(["topup", "history"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}>
                  {tab === "topup" ? "Top Up Requests" : "Transaction History"}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">

            {/* ── TOPUP REQUESTS ───────────────────────────────────────────── */}
            {activeTab === "topup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">My Top Up Requests</h3>
                  <span className="text-sm text-gray-400">{reqTotal} total</span>
                </div>

                {loadingRequests ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />)}
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-10">
                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No top up requests yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {["Request ID", "Date", "Amount", "Status"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {requests.map(r => (
                          <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">{r.id}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDateTime(r.requestDate)}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                              {currency} {r.amount.toLocaleString()}
                            </td>
                            {/* <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[160px] truncate" title={r.receiptUrl || ""}>
                              {r.receiptUrl || <span className="italic text-gray-400">—</span>}
                            </td> */}
                            <td className="px-4 py-3">
                              <span className={statusPillCls(r.status)}>{r.status.toUpperCase()}</span>
                              {r.rejectionReason && (
                                <p className="text-xs text-red-500 dark:text-red-400 mt-1">{r.rejectionReason}</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reqTotalPages > 1 && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Page {reqPage} of {reqTotalPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setReqPage(p => Math.max(1, p - 1))} disabled={reqPage === 1 || loadingRequests}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Previous</button>
                      <button onClick={() => setReqPage(p => Math.min(reqTotalPages, p + 1))} disabled={reqPage === reqTotalPages || loadingRequests}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TRANSACTION HISTORY ──────────────────────────────────────── */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Transaction History</h3>
                  <span className="text-sm text-gray-400">{txnTotal} total</span>
                </div>

                {loadingTxns ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />)}
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {["Date", "Description", "Type", "Amount", "Balance After"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>

                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map(t => (
                          <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDateTime(t.timestamp)}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={t.description}>{t.description}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                t.type === "credit"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              }`}>
                                {t.type.toUpperCase()}
                              </span>
                            </td>
                            <td className={`px-4 py-3 font-semibold ${
                              t.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}>
                              {t.type === "credit" ? "+" : "-"}{currency} {t.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              {currency} {t.balanceAfter.toLocaleString()}
                            </td>
                            {/* <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.processedByName || "System"}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {txnTotalPages > 1 && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Page {txnPage} of {txnTotalPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setTxnPage(p => Math.max(1, p - 1))} disabled={txnPage === 1 || loadingTxns}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Previous</button>
                      <button onClick={() => setTxnPage(p => Math.min(txnTotalPages, p + 1))} disabled={txnPage === txnTotalPages || loadingTxns}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── REQUEST TOP UP MODAL ────────────────────────────────────────────── */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Top Up</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Enter amount and attach your payment receipt.
                </p>
              </div>
              <button onClick={() => setShowTopupModal(false)} disabled={submitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="p-5 space-y-4" onSubmit={handleSubmitTopup}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Amount ({currency}) *
                </label>
                <input
                  type="number" min="1" step="any"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 500" disabled={submitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Payment Receipt *
                </label>
                <input
                  type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" disabled={submitting}
                  onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {receiptFile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">✓ {receiptFile.name}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, PNG, JPG, WebP — max 10MB</p>
              </div>

              {submitError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowTopupModal(false)} disabled={submitting}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
