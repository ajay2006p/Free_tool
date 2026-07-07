"use client";

import { useRef, useEffect, useState } from "react";

/* A lightweight Blogger-style WYSIWYG editor.
   - Compose mode = contentEditable with a formatting toolbar (outputs HTML)
   - HTML mode = raw source, like Blogger's "HTML" tab
   No external libraries - uses the browser's built-in editing commands. */

export default function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("rich");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try { document.execCommand("styleWithCSS", false, false); } catch (e) {}
  }, []);

  useEffect(() => {
    if (mode === "rich" && ref.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
  }, [value, mode]);

  const emit = () => onChange(ref.current ? ref.current.innerHTML : "");

  function run(cmd, val = null) {
    ref.current?.focus();
    try { document.execCommand(cmd, false, val); } catch (e) {}
    emit();
  }
  const block = (tag) => run("formatBlock", tag);

  function link() {
    const url = prompt("Link URL (https://...)");
    if (url) run("createLink", url.trim());
  }

  function image() {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.onchange = async () => {
      const file = picker.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const auth = await fetch("/api/imagekit/auth").then((r) => r.json());
        if (!auth?.signature) throw new Error(auth?.error || "ImageKit is not configured.");

        const fd = new FormData();
        fd.append("file", file);
        fd.append("fileName", file.name);
        fd.append("publicKey", auth.publicKey || auth.token);
        fd.append("signature", auth.signature);
        fd.append("expire", String(auth.expire));
        fd.append("token", auth.token);
        fd.append("folder", "blog");

        const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Upload failed.");
        if (data.url) run("insertImage", data.url);
      } catch (e) {
        alert(e.message || "Could not upload image.");
      } finally {
        setUploading(false);
      }
    };
    picker.click();
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button type="button" className="ed-btn" title="Heading" onClick={() => block("<h2>")}>H2</button>
        <button type="button" className="ed-btn" title="Subheading" onClick={() => block("<h3>")}>H3</button>
        <button type="button" className="ed-btn" title="Normal text" onClick={() => block("<p>")}>P</button>
        <span className="ed-sep" />
        <button type="button" className="ed-btn" title="Bold" style={{ fontWeight: 900 }} onClick={() => run("bold")}>B</button>
        <button type="button" className="ed-btn" title="Italic" style={{ fontStyle: "italic" }} onClick={() => run("italic")}>I</button>
        <button type="button" className="ed-btn" title="Underline" style={{ textDecoration: "underline" }} onClick={() => run("underline")}>U</button>
        <button type="button" className="ed-btn" title="Strikethrough" style={{ textDecoration: "line-through" }} onClick={() => run("strikeThrough")}>S</button>
        <span className="ed-sep" />
        <button type="button" className="ed-btn" title="Bulleted list" onClick={() => run("insertUnorderedList")}>• List</button>
        <button type="button" className="ed-btn" title="Numbered list" onClick={() => run("insertOrderedList")}>1. List</button>
        <button type="button" className="ed-btn" title="Quote" onClick={() => block("<blockquote>")}>❝</button>
        <button type="button" className="ed-btn" title="Code block" onClick={() => block("<pre>")}>{"</>"}</button>
        <span className="ed-sep" />
        <button type="button" className="ed-btn" title="Insert link" onClick={link}>🔗</button>
        <button type="button" className="ed-btn" title="Insert image" onClick={image} disabled={uploading}>{uploading ? "..." : "🖼️"}</button>
        <button type="button" className="ed-btn" title="Clear formatting" onClick={() => run("removeFormat")}>✖</button>
        <div className="ed-tabs">
          <button type="button" className={"ed-tab" + (mode === "rich" ? " on" : "")} onClick={() => setMode("rich")}>Compose</button>
          <button type="button" className={"ed-tab" + (mode === "html" ? " on" : "")} onClick={() => setMode("html")}>HTML</button>
        </div>
      </div>

      {mode === "rich" ? (
        <div
          ref={ref}
          className="editor-area"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          data-ph={placeholder || "Start writing your post..."}
        />
      ) : (
        <textarea
          className="editor-html"
          value={value || ""}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<h2>Raw HTML...</h2>"
        />
      )}
    </div>
  );
}
