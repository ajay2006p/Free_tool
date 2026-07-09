"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { router.push(next); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.error || "Login failed"); }
    } catch (err) { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-card">
      <div className="a-logo">⚡</div>
      <h1 style={{ fontSize: 25, textAlign: "center", margin: 0 }}>Control Center</h1>
      <p className="muted center" style={{ fontSize: 14, margin: "6px 0 20px" }}>Sign in to manage your whole website.</p>
      {error ? <div className="notice notice-error">{error}</div> : null}
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
          <div className="hint">Default: <code>admin123</code> — change it in web/.env (<code>ADMIN_PASSWORD</code>).</div>
        </div>
        <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>{loading ? "Signing in…" : "Sign in →"}</button>
      </form>
    </div>
  );
}
