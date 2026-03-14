"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");

  return (
    <Dashboard>
      <div className="app-page">
        <section className="app-card app-hero">
          <div>
            <h1 className="app-title">Settings</h1>
            <p className="app-subtitle">Manage your account preferences and settings.</p>
          </div>
        </section>

        <section className="app-card">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-5">
            <nav className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preferences")}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === "preferences"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Preferences
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {activeTab === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Raamish Customer"
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="raamish@cardcove.com"
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    defaultValue="CardCove"
                    className="app-input"
                  />
                </div>
                <div className="pt-4">
                  <button className="app-button-primary px-4 py-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about your account activity.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about new products and features.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode appearance.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="app-input"
                  />
                </div>
                <div className="pt-4">
                  <button className="app-button-primary px-4 py-2">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </Dashboard>
  );
}
