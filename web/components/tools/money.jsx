"use client";

import { useEffect, useState } from "react";

const CURRENCIES = [
  ["USD", "US Dollar", "🇺🇸"],
  ["EUR", "Euro", "🇪🇺"],
  ["GBP", "British Pound", "🇬🇧"],
  ["JPY", "Japanese Yen", "🇯🇵"],
  ["AUD", "Australian Dollar", "🇦🇺"],
  ["CAD", "Canadian Dollar", "🇨🇦"],
  ["CHF", "Swiss Franc", "🇨🇭"],
  ["CNY", "Chinese Yuan", "🇨🇳"],
  ["INR", "Indian Rupee", "🇮🇳"],
  ["SGD", "Singapore Dollar", "🇸🇬"],
  ["HKD", "Hong Kong Dollar", "🇭🇰"],
  ["NZD", "New Zealand Dollar", "🇳🇿"],
  ["SEK", "Swedish Krona", "🇸🇪"],
  ["NOK", "Norwegian Krone", "🇳🇴"],
  ["DKK", "Danish Krone", "🇩🇰"],
  ["ZAR", "South African Rand", "🇿🇦"],
  ["BRL", "Brazilian Real", "🇧🇷"],
  ["MXN", "Mexican Peso", "🇲🇽"],
  ["AED", "UAE Dirham", "🇦🇪"],
  ["SAR", "Saudi Riyal", "🇸🇦"],
  ["RUB", "Russian Ruble", "🇷🇺"],
  ["TRY", "Turkish Lira", "🇹🇷"],
  ["KRW", "South Korean Won", "🇰🇷"],
  ["THB", "Thai Baht", "🇹🇭"],
  ["MYR", "Malaysian Ringgit", "🇲🇾"],
  ["IDR", "Indonesian Rupiah", "🇮🇩"],
  ["PHP", "Philippine Peso", "🇵🇭"],
  ["PLN", "Polish Zloty", "🇵🇱"],
  ["CZK", "Czech Koruna", "🇨🇿"],
  ["HUF", "Hungarian Forint", "🇭🇺"],
  ["ILS", "Israeli Shekel", "🇮🇱"],
  ["NGN", "Nigerian Naira", "🇳🇬"],
];

const META = Object.fromEntries(CURRENCIES.map(([c, n, f]) => [c, { name: n, flag: f }]));
const POPULAR = ["USD", "EUR", "GBP", "JPY", "INR", "CNY", "AUD", "CAD"];

function fmtMoney(v, cur) {
  if (!isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: v >= 1000 ? 2 : 4,
    }).format(v);
  } catch (e) {
    return v.toFixed(2) + " " + cur;
  }
}

function fmtRate(v) {
  if (!isFinite(v)) return "—";
  if (v >= 100) return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (v >= 1) return v.toFixed(4);
  return v.toPrecision(4);
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null); // { unitRate, date, rates, source }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      if (from === to) {
        if (!cancelled) {
          setData({
            unitRate: 1,
            date: new Date().toISOString().slice(0, 10),
            rates: { [to]: 1 },
            source: "Same currency",
          });
          setLoading(false);
        }
        return;
      }

      const amt = Number(amount) > 0 ? Number(amount) : 1;

      // 1) Frankfurter (European Central Bank) — CORS friendly, no key
      try {
        const r = await fetch(
          `https://api.frankfurter.app/latest?amount=${amt}&from=${from}&to=${to}`
        );
        if (!r.ok) throw new Error("frankfurter-status");
        const d = await r.json();
        if (!d || !d.rates || d.rates[to] == null) throw new Error("frankfurter-data");

        const unitRate = d.rates[to] / amt;
        let rates = { [to]: unitRate, [from]: 1 };

        // pull the whole base table for the mini-table (best effort)
        try {
          const r2 = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
          if (r2.ok) {
            const d2 = await r2.json();
            if (d2 && d2.rates) rates = { ...d2.rates, [from]: 1, [to]: unitRate };
          }
        } catch (e) {}

        if (!cancelled) {
          setData({ unitRate, date: d.date, rates, source: "European Central Bank" });
          setLoading(false);
        }
        return;
      } catch (e) {
        // fall through to backup source
      }

      // 2) open.er-api.com fallback — compute locally
      try {
        const r = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        if (!r.ok) throw new Error("erapi-status");
        const d = await r.json();
        if (d.result !== "success" || !d.rates || d.rates[to] == null)
          throw new Error("erapi-data");

        const date = d.time_last_update_utc
          ? new Date(d.time_last_update_utc).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);

        if (!cancelled) {
          setData({
            unitRate: d.rates[to],
            date,
            rates: d.rates,
            source: "open.er-api.com",
          });
          setLoading(false);
        }
        return;
      } catch (e) {
        if (!cancelled) {
          setError("Couldn't fetch live rates right now. Check your connection and try again.");
          setData(null);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [from, to, amount]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const amt = Number(amount);
  const validAmt = isFinite(amt) && amount !== "";
  const converted = data && validAmt ? amt * data.unitRate : null;

  const tableRows =
    data && data.rates
      ? POPULAR.filter((c) => c !== from && data.rates[c] != null).slice(0, 6)
      : [];

  return (
    <div className="tool">
      <style>{`
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        .cc-spin {
          width: 22px; height: 22px; border-radius: 50%;
          border: 3px solid var(--accent-soft);
          border-top-color: var(--accent);
          animation: cc-spin .7s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div className="tool-controls" style={{ marginBottom: 12 }}>
        <label className="chk" style={{ fontWeight: 600 }}>
          💰 Amount
          <input
            className="input"
            style={{ width: 150 }}
            type="number"
            min="0"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>

      <div
        className="grid grid-3"
        style={{ alignItems: "end", gap: 12, marginBottom: 8 }}
      >
        <div>
          <label className="fld" htmlFor="cc-from">From</label>
          <select className="select" id="cc-from" value={from} onChange={(e) => setFrom(e.target.value)}>
            {CURRENCIES.map(([c, n, f]) => (
              <option key={c} value={c}>{f} {c} — {n}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 4 }}>
          <button
            className="btn btn-outline"
            onClick={swap}
            title="Swap currencies"
            aria-label="Swap currencies"
            style={{ padding: "10px 16px", fontSize: 18 }}
          >
            ⇄
          </button>
        </div>
        <div>
          <label className="fld" htmlFor="cc-to">To</label>
          <select className="select" id="cc-to" value={to} onChange={(e) => setTo(e.target.value)}>
            {CURRENCIES.map(([c, n, f]) => (
              <option key={c} value={c}>{f} {c} — {n}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="sheet"
        style={{
          padding: 20,
          marginTop: 16,
          textAlign: "center",
          background: "linear-gradient(135deg, var(--accent-soft), var(--accent-2-soft))",
          border: "1px solid var(--border)",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "18px 0" }}>
            <span className="cc-spin" />
            <span className="muted" style={{ fontWeight: 600 }}>Fetching live rates…</span>
          </div>
        ) : error ? (
          <div className="result-err" style={{ fontWeight: 700, padding: "14px 0" }}>
            ⚠ {error}
          </div>
        ) : converted != null ? (
          <>
            <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>
              {META[from]?.flag} {fmtMoney(amt, from)} equals
            </div>
            <div
              style={{
                fontSize: 40,
                lineHeight: 1.1,
                fontWeight: 800,
                margin: "8px 0 6px",
                letterSpacing: "-0.02em",
                background: "linear-gradient(120deg, var(--accent), var(--accent-2))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                overflowWrap: "anywhere",
              }}
            >
              {META[to]?.flag} {fmtMoney(converted, to)}
            </div>
            <div className="result-ok" style={{ fontWeight: 700, fontSize: 15 }}>
              1 {from} = {fmtRate(data.unitRate)} {to}
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              As of {data.date} · Source: {data.source}
            </div>
          </>
        ) : (
          <div className="muted" style={{ padding: "14px 0" }}>Enter an amount to convert.</div>
        )}
      </div>

      {!loading && !error && tableRows.length > 0 ? (
        <div className="sheet" style={{ padding: 0, marginTop: 16, overflow: "hidden" }}>
          <div
            style={{
              padding: "10px 14px",
              fontWeight: 700,
              fontSize: 13,
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            1 {META[from]?.flag} {from} in popular currencies
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {tableRows.map((c) => (
                  <tr key={c} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 17, marginRight: 8 }}>{META[c]?.flag}</span>
                      <strong>{c}</strong>{" "}
                      <span className="muted">— {META[c]?.name}</span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--accent)" }}>
                      {fmtRate(data.rates[c])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <p className="hint">
        Rates are mid-market reference rates that update once daily (banks and cards add a
        margin). Powered by the European Central Bank via Frankfurter, with a live fallback —
        no API key, nothing tracked.
      </p>
    </div>
  );
}
