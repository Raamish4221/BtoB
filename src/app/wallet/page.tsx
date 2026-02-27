"use client";

import { FormEvent, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";

export interface TopupRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: string;
  amount: number;
  receiptUrl: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface WalletBalance {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  company: string;
  balance: number;
  lastTopup?: string;
  lastTopupAmount?: number;
  totalTopups: number;
  totalSpent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  company: string;
  type: "topup" | "purchase" | "refund" | "adjustment";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  performedBy: string;
}

const seedRequests: TopupRequest[] = [
  {
    id: "REQ-1209",
    userId: "CUS-001",
    userName: "Raamish Customer",
    userEmail: "raamish@cardcove.com",
    company: "CardCove",
    amount: 450,
    receiptUrl: "bank-transfer-feb.pdf",
    requestDate: "2026-02-24 14:20",
    status: "pending",
  },
  {
    id: "REQ-1210",
    userId: "CUS-001",
    userName: "Raamish Customer",
    userEmail: "raamish@cardcove.com",
    company: "CardCove",
    amount: 900,
    receiptUrl: "topup-slip-900.png",
    requestDate: "2026-02-25 09:40",
    status: "pending",
  },
];

const seedTransactions: Transaction[] = [
  {
    id: "TXN-9001",
    userId: "CUS-001",
    userName: "Raamish Customer",
    company: "CardCove",
    type: "topup",
    amount: 1000,
    balanceBefore: 2200,
    balanceAfter: 3200,
    description: "Wallet topup approved",
    timestamp: "2026-02-20 11:03",
    performedBy: "Admin",
  },
  {
    id: "TXN-9002",
    userId: "CUS-001",
    userName: "Raamish Customer",
    company: "CardCove",
    type: "purchase",
    amount: -350,
    balanceBefore: 3200,
    balanceAfter: 2850,
    description: "Purchase order #PO-1221",
    timestamp: "2026-02-22 09:40",
    performedBy: "System",
  },
];

function statusClasses(status: TopupRequest["status"]) {
  if (status === "approved") return "status-pill approved";
  if (status === "rejected") return "status-pill rejected";
  return "status-pill pending";
}

function currentTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(
    2,
    "0"
  )}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"topup" | "history">("topup");
  const [requests, setRequests] = useState<TopupRequest[]>(seedRequests);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [notice, setNotice] = useState("");

  const [openTopupModal, setOpenTopupModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests]
  );
  const currentBalance = 2850;
  const pendingAmount = pendingRequests.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmitTopup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setNotice("Please enter a valid top-up amount.");
      return;
    }
    if (!receiptFile) {
      setNotice("Please upload a receipt file before submitting.");
      return;
    }

    const requestId = `REQ-${1000 + requests.length + 1}`;
    const timestamp = currentTimestamp();

    const newRequest: TopupRequest = {
      id: requestId,
      userId: "CUS-001",
      userName: "Raamish Customer",
      userEmail: "raamish@cardcove.com",
      company: "CardCove",
      amount: numericAmount,
      receiptUrl: receiptFile.name,
      requestDate: timestamp,
      status: "pending",
    };

    setRequests((prev) => [newRequest, ...prev]);
    setTransactions((prev) => [
      {
        id: `TXN-${9000 + prev.length + 1}`,
        userId: "CUS-001",
        userName: "Raamish Customer",
        company: "CardCove",
        type: "topup",
        amount: numericAmount,
        balanceBefore: currentBalance,
        balanceAfter: currentBalance,
        description: `Top-up request submitted (${requestId})`,
        timestamp,
        performedBy: "Customer",
      },
      ...prev,
    ]);

    setNotice(`Top-up request ${requestId} submitted.`);
    setOpenTopupModal(false);
    setAmount("");
    setReceiptFile(null);
  };

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <div className="flex flex-wrap justify-between gap-4 items-end">
            <div>
              <h1 className="app-title">Wallet</h1>
              <p className="app-subtitle">Track balances, submit top-up requests, and monitor activity.</p>
            </div>
            <button className="app-button-primary px-5 py-2.5" onClick={() => setOpenTopupModal(true)}>
              Request Top Up
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card">
            <p className="metric-label">Current Balance</p>
            <p className="metric-value">${currentBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Available wallet funds</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Pending Top Up Requests</p>
            <p className="metric-value">{pendingRequests.length}</p>
            <p className="text-xs text-gray-500 mt-1">${pendingAmount.toLocaleString()} awaiting approval</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Account Summary</p>
            <p className="metric-value">{transactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total recorded wallet transactions</p>
          </div>
        </section>

        <section className="app-card">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-5">
            <nav className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("topup")}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === "topup"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Top Up Requests
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === "history"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Transaction History
              </button>
            </nav>
          </div>

          {activeTab === "topup" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Top Up Requests</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Multiple pending requests can be active at the same time.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4">Request ID</th>
                      <th className="py-2 pr-4">Submitted</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Receipt</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 dark:border-gray-700/60">
                        <td className="py-3 pr-4 font-medium">{request.id}</td>
                        <td className="py-3 pr-4">{request.requestDate}</td>
                        <td className="py-3 pr-4">${request.amount.toLocaleString()}</td>
                        <td className="py-3 pr-4">{request.receiptUrl}</td>
                        <td className="py-3">
                          <span className={statusClasses(request.status)}>{request.status.toUpperCase()}</span>
                        </td>
                      </tr>
                    ))}
                    {pendingRequests.length === 0 && (
                      <tr>
                        <td className="py-6 text-center text-gray-500" colSpan={5}>
                          No active requests.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Transaction</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Balance Before</th>
                      <th className="py-2 pr-4">Balance After</th>
                      <th className="py-2">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 dark:border-gray-700/60 text-gray-700 dark:text-gray-300"
                      >
                        <td className="py-3 pr-4">{transaction.timestamp}</td>
                        <td className="py-3 pr-4">{transaction.description}</td>
                        <td
                          className={`py-3 pr-4 font-medium ${
                            transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}${transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-3 pr-4">${transaction.balanceBefore.toLocaleString()}</td>
                        <td className="py-3 pr-4">${transaction.balanceAfter.toLocaleString()}</td>
                        <td className="py-3">{transaction.performedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {notice && <section className="app-card text-sm text-gray-700 dark:text-gray-300">{notice}</section>}
      </div>

      {openTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Top Up</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter amount and attach payment receipt.
              </p>
            </div>

            <form className="p-5 space-y-4" onSubmit={handleSubmitTopup}>
              <div>
                <label htmlFor="topupAmount" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Amount (USD)
                </label>
                <input
                  id="topupAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="app-input"
                  placeholder="500"
                />
              </div>

              <div>
                <label htmlFor="topupReceipt" className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Upload Receipt
                </label>
                <input
                  id="topupReceipt"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) =>
                    setReceiptFile(
                      event.target.files && event.target.files[0] ? event.target.files[0] : null
                    )
                  }
                  className="app-input"
                />
                {receiptFile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Selected file: {receiptFile.name}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpenTopupModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="app-button-primary text-sm px-4 py-2">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
