"use client";

import { useState } from "react";
import { convert } from "../../lib/conversions";

const fmt = (n) => (Number.isFinite(n) ? Number(n.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "—");

export function UnitConvert({ cfg }) {
  const [val, setVal] = useState(1);
  const out = convert(Number(val) || 0, cfg.from, cfg.to, cfg.dim);
  const one = convert(1, cfg.from, cfg.to, cfg.dim);
  const table = [1, 2, 3, 5, 10, 25, 50, 100, 500, 1000];

  return (
    <div className="tool">
      <div className="tool-io" style={{ alignItems: "end" }}>
        <div>
          <label className="fld">{cfg.fromLabel} ({cfg.fu})</label>
          <input className="input" type="number" value={val} onChange={(e) => setVal(e.target.value)} style={{ fontSize: 20 }} />
        </div>
        <div>
          <label className="fld">{cfg.toLabel} ({cfg.tu})</label>
          <div className="sheet" style={{ padding: "12px 14px", fontSize: 22, fontWeight: 800 }}>{fmt(out)}</div>
        </div>
      </div>

      <div className="sheet" style={{ padding: "12px 16px", marginTop: 14, textAlign: "center", fontSize: 15 }}>
        <strong>1 {cfg.fu} = {fmt(one)} {cfg.tu}</strong>
      </div>

      <h3 style={{ fontSize: 16, marginTop: 22 }}>{cfg.fromLabel} to {cfg.toLabel} conversion table</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{cfg.fromLabel} ({cfg.fu})</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{cfg.toLabel} ({cfg.tu})</th>
          </tr></thead>
          <tbody>
            {table.map((n) => (
              <tr key={n}>
                <td style={{ padding: 8, borderBottom: "1px solid var(--border)" }}>{n} {cfg.fu}</td>
                <td style={{ padding: 8, borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{fmt(convert(n, cfg.from, cfg.to, cfg.dim))} {cfg.tu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
