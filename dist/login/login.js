"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function LoginPage() {
    const [formData, setFormData] = (0, react_1.useState)({ email: "", password: "", mfaCode: "" });
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [requiresMFA, setRequiresMFA] = (0, react_1.useState)(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }, 1500);
    };
    const handleChange = (e) => {
        setFormData(Object.assign(Object.assign({}, formData), { [e.target.name]: e.target.value }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            padding: "0 16px",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 448, width: "100%" }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: "center", marginBottom: 32 }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                margin: "0 auto 16px",
                                height: 64, width: 64,
                                background: "#2563eb",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }, children: (0, jsx_runtime_1.jsx)("svg", { style: { height: 40, width: 40 }, fill: "none", stroke: "white", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), (0, jsx_runtime_1.jsx)("h2", { style: { fontSize: 30, fontWeight: 700, color: "#111827", margin: "0 0 8px" }, children: "Card Cove Admin" }), (0, jsx_runtime_1.jsx)("p", { style: { fontSize: 14, color: "#6b7280", margin: 0 }, children: requiresMFA ? "Enter your MFA code to continue" : "Sign in to access the admin portal" })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                        padding: 32,
                    }, children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 24 }, children: [error && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        background: "#fef2f2",
                                        border: "1px solid #fecaca",
                                        borderRadius: 8,
                                        padding: 16,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                    }, children: [(0, jsx_runtime_1.jsx)("svg", { style: { height: 20, width: 20, flexShrink: 0 }, fill: "none", stroke: "#f87171", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), (0, jsx_runtime_1.jsx)("p", { style: { fontSize: 14, color: "#b91c1c", margin: 0 }, children: error })] })), !requiresMFA ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", style: { display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }, children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: handleChange, placeholder: "admin@cardcove.com", style: {
                                                        width: "100%", padding: "12px 16px", border: "1px solid #d1d5db",
                                                        borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff",
                                                        outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                                                    }, onFocus: (e) => e.target.style.borderColor = "#3b82f6", onBlur: (e) => e.target.style.borderColor = "#d1d5db" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", style: { display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }, children: "Password" }), (0, jsx_runtime_1.jsx)("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, value: formData.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", style: {
                                                        width: "100%", padding: "12px 16px", border: "1px solid #d1d5db",
                                                        borderRadius: 8, fontSize: 14, color: "#111827", background: "#fff",
                                                        outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                                                    }, onFocus: (e) => e.target.style.borderColor = "#3b82f6", onBlur: (e) => e.target.style.borderColor = "#d1d5db" })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "mfaCode", style: { display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }, children: "MFA Code" }), (0, jsx_runtime_1.jsx)("input", { id: "mfaCode", name: "mfaCode", type: "text", maxLength: 6, required: true, value: formData.mfaCode, onChange: handleChange, placeholder: "123456", autoFocus: true, style: {
                                                        width: "100%", padding: "12px 16px", border: "1px solid #d1d5db",
                                                        borderRadius: 8, fontSize: 24, color: "#111827", background: "#fff",
                                                        outline: "none", boxSizing: "border-box", textAlign: "center",
                                                        letterSpacing: "0.3em", transition: "border-color 0.2s",
                                                    }, onFocus: (e) => e.target.style.borderColor = "#3b82f6", onBlur: (e) => e.target.style.borderColor = "#d1d5db" }), (0, jsx_runtime_1.jsx)("p", { style: { marginTop: 8, fontSize: 12, color: "#6b7280", textAlign: "center" }, children: "Enter the 6-digit code from your authenticator app" })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => { setRequiresMFA(false); setFormData(Object.assign(Object.assign({}, formData), { mfaCode: "" })); }, style: {
                                                background: "none", border: "none", cursor: "pointer",
                                                fontSize: 14, color: "#6b7280", padding: 0,
                                            }, children: "\u2190 Back to login" })] })), !requiresMFA && ((0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [(0, jsx_runtime_1.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", style: { height: 16, width: 16, accentColor: "#2563eb" } }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: 14, color: "#374151" }, children: "Remember me" })] }), (0, jsx_runtime_1.jsx)("a", { href: "/forgot-password", style: { fontSize: 14, fontWeight: 500, color: "#2563eb", textDecoration: "none" }, children: "Forgot password?" })] })), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, style: {
                                        width: "100%", display: "flex", justifyContent: "center", alignItems: "center",
                                        padding: "12px 16px", border: "none", borderRadius: 8,
                                        fontSize: 14, fontWeight: 500, color: "#fff",
                                        background: loading ? "#93c5fd" : "#2563eb",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        transition: "background 0.2s",
                                    }, onMouseOver: (e) => { if (!loading)
                                        e.target.style.background = "#1d4ed8"; }, onMouseOut: (e) => { if (!loading)
                                        e.target.style.background = "#2563eb"; }, children: loading ? ((0, jsx_runtime_1.jsxs)("svg", { style: { animation: "spin 1s linear infinite", height: 20, width: 20 }, fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("style", { children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }), (0, jsx_runtime_1.jsx)("circle", { style: { opacity: 0.25 }, cx: "12", cy: "12", r: "10", stroke: "white", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { style: { opacity: 0.75 }, fill: "white", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : requiresMFA ? "Verify & Sign In" : "Sign In" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24, padding: 16, background: "#f9fafb", borderRadius: 8 }, children: [(0, jsx_runtime_1.jsx)("p", { style: { fontSize: 12, color: "#6b7280", textAlign: "center", marginBottom: 8 }, children: "Demo Credentials:" }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: 12, color: "#374151", display: "flex", flexDirection: "column", gap: 4 }, children: [(0, jsx_runtime_1.jsxs)("p", { style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " admin@cardcove.com"] }), (0, jsx_runtime_1.jsxs)("p", { style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Password:" }), " Admin@123"] })] })] })] }), (0, jsx_runtime_1.jsx)("p", { style: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 24 }, children: "\u00A9 2024 Card Cove. All rights reserved." })] }) }));
}
