"use client";

import { useRef, useEffect, useState } from "react";

/* A lightweight Blogger-style WYSIWYG editor.
   - Compose mode = contentEditable with a formatting toolbar (outputs HTML)
   - HTML mode = raw source, like Blogger's "HTML" tab
   No external libraries — uses the browser's built-in editing commands. */

export default function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("rich"); // "rich" | "html"

  // Prefer semantic tags (<b>) over inline styles for cleaner output
  useEffect(() => {
    try { document.execCommand("styleWithCSS", false, false); } catch (e) {}
  }, []);

  // Sync the editable DOM when the value changes from outside (initial load,
  // AI generate, or switching back from HTML mode). Guarded so typing never
  // resets the caret (after typing, value already equals innerHTML).
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
    const url = prompt("Link URL (https://…)");
    if (url) run("createLink", url.trim());
  }
  function image() {
    const url = prompt("Image URL (https://…)");
    if (url) run("insertImage", url.trim());
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button type="button" className="ed-btn" title="Heading" onClick={() => block("<h2>")}>H2</button>
        <button type="button" className="ed-btn" title="Subheading" onClick={() => block("<h3>")}>H3</button>
        <button type="button" className="ed-btn" title="Normal text" onClick={() => block("<p>")}>¶</button>
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
        <button type="button" className="ed-btn" title="Insert image" onClick={image}>🖼️</button>
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
          data-ph={placeholder || "Start writing your post…"}
        />
      ) : (
        <textarea
          className="editor-html"
          value={value || ""}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<h2>Raw HTML…</h2>"
        />
      )}
    </div>
  );
}
