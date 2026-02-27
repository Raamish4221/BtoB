"use client";

import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  mfaCode: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    mfaCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }, 1200);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <div className="login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="app-title">CardCove Login</h1>
          <p className="app-subtitle">
            {requiresMFA ? "Enter your MFA code to continue" : "Sign in to access your account"}
          </p>
        </div>

        <div className="login-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2">
                {error}
              </p>
            )}

            {!requiresMFA ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="admin@cardcove.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="********"
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="mfaCode" className="block text-sm mb-1">
                  MFA Code
                </label>
                <input
                  id="mfaCode"
                  name="mfaCode"
                  type="text"
                  maxLength={6}
                  required
                  value={formData.mfaCode}
                  onChange={handleChange}
                  className="app-input text-center tracking-[0.3em]"
                  placeholder="123456"
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="app-button-primary w-full disabled:opacity-70">
              {loading ? "Please wait..." : requiresMFA ? "Verify & Sign In" : "Sign In"}
            </button>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <button
                type="button"
                className="hover:underline"
                onClick={() => setRequiresMFA((prev) => !prev)}
              >
                {requiresMFA ? "Back to password login" : "Use MFA"}
              </button>
              <a href="/forgot-password" className="hover:underline">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
