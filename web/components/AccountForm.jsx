"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AccountForm() {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/scraper";
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
      });
      const data = await res.json();
      if (res.ok) { router.push(next); router.refresh(); }
      else setErr(data.error || "Something went wrong.");
    } catch (e2) { setErr("Something went wrong."); }
    finally { setBusy(false); }
  }

  return (
    <div className="sheet" style={{ maxWidth: 420, margin: "0 auto", padding: 28 }}>
      <div className="pill-group" style={{ display: "flex", margin: "0 auto 18px", width: "fit-content" }}>
        <button className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>Log in</button>
        <button className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>Sign up</button>
      </div>
      <h1 style={{ fontSize: 24, textAlign: "center" }}>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="muted center" style={{ fontSize: 14 }}>{mode === "login" ? "Log in to use the Business Scraper and more." : "Free account — unlock the Business Scraper."}</p>
      {err ? <div className="notice notice-error">{err}</div> : null}
      <form onSubmit={submit}>
        {mode === "register" ? (
          <div className="form-field"><label className="fld">Name (optional)</label><input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
        ) : null}
        <div className="form-field"><label className="fld">Email</label><input className="input" type="email" value={f.email} onChange={(e) => up("email", e.target.value)} placeholder="you@example.com" autoFocus /></div>
        <div className="form-field"><label className="fld">Password</label><input className="input" type="password" value={f.password} onChange={(e) => up("password", e.target.value)} placeholder="At least 6 characters" /></div>
        <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>{busy ? "Please wait…" : mode === "login" ? "Log in →" : "Create account →"}</button>
      </form>
      <div className="center" style={{ marginTop: 12 }}><Link href="/" className="muted" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 12px" }}>← Back to site</Link></div>
    </div>
  );
}
