"use client";

/* ============================================================================
   Would You Rather — a browser party game with a large built-in question bank.

   No signup and nothing to unblock: it's one page of JavaScript, so it runs on
   school and work networks that block game sites. Questions are drawn without
   repeats until the pack is exhausted, and your own picks are tallied locally.

   SSR safety: every random draw happens in an effect or a click handler, never
   during render, so the server and client markup always agree.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import CopyButton from "../CopyButton";

const PACKS = {
  classic: {
    name: "Classic",
    icon: "🎲",
    qs: [
      ["be able to fly", "be able to turn invisible"],
      ["have unlimited money", "have unlimited time"],
      ["never use social media again", "never watch another film or show"],
      ["know how you die", "know when you die"],
      ["be famous but poor", "be unknown but rich"],
      ["live without music", "live without television"],
      ["always be 10 minutes late", "always be 20 minutes early"],
      ["read minds", "see one week into the future"],
      ["lose all your old memories", "never be able to make new ones"],
      ["be the funniest person in the room", "be the smartest person in the room"],
      ["speak every language", "play every instrument"],
      ["have a rewind button for your life", "have a pause button"],
      ["live in a big city forever", "live in the countryside forever"],
      ["give up coffee", "give up dessert"],
      ["never wait in a queue again", "never sit in traffic again"],
      ["be able to teleport anywhere", "never need to sleep"],
      ["always know when someone is lying", "always get away with lying"],
      ["have one true friend", "have a hundred acquaintances"],
      ["work your dream job for low pay", "work a boring job for triple pay"],
      ["explore space", "explore the deep ocean"],
      ["be immortal but alone", "live 80 happy years surrounded by people"],
      ["restart your life with your memories", "live the rest of it knowing the future"],
      ["never feel physical pain", "never feel sadness"],
      ["have every book memorised", "have every skill at beginner level"],
      ["win the lottery tomorrow", "find your perfect career tomorrow"],
    ],
  },
  funny: {
    name: "Funny",
    icon: "😂",
    qs: [
      ["sneeze glitter every time", "burp bubbles every time"],
      ["have a permanent unibrow", "have permanently greasy hair"],
      ["fight one horse-sized duck", "fight a hundred duck-sized horses"],
      ["always have to sing instead of speak", "always have to dance while walking"],
      ["have hiccups for a year", "feel like you need to sneeze for a year"],
      ["wear clown shoes every day", "wear a clown wig every day"],
      ["have your search history made public", "have your camera roll made public"],
      ["only be able to whisper", "only be able to shout"],
      ["have spaghetti for hair", "have teeth that grow like fingernails"],
      ["be followed everywhere by a slow tuba player", "have your thoughts narrated aloud"],
      ["smell like garlic permanently", "hear a faint kazoo permanently"],
      ["have to high-five everyone you pass", "have to bow to everyone you pass"],
      ["always speak in rhyme", "always speak in questions"],
      ["have fingers as long as your legs", "have legs as short as your fingers"],
      ["accidentally call your teacher 'mum'", "wave at someone who wasn't waving at you, forever"],
      ["sweat maple syrup", "cry chocolate milk"],
      ["have a pet dinosaur that eats your furniture", "have a pet dragon that sets off the smoke alarm"],
      ["only wear clothes two sizes too big", "only wear clothes two sizes too small"],
      ["have every photo of you be a blink", "have every video of you be sideways"],
      ["be unable to whisper a secret", "be unable to keep a straight face"],
    ],
  },
  food: {
    name: "Food",
    icon: "🍕",
    qs: [
      ["only eat pizza for a year", "never eat pizza again"],
      ["give up cheese", "give up chocolate"],
      ["eat only sweet food", "eat only savoury food"],
      ["have every meal be too spicy", "have every meal be bland"],
      ["never eat bread again", "never eat rice again"],
      ["drink only water forever", "give up your favourite meal forever"],
      ["eat a whole raw onion", "eat a spoon of wasabi"],
      ["have unlimited free takeaway", "become an amazing cook"],
      ["eat breakfast food for every meal", "eat dinner food for every meal"],
      ["never taste salt again", "never taste sugar again"],
      ["eat cold soup", "eat warm ice cream"],
      ["give up fruit", "give up vegetables"],
      ["have your food always slightly burnt", "always slightly undercooked"],
      ["eat the same lunch every day for life", "have a random surprise lunch every day"],
      ["never eat out again", "never cook again"],
    ],
  },
  tech: {
    name: "Tech & work",
    icon: "💻",
    qs: [
      ["lose your phone", "lose your laptop"],
      ["have no internet at home", "have no phone signal outside"],
      ["work fully remote forever", "work in an office with great colleagues"],
      ["debug someone else's code", "rewrite it from scratch"],
      ["have unlimited cloud storage", "have unlimited bandwidth"],
      ["lose all your photos", "lose all your messages"],
      ["never receive another notification", "never send another message"],
      ["have your code reviewed by a legend", "ship whatever you like unreviewed"],
      ["use only the keyboard", "use only the mouse"],
      ["have a four-day week for less pay", "a five-day week for more"],
      ["answer emails at midnight", "attend meetings at 7am"],
      ["have every meeting be a phone call", "have every call be a meeting"],
      ["work with slow internet", "work with a broken chair"],
      ["give a talk to 500 people", "write a report nobody reads"],
      ["have AI do your admin", "have AI do your creative work"],
    ],
  },
  deep: {
    name: "Deep",
    icon: "🤔",
    qs: [
      ["be respected", "be loved"],
      ["change one decision in your past", "see one decision in your future"],
      ["be content with an ordinary life", "chase greatness and risk failing"],
      ["know every truth about the world", "keep some comforting illusions"],
      ["forgive someone who never apologised", "get an apology from someone you can't forgive"],
      ["have more time", "have more courage"],
      ["be understood by everyone", "understand everyone"],
      ["leave a legacy nobody links to you", "be remembered for something small"],
      ["never be criticised again", "never be praised again"],
      ["live where you grew up", "live somewhere nobody knows you"],
      ["have your dreams come true late", "have small wins all your life"],
      ["always say what you think", "always know what others think"],
      ["be the person who leaves", "be the person who stays"],
      ["find out you were wrong", "never find out at all"],
      ["do work that matters quietly", "do work that's celebrated loudly"],
    ],
  },
  family: {
    name: "Family friendly",
    icon: "🧒",
    qs: [
      ["have a treehouse", "have a trampoline"],
      ["be a lion for a day", "be an eagle for a day"],
      ["have summer all year", "have winter all year"],
      ["swim with dolphins", "ride an elephant"],
      ["build the tallest sandcastle", "grow the biggest pumpkin"],
      ["talk to animals", "breathe underwater"],
      ["have a robot that tidies your room", "a robot that does your homework"],
      ["visit the moon", "visit the bottom of the sea"],
      ["be a famous footballer", "be a famous singer"],
      ["have a magic pencil that draws real things", "magic boots that run super fast"],
      ["eat ice cream for breakfast", "have pancakes for dinner"],
      ["be invisible for a day", "be twice as tall for a day"],
      ["have a pet penguin", "have a pet monkey"],
      ["go back to the dinosaurs", "go 100 years into the future"],
      ["always win at board games", "always be the funniest at the table"],
    ],
  },
};

const PACK_KEYS = Object.keys(PACKS);

/** Fisher-Yates. Only ever called from a handler/effect — never during render. */
function shuffled(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WouldYouRather() {
  const [pack, setPack] = useState("classic");
  const [order, setOrder] = useState([]);
  const [at, setAt] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [stats, setStats, ready] = useLocalStorage("dh_wyr_stats", { answered: 0, a: 0, b: 0 });

  const questions = PACKS[pack].qs;

  const deal = useCallback(() => {
    setOrder(shuffled(questions.length));
    setAt(0);
    setChosen(null);
  }, [questions.length]);

  // First deal happens after mount, so the server renders a neutral shell.
  useEffect(() => {
    deal();
  }, [deal]);

  const current = order.length ? questions[order[at]] : null;
  const done = order.length > 0 && at >= order.length;

  function choose(side) {
    if (chosen) return;
    setChosen(side);
    setStats({ answered: (stats.answered || 0) + 1, a: (stats.a || 0) + (side === "a" ? 1 : 0), b: (stats.b || 0) + (side === "b" ? 1 : 0) });
  }
  function next() {
    setChosen(null);
    setAt((i) => i + 1);
  }

  const shareText = current ? `Would you rather ${current[0]} OR ${current[1]}?` : "";

  const progress = order.length ? Math.min(at + (chosen ? 1 : 0), order.length) : 0;

  const Card = ({ side, text }) => {
    const picked = chosen === side;
    const dimmed = chosen && !picked;
    return (
      <button
        onClick={() => choose(side)}
        disabled={Boolean(chosen)}
        style={{
          cursor: chosen ? "default" : "pointer",
          textAlign: "left",
          padding: "20px 18px",
          borderRadius: "var(--radius)",
          border: `2px solid ${picked ? "var(--accent)" : "var(--border)"}`,
          background: picked ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--surface-2)",
          color: picked ? "#fff" : "var(--text)",
          opacity: dimmed ? 0.5 : 1,
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.45,
          transition: "all .18s ease",
          minHeight: 108,
        }}
      >
        <span style={{ display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7, marginBottom: 6 }}>
          {side === "a" ? "Option A" : "Option B"}
        </span>
        {text}
        {picked ? <span style={{ display: "block", marginTop: 8, fontSize: 13, opacity: 0.9 }}>✓ Your pick</span> : null}
      </button>
    );
  };

  return (
    <div className="tool">
      <div className="fld">Question pack</div>
      <div className="chips" style={{ marginBottom: 16 }}>
        {PACK_KEYS.map((k) => (
          <button
            key={k}
            className="chip"
            onClick={() => setPack(k)}
            style={pack === k ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {PACKS[k].icon} {PACKS[k].name}
          </button>
        ))}
      </div>

      {!order.length ? (
        <p className="muted">Shuffling questions…</p>
      ) : done ? (
        <div className="sheet center" style={{ padding: "30px 20px" }}>
          <div style={{ fontSize: 40 }}>🎉</div>
          <h3 style={{ margin: "8px 0 4px" }}>That's the whole {PACKS[pack].name} pack!</h3>
          <p className="muted">You got through all {questions.length} questions. Reshuffle, or try another pack.</p>
          <button className="btn btn-accent" onClick={deal}>Shuffle & play again</button>
        </div>
      ) : (
        <>
          <div className="flex-between" style={{ marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <strong>
              Question {progress || 1} of {order.length}
            </strong>
            <span className="muted" style={{ fontSize: 13 }}>
              {PACKS[pack].icon} {PACKS[pack].name}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden", marginBottom: 18 }}>
            <div
              style={{
                height: "100%",
                width: `${(progress / order.length) * 100}%`,
                background: "linear-gradient(90deg,var(--accent),var(--accent-2))",
                transition: "width .25s ease",
              }}
            />
          </div>

          <h2 style={{ fontSize: 20, margin: "0 0 14px" }}>Would you rather…</h2>
          <div className="grid-2" style={{ gap: 12 }}>
            <Card side="a" text={current[0]} />
            <Card side="b" text={current[1]} />
          </div>

          <div className="tool-controls" style={{ marginTop: 16, flexWrap: "wrap" }}>
            <button className="btn btn-accent" onClick={next} disabled={!chosen}>
              Next question →
            </button>
            <button className="btn btn-outline" onClick={next}>Skip</button>
            <CopyButton value={shareText} />
            <button className="btn btn-sm btn-outline" onClick={deal}>Reshuffle</button>
          </div>
          {!chosen ? <p className="hint">Pick a side to continue — no wrong answers.</p> : null}
        </>
      )}

      {ready && stats.answered ? (
        <p className="hint" style={{ marginTop: 18 }}>
          You've answered {stats.answered} question{stats.answered === 1 ? "" : "s"} on this device
          ({stats.a} × option A, {stats.b} × option B).{" "}
          <button
            className="btn btn-sm btn-outline"
            style={{ marginLeft: 6 }}
            onClick={() => setStats({ answered: 0, a: 0, b: 0 })}
          >
            Reset
          </button>
        </p>
      ) : null}

      <div className="notice" style={{ marginTop: 16 }}>
        <strong>Playing in a group?</strong> Put it on a big screen, read the question aloud and have everyone point
        left or right at the same time — then make anyone in the minority explain themselves.
        {" "}{Object.values(PACKS).reduce((n, p) => n + p.qs.length, 0)} questions across {PACK_KEYS.length} packs, all free.
      </div>
    </div>
  );
}
