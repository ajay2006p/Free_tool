"use client";

/* ============================================================================
   Flashcard & Quiz Maker — build a deck, study it, then test yourself.

   Decks live in this browser (localStorage) and can be exported to a JSON file
   for backup or sharing, so nothing is locked in and no account is needed.

   Study mode leads with the weakest cards rather than a fixed order: cards you
   got wrong come back sooner, which is the one thing that makes flashcards
   actually work.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage, uid } from "./useLocalStorage";

const MODES = { edit: "Build", study: "Study", test: "Test" };

/** "term - definition" / "term: definition" / "term<tab>definition" per line. */
function parseBulk(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = /^(.*?)\s*(?:\t|\s[-–—]\s|:\s|,\s)(.*)$/.exec(line);
      if (!m) return null;
      const front = m[1].trim();
      const back = m[2].trim();
      return front && back ? { id: uid(), front, back, right: 0, wrong: 0 } : null;
    })
    .filter(Boolean);
}

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* Weakest first: never-seen cards, then the ones with the worst hit rate. */
function byWeakness(cards) {
  return cards.slice().sort((a, b) => {
    const seenA = a.right + a.wrong;
    const seenB = b.right + b.wrong;
    if (!seenA !== !seenB) return seenA ? 1 : -1;
    const rateA = seenA ? a.right / seenA : 0;
    const rateB = seenB ? b.right / seenB : 0;
    return rateA - rateB;
  });
}

const STARTER = {
  name: "My first deck",
  cards: [
    { id: "c1", front: "What does HTML stand for?", back: "HyperText Markup Language", right: 0, wrong: 0 },
    { id: "c2", front: "What does CSS stand for?", back: "Cascading Style Sheets", right: 0, wrong: 0 },
    { id: "c3", front: "What does API stand for?", back: "Application Programming Interface", right: 0, wrong: 0 },
  ],
};

export function QuizMaker() {
  const [deck, setDeck] = useLocalStorage("dh_deck_cards", STARTER);
  const [mode, setMode] = useState("edit");
  const [bulk, setBulk] = useState("");
  const [note, setNote] = useState("");

  const cards = deck.cards || [];

  const setCards = useCallback((next) => setDeck((d) => ({ ...d, cards: next })), [setDeck]);

  function addCard() {
    setCards([...cards, { id: uid(), front: "", back: "", right: 0, wrong: 0 }]);
  }
  function setCard(id, patch) {
    setCards(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCard(id) {
    setCards(cards.filter((c) => c.id !== id));
  }
  function importBulk() {
    const parsed = parseBulk(bulk);
    if (!parsed.length) {
      setNote("No cards found. Use one card per line: term - definition");
      setTimeout(() => setNote(""), 5000);
      return;
    }
    setCards([...cards, ...parsed]);
    setBulk("");
    setNote(`Added ${parsed.length} card${parsed.length === 1 ? "" : "s"}.`);
    setTimeout(() => setNote(""), 4000);
  }
  function exportJson() {
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(deck.name || "deck").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) {}
  }
  function importFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = Array.isArray(parsed) ? parsed : parsed.cards;
        if (!Array.isArray(incoming)) throw new Error("bad shape");
        const clean = incoming
          .filter((c) => c && c.front && c.back)
          .map((c) => ({ id: uid(), front: String(c.front), back: String(c.back), right: 0, wrong: 0 }));
        if (!clean.length) throw new Error("empty");
        setDeck({ name: parsed.name || deck.name, cards: clean });
        setNote(`Loaded ${clean.length} cards.`);
        setTimeout(() => setNote(""), 4000);
      } catch (e) {
        setNote("That file isn't a deck this tool can read.");
        setTimeout(() => setNote(""), 5000);
      }
    };
    reader.readAsText(file);
  }
  function resetProgress() {
    setCards(cards.map((c) => ({ ...c, right: 0, wrong: 0 })));
  }

  const studied = cards.filter((c) => c.right + c.wrong > 0).length;
  const mastered = cards.filter((c) => c.right >= 2 && c.right > c.wrong).length;
  // Memoised: Study and Test key their session off this array, so handing them
  // a fresh one on every unrelated re-render would restart the session.
  const usable = useMemo(() => cards.filter((c) => c.front.trim() && c.back.trim()), [cards]);

  return (
    <div className="tool">
      <div className="flex-between" style={{ flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <input
          className="input"
          style={{ maxWidth: 280, fontWeight: 700 }}
          value={deck.name}
          onChange={(e) => setDeck({ ...deck, name: e.target.value })}
          placeholder="Deck name"
          maxLength={80}
        />
        <div className="chips" style={{ margin: 0 }}>
          {Object.entries(MODES).map(([key, label]) => (
            <button
              key={key}
              className="chip"
              onClick={() => setMode(key)}
              disabled={key !== "edit" && !usable.length}
              style={mode === key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="hint" style={{ marginTop: 0 }}>
        {cards.length} card{cards.length === 1 ? "" : "s"} · {studied} studied · {mastered} mastered
      </p>

      {note ? <div className="notice notice-ok">{note}</div> : null}

      {mode === "edit" ? (
        <>
          {cards.map((c, i) => (
            <div key={c.id} className="sheet" style={{ padding: "10px 12px", marginBottom: 8 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Card {i + 1}</span>
                <button className="btn btn-sm btn-outline" onClick={() => removeCard(c.id)}>✕</button>
              </div>
              <input
                className="input"
                value={c.front}
                onChange={(e) => setCard(c.id, { front: e.target.value })}
                placeholder="Front — the question or term"
                maxLength={300}
              />
              <input
                className="input"
                style={{ marginTop: 6 }}
                value={c.back}
                onChange={(e) => setCard(c.id, { back: e.target.value })}
                placeholder="Back — the answer or definition"
                maxLength={500}
              />
            </div>
          ))}

          <button className="btn btn-sm btn-outline" onClick={addCard}>+ Add card</button>

          <div className="fld" style={{ marginTop: 20 }}>Paste a whole list at once</div>
          <textarea
            className="textarea"
            rows={4}
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={"One card per line:\nMitochondria - the powerhouse of the cell\nOsmosis: movement of water across a membrane"}
          />
          <div className="tool-controls" style={{ marginTop: 8, flexWrap: "wrap" }}>
            <button className="btn" onClick={importBulk} disabled={!bulk.trim()}>Add these cards</button>
            <button className="btn btn-outline" onClick={exportJson} disabled={!cards.length}>Export deck</button>
            <label className="btn btn-outline" style={{ cursor: "pointer" }}>
              Import deck
              <input
                type="file"
                accept="application/json,.json"
                style={{ display: "none" }}
                onChange={(e) => importFile(e.target.files?.[0])}
              />
            </label>
            {studied ? (
              <button className="btn btn-outline" onClick={resetProgress}>Reset progress</button>
            ) : null}
          </div>
          <p className="hint">
            Separate the two sides with a dash, a colon, a comma or a tab. Your deck saves automatically in this browser.
          </p>
        </>
      ) : mode === "study" ? (
        <StudyMode cards={usable} onScore={(id, ok) => setCard(id, ok ? { right: (cards.find((c) => c.id === id)?.right || 0) + 1 } : { wrong: (cards.find((c) => c.id === id)?.wrong || 0) + 1 })} />
      ) : (
        <TestMode cards={usable} onFinish={resetProgress} />
      )}
    </div>
  );
}

/* ------------------------------- study ----------------------------------- */

function StudyMode({ cards, onScore }) {
  // The order is fixed when the session starts. Scoring a card updates the deck,
  // which would otherwise re-sort the queue underneath the user mid-session and
  // make cards repeat or vanish.
  const latest = useRef(cards);
  latest.current = cards;
  const [queue, setQueue] = useState(() => byWeakness(cards));
  const [at, setAt] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = queue[at];
  const done = at >= queue.length;

  function answer(ok) {
    if (card) onScore(card.id, ok);
    setFlipped(false);
    setAt((i) => i + 1);
  }
  function again() {
    setQueue(byWeakness(latest.current));
    setAt(0);
    setFlipped(false);
  }

  if (done) {
    return (
      <div className="sheet center" style={{ padding: "30px 20px" }}>
        <div style={{ fontSize: 38 }}>🎓</div>
        <h3 style={{ margin: "8px 0 4px" }}>Deck complete</h3>
        <p className="muted">You went through all {queue.length} cards. Cards you missed will come first next time.</p>
        <button className="btn btn-accent" onClick={again}>Go again</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ height: 6, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden", margin: "6px 0 16px" }}>
        <div style={{ height: "100%", width: `${(at / queue.length) * 100}%`, background: "linear-gradient(90deg,var(--accent),var(--accent-2))", transition: "width .25s ease" }} />
      </div>

      <button
        onClick={() => setFlipped((v) => !v)}
        style={{
          width: "100%",
          minHeight: 190,
          cursor: "pointer",
          padding: "26px 22px",
          borderRadius: "var(--radius)",
          border: `2px solid ${flipped ? "var(--accent)" : "var(--border)"}`,
          background: flipped ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--surface-2)",
          color: flipped ? "#fff" : "var(--text)",
          fontSize: 19,
          fontWeight: 700,
          lineHeight: 1.5,
          transition: "all .2s ease",
        }}
      >
        <span style={{ display: "block", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7, marginBottom: 10 }}>
          {flipped ? "Answer" : "Question"}
        </span>
        {flipped ? card.back : card.front}
        <span style={{ display: "block", fontSize: 12, opacity: 0.7, marginTop: 14, fontWeight: 500 }}>
          {flipped ? "Tap to see the question again" : "Tap to reveal the answer"}
        </span>
      </button>

      <div className="tool-controls" style={{ marginTop: 14 }}>
        <button className="btn btn-outline" onClick={() => answer(false)}>✕ Didn't know</button>
        <button className="btn btn-accent" onClick={() => answer(true)}>✓ Got it</button>
      </div>
      <p className="hint">
        Card {at + 1} of {queue.length} · this session leads with your weakest cards.
      </p>
    </div>
  );
}

/* -------------------------------- test ----------------------------------- */

/* Multiple choice built from the deck itself: the other three options are real
   answers from other cards, which makes the test meaningfully harder than
   guessing from a flashcard flip. */
function TestMode({ cards }) {
  const [questions, setQuestions] = useState([]);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const build = useCallback(() => {
    const pool = cards.slice();
    const qs = shuffle(pool).map((card) => {
      const distractors = shuffle(pool.filter((c) => c.id !== card.id)).slice(0, 3).map((c) => c.back);
      return { card, options: shuffle([card.back, ...distractors]) };
    });
    setQuestions(qs);
    setAt(0);
    setPicked(null);
    setScore(0);
  }, [cards]);

  useEffect(() => {
    build();
  }, [build]);

  // Checked before the "building" state: with one card there is nothing to build
  // and the user would otherwise sit on a spinner forever.
  if (cards.length < 2) {
    return <div className="notice notice-warn">Add at least two cards to take a multiple-choice test.</div>;
  }

  if (!questions.length) return <p className="muted">Building your test…</p>;

  const q = questions[at];
  const finished = at >= questions.length;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="sheet center" style={{ padding: "30px 20px" }}>
        <div style={{ fontSize: 38 }}>{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div>
        <h3 style={{ margin: "8px 0 4px" }}>
          {score} / {questions.length} correct ({pct}%)
        </h3>
        <p className="muted">
          {pct >= 80 ? "You know this deck well." : pct >= 50 ? "Solid — a study round will close the gap." : "Worth another study round before testing again."}
        </p>
        <button className="btn btn-accent" onClick={build}>Test me again</button>
      </div>
    );
  }

  function pick(option) {
    if (picked) return;
    setPicked(option);
    if (option === q.card.back) setScore((s) => s + 1);
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <strong>Question {at + 1} of {questions.length}</strong>
        <span className="muted" style={{ fontSize: 13 }}>Score {score}</span>
      </div>

      <div className="sheet" style={{ padding: "16px 18px", marginBottom: 12, fontSize: 17, fontWeight: 700 }}>
        {q.card.front}
      </div>

      <div className="stack-sm">
        {q.options.map((opt) => {
          const isRight = opt === q.card.back;
          const chosen = picked === opt;
          const reveal = Boolean(picked);
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={reveal}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                cursor: reveal ? "default" : "pointer",
                padding: "12px 14px",
                marginBottom: 7,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                border: `2px solid ${reveal && isRight ? "#16a34a" : chosen ? "#dc2626" : "var(--border)"}`,
                background: reveal && isRight ? "rgba(22,163,74,.12)" : chosen ? "rgba(220,38,38,.1)" : "var(--surface-2)",
                color: "var(--text)",
              }}
            >
              {opt}
              {reveal && isRight ? " ✓" : chosen && !isRight ? " ✕" : ""}
            </button>
          );
        })}
      </div>

      {picked ? (
        <button className="btn btn-accent" style={{ marginTop: 14 }} onClick={() => { setPicked(null); setAt((i) => i + 1); }}>
          {at + 1 === questions.length ? "See my score" : "Next question →"}
        </button>
      ) : null}
    </div>
  );
}
