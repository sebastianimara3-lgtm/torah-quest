import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, CheckCircle2, Crown, Flame, HelpCircle, RotateCcw, ScrollText, Shield, Sparkles, Star, Trophy, XCircle, User, ChevronRight, Zap, Award, AlertCircle, X as XIcon, ExternalLink } from "lucide-react";
import { cargarBanner } from "./firebase";
import { bereshitQuestions } from "./questions/bereshit";
import { shemotQuestions } from "./questions/shemot";
import { vayikraQuestions } from "./questions/vayikra";
import { bamidbarQuestions } from "./questions/bamidbar";
import { devarimQuestions } from "./questions/devarim";

const LS_KEY = "toraQuestLeaderboardV3";

const BOOK_META = {
  bereshit: { label: "Bereshit", hebrew: "בראשית", color: "#f59e0b" },
  shemot:   { label: "Shemot",   hebrew: "שמות",   color: "#3b82f6" },
  vayikra:  { label: "Vayikrá",  hebrew: "ויקרא",  color: "#a855f7" },
  bamidbar: { label: "Bamidbar", hebrew: "במדבר",  color: "#10b981" },
  devarim:  { label: "Devarim",  hebrew: "דברים",  color: "#f97316" },
};

const LEVELS = [
  { id: "talmid",  label: "Talmid",  hebrew: "תלמיד",  qty: 10, maxLevel: 1, icon: "📖", desc: "10 preguntas · Solo nivel Básico" },
  { id: "jajam",   label: "Jajam",   hebrew: "חכם",    qty: 20, maxLevel: 2, icon: "🕯️", desc: "20 preguntas · Básico y Medio" },
  { id: "gaon",    label: "Gaón",    hebrew: "גאון",   qty: 30, maxLevel: 3, icon: "✡️", desc: "30 preguntas · Todos los niveles" },
];

const ALL_QUESTIONS = [
  ...bereshitQuestions,
  ...shemotQuestions,
  ...vayikraQuestions,
  ...bamidbarQuestions,
  ...devarimQuestions,
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(qty, maxLevel) {
  const pool = ALL_QUESTIONS.filter(q => q.level <= maxLevel);
  return shuffle(pool).slice(0, qty).map(q => ({ ...q, options: shuffle(q.options) }));
}

function getTitle(pct) {
  if (pct >= 90) return { title: "גאון התורה", label: "Gaón de la Torá", color: "#fbbf24", icon: "🏆" };
  if (pct >= 75) return { title: "חכם מצוין",  label: "Jajam destacado", color: "#a78bfa", icon: "⭐" };
  if (pct >= 55) return { title: "תלמיד טוב",  label: "Buen Talmid",     color: "#34d399", icon: "📖" };
  return          { title: "חלוץ אמיץ",   label: "Explorador valiente", color: "#94a3b8", icon: "🛡️" };
}

const lvBadge = {
  1: { label: "Básico",  bg: "#1e3a8a22", border: "#3b82f688", color: "#93c5fd" },
  2: { label: "Medio",   bg: "#4c1d9522", border: "#7c3aed88", color: "#c4b5fd" },
  3: { label: "Difícil", bg: "#7f1d1d22", border: "#ef444488", color: "#fca5a5" },
};

// ── MENU ────────────────────────────────────────────────────────
function MenuScreen({ onStart }) {
  const [name, setName] = useState("");
  const [chosen, setChosen] = useState(null);
  const [err, setErr] = useState(false);

  function go() {
    if (!name.trim()) { setErr(true); return; }
    if (!chosen) return;
    onStart(name.trim(), chosen);
  }

  const entries = JSON.parse(localStorage.getItem(LS_KEY) || "[]").slice(0, 5);

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Header */}
      <motion.div className="text-center mb-8"
        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,.5)" }}>
          <ScrollText className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-1">תורה Quest</h1>
        <p className="text-base" style={{ color: "#a78bfa" }}>Respondé · Aprendé · Ganá coronas de sabiduría</p>
      </motion.div>

      {/* Name */}
      <motion.div className="w-full max-w-sm mb-5"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: "#a78bfa" }}>
          Tu nombre
        </label>
        <input type="text" maxLength={20} placeholder="¿Cómo te llamás?"
          value={name}
          onChange={e => { setName(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && go()}
          className="w-full px-4 py-3 rounded-xl text-white text-base font-medium outline-none"
          style={{
            background: err ? "rgba(239,68,68,.12)" : "rgba(255,255,255,.08)",
            border: `1.5px solid ${err ? "#ef4444" : "rgba(167,139,250,.3)"}`,
          }} />
        {err && <p className="text-red-400 text-xs mt-1">⚠ Ingresá tu nombre para continuar</p>}
      </motion.div>

      {/* Levels */}
      <motion.div className="w-full max-w-sm mb-6"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#a78bfa" }}>Nivel de dificultad</p>
        <div className="flex flex-col gap-2.5">
          {LEVELS.map(lv => {
            const sel = chosen?.id === lv.id;
            return (
              <button key={lv.id} onClick={() => setChosen(lv)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: sel ? "rgba(124,58,237,.25)" : "rgba(255,255,255,.06)",
                  border: `1.5px solid ${sel ? "#7c3aed" : "rgba(255,255,255,.1)"}`,
                  transform: sel ? "scale(1.01)" : "scale(1)",
                  boxShadow: sel ? "0 0 16px rgba(124,58,237,.25)" : "none",
                }}>
                <span className="text-2xl">{lv.icon}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-white">{lv.label}</span>
                    <span className="text-xs" style={{ color: "#a78bfa" }}>{lv.hebrew}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#64748b" }}>{lv.desc}</p>
                </div>
                {sel && <CheckCircle2 className="w-5 h-5 text-violet-400" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Start */}
      <motion.button onClick={go} disabled={!chosen}
        className="w-full max-w-sm py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2"
        style={{
          background: chosen ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(255,255,255,.08)",
          opacity: chosen ? 1 : 0.5,
          boxShadow: chosen ? "0 4px 24px rgba(124,58,237,.4)" : "none",
        }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Zap className="w-5 h-5" /> ¡Empezar!
      </motion.button>

      {/* Books */}
      <motion.div className="mt-6 flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {Object.entries(BOOK_META).map(([k, m]) => (
          <span key={k} className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}44` }}>
            {m.hebrew} {m.label}
          </span>
        ))}
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: "#64748b", border: "1px solid rgba(255,255,255,.1)" }}>
          {ALL_QUESTIONS.length} preguntas
        </span>
      </motion.div>

      {/* Leaderboard preview */}
      {entries.length > 0 && (
        <motion.div className="mt-6 w-full max-w-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2 text-center" style={{ color: "#a78bfa" }}>
            🏆 Mejores puntajes
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
            {entries.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 border-b last:border-b-0"
                style={{ borderColor: "rgba(255,255,255,.06)" }}>
                <span className="text-sm w-5" style={{ color: ["#fbbf24","#94a3b8","#b45309"][i] || "#6b7280" }}>{i + 1}</span>
                <span className="flex-1 text-sm text-white font-medium truncate">{e.name || "Anónimo"}</span>
                <span className="text-xs mr-1" style={{ color: "#64748b" }}>{e.mode}</span>
                <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>{e.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── GAME ────────────────────────────────────────────────────────
// ── BANNER HOOK ──────────────────────────────────────────────────
function useBanner() {
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    cargarBanner().then(data => {
      if (data && data.activo) setBanner(data);
    });
  }, []);
  return banner;
}

// ── BANNER COMPONENT ─────────────────────────────────────────────
function BannerPublicitario({ banner }) {
  const [visible, setVisible] = useState(true);
  if (!banner || !visible) return null;
  const tieneImagen = banner.imagenUrl && banner.imagenUrl.trim() !== "";
  function handleClick() {
    if (banner.link) window.open(banner.link, "_blank");
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl overflow-hidden relative"
      style={{
        background: banner.colorFondo || "#1e1b4b",
        border: "1px solid rgba(255,255,255,.15)",
        cursor: banner.link ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <button
        onClick={e => { e.stopPropagation(); setVisible(false); }}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
        style={{ background: "rgba(0,0,0,.4)" }}
      >
        <XIcon className="w-3 h-3 text-white" />
      </button>
      <span className="absolute top-1.5 left-2" style={{ color: "rgba(255,255,255,.4)", fontSize: "9px" }}>
        Publicidad
      </span>
      {tieneImagen ? (
        <div className="flex items-center gap-3 px-3 pt-5 pb-3">
          <img src={banner.imagenUrl} alt="banner"
            className="h-12 w-12 object-contain rounded-lg flex-shrink-0"
            onError={e => e.target.style.display = "none"} />
          <div className="flex-1 min-w-0">
            {banner.texto && (
              <p className="text-sm font-semibold leading-tight"
                style={{ color: banner.colorTexto || "#ffffff" }}>{banner.texto}</p>
            )}
            {banner.link && (
              <p className="text-xs mt-0.5 flex items-center gap-1"
                style={{ color: "rgba(255,255,255,.5)" }}>
                <ExternalLink className="w-3 h-3" /> Ver más
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 pt-5 pb-3">
          <p className="flex-1 text-sm font-semibold text-center leading-tight"
            style={{ color: banner.colorTexto || "#ffffff" }}>{banner.texto}</p>
          {banner.link && <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.5)" }} />}
        </div>
      )}
    </motion.div>
  );
}


function GameScreen({ player, mode, onFinish }) {
  const [questions] = useState(() => pickQuestions(mode.qty, mode.maxLevel));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [eliminated, setEliminated] = useState([]);
  const [hints, setHints] = useState(1);
  const [halves, setHalves] = useState(1);
  const [skips, setSkips] = useState(1);
  const [streak, setStreak] = useState(0);
  const banner = useBanner();

  const q = questions[idx];
  const answered = selected !== null;
  const progress = (idx / questions.length) * 100;
  const bm = BOOK_META[q.category] || BOOK_META.bereshit;
  const lb = lvBadge[q.level];

  function select(opt) {
    if (answered || eliminated.includes(opt)) return;
    setSelected(opt);
    if (opt === q.answer) { setScore(s => s + 1); setStreak(s => s + 1); }
    else setStreak(0);
  }

  function next() {
    const newScore = score; // already updated
    if (idx + 1 >= questions.length) { onFinish(newScore, questions.length); return; }
    setIdx(i => i + 1);
    setSelected(null); setShowHint(false); setShowNote(false); setEliminated([]);
  }

  function useHint() {
    if (hints <= 0 || answered) return;
    setHints(h => h - 1); setShowHint(true);
  }
  function useHalf() {
    if (halves <= 0 || answered) return;
    setHalves(h => h - 1);
    const wrong = q.options.filter(o => o !== q.answer);
    setEliminated(shuffle(wrong).slice(0, 2));
  }
  function useSkip() {
    if (skips <= 0 || answered) return;
    setSkips(s => s - 1);
    if (idx + 1 >= questions.length) { onFinish(score, questions.length); return; }
    setIdx(i => i + 1);
    setSelected(null); setShowHint(false); setShowNote(false); setEliminated([]);
  }

  return (
    <motion.div className="min-h-screen flex flex-col px-4 pt-4 pb-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(124,58,237,.3)", color: "#c4b5fd" }}>
            {player.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-white">{player}</span>
          {streak >= 3 && <span className="text-orange-400 text-sm font-bold">🔥{streak}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-sm font-bold flex items-center gap-1">
            <Crown className="w-4 h-4" />{score}
          </span>
          <span className="text-xs" style={{ color: "#64748b" }}>{idx + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 rounded-full mb-4" style={{ background: "rgba(255,255,255,.1)" }}>
        <motion.div className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#7c3aed,#818cf8)" }}
          animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${bm.color}18`, color: bm.color, border: `1px solid ${bm.color}44` }}>
              {bm.hebrew} {bm.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: lb.bg, color: lb.color, border: `1px solid ${lb.border}` }}>
              {lb.label}
            </span>
          </div>

          {/* Question */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)" }}>
            <p className="text-white text-base font-semibold leading-snug">{q.question}</p>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl px-4 py-2.5 mb-3 text-sm"
                style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.3)", color: "#fbbf24" }}>
                💡 {q.hint}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-4">
            {q.options.map(opt => {
              const elim = eliminated.includes(opt);
              const correct = opt === q.answer;
              const chosen = opt === selected;
              let bg = "rgba(255,255,255,.06)"; let border = "rgba(255,255,255,.12)"; let color = "#e2e8f0";
              if (elim) { bg = "transparent"; border = "rgba(255,255,255,.04)"; color = "#374151"; }
              else if (answered) {
                if (correct) { bg = "rgba(16,185,129,.15)"; border = "#10b981"; color = "#6ee7b7"; }
                else if (chosen) { bg = "rgba(239,68,68,.15)"; border = "#ef4444"; color = "#fca5a5"; }
              }
              return (
                <button key={opt} onClick={() => select(opt)}
                  disabled={answered || elim}
                  className="w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium flex items-center gap-3"
                  style={{ background: bg, border: `1.5px solid ${border}`, color, opacity: elim ? 0.3 : 1,
                    cursor: answered || elim ? "default" : "pointer" }}>
                  {answered && correct && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
                  {answered && chosen && !correct && <XCircle className="w-4 h-4 flex-shrink-0 text-red-400" />}
                  {!answered && !elim && <span className="w-4 h-4 flex-shrink-0" />}
                  {elim && <span className="w-4 h-4 flex-shrink-0" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Note */}
          {answered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              <button onClick={() => setShowNote(n => !n)}
                className="text-xs font-semibold flex items-center gap-1 mb-2"
                style={{ color: "#a78bfa" }}>
                <BookOpen className="w-3.5 h-3.5" /> {showNote ? "Ocultar fuente" : "Ver fuente"}
              </button>
              <AnimatePresence>
                {showNote && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs rounded-xl px-4 py-3"
                    style={{ background: "rgba(139,92,246,.1)", border: "1px solid rgba(139,92,246,.3)", color: "#c4b5fd" }}>
                    {q.note}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Jokers */}
          {!answered && (
            <div className="flex gap-2 mb-4">
              {[
                { label: "Pista", count: hints, fn: useHint, color: "#fbbf24", bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.35)", icon: <HelpCircle className="w-3.5 h-3.5" /> },
                { label: "50/50", count: halves, fn: useHalf, color: "#818cf8", bg: "rgba(99,102,241,.12)", border: "rgba(99,102,241,.35)", icon: <Brain className="w-3.5 h-3.5" /> },
                { label: "Pasar", count: skips, fn: useSkip, color: "#34d399", bg: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.35)", icon: <ChevronRight className="w-3.5 h-3.5" /> },
              ].map(j => (
                <button key={j.label} onClick={j.fn} disabled={j.count <= 0}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  style={{
                    background: j.count > 0 ? j.bg : "rgba(255,255,255,.04)",
                    border: `1px solid ${j.count > 0 ? j.border : "rgba(255,255,255,.06)"}`,
                    color: j.count > 0 ? j.color : "#374151",
                    opacity: j.count > 0 ? 1 : 0.4,
                  }}>
                  {j.icon} {j.label} ({j.count})
                </button>
              ))}
            </div>
          )}

          {/* Next */}
          {answered && (
            <motion.button onClick={next}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 20px rgba(124,58,237,.35)" }}
              whileTap={{ scale: 0.97 }}>
              {idx + 1 >= questions.length ? "Ver resultados" : "Siguiente"} <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Banner publicitario fijo abajo */}
      <div className="mt-3">
        <BannerPublicitario banner={banner} />
      </div>
    </motion.div>
  );
}

// ── RESULTS ─────────────────────────────────────────────────────
function ResultsScreen({ player, score, total, mode, onRestart, onMenu }) {
  const pct = Math.round((score / total) * 100);
  const { title, label, color, icon } = getTitle(pct);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    entries.push({ name: player, score, total, pct, mode: mode.label, date: Date.now() });
    entries.sort((a, b) => b.pct - a.pct || b.score - a.score);
    localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(0, 20)));
  }, []);

  const entries = JSON.parse(localStorage.getItem(LS_KEY) || "[]").slice(0, 8);
  const medals = ["🥇","🥈","🥉"];

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>

      {/* Icon */}
      <motion.div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl mb-5"
        style={{ background: `${color}18`, border: `2px solid ${color}44` }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 140, delay: 0.15 }}>
        {icon}
      </motion.div>

      <motion.div className="text-center mb-5"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="text-3xl font-black mb-0.5" style={{ color, direction: "rtl" }}>{title}</p>
        <p className="text-lg font-semibold text-white">{label}</p>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
          ¡Bien hecho, <span className="font-bold text-white">{player}</span>!
        </p>
      </motion.div>

      {/* Score */}
      <motion.div className="w-full max-w-sm rounded-2xl p-5 mb-5"
        style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex justify-around text-center">
          <div><p className="text-4xl font-black text-white">{score}</p><p className="text-xs mt-1" style={{ color: "#64748b" }}>Correctas</p></div>
          <div className="w-px" style={{ background: "rgba(255,255,255,.1)" }} />
          <div><p className="text-4xl font-black" style={{ color }}>{pct}%</p><p className="text-xs mt-1" style={{ color: "#64748b" }}>Acierto</p></div>
          <div className="w-px" style={{ background: "rgba(255,255,255,.1)" }} />
          <div><p className="text-4xl font-black text-white">{total}</p><p className="text-xs mt-1" style={{ color: "#64748b" }}>Total</p></div>
        </div>
        <p className="text-center text-xs mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,.08)", color: "#64748b" }}>
          Modo: <span className="text-white font-bold">{mode.label} {mode.hebrew}</span>
        </p>
      </motion.div>

      {/* Leaderboard */}
      {entries.length > 0 && (
        <motion.div className="w-full max-w-sm mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2 text-center" style={{ color: "#a78bfa" }}>🏆 Ranking</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
            {entries.map((e, i) => {
              const isMe = e.name === player && e.score === score && e.pct === pct;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0"
                  style={{ borderColor: "rgba(255,255,255,.06)", background: isMe ? "rgba(124,58,237,.15)" : "transparent" }}>
                  <span className="text-sm w-6">{medals[i] || `${i + 1}`}</span>
                  <span className="flex-1 text-sm font-medium truncate" style={{ color: isMe ? "#c4b5fd" : "#e2e8f0" }}>
                    {e.name || "Anónimo"}{isMe ? " 👈" : ""}
                  </span>
                  <span className="text-xs mr-1" style={{ color: "#64748b" }}>{e.mode}</span>
                  <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>{e.pct}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <motion.div className="flex gap-3 w-full max-w-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <button onClick={onRestart}
          className="flex-1 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-sm"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 16px rgba(124,58,237,.3)" }}>
          <RotateCcw className="w-4 h-4" /> Jugar de nuevo
        </button>
        <button onClick={onMenu}
          className="flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
          style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "#e2e8f0" }}>
          <ScrollText className="w-4 h-4" /> Menú
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("menu");
  const [player, setPlayer] = useState("");
  const [mode, setMode] = useState(null);
  const [result, setResult] = useState({ score: 0, total: 0 });

  function handleStart(name, lv) { setPlayer(name); setMode(lv); setScreen("game"); }
  function handleFinish(score, total) { setResult({ score, total }); setScreen("results"); }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left,#4c1d95 0%,#111827 45%,#020617 100%)",
      fontFamily: "'Rubik','Segoe UI',sans-serif",
    }}>
      <AnimatePresence mode="wait">
        {screen === "menu" && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MenuScreen onStart={handleStart} />
          </motion.div>
        )}
        {screen === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameScreen player={player} mode={mode} onFinish={handleFinish} />
          </motion.div>
        )}
        {screen === "results" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultsScreen
              player={player} score={result.score} total={result.total} mode={mode}
              onRestart={() => setScreen("game")}
              onMenu={() => setScreen("menu")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
