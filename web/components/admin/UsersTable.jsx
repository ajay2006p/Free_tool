"use client";

import { useState, useEffect } from "react";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function UsersTable() {
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else setUsers(data.users);
    } catch (e) { setErr("Could not load users."); }
  }
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Delete this user account permanently?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) setUsers((u) => u.filter((x) => x.id !== id));
      else alert("Could not delete.");
    } catch (e) { alert("Something went wrong."); }
    finally { setBusy(""); }
  }

  if (err) return <div className="notice notice-error">{err}</div>;
  if (!users) return <div className="empty">Loading users…</div>;

  return (
    <div className="sheet" style={{ padding: 8 }}>
      {users.length === 0 ? (
        <div className="empty">No one has signed up yet. Accounts created on the site's login page show up here.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name || "—"}</strong></td>
                  <td className="mono" style={{ fontSize: 13 }}>{u.email}</td>
                  <td className="muted">{fmt(u.createdAt)}</td>
                  <td><div className="row-actions"><button className="btn btn-sm btn-outline" disabled={busy === u.id} onClick={() => remove(u.id)}>{busy === u.id ? "…" : "Delete"}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
