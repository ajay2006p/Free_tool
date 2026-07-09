"use client";

import { useState, useMemo, useEffect } from "react";
import CopyButton from "../CopyButton";

/* ==================================================================
   Shared UI helpers (not exported)
   ================================================================== */
const GRAD = "linear-gradient(135deg,var(--accent),var(--accent-2))";

function ToolHead({ icon, title, desc }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
        padding: "13px 16px",
        borderRadius: "var(--radius)",
        background: GRAD,
        color: "#fff",
        boxShadow: "0 10px 26px rgba(79,70,229,.28)",
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 12.5, opacity: 0.92 }}>{desc}</div>
      </div>
    </div>
  );
}

function Seg({ options, value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        padding: 3,
        gap: 3,
        maxWidth: "100%",
        flexWrap: "wrap",
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              padding: "6px 15px",
              borderRadius: 999,
              color: on ? "#fff" : "var(--text-soft)",
              background: on ? GRAD : "transparent",
              transition: "all .15s ease",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ==================================================================
   1) JSON → TypeScript
   ================================================================== */
function pascal(str) {
  let out = String(str)
    .replace(/[^A-Za-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  if (!out) out = "Item";
  if (/^[0-9]/.test(out)) out = "N" + out;
  return out;
}

function singular(name) {
  const s = String(name);
  if (/ies$/i.test(s)) return s.replace(/ies$/i, "y");
  if (/ses$/i.test(s)) return s.replace(/ses$/i, "s");
  if (/ss$/i.test(s)) return s;
  if (/s$/i.test(s)) return s.replace(/s$/i, "");
  return s;
}

function uniqueName(base, ctx) {
  let name = base || "Item";
  if (!ctx.used.has(name)) {
    ctx.used.add(name);
    return name;
  }
  let i = 2;
  while (ctx.used.has(name + i)) i++;
  const finalName = name + i;
  ctx.used.add(finalName);
  return finalName;
}

// register an interface from one or more objects (arrays-of-objects merge keys)
function registerObject(objs, hint, ctx) {
  const name = uniqueName(pascal(hint), ctx); // reserve name first (avoids recursion clashes)
  const presence = new Map();
  const values = new Map();
  for (const o of objs) {
    for (const k of Object.keys(o)) {
      presence.set(k, (presence.get(k) || 0) + 1);
      if (!values.has(k)) values.set(k, []);
      values.get(k).push(o[k]);
    }
  }
  const fields = [];
  for (const [k, vals] of values) {
    const optional = presence.get(k) < objs.length; // missing from some elements -> optional
    fields.push({ key: k, type: inferField(vals, k, ctx), optional });
  }
  ctx.interfaces.push({ name, fields });
  return name;
}

// infer a single field's type from all collected values (across merged objects)
function inferField(vals, hint, ctx) {
  const nonNull = vals.filter((v) => v !== null && v !== undefined);
  const hasNull = vals.length !== nonNull.length;
  const types = new Set();
  const allObjects =
    nonNull.length > 0 &&
    nonNull.every((v) => v && typeof v === "object" && !Array.isArray(v));
  if (allObjects) {
    types.add(registerObject(nonNull, hint, ctx)); // merge object-valued fields too
  } else {
    for (const v of nonNull) types.add(inferType(v, hint, ctx));
  }
  if (hasNull) types.add("null");
  const arr = [...types];
  if (arr.length === 0) return "any";
  return arr.join(" | ");
}

function inferType(value, hint, ctx) {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    const allObjects = value.every(
      (v) => v && typeof v === "object" && !Array.isArray(v)
    );
    if (allObjects) {
      return registerObject(value, singular(hint), ctx) + "[]"; // merge across elements
    }
    const types = [...new Set(value.map((v) => inferType(v, singular(hint), ctx)))];
    const inner = types.length === 1 ? types[0] : "(" + types.join(" | ") + ")";
    return inner + "[]";
  }
  const t = typeof value;
  if (t === "object") return registerObject([value], hint, ctx);
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  return "any";
}

function renderDef(def, kind, ro) {
  const validId = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  const body = def.fields
    .map((f) => {
      const key = validId.test(f.key) ? f.key : JSON.stringify(f.key);
      const r = ro ? "readonly " : "";
      return `  ${r}${key}${f.optional ? "?" : ""}: ${f.type};`;
    })
    .join("\n");
  const inner = body ? `{\n${body}\n}` : `{}`;
  if (kind === "type") return `export type ${def.name} = ${inner};`;
  return `export interface ${def.name} ${inner}`;
}

function jsonToTs(json, rootName, kind, ro) {
  const parsed = JSON.parse(json);
  const ctx = { interfaces: [], used: new Set() };
  const base = pascal(rootName || "Root");

  if (parsed === null || typeof parsed !== "object") {
    const t = inferType(parsed, base, ctx);
    return `export type ${uniqueName(base, ctx)} = ${t};`;
  }

  if (Array.isArray(parsed)) {
    const aliasName = uniqueName(base, ctx); // reserve alias name
    const t = inferType(parsed, base + "Item", ctx);
    const lines = ctx.interfaces.map((d) => renderDef(d, kind, ro));
    lines.push(`export type ${aliasName} = ${t};`);
    return lines.join("\n\n");
  }

  const rootTypeName = registerObject([parsed], base, ctx);
  const idx = ctx.interfaces.findIndex((d) => d.name === rootTypeName);
  if (idx > 0) {
    const [root] = ctx.interfaces.splice(idx, 1);
    ctx.interfaces.unshift(root); // show root first
  }
  return ctx.interfaces.map((d) => renderDef(d, kind, ro)).join("\n\n");
}

const JSON_SAMPLE = JSON.stringify(
  {
    id: 1,
    name: "Ada",
    active: true,
    roles: ["admin", "editor"],
    profile: { age: 36, city: "London", verified: null },
    posts: [
      { title: "Hello", views: 10 },
      { title: "World", views: 20, pinned: true },
    ],
  },
  null,
  2
);

export function JsonToTypescript() {
  const [input, setInput] = useState(JSON_SAMPLE);
  const [rootName, setRootName] = useState("Root");
  const [kind, setKind] = useState("interface");
  const [ro, setRo] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      return { output: jsonToTs(input, rootName, kind, ro), error: "" };
    } catch (e) {
      return { output: "", error: e.message || "Invalid JSON" };
    }
  }, [input, rootName, kind, ro]);

  return (
    <div className="tool">
      <ToolHead
        icon="🧬"
        title="JSON → TypeScript"
        desc="Paste JSON, get typed interfaces. Runs 100% in your browser."
      />
      <div className="tool-controls">
        <label className="chk">
          Root name
          <input
            className="input"
            style={{ width: 130 }}
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
          />
        </label>
        <Seg
          value={kind}
          onChange={setKind}
          options={[
            { value: "interface", label: "interface" },
            { value: "type", label: "type" },
          ]}
        />
        <label className="chk">
          <input type="checkbox" checked={ro} onChange={(e) => setRo(e.target.checked)} /> readonly
        </label>
      </div>

      <div className="tool-io">
        <div>
          <label className="fld">JSON input</label>
          <textarea
            className="textarea"
            style={{ minHeight: 300 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"hello":"world"}'
            spellCheck={false}
          />
        </div>
        <div>
          <label className="fld">
            TypeScript {output ? <CopyButton value={output} /> : null}
          </label>
          <div
            className="sheet mono-out"
            style={{
              padding: 14,
              minHeight: 300,
              maxHeight: 460,
              overflow: "auto",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            {output || <span className="hint" style={{ margin: 0 }}>Types appear here…</span>}
          </div>
        </div>
      </div>
      {error ? <p className="result-err hint">✗ {error}</p> : output ? (
        <p className="result-ok hint">✓ Generated {output.split("\n\n").length} definition(s)</p>
      ) : null}
    </div>
  );
}

/* ==================================================================
   2) Cron Explainer
   ================================================================== */
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_MAP = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
const DOW_MAP = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

const CF_SECOND = { key: "second", label: "Seconds", min: 0, max: 59, names: null, unit: "second" };
const CF_MINUTE = { key: "minute", label: "Minutes", min: 0, max: 59, names: null, unit: "minute" };
const CF_HOUR = { key: "hour", label: "Hours", min: 0, max: 23, names: null, unit: "hour" };
const CF_DOM = { key: "dom", label: "Day of month", min: 1, max: 31, names: null, unit: "day-of-month" };
const CF_MONTH = { key: "month", label: "Month", min: 1, max: 12, names: MONTHS_MAP, unit: "month", fmt: (v) => MONTH_NAMES[v] };
const CF_DOW = { key: "dow", label: "Day of week", min: 0, max: 7, names: DOW_MAP, unit: "weekday", fmt: (v) => DOW_NAMES[v] };
const FIVE = [CF_MINUTE, CF_HOUR, CF_DOM, CF_MONTH, CF_DOW];

const MACROS = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@hourly": "0 * * * *",
};

function two(n) {
  return String(n).padStart(2, "0");
}
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function isContiguous(vals) {
  for (let i = 1; i < vals.length; i++) if (vals[i] !== vals[i - 1] + 1) return false;
  return true;
}
function listToText(arr, fmt) {
  const a = arr.map(fmt);
  if (a.length === 0) return "";
  if (a.length === 1) return a[0];
  if (a.length === 2) return a[0] + " and " + a[1];
  return a.slice(0, -1).join(", ") + ", and " + a[a.length - 1];
}

function resolveToken(tok, cfg) {
  tok = tok.trim();
  let n;
  if (cfg.names && cfg.names[tok] != null) n = cfg.names[tok];
  else if (/^\d+$/.test(tok)) n = parseInt(tok, 10);
  else throw new Error(cfg.label + ": '" + tok + "' is not valid.");
  if (n < cfg.min || n > cfg.max)
    throw new Error(cfg.label + ": " + n + " is out of range (" + cfg.min + "–" + cfg.max + ").");
  return n;
}

function parseField(raw, cfg) {
  const set = new Set();
  const segs = String(raw).toUpperCase().split(",");
  for (let seg of segs) {
    seg = seg.trim();
    if (!seg) throw new Error(cfg.label + ": empty value in '" + raw + "'.");
    let step = 1;
    let body = seg;
    const sp = seg.split("/");
    if (sp.length === 2) {
      step = parseInt(sp[1], 10);
      if (!(step > 0)) throw new Error(cfg.label + ": invalid step '" + sp[1] + "'.");
      body = sp[0];
    } else if (sp.length > 2) {
      throw new Error(cfg.label + ": invalid syntax '" + seg + "'.");
    }
    let lo, hi;
    if (body === "*") {
      lo = cfg.min;
      hi = cfg.max;
    } else if (body.includes("-")) {
      const hp = body.split("-");
      if (hp.length !== 2) throw new Error(cfg.label + ": invalid range '" + body + "'.");
      lo = resolveToken(hp[0], cfg);
      hi = resolveToken(hp[1], cfg);
    } else {
      lo = resolveToken(body, cfg);
      hi = sp.length === 2 ? cfg.max : lo; // "N/step" == "N-max/step"
    }
    const seq = [];
    if (lo <= hi) {
      for (let v = lo; v <= hi; v++) seq.push(v);
    } else {
      for (let v = lo; v <= cfg.max; v++) seq.push(v); // wrap-around range e.g. FRI-MON
      for (let v = cfg.min; v <= hi; v++) seq.push(v);
    }
    for (let i = 0; i < seq.length; i += step) set.add(seq[i]);
  }
  if (cfg.key === "dow" && set.has(7)) {
    set.delete(7);
    set.add(0); // 7 == Sunday
  }
  return set;
}

function parseCron(expr) {
  let e = String(expr).trim().replace(/\s+/g, " ");
  if (!e) throw new Error("Enter a cron expression.");
  const lower = e.toLowerCase();
  if (lower.startsWith("@")) {
    if (MACROS[lower]) e = MACROS[lower];
    else
      throw new Error(
        "Unknown macro '" + e + "'. Try @yearly, @monthly, @weekly, @daily or @hourly."
      );
  }
  const tokens = e.split(" ");
  let order;
  let hasSeconds = false;
  if (tokens.length === 6) {
    hasSeconds = true;
    order = [CF_SECOND, ...FIVE];
  } else if (tokens.length === 5) {
    order = FIVE;
  } else {
    throw new Error("Expected 5 fields (or 6 with seconds) but got " + tokens.length + ".");
  }
  const fields = {};
  order.forEach((cfg, i) => {
    fields[cfg.key] = { set: parseField(tokens[i], cfg), raw: tokens[i], cfg };
  });
  return { fields, order, hasSeconds, normalized: e };
}

function fieldMeaning(f) {
  const cfg = f.cfg;
  if (f.raw === "*") return "every " + cfg.unit;
  const st = /^\*\/(\d+)$/.exec(f.raw);
  if (st) return "every " + st[1] + " " + cfg.unit + "s";
  const vals = [...f.set].sort((a, b) => a - b);
  const fmt = cfg.fmt || String;
  if (vals.length > 1 && isContiguous(vals))
    return cfg.unit + " " + fmt(vals[0]) + "–" + fmt(vals[vals.length - 1]);
  return (vals.length > 1 ? cfg.unit + "s " : cfg.unit + " ") + vals.map(fmt).join(", ");
}

function hourTail(hr) {
  const vals = [...hr.set].sort((a, b) => a - b);
  const st = /^\*\/(\d+)$/.exec(hr.raw);
  if (hr.raw === "*") return "of every hour";
  if (st) return "past every " + ordinal(parseInt(st[1], 10)) + " hour";
  if (vals.length > 1 && isContiguous(vals)) return "past hours " + vals[0] + "–" + vals[vals.length - 1];
  return "past hour " + vals.join(", ");
}

function timePhrase(fields) {
  const min = fields.minute;
  const hr = fields.hour;
  const sec = fields.second;
  const minVals = [...min.set].sort((a, b) => a - b);
  const hrVals = [...hr.set].sort((a, b) => a - b);
  const minAll = min.raw === "*";
  const hrAll = hr.raw === "*";
  const minStep = /^\*\/(\d+)$/.exec(min.raw);
  const secAll = !sec || sec.raw === "*";
  const secSingle =
    sec && sec.raw !== "*" && !/^\*\//.test(sec.raw) && sec.set.size === 1 ? [...sec.set][0] : null;

  const exactMin = !minAll && !minStep;
  const exactHr = !hrAll && !/^\*\//.test(hr.raw);

  if (exactMin && exactHr && minVals.length * hrVals.length <= 16 && (secAll || secSingle != null)) {
    const times = [];
    for (const h of hrVals)
      for (const m of minVals)
        times.push(secSingle != null ? two(h) + ":" + two(m) + ":" + two(secSingle) : two(h) + ":" + two(m));
    return "At " + listToText(times, (x) => x);
  }
  if (minAll && hrAll) return "Every minute";
  if (minStep && hrAll) return "Every " + minStep[1] + " minutes";
  if (minAll && !hrAll) return "Every minute " + hourTail(hr);
  if (minStep && !hrAll) return "Every " + minStep[1] + " minutes " + hourTail(hr);
  if (exactMin && hrAll) {
    const mt = minVals.length > 1 ? "minutes " + minVals.join(", ") : "minute " + minVals[0];
    return "At " + mt + " past every hour";
  }
  const mt = minStep
    ? "every " + minStep[1] + " minutes"
    : minVals.length > 1
    ? "minutes " + minVals.join(", ")
    : "minute " + minVals[0];
  return "At " + mt + " " + hourTail(hr);
}

function dayPhrase(fields) {
  const parts = [];
  const dow = fields.dow;
  const dom = fields.dom;
  const month = fields.month;
  if (dow.raw !== "*") {
    const vals = [...dow.set].sort((a, b) => a - b);
    if (vals.length > 1 && isContiguous(vals))
      parts.push(DOW_NAMES[vals[0]] + " through " + DOW_NAMES[vals[vals.length - 1]]);
    else parts.push("on " + listToText(vals, (v) => DOW_NAMES[v]));
  }
  if (dom.raw !== "*") {
    const vals = [...dom.set].sort((a, b) => a - b);
    if (vals.length > 1 && isContiguous(vals))
      parts.push("on day-of-month " + vals[0] + " through " + vals[vals.length - 1]);
    else parts.push("on the " + listToText(vals, ordinal));
  }
  if (month.raw !== "*") {
    const vals = [...month.set].sort((a, b) => a - b);
    if (vals.length > 1 && isContiguous(vals))
      parts.push("in " + MONTH_NAMES[vals[0]] + " through " + MONTH_NAMES[vals[vals.length - 1]]);
    else parts.push("in " + listToText(vals, (v) => MONTH_NAMES[v]));
  }
  return parts.join(", ");
}

function toSentence(fields) {
  let s = timePhrase(fields);
  const d = dayPhrase(fields);
  s += d ? ", " + d : ", every day";
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s.replace(/\s+/g, " ").trim() + ".";
}

function minuteMatch(date, fields) {
  if (!fields.minute.set.has(date.getMinutes())) return false;
  if (!fields.hour.set.has(date.getHours())) return false;
  if (!fields.month.set.has(date.getMonth() + 1)) return false;
  const domR = fields.dom.raw !== "*";
  const dowR = fields.dow.raw !== "*";
  const dm = fields.dom.set.has(date.getDate());
  const wm = fields.dow.set.has(date.getDay());
  if (domR && dowR) return dm || wm; // classic cron OR when both restricted
  if (domR) return dm;
  if (dowR) return wm;
  return true;
}

function nextRuns(fields, hasSeconds, count) {
  const runs = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1); // start at the next whole minute
  const capMinutes = 366 * 4 * 24 * 60; // ~4 years of minutes
  for (let i = 0; i < capMinutes && runs.length < count; i++) {
    if (minuteMatch(d, fields)) {
      if (hasSeconds) {
        const secs = [...fields.second.set].sort((a, b) => a - b);
        for (const s of secs) {
          const dt = new Date(d);
          dt.setSeconds(s);
          if (dt > now) {
            runs.push(dt);
            if (runs.length >= count) break;
          }
        }
      } else {
        runs.push(new Date(d));
      }
    }
    d.setTime(d.getTime() + 60000);
  }
  return runs;
}

export function CronExplainer() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const parsed = useMemo(() => {
    try {
      return { ok: true, ...parseCron(expr) };
    } catch (e) {
      return { ok: false, error: e.message || "Invalid expression" };
    }
  }, [expr]);

  const sentence = useMemo(
    () => (parsed.ok ? toSentence(parsed.fields) : ""),
    [parsed]
  );

  const runs = useMemo(
    () => (mounted && parsed.ok ? nextRuns(parsed.fields, parsed.hasSeconds, 5) : []),
    [mounted, parsed]
  );

  const th = {
    textAlign: "left",
    padding: "9px 12px",
    fontSize: 11.5,
    letterSpacing: ".04em",
    textTransform: "uppercase",
    color: "var(--text-soft)",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };
  const td = { padding: "9px 12px", borderBottom: "1px solid var(--border)", verticalAlign: "top" };

  return (
    <div className="tool">
      <ToolHead icon="⏰" title="Cron Explainer" desc="Decode any cron schedule into plain English + next runs." />

      <label className="fld">Cron expression</label>
      <div className="tool-controls" style={{ marginBottom: 10 }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: 180, fontFamily: "var(--mono)", fontSize: 16, fontWeight: 600 }}
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="0 9 * * 1-5  or  @daily"
          spellCheck={false}
        />
        <CopyButton value={expr} label="Copy" />
      </div>
      <div className="tool-controls" style={{ marginTop: 0 }}>
        {["* * * * *", "*/15 * * * *", "0 0 * * 0", "0 9 1 * *", "@daily"].map((p) => (
          <button key={p} type="button" className="btn btn-sm btn-outline" onClick={() => setExpr(p)}>
            {p}
          </button>
        ))}
      </div>

      {!parsed.ok ? (
        <p className="result-err hint" style={{ fontSize: 14 }}>✗ {parsed.error}</p>
      ) : (
        <>
          <div
            style={{
              margin: "16px 0",
              padding: "18px 20px",
              borderRadius: "var(--radius)",
              background: GRAD,
              color: "#fff",
              fontSize: 19,
              fontWeight: 700,
              lineHeight: 1.4,
              boxShadow: "0 10px 26px rgba(79,70,229,.28)",
            }}
          >
            {sentence}
          </div>

          {parsed.normalized !== expr.trim().replace(/\s+/g, " ") ? (
            <p className="hint">Expands to <code>{parsed.normalized}</code></p>
          ) : null}

          <label className="fld" style={{ marginTop: 6 }}>Field breakdown</label>
          <div className="sheet" style={{ overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
              <thead>
                <tr>
                  <th style={th}>Field</th>
                  <th style={th}>Value</th>
                  <th style={th}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {parsed.order.map((cfg) => {
                  const f = parsed.fields[cfg.key];
                  return (
                    <tr key={cfg.key}>
                      <td style={{ ...td, fontWeight: 600 }}>{cfg.label}</td>
                      <td style={{ ...td, fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700 }}>{f.raw}</td>
                      <td style={{ ...td, color: "var(--text-soft)" }}>{fieldMeaning(f)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <label className="fld" style={{ marginTop: 16 }}>Next 5 runs (your local time)</label>
          {!mounted ? (
            <p className="hint">Calculating…</p>
          ) : runs.length ? (
            <div className="grid grid-2" style={{ gap: 10 }}>
              {runs.map((r, i) => (
                <div
                  key={i}
                  className="sheet"
                  style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 12, borderLeft: "3px solid var(--accent)" }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      fontWeight: 800,
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{r.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="result-err hint">✗ No matching runs within the next ~4 years.</p>
          )}
        </>
      )}
    </div>
  );
}

/* ==================================================================
   3) HTML ⇄ Markdown
   ================================================================== */
const HTML_SAMPLE =
  '<h1>Hello world</h1>\n<p>This is <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>\n<blockquote>A short quote.</blockquote>';
const MD_SAMPLE =
  "# Hello world\n\nThis is **bold** and *italic* text with a [link](https://example.com).\n\n- First item\n- Second item\n\n> A short quote.\n\n```js\nconsole.log('code block');\n```";

export function HtmlMarkdown() {
  const [mode, setMode] = useState("html2md");
  const [input, setInput] = useState(HTML_SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!input.trim()) {
        setOutput("");
        setError("");
        return;
      }
      try {
        let out;
        if (mode === "html2md") {
          const TurndownService = (await import("turndown")).default;
          out = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" }).turndown(input);
        } else {
          const { marked } = await import("marked");
          out = await marked.parse(input);
        }
        if (!cancelled) {
          setOutput(out);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Conversion failed");
          setOutput("");
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [input, mode]);

  function swap() {
    setInput(output || "");
    setMode((m) => (m === "html2md" ? "md2html" : "html2md"));
  }
  function loadSample() {
    setInput(mode === "html2md" ? HTML_SAMPLE : MD_SAMPLE);
  }

  const isHtmlToMd = mode === "html2md";
  const inLabel = isHtmlToMd ? "HTML input" : "Markdown input";
  const outLabel = isHtmlToMd ? "Markdown output" : "HTML output";

  return (
    <div className="tool">
      <ToolHead icon="🔁" title="HTML ⇄ Markdown" desc="Two-way converter with a live preview. Everything stays in your browser." />

      <div className="tool-controls">
        <Seg
          value={mode}
          onChange={setMode}
          options={[
            { value: "html2md", label: "HTML → Markdown" },
            { value: "md2html", label: "Markdown → HTML" },
          ]}
        />
        <button type="button" className="btn btn-sm btn-outline" onClick={swap}>⇄ Swap</button>
        <button type="button" className="btn btn-sm btn-outline" onClick={loadSample}>Load example</button>
      </div>

      <div className="tool-io">
        <div>
          <label className="fld">{inLabel}</label>
          <textarea
            className="textarea"
            style={{ minHeight: 280, fontFamily: isHtmlToMd ? "var(--mono)" : "var(--sans)" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHtmlToMd ? "<p>Paste HTML…</p>" : "# Paste Markdown…"}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="fld">
            {outLabel} {output ? <CopyButton value={output} /> : null}
          </label>
          <textarea
            className="textarea"
            style={{ minHeight: 280, fontFamily: "var(--mono)" }}
            readOnly
            value={output}
            placeholder="Converted output appears here…"
            spellCheck={false}
          />
        </div>
      </div>

      {!isHtmlToMd && output ? (
        <>
          <label className="fld" style={{ marginTop: 14 }}>Live preview</label>
          <div
            className="sheet prose"
            style={{ padding: 18, minHeight: 80, borderTop: "3px solid var(--accent)" }}
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </>
      ) : null}

      {error ? (
        <p className="result-err hint">✗ {error}</p>
      ) : output ? (
        <p className="result-ok hint">✓ Converted {isHtmlToMd ? "HTML → Markdown" : "Markdown → HTML"}</p>
      ) : (
        <p className="hint">Type or paste on the left to convert instantly.</p>
      )}
    </div>
  );
}
