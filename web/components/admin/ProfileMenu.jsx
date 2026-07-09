"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const name = process.env.NEXT_PUBLIC_ADMIN_NAME || "Admin";
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "FreeTool";
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="profile" ref={ref}>
      <button type="button" className="p-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{initials}</span>
        <span className="who">{name}</span>
        <span className="caret">▾</span>
      </button>
      {open ? (
        <div className="menu">
          <div className="head">
            <span className="avatar">{initials}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{site} admin</div>
            </div>
          </div>
          <Link href="/admin" onClick={() => setOpen(false)}>📊 Dashboard</Link>
          <Link href="/admin/analytics" onClick={() => setOpen(false)}>📈 Analytics</Link>
          <Link href="/admin/monetization" onClick={() => setOpen(false)}>💰 Monetization</Link>
          <a href="/" target="_blank" rel="noreferrer">🌐 View website ↗</a>
          <button onClick={logout}>🚪 Sign out</button>
        </div>
      ) : null}
    </div>
  );
}
