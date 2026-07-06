"use client";

/**
 * Renders the SAME Adsterra unit the website uses, inside an isolated iframe —
 * shown here as a PREVIEW so you can confirm the ad code works. Do NOT click it:
 * clicking your own ads violates ad-network rules and can get you banned.
 */
export default function AdPreview({ adKey, width = 728, height = 90 }) {
  if (!adKey) {
    return <div className="notice notice-warn">No Adsterra key configured. Add <code>NEXT_PUBLIC_ADSTERRA_KEY</code> to admin/.env.</div>;
  }
  const srcDoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script type="text/javascript">atOptions={'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};<\/script><script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"><\/script></body></html>`;
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 10, background: "repeating-linear-gradient(45deg,rgba(214,199,150,.1),rgba(214,199,150,.1) 12px,transparent 12px,transparent 24px)", borderRadius: 6 }}>
      <iframe title="Ad preview" srcDoc={srcDoc} width={width} height={height} scrolling="no" style={{ border: 0, overflow: "hidden", maxWidth: "100%" }} />
    </div>
  );
}
