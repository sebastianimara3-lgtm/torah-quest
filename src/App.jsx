import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Brain, CheckCircle2, ChevronRight, Crown, Flame,
  Heart, HelpCircle, RotateCcw, ScrollText, Shield, Sparkles,
  Star, Trophy, Wand2, XCircle, Zap,
} from "lucide-react";

const LS_KEY = "toraQuestLeaderboardV1";

const categories = [
  { id: "bereshit", label: "Bereshit", hebrew: "בראשית", icon: Sparkles, gradient: "from-amber-300 via-orange-400 to-rose-500", glow: "shadow-orange-400/40", ring: "border-orange-200/70", description: "Creación, Avot, Imahot y los comienzos del pueblo de Israel" },
  { id: "shemot", label: "Shemot", hebrew: "שמות", icon: Flame, gradient: "from-sky-300 via-blue-500 to-indigo-800", glow: "shadow-blue-400/40", ring: "border-sky-200/70", description: "Egipto, Moshe Rabenu, las plagas, Yam Suf y Matan Torá" },
  { id: "vayikra", label: "Vayikrá", hebrew: "ויקרא", icon: Crown, gradient: "from-violet-300 via-purple-500 to-fuchsia-800", glow: "shadow-purple-400/40", ring: "border-violet-200/70", description: "Kedushá, korbanot, Cohanim, pureza y responsabilidad espiritual" },
  { id: "bamidbar", label: "Bamidbar", hebrew: "במדבר", icon: Shield, gradient: "from-emerald-300 via-teal-500 to-cyan-800", glow: "shadow-teal-400/40", ring: "border-emerald-200/70", description: "El desierto, el campamento, desafíos y liderazgo" },
  { id: "devarim", label: "Devarim", hebrew: "דברים", icon: BookOpen, gradient: "from-yellow-200 via-amber-400 to-yellow-700", glow: "shadow-yellow-400/40", ring: "border-yellow-100/70", description: "El discurso final de Moshe, memoria, ética y elección" },
  { id: "personajes", label: "Personajes", hebrew: "דמויות", icon: Heart, gradient: "from-pink-300 via-red-500 to-orange-700", glow: "shadow-red-400/40", ring: "border-pink-200/70", description: "Avraham, Sara, Itzjak, Rivká, Yacob, Yosef, Moshe y Miriam" },
];

const questions = [
  { category: "bereshit", level: 1, question: "Según Bereshit, ¿qué creó Hashem en el primer día?", options: ["La luz", "Los peces", "El sol y la luna", "El ser humano"], answer: "La luz", hint: "Antes de los astros ya había una separación fundamental.", note: "La Torá relata primero la creación de la luz, antes de los astros." },
  { category: "bereshit", level: 1, question: "¿Cómo se llamaba el hijo de Avraham y Sara?", options: ["Yishmael", "Itzjak", "Yacob", "Yosef"], answer: "Itzjak", hint: "Su nombre se relaciona con la risa.", note: "Itzjak nace como cumplimiento de la promesa hecha a Avraham y Sara." },
  { category: "bereshit", level: 1, question: "¿Qué vendió Esav a Yacob?", options: ["Su bendición", "Su primogenitura", "Su rebaño", "Su tienda"], answer: "Su primogenitura", hint: "Era un derecho ligado al nacimiento y al liderazgo familiar.", note: "Esav entrega la primogenitura a cambio de comida." },
  { category: "bereshit", level: 2, question: "¿Cuál fue el sueño famoso de Yacob al salir de Beer Sheva?", options: ["Una escalera hacia el cielo", "Siete vacas flacas", "Una zarza ardiente", "Una nube sobre el Mishkán"], answer: "Una escalera hacia el cielo", hint: "Había malajim subiendo y bajando.", note: "Yacob ve una escalera apoyada en la tierra cuya cima llega al cielo." },
  { category: "bereshit", level: 2, question: "¿Quién fue salvado del diluvio junto con su familia?", options: ["Noaj", "Teraj", "Lavan", "Yehudá"], answer: "Noaj", hint: "Construyó una tevah.", note: "Noaj construyó la tevah y preservó a su familia y a los animales." },
  { category: "bereshit", level: 3, question: "¿Qué señal del pacto aparece después del diluvio?", options: ["El arco iris", "La Menorá", "El shofar", "La escalera"], answer: "El arco iris", hint: "Aparece en el cielo después de la lluvia.", note: "El arco iris es presentado como señal del pacto posterior al diluvio." },
  { category: "bereshit", level: 3, question: "¿Qué nombre recibió Yacob después de luchar con el ángel?", options: ["Israel", "Yehoshua", "Efraim", "Eliezer"], answer: "Israel", hint: "Ese nombre da identidad al pueblo entero.", note: "Yacob recibe el nombre Israel luego de aquel episodio decisivo." },
  { category: "shemot", level: 1, question: "¿Quién fue elegido para sacar a Israel de Egipto?", options: ["Aharon", "Yehoshua", "Moshe", "Yehudá"], answer: "Moshe", hint: "Fue criado en la casa de Paró y llamado desde la zarza.", note: "Moshe Rabenu recibe la misión en la zarza ardiente." },
  { category: "shemot", level: 1, question: "¿Quién acompañó a Moshe como portavoz ante Paró?", options: ["Aharon", "Calev", "Yosef", "Noaj"], answer: "Aharon", hint: "Era hermano de Moshe.", note: "Aharon actúa como portavoz de Moshe ante Paró." },
  { category: "shemot", level: 1, question: "¿Qué ocurrió en Yam Suf?", options: ["Se abrió el mar", "Cayó el man", "Se construyó el Mishkán", "Nació Itzjak"], answer: "Se abrió el mar", hint: "Fue el gran cruce de la salida de Egipto.", note: "El cruce de Yam Suf es uno de los momentos centrales de la salida de Egipto." },
  { category: "shemot", level: 2, question: "¿Qué marcó la sangre colocada en los dinteles antes de la salida de Egipto?", options: ["Las casas de Israel", "Los palacios de Egipto", "El campamento de Amalek", "El camino al mar"], answer: "Las casas de Israel", hint: "Era una señal colocada en las casas.", note: "La señal distinguía las casas de Israel en la noche de la última plaga." },
  { category: "shemot", level: 2, question: "¿Dónde recibió Israel la Torá?", options: ["Har Sinai", "Beer Sheva", "Chevron", "Goshen"], answer: "Har Sinai", hint: "Es el monte asociado a Matan Torá.", note: "La entrega de la Torá ocurre en Har Sinai." },
  { category: "shemot", level: 3, question: "¿Qué objeto contenía las Lujot?", options: ["El Aron", "La Menorá", "El Shulján", "El Mizbeaj"], answer: "El Aron", hint: "Era el arca ubicada en el espacio más sagrado.", note: "El Aron HaKodesh contenía las Lujot del pacto." },
  { category: "vayikra", level: 1, question: "¿Quiénes tenían una función especial en el servicio del Mishkán?", options: ["Los Cohanim", "Los comerciantes", "Los espías", "Los egipcios"], answer: "Los Cohanim", hint: "Aharon y sus descendientes pertenecen a este grupo.", note: "Los Cohanim fueron designados para el servicio sagrado." },
  { category: "vayikra", level: 1, question: "¿Qué significa la idea de kedushá en la Torá?", options: ["Santidad y separación para un propósito elevado", "Comercio", "Viaje", "Guerra"], answer: "Santidad y separación para un propósito elevado", hint: "No es solo apartarse; es orientarse a una finalidad superior.", note: "Kedushá implica elevar la vida cotidiana hacia un propósito sagrado." },
  { category: "vayikra", level: 2, question: "¿Qué día especial aparece en Vayikrá como día de expiación?", options: ["Yom Kipur", "Purim", "Janucá", "Tu Bishvat"], answer: "Yom Kipur", hint: "Es el día central de kapará y teshuvá.", note: "Yom Kipur ocupa un lugar central en el servicio descripto en Vayikrá." },
  { category: "vayikra", level: 2, question: "¿Qué animales terrestres son kasher según las señales de la Torá?", options: ["Los que rumian y tienen pezuña partida", "Todos los animales veloces", "Solo los animales blancos", "Los que viven cerca del agua"], answer: "Los que rumian y tienen pezuña partida", hint: "Son dos señales juntas.", note: "La Torá da señales específicas para animales terrestres kasher." },
  { category: "vayikra", level: 3, question: "¿Qué precepto resume la relación ética con el prójimo en Kedoshim?", options: ["Amar al prójimo como a uno mismo", "Comprar la primogenitura", "Construir una tevah", "Contar las estrellas"], answer: "Amar al prójimo como a uno mismo", hint: "Es una de las frases éticas más conocidas de la Torá.", note: "Kedoshim contiene un núcleo ético fundamental para la vida comunitaria." },
  { category: "bamidbar", level: 1, question: "¿Qué alimento cayó del cielo durante la travesía por el desierto?", options: ["Man", "Dátiles", "Trigo", "Aceitunas"], answer: "Man", hint: "Aparecía cada día, salvo Shabat.", note: "El man sostenía al pueblo durante su marcha por el desierto." },
  { category: "bamidbar", level: 1, question: "¿Qué señal guiaba al campamento durante el día?", options: ["Una nube", "Una estrella", "Un río", "Una columna de oro"], answer: "Una nube", hint: "De noche había otra manifestación visible.", note: "La nube indicaba cuándo acampar y cuándo avanzar." },
  { category: "bamidbar", level: 2, question: "¿Quiénes fueron los dos espías que dieron un informe positivo sobre la Tierra de Israel?", options: ["Yehoshua y Calev", "Moshe y Aharon", "Yacob y Esav", "Nadav y Avihú"], answer: "Yehoshua y Calev", hint: "Uno sucederá a Moshe como líder.", note: "Yehoshua bin Nun y Calev ben Yefuné mantuvieron su confianza." },
  { category: "bamidbar", level: 2, question: "¿Quién sucedió a Moshe como líder del pueblo?", options: ["Yehoshua", "Aharon", "Pinjás", "Calev"], answer: "Yehoshua", hint: "Fue uno de los espías fieles.", note: "Yehoshua bin Nun fue designado para conducir al pueblo luego de Moshe." },
  { category: "bamidbar", level: 3, question: "¿Quién se rebeló contra el liderazgo de Moshe y Aharon?", options: ["Koraj", "Betzalel", "Efrón", "Teraj"], answer: "Koraj", hint: "Su nombre identifica una parashá de Bamidbar.", note: "Koraj encabeza una rebelión contra la autoridad de Moshe y Aharon." },
  { category: "devarim", level: 1, question: "¿Quién pronuncia los discursos principales de Sefer Devarim?", options: ["Moshe", "Yosef", "Noaj", "Paró"], answer: "Moshe", hint: "Son sus palabras antes de que el pueblo entre a la Tierra de Israel.", note: "Devarim reúne el discurso final de Moshe al pueblo." },
  { category: "devarim", level: 1, question: "¿Qué texto central comienza con 'Shemá Israel'?", options: ["Shemá", "Birkat Hamazón", "Aleinu", "Avinu Malkeinu"], answer: "Shemá", hint: "Es una declaración central de emuná.", note: "El Shemá ocupa un lugar esencial en la vida judía." },
  { category: "devarim", level: 2, question: "¿Qué mitzvá se relaciona con escribir palabras de Torá en los postes de la casa?", options: ["Mezuzá", "Shofar", "Lulav", "Tzitzit"], answer: "Mezuzá", hint: "Se coloca en la puerta.", note: "La mezuzá contiene parshiot escritas por un sofer." },
  { category: "devarim", level: 2, question: "¿Qué debe hacer el pueblo con la memoria de la salida de Egipto?", options: ["Recordarla y transmitirla", "Ocultarla", "Venderla", "Olvidarla"], answer: "Recordarla y transmitirla", hint: "La memoria es una obligación educativa.", note: "La Torá insiste en recordar y transmitir la salida de Egipto." },
  { category: "devarim", level: 3, question: "En Nitzavim, ¿ante quiénes se renueva el pacto?", options: ["Ante todos, incluso generaciones futuras", "Solo ante los Cohanim", "Solo ante Paró", "Solo ante los espías"], answer: "Ante todos, incluso generaciones futuras", hint: "La parashá habla de quienes están presentes y de quienes no están allí ese día.", note: "Nitzavim presenta el pacto como compromiso de todo Israel y de las generaciones futuras." },
  { category: "personajes", level: 1, question: "¿Quién fue el padre de Avraham?", options: ["Teraj", "Noaj", "Yacob", "Lavan"], answer: "Teraj", hint: "Aparece antes de la partida hacia Canaan.", note: "Teraj fue el padre de Avram, luego llamado Avraham." },
  { category: "personajes", level: 1, question: "¿Cómo se llamaba la esposa de Yacob por la que trabajó primero siete años?", options: ["Rajel", "Leá", "Rivká", "Sara"], answer: "Rajel", hint: "Yacob la amaba profundamente.", note: "Yacob trabajó por Rajel con Lavan." },
  { category: "personajes", level: 1, question: "¿Quién interpretó los sueños de Paró en Egipto?", options: ["Yosef", "Moshe", "Aharon", "Betzalel"], answer: "Yosef", hint: "Había sido vendido por sus hermanos.", note: "Yosef interpretó los sueños de las vacas y las espigas." },
  { category: "personajes", level: 2, question: "¿Quién era la hermana de Moshe y Aharon?", options: ["Miriam", "Rajel", "Leá", "Diná"], answer: "Miriam", hint: "Cantó después del cruce de Yam Suf.", note: "Miriam tuvo un rol fundamental desde la infancia de Moshe." },
  { category: "personajes", level: 2, question: "¿Quién fue llamado 'HaTzadik' por su conducta en Egipto?", options: ["Yosef", "Esav", "Lavan", "Koraj"], answer: "Yosef", hint: "Resistió una prueba moral muy grande.", note: "Yosef es recordado como Yosef HaTzadik." },
  { category: "personajes", level: 3, question: "¿Quién fue el constructor principal del Mishkán, dotado de sabiduría artística?", options: ["Betzalel", "Yacob", "Calev", "Yishmael"], answer: "Betzalel", hint: "Su nombre se asocia a la sombra y protección de Hashem.", note: "Betzalel recibió sabiduría artística para la obra del Mishkán." },
];

const difficultyOptions = [
  { id: "talmid", label: "Talmid", subtitle: "10 preguntas", count: 10, level: 1, icon: BookOpen },
  { id: "jajam", label: "Jajam", subtitle: "18 preguntas", count: 18, level: 2, icon: Brain },
  { id: "gaon", label: "Gaón", subtitle: "Todas", count: questions.length, level: 3, icon: Crown },
];

const characterCards = [
  { name: "Moshe Rabenu", role: "Líder", emoji: "🌊", trait: "Emuná" },
  { name: "Miriam", role: "Profetisa", emoji: "🥁", trait: "Alegría" },
  { name: "Aharon HaCohen", role: "Cohen Gadol", emoji: "✨", trait: "Shalom" },
  { name: "Yosef HaTzadik", role: "Soñador", emoji: "🌾", trait: "Fidelidad" },
  { name: "Yacob Avinu", role: "Patriarca", emoji: "🪜", trait: "Verdad" },
];

const normalize = (v) => String(v || "").trim().toLowerCase();
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const getCategory = (id) => categories.find((c) => c.id === id) || categories[0];

function loadScores() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
function saveScore(entry) {
  const next = [...loadScores(), entry]
    .sort((a, b) => b.score - a.score || b.percent - a.percent)
    .slice(0, 5);
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

function CategoryBadge({ category }) {
  const Icon = category.icon;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${category.gradient} px-3 py-1.5 text-xs font-black text-white shadow-xl`}>
      <Icon className="h-3 w-3" />
      {category.label} <span className="opacity-80">{category.hebrew}</span>
    </div>
  );
}

function ProgressRing({ score, answered }) {
  const pct = answered ? Math.round((score / answered) * 100) : 0;
  return (
    <div className="relative grid h-16 w-16 place-items-center rounded-full bg-white/10">
      <div className="absolute inset-1 rounded-full" style={{ background: `conic-gradient(rgba(255,255,255,.9) ${pct * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} />
      <div className="absolute inset-3 rounded-full bg-slate-950/95" />
      <div className="relative text-center">
        <div className="text-sm font-black text-white">{pct}%</div>
      </div>
    </div>
  );
}

function FancyButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-2xl px-4 py-3 font-black shadow-xl transition ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function StatBox({ label, value, tone = "text-amber-200" }) {
  return (
    <div className="rounded-2xl bg-white/10 p-2 text-center shadow-inner">
      <p className="text-[10px] uppercase tracking-widest text-white/50">{label}</p>
      <p className={`text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

/* ── MENU ── */
function MenuScreen({ startGame, leaderboard }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("jajam");
  const selected = difficultyOptions.find((d) => d.id === selectedDifficulty) || difficultyOptions[1];

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
            <ScrollText className="h-3 w-3" /> Trivia de Torá
          </div>
          <h2 className="text-3xl font-black leading-tight">
            Girá la ruleta, respondé y ganá coronas de sabiduría.
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Preguntas por sefarim y personajes con ruleta, comodines y ranking local.
          </p>
          {/* Difficulty */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {difficultyOptions.map((d) => {
              const Icon = d.icon;
              const active = d.id === selectedDifficulty;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`rounded-2xl border p-3 text-left transition ${active ? "border-amber-200 bg-amber-300/20" : "border-white/15 bg-white/10"}`}
                >
                  <Icon className="mb-1 h-5 w-5 text-amber-200" />
                  <p className="text-sm font-black">{d.label}</p>
                  <p className="text-[10px] text-white/60">{d.subtitle}</p>
                </button>
              );
            })}
          </div>
          <FancyButton
            onClick={() => startGame(selected)}
            className="mt-4 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Empezar partida <ChevronRight className="h-4 w-4" />
            </span>
          </FancyButton>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-200" />
          <h3 className="font-black">Ranking local</h3>
        </div>
        {leaderboard.length ? (
          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-950/40 px-3 py-2">
                <div>
                  <p className="text-sm font-black">#{idx + 1} · {item.title}</p>
                  <p className="text-[10px] text-white/55">{item.difficulty} · racha {item.bestStreak}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-amber-200">{item.score}</p>
                  <p className="text-[10px] text-white/55">{item.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-950/40 p-3 text-sm text-white/60">
            Todavía no hay partidas. ¡La primera corona te espera!
          </p>
        )}
      </section>

      {/* Characters */}
      <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-200" />
          <h3 className="font-black">Personajes</h3>
        </div>
        <div className="space-y-2">
          {characterCards.map((c, idx) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-2xl">{c.emoji}</div>
              <div>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-[10px] text-white/60">{c.role} · {c.trait}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── GAME ── */
function GameScreen({ deck, meta, finishGame, restart }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const current = deck[index];
  const category = getCategory(current.category);
  const Icon = category.icon;
  const progress = Math.round(((index + (answered ? 1 : 0)) / deck.length) * 100);

  const answer = (option) => {
    if (answered) return;
    const correct = normalize(option) === normalize(current.answer);
    setSelected(option);
    setAnswered(true);
    setHistory((prev) => [...prev, { category: current.category, correct }]);
    if (correct) {
      setScore((p) => p + 1);
      setStreak((p) => { const n = p + 1; setBestStreak((o) => Math.max(o, n)); return n; });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      finishGame({ score, total: deck.length, percent: Math.round((score / deck.length) * 100), bestStreak, history, difficulty: meta.label });
      return;
    }
    setSpinning(true);
    setTimeout(() => {
      setIndex((p) => p + 1);
      setSelected(null); setAnswered(false); setHintVisible(false); setHiddenOptions([]);
      setSpinning(false);
    }, 450);
  };

  const useHint = () => { if (hintUsed || answered) return; setHintUsed(true); setHintVisible(true); };
  const useFifty = () => {
    if (fiftyUsed || answered) return;
    const wrong = current.options.filter((o) => normalize(o) !== normalize(current.answer));
    setHiddenOptions(shuffle(wrong).slice(0, 2));
    setFiftyUsed(true);
  };
  const useSkip = () => {
    if (skipUsed || answered) return;
    setSkipUsed(true);
    if (index + 1 >= deck.length) {
      finishGame({ score, total: deck.length, percent: Math.round((score / deck.length) * 100), bestStreak, history, difficulty: meta.label });
    } else {
      setSpinning(true);
      setTimeout(() => { setIndex((p) => p + 1); setHintVisible(false); setHiddenOptions([]); setSpinning(false); }, 380);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between rounded-3xl border border-white/15 bg-white/10 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <ProgressRing score={score} answered={history.length || 1} />
          <div>
            <CategoryBadge category={category} />
            <p className="mt-1 text-[10px] text-white/55">{index + 1}/{deck.length} · {progress}%</p>
          </div>
        </div>
        <motion.div
          animate={spinning ? { rotate: 360, scale: [1, 1.1, 1] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${category.gradient} shadow-xl`}
        >
          <Icon className="h-7 w-7" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-400" animate={{ width: `${progress}%` }} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Puntos" value={score} />
        <StatBox label="Racha" value={streak} tone="text-cyan-200" />
        <StatBox label="Mejor" value={bestStreak} tone="text-fuchsia-200" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/60 p-4 shadow-2xl"
        >
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">{category.description}</p>
          <h2 className="text-xl font-black leading-snug">{current.question}</h2>

          <AnimatePresence>
            {hintVisible && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-2xl border border-amber-200/30 bg-amber-300/15 p-3 text-sm text-amber-50">
                <span className="font-black">Pista:</span> {current.hint}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {current.options.map((option, i) => {
              const isHidden = hiddenOptions.includes(option);
              const isCorrect = normalize(option) === normalize(current.answer);
              const isSelected = normalize(option) === normalize(selected);
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;
              return (
                <motion.button
                  key={option}
                  whileTap={!answered && !isHidden ? { scale: 0.97 } : undefined}
                  onClick={() => !isHidden && answer(option)}
                  disabled={isHidden}
                  className={[
                    "relative min-h-[72px] overflow-hidden rounded-2xl border p-3 text-left text-sm font-bold shadow-lg transition-all",
                    isHidden ? "border-white/5 bg-white/5 opacity-20 cursor-default" : "",
                    showCorrect ? "border-emerald-300 bg-emerald-500/25" : "",
                    showWrong ? "border-rose-300 bg-rose-500/25" : "",
                    !showCorrect && !showWrong && !isHidden ? "border-white/15 bg-white/10 active:bg-white/20" : "",
                  ].join(" ")}
                >
                  <span className="text-[10px] font-black text-white/40 block mb-1">{String.fromCharCode(65 + i)}</span>
                  {option}
                  {showCorrect && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-emerald-300" />}
                  {showWrong && <XCircle className="absolute right-2 top-2 h-4 w-4 text-rose-300" />}
                </motion.button>
              );
            })}
          </div>

          {/* Power-ups */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Pista", icon: HelpCircle, action: useHint, used: hintUsed },
              { label: "50/50", icon: Wand2, action: useFifty, used: fiftyUsed },
              { label: "Pasar", icon: ChevronRight, action: useSkip, used: skipUsed },
            ].map(({ label, icon: BtnIcon, action, used }) => (
              <button
                key={label}
                onClick={action}
                disabled={used || answered}
                className={`flex items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 py-2 text-xs font-black transition ${used || answered ? "opacity-30 cursor-default" : "active:bg-white/20"}`}
              >
                <BtnIcon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>

          {/* Answer feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className={`text-base font-black ${normalize(selected) === normalize(current.answer) ? "text-emerald-300" : "text-rose-300"}`}>
                  {normalize(selected) === normalize(current.answer) ? "¡Correcto! 🎉" : "No era esa."}
                </p>
                <p className="mt-1 text-xs text-white/70">
                  <span className="font-bold text-white">{current.answer}.</span> {current.note}
                </p>
                <FancyButton onClick={next} className="mt-3 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 text-sm">
                  {index + 1 >= deck.length ? "Ver resultado" : "Siguiente →"}
                </FancyButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <FancyButton onClick={restart} className="w-full bg-white/10 text-white text-sm">
        <span className="inline-flex items-center justify-center gap-2"><RotateCcw className="h-3 w-3" /> Volver al menú</span>
      </FancyButton>
    </div>
  );
}

/* ── RESULT ── */
function ResultScreen({ result, leaderboard, restart, goMenu }) {
  const title = result.percent >= 90 ? "Gaón de Torá 👑" : result.percent >= 75 ? "Jajam destacado 🌟" : result.percent >= 55 ? "Buen talmid 📖" : "Explorador valiente 🗺️";
  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#facc15_0,transparent_50%)] opacity-15" />
        <motion.div initial={{ scale: 0.5, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 shadow-2xl shadow-amber-400/30">
          <Trophy className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="relative mt-4 text-2xl font-black">{title}</h2>
        <p className="relative mt-2 text-sm text-white/70">
          <span className="font-black text-amber-200">{result.score}</span> correctas de {result.total} · racha {result.bestStreak}
        </p>
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <StatBox label="Correctas" value={result.score} />
          <StatBox label="Acierto" value={`${result.percent}%`} tone="text-cyan-200" />
          <StatBox label="Racha" value={result.bestStreak} tone="text-fuchsia-200" />
        </div>
        <div className="relative mt-4 flex gap-3">
          <FancyButton onClick={restart} className="flex-1 bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 text-sm">Jugar otra vez</FancyButton>
          <FancyButton onClick={goMenu} className="flex-1 bg-white/10 text-white text-sm">Al menú</FancyButton>
        </div>
      </section>

      {leaderboard.length > 0 && (
        <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-200" />
            <h3 className="font-black">Ranking actualizado</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2">
                <span className="text-sm font-bold">#{idx + 1} · {item.title} · {item.difficulty}</span>
                <span className="font-black text-amber-200">{item.score} / {item.percent}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── ROOT ── */
export default function TorahQuestGame() {
  const [screen, setScreen] = useState("menu");
  const [deck, setDeck] = useState([]);
  const [meta, setMeta] = useState(difficultyOptions[1]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => setLeaderboard(loadScores()), []);

  const startGame = (difficulty) => {
    const pool = questions.filter((q) => q.level <= difficulty.level);
    setDeck(shuffle(pool).slice(0, difficulty.count));
    setMeta(difficulty);
    setResult(null);
    setScreen("game");
  };

  const finishGame = (finalResult) => {
    const title = finalResult.percent >= 90 ? "Gaón" : finalResult.percent >= 75 ? "Jajam" : finalResult.percent >= 55 ? "Talmid" : "Aprendiz";
    const updated = saveScore({ ...finalResult, title, date: new Date().toISOString() });
    setLeaderboard(updated);
    setResult(finalResult);
    setScreen("result");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#111827_34%,#020617_72%)] text-white" style={{ fontFamily: "'Rubik', sans-serif" }}>
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute left-4 top-8 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-lg px-4 py-4 pb-8">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-600 shadow-xl"
            >
              <ScrollText className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Torá Quest</h1>
              <p className="text-[10px] text-white/60">{questions.length} preguntas · {categories.length} categorías</p>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
            {leaderboard.length > 0 ? `🏆 ${leaderboard.length}` : "Nuevo"}
          </span>
        </header>

        <AnimatePresence mode="wait">
          {screen === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <MenuScreen startGame={startGame} leaderboard={leaderboard} />
            </motion.div>
          )}
          {screen === "game" && (
            <motion.div key="game" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <GameScreen deck={deck} meta={meta} finishGame={finishGame} restart={() => setScreen("menu")} />
            </motion.div>
          )}
          {screen === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <ResultScreen result={result} leaderboard={leaderboard} restart={() => startGame(meta)} goMenu={() => setScreen("menu")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
