/* Simulasi TOEFL iBT: kode aplikasi (React + JSX, dikompilasi Babel di browser).
   Bank soal ada di js/data-*.js dan dimuat lebih dulu oleh index.html. */

/* ============================================================
   INTI: helper, skor, TTS, timer, perekam
   ============================================================ */
const { useState, useEffect, useRef, useReducer, useMemo, useCallback } = React;
const BANK = window.TOEFL_BANK;

/* ---------- Icon (Lucide UMD) ---------- */
function Icon({ name, size = 18, className = "", stroke = 2 }) {
  const node = window.lucide && window.lucide.icons && window.lucide.icons[name];
  if (!node) return <span className={className} style={{ display: "inline-block", width: size, height: size }} />;
  const kids = node[0] === "svg" ? node[2] : node;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 " + className} aria-hidden="true">
      {kids.map(([tag, attrs], i) => React.createElement(tag, { ...attrs, key: i }))}
    </svg>
  );
}

/* ---------- Storage (try/catch: may be unavailable) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
const HISTORY_KEY = "toefl-ibt-history-v1";
const THEME_KEY = "toefl-ibt-theme";
const IN_FRAME = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

/* ---------- Meta ---------- */
const SECTION_META = {
  reading: { label: "Reading", icon: "BookOpen" },
  listening: { label: "Listening", icon: "Headphones" },
  speaking: { label: "Speaking", icon: "Mic" },
  writing: { label: "Writing", icon: "PenLine" }
};
const SECTIONS = ["reading", "listening", "speaking", "writing"];
const LETTERS = ["A", "B", "C", "D"];
const TYPE_LABEL = {
  factual: "Factual Information", negative: "Negative Factual", inference: "Inference", vocab: "Vocabulary in Context",
  rhetorical: "Rhetorical Purpose", gist: "Gist / Main Idea", detail: "Detail", function: "Function of What Is Said",
  attitude: "Speaker’s Attitude", organization: "Organization"
};
const TYPE_TIPS = {
  factual: "Cari kata kunci soal di paragraf yang ditunjuk, lalu cocokkan dengan parafrase di opsi. Jawaban benar jarang memakai kata yang sama persis dengan teks.",
  negative: "Untuk soal EXCEPT/NOT, coret tiga opsi yang memang disebut teks. Opsi yang tersisa (sering bertentangan dengan teks) adalah jawabannya.",
  inference: "Jawaban inference harus 100% didukung teks walau tidak tertulis langsung. Hindari opsi dengan kata ekstrem (always, never) atau informasi baru.",
  vocab: "Tebak makna dari konteks kalimat sebelum melihat opsi, lalu uji setiap opsi dengan menggantinya ke dalam kalimat. Waspadai opsi yang ‘benar secara fakta’ tetapi bukan sinonim.",
  rhetorical: "Tanyakan MENGAPA penulis menyebut info ini: memberi contoh, membandingkan, membantah, atau menjelaskan? Perhatikan kalimat sebelum dan sesudahnya.",
  gist: "Saat mendengar, catat tujuan di 30 detik pertama (masalah, permintaan, topik kuliah). Jawaban gist mencakup keseluruhan percakapan, bukan satu contoh.",
  detail: "Catat angka, alasan, dan contoh yang ditekankan pembicara (diulang, diberi penekanan, atau dikoreksi). Abaikan detail kecil yang hanya disebut sekali sambil lalu.",
  function: "Fokus pada maksud di balik kalimat (menenangkan, mengkritik, mengubah topik), bukan arti harfiah. Dengarkan nada dan respons lawan bicara.",
  attitude: "Perhatikan kata sikap (surprisingly, I’m not convinced, that’s exactly) dan intonasi. Bedakan sikap pembicara dengan pendapat orang yang ia kutip.",
  organization: "Catat penanda struktur: first, another example, but the long term, in contrast. Soal organisasi menanyakan pola, bukan isi."
};
const SPEAK_RUBRIC = [
  { key: "delivery", label: "Delivery", hint: "Lancar, pelafalan jelas, jeda wajar, intonasi alami" },
  { key: "language", label: "Language Use", hint: "Tata bahasa & kosakata tepat, struktur kalimat bervariasi" },
  { key: "topic", label: "Topic Development", hint: "Ide lengkap, runtut, contoh/detail relevan, tidak terpotong waktu" }
];
const WRITE_RUBRIC = {
  discussion: [
    "Posisi/opini dinyatakan jelas di awal",
    "Menyumbang ide baru, bukan sekadar mengulang pendapat mahasiswa lain",
    "Alasan didukung contoh atau penjelasan spesifik",
    "Menanggapi minimal satu argumen mahasiswa lain secara langsung",
    "Kalimat bervariasi, kosakata tepat, kesalahan tata bahasa minim",
    "Panjang minimal 100 kata dan selesai dalam 10 menit"
  ],
  integrated: [
    "Ketiga poin ceramah dirangkum dengan akurat",
    "Setiap poin ceramah dikaitkan dengan poin bacaan yang dibantah",
    "Struktur jelas: pembuka + 3 paragraf isi",
    "Tidak memasukkan opini pribadi",
    "Memakai parafrase, tidak menyalin kalimat bacaan",
    "Tata bahasa jelas dan panjang 150–225 kata"
  ]
};

/* ---------- Helpers ---------- */
const fmtTime = (s) => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60); return m + ":" + String(s % 60).padStart(2, "0"); };
const countWords = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const cx = (...a) => a.filter(Boolean).join(" ");
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtDate = (iso) => { try { return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return iso; } };
const byId = (list, id) => list.find((x) => x.id === id);

/* Flatten MC items */
function readingItems(passageIds, typeFilter) {
  const out = [];
  BANK.reading.forEach((p) => {
    if (!passageIds.includes(p.id)) return;
    p.questions.forEach((q) => { if (!typeFilter || q.type === typeFilter) out.push({ qid: q.id, q, group: p, section: "reading" }); });
  });
  return out;
}
function listeningItems(audioIds, typeFilter) {
  const out = [];
  BANK.listening.forEach((a) => {
    if (!audioIds.includes(a.id)) return;
    a.questions.forEach((q) => { if (!typeFilter || q.type === typeFilter) out.push({ qid: q.id, q, group: a, section: "listening" }); });
  });
  return out;
}
function findQuestion(qid) {
  for (const p of BANK.reading) for (const q of p.questions) if (q.id === qid) return { q, group: p, section: "reading" };
  for (const a of BANK.listening) for (const q of a.questions) if (q.id === qid) return { q, group: a, section: "listening" };
  return null;
}

/* ---------- Scoring ---------- */
const scaleMC = (c, n) => (n ? Math.round((c / n) * 30) : 0);
function cefrSection(section, s) {
  const T = {
    reading: [[24, "C1"], [18, "B2"], [4, "B1"]],
    listening: [[22, "C1"], [17, "B2"], [9, "B1"]],
    speaking: [[25, "C1"], [20, "B2"], [16, "B1"], [10, "A2"]],
    writing: [[24, "C1"], [17, "B2"], [13, "B1"], [7, "A2"]]
  }[section];
  for (const [min, lv] of T) if (s >= min) return lv;
  return "< B1";
}
function cefrTotal(t) { if (t >= 95) return "C1"; if (t >= 72) return "B2"; if (t >= 42) return "B1"; return "A2"; }

function speakingAuto(task, text) {
  const words = countWords(text);
  if (!words) return null;
  const expected = Math.round(task.speakTime * 2.3);
  const low = (text || "").toLowerCase();
  const matched = task.keywords.filter((k) => low.includes(k.toLowerCase()));
  const flu = Math.min(1, words / expected);
  const cov = Math.min(1, matched.length / Math.max(3, task.keywords.length * 0.55));
  const raw = 4 * (0.5 * flu + 0.5 * cov);
  return { score: Math.round(raw * 2) / 2, words, expected, matched };
}
const TRANSITIONS = ["however", "moreover", "furthermore", "first", "second", "finally", "for example", "for instance", "in addition", "therefore", "although", "while", "because", "in contrast", "as a result", "meanwhile", "in short", "on the other hand", "consequently", "specifically"];
function writingAuto(task, text) {
  const words = countWords(text);
  const low = (text || "").toLowerCase();
  const matched = task.keywords.filter((k) => low.includes(k.toLowerCase()));
  const trans = TRANSITIONS.filter((t) => low.includes(t)).length;
  const sentences = (text || "").split(/[.!?]+\s/).filter((s) => s.trim().length > 3).length;
  const avgLen = sentences ? words / sentences : 0;
  if (words < 20) return { score: words ? 0.5 : 0, words, matched, trans, sentences };
  const target = task.kind === "integrated" ? 170 : 120;
  let len = Math.min(1, words / target);
  if (task.maxWords && words > task.maxWords + 90) len -= 0.15;
  const cov = Math.min(1, matched.length / Math.max(3, task.keywords.length * 0.55));
  const tr = Math.min(1, trans / 4);
  const vari = sentences >= 5 && avgLen >= 11 && avgLen <= 28 ? 1 : 0.6;
  let raw = 5 * (0.35 * len + 0.35 * cov + 0.15 * tr + 0.15 * vari);
  if (words < task.minWords) raw = Math.min(raw, 1 + 3 * (words / task.minWords));
  return { score: Math.max(0, Math.round(raw * 2) / 2), words, matched, trans, sentences };
}
function speakingTaskScore(d) {
  if (!d) return null;
  const r = d.rubric || {};
  const vals = SPEAK_RUBRIC.map((x) => r[x.key]).filter((v) => typeof v === "number");
  if (vals.length === SPEAK_RUBRIC.length) {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return d.auto ? Math.round((0.7 * avg + 0.3 * d.auto.score) * 2) / 2 : Math.round(avg * 2) / 2;
  }
  return d.auto ? d.auto.score : null;
}
function writingTaskScore(d) {
  if (!d) return null;
  const auto = d.auto ? d.auto.score : 0;
  if (d.checks && d.checks.some((c) => c !== null && c !== undefined)) {
    const rub = (d.checks.filter(Boolean).length / d.checks.length) * 5;
    return Math.round((0.5 * auto + 0.5 * rub) * 2) / 2;
  }
  return auto;
}

/* Compute all scores of a result object */
function scoreResult(r) {
  const out = { sections: {}, total: null, cefr: null, complete: false, pending: [] };
  ["reading", "listening"].forEach((s) => {
    const m = r.mc && r.mc[s];
    if (!m) return;
    let c = 0;
    m.ids.forEach((id) => { const f = findQuestion(id); if (f && r.answers[id] === f.q.answer) c++; });
    const scaled = scaleMC(c, m.ids.length);
    out.sections[s] = { raw: c, max: m.ids.length, scaled, cefr: cefrSection(s, scaled) };
  });
  if (r.speaking) {
    const ts = r.speaking.taskIds.map((id) => speakingTaskScore(r.speaking.data[id]));
    const unrated = ts.filter((x) => x === null).length;
    const avg = ts.reduce((a, b) => a + (b || 0), 0) / Math.max(1, ts.length);
    const scaled = Math.round((avg / 4) * 30);
    if (unrated) out.pending.push("speaking");
    out.sections.speaking = { raw: Math.round(avg * 10) / 10, max: 4, scaled, cefr: cefrSection("speaking", scaled), unrated, perTask: ts };
  }
  if (r.writing) {
    const ts = r.writing.taskIds.map((id) => writingTaskScore(r.writing.data[id]));
    const avg = ts.reduce((a, b) => a + (b || 0), 0) / Math.max(1, ts.length);
    const scaled = Math.round((avg / 5) * 30);
    out.sections.writing = { raw: Math.round(avg * 10) / 10, max: 5, scaled, cefr: cefrSection("writing", scaled), perTask: ts };
  }
  if (SECTIONS.every((s) => out.sections[s])) {
    out.complete = true;
    out.total = SECTIONS.reduce((a, s) => a + out.sections[s].scaled, 0);
    out.cefr = cefrTotal(out.total);
  }
  return out;
}
function typeStats(r) {
  const st = {};
  ["reading", "listening"].forEach((s) => {
    const m = r.mc && r.mc[s];
    if (!m) return;
    m.ids.forEach((id) => {
      const f = findQuestion(id);
      if (!f) return;
      const t = f.q.type;
      st[t] = st[t] || { c: 0, n: 0, section: s };
      st[t].n++;
      if (r.answers[id] === f.q.answer) st[t].c++;
    });
  });
  return st;
}

/* ---------- Theme ---------- */
function initialTheme() {
  const saved = store.get(THEME_KEY, null);
  if (saved === "dark" || saved === "light") return saved;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* ---------- Web Audio beep ---------- */
let AC = null;
function audioCtx() {
  try {
    if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (C) AC = new C(); }
    if (AC && AC.state === "suspended") AC.resume();
  } catch (e) { AC = null; }
  return AC;
}
function beep(freq = 880, dur = 0.3) {
  const ctx = audioCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}

/* ---------- Text-to-speech engine ---------- */
const TTS = {
  supported: typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
  voices: [],
  load() {
    if (!this.supported) return;
    const grab = () => { try { this.voices = window.speechSynthesis.getVoices() || []; } catch (e) { this.voices = []; } };
    grab();
    try { window.speechSynthesis.addEventListener("voiceschanged", grab); } catch (e) { window.speechSynthesis.onvoiceschanged = grab; }
  },
  pick(gender) {
    const FEM = /female|samantha|zira|aria|jenny|allison|ava|susan|victoria|karen|moira|tessa|joanna|salli|kendra|kimberly|ivy|emma|michelle|google us english/i;
    const MAL = /\bmale|david|mark|guy|alex|fred|tom\b|daniel|aaron|christopher|eric|ryan|matthew|joey|justin|roger|steffan|davis|tony|jason/i;
    const all = this.voices;
    const us = all.filter((v) => /en[-_]US/i.test(v.lang));
    const en = all.filter((v) => /^en/i.test(v.lang));
    const pool = us.length ? us : en;
    const isF = (v) => FEM.test(v.name);
    const isM = (v) => MAL.test(v.name) && !isF(v);
    if (gender === "F") return pool.find(isF) || pool[0] || null;
    if (gender === "M") return pool.find(isM) || pool.find((v) => !isF(v)) || pool[0] || null;
    return pool.find((v) => v.default) || pool[0] || null;
  },
  /* speaks a script [{s, t}] with speakers map; returns a controller */
  play(script, speakers, { rate = 1, onLine, onEnd } = {}) {
    const ctl = { cancelled: false, cancel() { this.cancelled = true; try { window.speechSynthesis.cancel(); } catch (e) {} clearTimeout(this.timer); } };
    if (!this.supported) { setTimeout(() => onEnd && onEnd(false), 50); return ctl; }
    try { window.speechSynthesis.cancel(); } catch (e) {}
    const chunks = [];
    script.forEach((line, li) => {
      const parts = (line.t.match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g) || [line.t]);
      let buf = "";
      parts.forEach((p) => { if ((buf + p).length > 220 && buf) { chunks.push({ li, s: line.s, t: buf.trim() }); buf = p; } else buf += p; });
      if (buf.trim()) chunks.push({ li, s: line.s, t: buf.trim() });
    });
    const voiceFor = (s) => {
      const g = s === "N" ? "N" : (speakers && speakers[s] ? speakers[s].gender : "N");
      const v = this.pick(g);
      const fv = this.pick("F"), mv = this.pick("M");
      const same = fv && mv && fv.name === mv.name;
      const pitch = g === "M" ? (same ? 0.72 : 0.92) : g === "F" ? (same ? 1.25 : 1.06) : 1;
      const r = g === "M" ? 0.95 : g === "F" ? 1.0 : 0.97;
      return { v, pitch, rate: r * rate };
    };
    let i = 0;
    const next = () => {
      if (ctl.cancelled) return;
      if (i >= chunks.length) { onEnd && onEnd(true); return; }
      const c = chunks[i];
      onLine && onLine(c.li);
      const u = new SpeechSynthesisUtterance(c.t);
      const { v, pitch, rate: rr } = voiceFor(c.s);
      u.lang = "en-US"; if (v) u.voice = v; u.pitch = pitch; u.rate = rr; u.volume = 1;
      let done = false;
      const fin = () => { if (done) return; done = true; clearTimeout(ctl.timer); i++; setTimeout(next, c.s !== (chunks[i] || {}).s ? 380 : 120); };
      u.onend = fin;
      u.onerror = (e) => { if (ctl.cancelled) return; fin(); };
      clearTimeout(ctl.timer);
      ctl.timer = setTimeout(fin, (c.t.length / 8 + 6) * 1000 / Math.max(0.5, rr));
      try { window.speechSynthesis.speak(u); } catch (e) { fin(); }
    };
    setTimeout(next, 250);
    return ctl;
  }
};
TTS.load();

/* ---------- Countdown hook ---------- */
function useCountdown(total, running, onExpire, resetKey) {
  const [st, setSt] = useState({ k: resetKey, t: total, left: total });
  const cb = useRef(onExpire);
  const fired = useRef(false);
  cb.current = onExpire;
  /* derive: a new key/total always starts fresh in the same render (no stale 0) */
  const fresh = st.k === resetKey && st.t === total;
  const left = fresh ? st.left : total;
  useEffect(() => {
    if (!fresh) { setSt({ k: resetKey, t: total, left: total }); }
    fired.current = false;
  }, [resetKey, total]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSt((s) => (s.k === resetKey ? { ...s, left: Math.max(0, s.left - 1) } : s)), 1000);
    return () => clearInterval(id);
  }, [running, resetKey]);
  useEffect(() => {
    if (fresh && left === 0 && running && !fired.current) { fired.current = true; cb.current && cb.current(); }
  }, [left, running, fresh]);
  const setLeft = useCallback((v) => setSt((s) => ({ ...s, left: typeof v === "function" ? v(s.left) : v })), []);
  return [left, setLeft];
}

/* ---------- Recorder hook: MediaRecorder + SpeechRecognition ---------- */
function useRecorder() {
  const [st, setSt] = useState({ status: "idle", error: null, transcript: "", interim: "" });
  const R = useRef({ stream: null, mr: null, chunks: [], rec: null, active: false, finalText: "", interim: "" });
  const cleanup = useCallback(() => {
    const r = R.current;
    r.active = false;
    try { r.rec && r.rec.abort(); } catch (e) {}
    try { if (r.mr && r.mr.state !== "inactive") r.mr.stop(); } catch (e) {}
    try { r.stream && r.stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
    r.rec = null; r.mr = null; r.stream = null;
  }, []);
  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    const r = R.current;
    cleanup();
    r.finalText = ""; r.interim = ""; r.chunks = []; r.active = true;
    setSt({ status: "starting", error: null, transcript: "", interim: "" });
    let micOk = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!r.active) { stream.getTracks().forEach((t) => t.stop()); return; }
        r.stream = stream;
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => { if (e.data && e.data.size) r.chunks.push(e.data); };
        mr.start();
        r.mr = mr; micOk = true;
      } catch (err) {
        setSt((s) => ({ ...s, status: "nomic", error: (err && err.name) || "Error" }));
      }
    } else {
      setSt((s) => ({ ...s, status: "nomic", error: "Unsupported" }));
    }
    if (!micOk) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let srOk = false;
    if (SR) {
      try {
        const rec = new SR();
        rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true;
        rec.onresult = (e) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const res = e.results[i];
            if (res.isFinal) r.finalText += res[0].transcript.trim() + " "; else interim += res[0].transcript;
          }
          r.interim = interim;
          setSt((s) => ({ ...s, transcript: r.finalText, interim }));
        };
        rec.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "network") { r.srBlocked = true; setSt((s) => ({ ...s, srError: e.error })); } };
        rec.onend = () => { if (r.active && !r.srBlocked) { try { rec.start(); } catch (e) {} } };
        r.srBlocked = false;
        rec.start();
        r.rec = rec; srOk = true;
      } catch (e) { srOk = false; }
    }
    setSt((s) => ({ ...s, status: "recording", srOk }));
  }, [cleanup]);

  const stop = useCallback(() => new Promise((resolve) => {
    const r = R.current;
    r.active = false;
    try { r.rec && r.rec.stop(); } catch (e) {}
    const done = (url) => {
      setTimeout(() => {
        try { r.stream && r.stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
        const transcript = (r.finalText + " " + (r.interim || "")).replace(/\s+/g, " ").trim();
        setSt((s) => ({ ...s, status: "stopped", transcript, interim: "" }));
        resolve({ url, transcript });
      }, 700);
    };
    const mr = r.mr;
    if (mr && mr.state !== "inactive") {
      mr.onstop = () => {
        let url = null;
        try { const blob = new Blob(r.chunks, { type: mr.mimeType || "audio/webm" }); if (blob.size) url = URL.createObjectURL(blob); } catch (e) {}
        done(url);
      };
      try { mr.stop(); } catch (e) { done(null); }
    } else done(null);
  }), []);

  return { st, start, stop, cleanup };
}

/* ============================================================
   KOMPONEN UI BERSAMA
   ============================================================ */
/* ---------- Shared UI ---------- */
const BTN = "inline-flex items-center justify-center gap-2 rounded-xl px-4 min-h-11 font-semibold text-[15px] leading-tight transition select-none active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-book disabled:opacity-40 disabled:pointer-events-none";
const BTN_V = {
  primary: "bg-book text-white hover:brightness-110 shadow-sm",
  secondary: "bg-paper text-ink border border-line hover:border-book",
  ghost: "text-ink hover:bg-surface",
  danger: "bg-bad text-white hover:brightness-110",
  soft: "bg-booksoft text-book hover:brightness-95"
};
function Btn({ v = "secondary", icon, children, className = "", iconRight, ...p }) {
  return (
    <button type="button" className={cx(BTN, BTN_V[v], className)} {...p}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
}
function IconBtn({ icon, label, active, className = "", ...p }) {
  return (
    <button type="button" aria-label={label} title={label}
      className={cx("inline-flex items-center justify-center rounded-xl w-11 h-11 border transition focus-visible:outline-2 focus-visible:outline-book",
        active ? "bg-book text-white border-book" : "bg-paper text-ink border-line hover:border-book", className)} {...p}>
      <Icon name={icon} size={19} />
    </button>
  );
}

function Modal({ open, title, children, onClose, actions, wide }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/50 fade-in no-print" role="dialog" aria-modal="true" data-modal="1">
      <div className={cx("w-full bg-paper text-ink rounded-2xl border border-line shadow-2xl max-h-[90vh] overflow-auto", wide ? "max-w-2xl" : "max-w-md")}>
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <h2 className="font-display text-xl font-bold leading-tight">{title}</h2>
          {onClose && <button className="p-1 rounded-lg hover:bg-surface" onClick={onClose} aria-label="Tutup"><Icon name="X" /></button>}
        </div>
        <div className="px-5 py-4 text-[15px] leading-relaxed">{children}</div>
        {actions && <div className="flex flex-wrap justify-end gap-2 px-5 pb-5">{actions}</div>}
      </div>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, tone = "info") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  const view = (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[min(92vw,420px)] no-print" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cx("rounded-xl px-4 py-3 shadow-lg text-[15px] font-medium fade-in border",
          t.tone === "warn" ? "bg-warnsoft text-ink border-warn" : t.tone === "ok" ? "bg-oksoft text-ink border-ok" : "bg-ink text-paper border-ink")}>{t.msg}</div>
      ))}
    </div>
  );
  return [push, view];
}

function TimerBadge({ left, paused, label = "Sisa waktu", warnAt = 60 }) {
  const danger = left <= warnAt;
  return (
    <div className={cx("inline-flex items-center gap-2 rounded-xl px-3 h-11 font-display font-bold tabular-nums text-[17px] border",
      paused ? "bg-surface border-line text-muted" : danger ? "bg-badsoft border-bad text-bad pulse-soft" : "bg-paper border-line text-ink")}
      title={label} aria-label={label + " " + fmtTime(left)}>
      <Icon name={paused ? "Pause" : "Clock"} size={18} />
      <span>{fmtTime(left)}</span>
    </div>
  );
}

function SectionTag({ section, small }) {
  const m = SECTION_META[section];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full bg-booksoft text-book font-semibold", small ? "text-[13px] px-2.5 py-0.5" : "text-sm px-3 py-1")}>
      <Icon name={m.icon} size={small ? 14 : 16} />{m.label}
    </span>
  );
}

/* Question navigator: status per question */
function Navigator({ items, idx, answers, flags, onJump, isLocked, groupLabel }) {
  const groups = [];
  items.forEach((it, i) => {
    const g = groups[groups.length - 1];
    if (!g || g.id !== it.group.id) groups.push({ id: it.group.id, label: groupLabel(it.group, groups.length), list: [{ it, i }] });
    else g.list.push({ it, i });
  });
  return (
    <div className="flex flex-nowrap sm:flex-wrap items-center gap-x-4 gap-y-2 w-max sm:w-auto">
      {groups.map((g) => (
        <div key={g.id} className="flex items-center gap-1.5 shrink-0">
          <span className="text-[13px] text-muted font-medium mr-0.5 whitespace-nowrap">{g.label}</span>
          {g.list.map(({ it, i }) => {
            const ans = answers[it.qid] !== undefined;
            const fl = flags[it.qid];
            const locked = isLocked && isLocked(it);
            return (
              <button key={it.qid} type="button" onClick={() => onJump(i)} disabled={locked}
                aria-label={"Soal " + (i + 1) + (ans ? ", sudah dijawab" : ", belum dijawab") + (fl ? ", ditandai" : "")}
                className={cx("relative w-9 h-9 rounded-lg text-[14px] font-bold tabular-nums border transition",
                  i === idx ? "ring-2 ring-book ring-offset-2 ring-offset-paper" : "",
                  locked ? "opacity-35 border-dashed border-line text-muted" :
                    fl ? "bg-warnsoft border-warn text-ink" : ans ? "bg-book border-book text-white" : "bg-paper border-line text-ink hover:border-book")}>
                {i + 1}
                {fl && <span className="absolute -top-1.5 -right-1.5 bg-warn text-white rounded-full p-0.5"><Icon name="Flag" size={10} stroke={3} /></span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
function NavLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-[13px] text-muted">
      <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border border-line bg-paper" />Belum dijawab</span>
      <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-book" />Sudah dijawab</span>
      <span className="inline-flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-warnsoft border border-warn" />Ditandai</span>
    </div>
  );
}

function Wave({ active, bars = 28 }) {
  return (
    <div className={cx("wave flex items-center justify-center gap-[3px] h-16", active ? "is-on" : "")} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ animationDelay: (i % 7) * 0.09 + (i % 3) * 0.05 + "s", height: 10 + ((i * 37) % 44) + "px" }} />
      ))}
    </div>
  );
}

function Bar({ value, max = 30, tone = "book", label, right }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      {(label || right) && <div className="flex items-baseline justify-between gap-3 mb-1 text-[14px]"><span className="font-medium">{label}</span><span className="tabular-nums text-muted whitespace-nowrap">{right}</span></div>}
      <div className="h-2.5 rounded-full bg-surface overflow-hidden border border-line">
        <div className={cx("h-full rounded-full bar-grow", tone === "bad" ? "bg-bad" : tone === "warn" ? "bg-warn" : tone === "ok" ? "bg-ok" : "bg-book")} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function Pill({ children, tone = "muted" }) {
  const t = { muted: "bg-surface text-muted border-line", ok: "bg-oksoft text-ok border-ok/40", bad: "bg-badsoft text-bad border-bad/40", warn: "bg-warnsoft text-warn border-warn/40", book: "bg-booksoft text-book border-book/30" }[tone];
  return <span className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap", t)}>{children}</span>;
}

/* Explanation block for MC questions */
function Explanation({ q, chosen }) {
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface p-4 fade-in">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Pill tone="ok"><Icon name="Check" size={14} stroke={3} />Jawaban benar: {LETTERS[q.answer]}</Pill>
        {chosen !== undefined && chosen !== q.answer && <Pill tone="bad"><Icon name="X" size={14} stroke={3} />Jawaban Anda: {LETTERS[chosen]}</Pill>}
        {chosen === undefined && <Pill tone="warn">Tidak dijawab</Pill>}
        <Pill tone="book">{TYPE_LABEL[q.type]}</Pill>
      </div>
      <p className="text-[15px] leading-relaxed"><b>Mengapa benar: </b>{q.why}</p>
      <ul className="mt-3 space-y-2">
        {q.options.map((o, i) => i === q.answer ? null : (
          <li key={i} className="flex gap-2 text-[14.5px] leading-relaxed">
            <span className={cx("mt-0.5 inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold", i === chosen ? "bg-bad text-white" : "bg-paper border border-line text-muted")}>{LETTERS[i]}</span>
            <span><b>Mengapa salah: </b>{q.notes[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Transcript({ script, speakers }) {
  return (
    <div className="space-y-2 text-[15px] leading-relaxed">
      {script.map((l, i) => (
        <p key={i} className={l.s === "N" ? "italic text-muted" : ""}>
          {l.s !== "N" && <b className="mr-1">{(speakers && speakers[l.s] ? speakers[l.s].name : l.s)}:</b>}{l.t}
        </p>
      ))}
    </div>
  );
}

/* ============================================================
   READING & LISTENING
   ============================================================ */
/* ---------- App-level context ---------- */
const AppCtx = React.createContext({ theme: "light", toggleTheme: () => {}, toast: () => {} });

function ExamBar({ section, mode, step, left, warnAt = 60, paused, onPause, onExit, onFinish, finishLabel = "Selesai section", extra }) {
  const { theme, toggleTheme } = React.useContext(AppCtx);
  return (
    <header className="no-print sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-line">
      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-5 py-2.5">
        <div className="flex items-center gap-2 min-w-0 mr-auto">
          <SectionTag section={section} />
          <span className="hidden sm:inline text-[14px] text-muted truncate">{mode === "sim" ? "Full iBT Simulation" : "Practice Mode"}{step ? " · " + step : ""}</span>
        </div>
        {extra}
        {typeof left === "number" && <TimerBadge left={left} paused={paused} warnAt={warnAt} />}
        {mode === "practice" && onPause && <IconBtn icon={paused ? "Play" : "Pause"} label={paused ? "Lanjutkan timer" : "Jeda timer"} onClick={onPause} active={paused} />}
        <span className="hidden sm:block"><IconBtn icon={theme === "dark" ? "Sun" : "Moon"} label="Ganti tema" onClick={toggleTheme} /></span>
        {onFinish && <span className="hidden sm:block"><Btn v="primary" onClick={onFinish}>{finishLabel}</Btn></span>}
        <IconBtn icon="LogOut" label="Keluar dari ujian" onClick={onExit} />
      </div>
    </header>
  );
}

function PausedCover({ onResume }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-paper/95 backdrop-blur-sm text-center p-6">
      <Icon name="Pause" size={40} className="text-book" />
      <p className="font-display text-2xl font-bold">Latihan dijeda</p>
      <p className="text-muted max-w-sm">Timer berhenti. Konten disembunyikan sementara agar jeda tidak dipakai untuk membaca soal.</p>
      <Btn v="primary" icon="Play" onClick={onResume}>Lanjutkan</Btn>
    </div>
  );
}

/* ---------- Reading passage pane ---------- */
function mergeRanges(r) {
  const s = r.slice().sort((a, b) => a[0] - b[0]);
  const out = [];
  s.forEach((x) => { const l = out[out.length - 1]; if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else out.push([x[0], x[1]]); });
  return out;
}
function lookupVocab(vocab, raw) {
  const w = (raw || "").toLowerCase().replace(/[^a-z\-]/g, "");
  if (!w) return null;
  if (vocab[w]) return { word: w, e: vocab[w] };
  for (const k in vocab) if ((vocab[k].forms || []).includes(w)) return { word: k, e: vocab[k] };
  const stems = [w.replace(/ies$/, "y"), w.replace(/es$/, ""), w.replace(/s$/, ""), w.replace(/ed$/, ""), w.replace(/d$/, ""), w.replace(/ing$/, ""), w.replace(/ly$/, "")];
  for (const s of stems) if (vocab[s]) return { word: s, e: vocab[s] };
  return null;
}

function PassagePane({ passage, practice, activePara, target, hl, setHl }) {
  const [size, setSize] = useState("M");
  const [hlMode, setHlMode] = useState(false);
  const [pop, setPop] = useState(null);
  const ref = useRef(null);
  const vocabWords = useMemo(() => {
    const w = [];
    Object.keys(passage.vocab).forEach((k) => { w.push(k); (passage.vocab[k].forms || []).forEach((f) => w.push(f)); });
    return w.sort((a, b) => b.length - a.length);
  }, [passage.id]);
  const re = useMemo(() => {
    const words = practice ? vocabWords.slice() : [];
    if (target && !words.includes(target)) words.unshift(target);
    return words.length ? new RegExp("\\b(" + words.join("|") + ")\\b", "gi") : null;
  }, [practice, vocabWords, target]);

  useEffect(() => {
    if (activePara === null || activePara === undefined || !ref.current) return;
    const el = ref.current.querySelector('[data-row="' + activePara + '"]');
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activePara, passage.id]);
  useEffect(() => { setPop(null); }, [passage.id]);

  const applySelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount || !ref.current) return false;
    const range = sel.getRangeAt(0);
    const next = { ...hl };
    let added = false;
    ref.current.querySelectorAll("[data-pi]").forEach((el) => {
      if (!range.intersectsNode(el)) return;
      const pi = +el.dataset.pi;
      let s = 0, e = el.textContent.length;
      const pre = document.createRange();
      if (el.contains(range.startContainer)) { pre.selectNodeContents(el); pre.setEnd(range.startContainer, range.startOffset); s = pre.toString().length; }
      if (el.contains(range.endContainer)) { pre.selectNodeContents(el); pre.setEnd(range.endContainer, range.endOffset); e = pre.toString().length; }
      if (e - s < 1) return;
      next[pi] = mergeRanges([...(next[pi] || []), [s, e]]);
      added = true;
    });
    if (added) { setHl(next); sel.removeAllRanges(); }
    return added;
  };
  const onMouseUp = (e) => { if (hlMode && e.detail < 2) applySelection(); };
  const removeAt = (pi, start) => {
    const next = { ...hl, [pi]: (hl[pi] || []).filter((r) => !(start >= r[0] && start < r[1])) };
    setHl(next);
  };
  const openVocab = (raw, x, y) => {
    const f = lookupVocab(passage.vocab, raw);
    setPop({ raw: (raw || "").trim(), f, x, y });
  };
  const onDbl = (e) => {
    if (!practice) return;
    const sel = window.getSelection();
    const w = sel ? sel.toString().trim() : "";
    if (w && w.split(/\s+/).length === 1) openVocab(w, e.clientX, e.clientY);
  };

  const decorate = (str, base, pi) => {
    if (!re) return [str];
    const out = []; let last = 0; let m; re.lastIndex = 0;
    while ((m = re.exec(str))) {
      if (m.index > last) out.push(str.slice(last, m.index));
      const w = m[0]; const lw = w.toLowerCase();
      const isT = target && lw === target && pi === activePara;
      if (isT) out.push(<span key={base + m.index} className="tgt">{w}</span>);
      else if (practice && lw !== target) out.push(<span key={base + m.index} className="voc" onClick={(ev) => { if (!hlMode) { ev.stopPropagation(); openVocab(w, ev.clientX, ev.clientY); } }}>{w}</span>);
      else out.push(w);
      last = m.index + w.length;
    }
    if (last < str.length) out.push(str.slice(last));
    return out;
  };
  const renderPara = (text, pi) => {
    const ranges = mergeRanges(hl[pi] || []);
    const pieces = []; let pos = 0;
    ranges.forEach(([s, e]) => { if (s > pos) pieces.push({ t: text.slice(pos, s), hl: false, s: pos }); pieces.push({ t: text.slice(s, e), hl: true, s }); pos = e; });
    if (pos < text.length) pieces.push({ t: text.slice(pos), hl: false, s: pos });
    return pieces.map((p) => p.hl
      ? <mark key={"h" + p.s} className="hl" onClick={() => { if (hlMode) removeAt(pi, p.s); }} title={hlMode ? "Klik untuk menghapus highlight" : undefined}>{decorate(p.t, "h" + p.s + "-", pi)}</mark>
      : <React.Fragment key={"n" + p.s}>{decorate(p.t, "n" + p.s + "-", pi)}</React.Fragment>);
  };
  const sizes = { S: "text-[15px]", M: "text-[17px]", L: "text-[19.5px]" };
  const hasHl = Object.values(hl).some((r) => r && r.length);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-line bg-surface">
        <div className="inline-flex rounded-xl border border-line overflow-hidden bg-paper" role="group" aria-label="Ukuran huruf">
          {["S", "M", "L"].map((s) => (
            <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
              className={cx("w-10 h-10 font-bold", size === s ? "bg-book text-white" : "text-ink hover:bg-surface", s === "S" ? "text-[13px]" : s === "L" ? "text-[18px]" : "text-[15px]")}>{s === "S" ? "A" : s === "M" ? "A" : "A"}<span className="sr-only">{s}</span></button>
          ))}
        </div>
        <button type="button" onClick={() => setHlMode((v) => !v)} aria-pressed={hlMode}
          className={cx("inline-flex items-center gap-2 h-10 px-3 rounded-xl border font-semibold text-[14px]", hlMode ? "bg-hl border-warn text-ink" : "bg-paper border-line hover:border-book")}>
          <Icon name="Highlighter" size={17} />Highlighter {hlMode ? "aktif" : ""}
        </button>
        {hlMode && <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={applySelection} className="h-10 px-3 rounded-xl border border-line bg-paper text-[14px] font-semibold hover:border-book">Tandai pilihan</button>}
        {hasHl && <button type="button" onClick={() => setHl({})} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-[14px] font-semibold text-muted hover:text-ink"><Icon name="Eraser" size={16} />Hapus</button>}
        {practice && <span className="text-[13px] text-muted ml-auto hidden md:inline">Klik 2× kata (atau ketuk kata bergaris titik) untuk arti</span>}
      </div>
      <div ref={ref} className="flex-1 min-h-0 overflow-auto px-4 sm:px-8 py-6 passage" onMouseUp={onMouseUp} onDoubleClick={onDbl}>
        <p className="text-[13px] font-semibold text-book mb-1">{passage.topic}</p>
        <h2 className="font-serif text-[24px] sm:text-[27px] font-semibold leading-tight mb-5 text-balance">{passage.title}</h2>
        {passage.paragraphs.map((t, pi) => (
          <div key={pi} data-row={pi} className={cx("relative grid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded-xl -mx-2 px-2 py-2 mb-2 transition-colors", activePara === pi ? "bg-booksoft" : "")}>
            <span className={cx("pt-1 text-right font-display font-bold text-[13px] tabular-nums", activePara === pi ? "text-book" : "text-muted")}>
              {activePara === pi ? <Icon name="ArrowRight" size={16} className="inline" /> : null}{pi + 1}
            </span>
            <p data-pi={pi} className={cx("font-serif leading-[1.8]", sizes[size], hlMode ? "cursor-text selection:bg-hl" : "")}>{renderPara(t, pi)}</p>
          </div>
        ))}
        <p className="text-[13px] text-muted mt-6">Bacaan orisinal untuk latihan.</p>
      </div>
      {pop && (
        <div className="fixed z-50 w-[288px] rounded-2xl border border-line bg-paper shadow-2xl p-4 fade-in"
          style={{ left: Math.min(Math.max(8, pop.x - 144), window.innerWidth - 296), top: pop.y > window.innerHeight - 260 ? pop.y - 230 : pop.y + 16 }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-serif text-[20px] font-semibold leading-tight">{pop.f ? pop.f.word : pop.raw}</p>
              {pop.f && <p className="text-[13px] text-muted italic">{pop.f.e.pos}</p>}
            </div>
            <button className="p-1 rounded-lg hover:bg-surface" onClick={() => setPop(null)} aria-label="Tutup"><Icon name="X" size={16} /></button>
          </div>
          {pop.f ? (
            <>
              <p className="mt-2 text-[15px]">{pop.f.e.meaning}</p>
              <p className="mt-3 text-[13px] font-semibold text-muted">Sinonim dalam konteks</p>
              <div className="mt-1 flex flex-wrap gap-1.5">{pop.f.e.syn.map((s) => <Pill key={s} tone="book">{s}</Pill>)}</div>
            </>
          ) : <p className="mt-2 text-[14px] text-muted">Kata ini belum ada di kamus akademik bacaan ini. Kata bergaris titik memiliki entri kamus.</p>}
        </div>
      )}
    </div>
  );
}

/* ---------- Question pane ---------- */
function QuestionPane({ item, index, total, chosen, onChoose, practice, checked, flagged, onFlag, onCheck, onShowPara }) {
  const q = item.q;
  const lockAns = practice && checked;
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-display font-bold text-[15px]">Question {index + 1} <span className="text-muted font-medium">of {total}</span></span>
        {practice && <Pill tone="book">{TYPE_LABEL[q.type]}</Pill>}
        {item.section === "reading" && (
          <button type="button" onClick={onShowPara} className="text-[13px] font-semibold text-book hover:underline">Paragraf {q.paragraph + 1}</button>
        )}
        <button type="button" onClick={onFlag} aria-pressed={!!flagged}
          className={cx("ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[14px] font-semibold", flagged ? "bg-warnsoft border-warn" : "bg-paper border-line hover:border-warn")}>
          <Icon name="Flag" size={15} />{flagged ? "Ditandai" : "Tandai"}
        </button>
      </div>
      <p className="text-[17.5px] font-semibold leading-snug mb-4 text-balance">{q.prompt}</p>
      <div className="space-y-2.5" role="radiogroup" aria-label="Pilihan jawaban">
        {q.options.map((o, i) => {
          const sel = chosen === i;
          const showOk = lockAns && i === q.answer;
          const showBad = lockAns && sel && i !== q.answer;
          return (
            <button key={i} type="button" role="radio" aria-checked={sel} disabled={lockAns} onClick={() => onChoose(i)}
              className={cx("w-full text-left flex gap-3 items-start rounded-xl border-2 px-3.5 py-3 transition",
                showOk ? "border-ok bg-oksoft" : showBad ? "border-bad bg-badsoft" : sel ? "border-book bg-booksoft" : "border-line bg-paper hover:border-book/60",
                lockAns ? "cursor-default" : "")}>
              <span className={cx("inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-lg font-display font-bold text-[14px]",
                showOk ? "bg-ok text-white" : showBad ? "bg-bad text-white" : sel ? "bg-book text-white" : "bg-surface border border-line text-ink")}>{LETTERS[i]}</span>
              <span className="pt-1 text-[16px] leading-snug">{o}</span>
            </button>
          );
        })}
      </div>
      {practice && !checked && (
        <div className="mt-4"><Btn v="soft" icon="ListChecks" onClick={onCheck} disabled={chosen === undefined}>Cek Jawaban & Pembahasan</Btn></div>
      )}
      {practice && checked && <Explanation q={q} chosen={chosen} />}
    </div>
  );
}

/* ---------- Listening audio player ---------- */
function AudioPlayer({ item, practice, played, onPlayed, onStatus, rate = 1, compact, autoPlay }) {
  const [status, setStatus] = useState(played ? "done" : "idle");
  const [line, setLine] = useState(-1);
  const [fallback, setFallback] = useState(false);
  const ctl = useRef(null);
  useEffect(() => {
    setStatus(played ? "done" : "idle"); setLine(-1); setFallback(false);
    return () => { if (ctl.current) ctl.current.cancel(); };
  }, [item.id]);
  useEffect(() => { onStatus && onStatus(status); }, [status]);
  useEffect(() => () => { if (ctl.current) ctl.current.cancel(); onStatus && onStatus("idle"); }, []);

  const canPlay = practice || !played;
  const play = () => {
    audioCtx();
    if (ctl.current) ctl.current.cancel();
    setStatus("playing");
    ctl.current = TTS.play(item.script, item.speakers, {
      rate, onLine: (i) => setLine(i),
      onEnd: () => { setStatus("done"); setLine(-1); onPlayed && onPlayed(); }
    });
  };
  const stop = () => { if (ctl.current) ctl.current.cancel(); setStatus(played ? "done" : "idle"); setLine(-1); };
  useEffect(() => {
    if (!autoPlay || played || !TTS.supported) return;
    const t = setTimeout(play, 700);
    return () => clearTimeout(t);
  }, [item.id]);
  const cur = line >= 0 ? item.script[line] : null;
  const isConv = item.kind === "conversation";
  const spk = Object.entries(item.speakers || {});

  return (
    <div className={cx("rounded-2xl border border-line overflow-hidden", compact ? "bg-surface" : "bg-paper shadow-sm")}>
      <div className={cx("flex flex-wrap items-center gap-3 px-4 py-3", compact ? "" : "bg-book text-white")}>
        <Icon name="Headphones" size={20} />
        <div className="min-w-0 mr-auto">
          <p className={cx("text-[13px] font-semibold", compact ? "text-book" : "text-white/80")}>{isConv ? "Campus Conversation" : "Academic Lecture"}</p>
          <p className="font-semibold leading-tight truncate">{item.context}</p>
        </div>
        <span className={cx("text-[13px] font-semibold rounded-full px-2.5 py-1", compact ? "bg-paper border border-line" : "bg-white/15")}>
          {practice ? "Putar ulang bebas" : played ? "Audio sudah diputar" : "Hanya bisa diputar 1×"}
        </span>
      </div>
      {!compact && (
        <div className="px-4 sm:px-6 pt-5 pb-2">
          <div className="flex justify-center gap-6 sm:gap-10 mb-2">
            {spk.map(([k, v]) => {
              const on = cur && cur.s === k;
              return (
                <div key={k} className="flex flex-col items-center gap-1.5">
                  <div className={cx("w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all",
                    on ? "border-book bg-booksoft scale-110" : "border-line bg-surface")}>
                    <Icon name={v.gender === "F" ? "User" : "User"} size={28} className={v.gender === "F" ? "text-mark" : "text-book"} />
                  </div>
                  <span className="text-[13px] font-semibold">{v.name}</span>
                  <span className="text-[12px] text-muted">{v.gender === "F" ? "Suara wanita" : "Suara pria"}</span>
                </div>
              );
            })}
          </div>
          <Wave active={status === "playing"} />
        </div>
      )}
      <div className={cx("flex flex-wrap items-center gap-3 px-4 py-3", compact ? "" : "border-t border-line")}>
        <span className={cx("inline-flex items-center gap-2 font-semibold text-[15px] mr-auto", status === "playing" ? "text-book" : status === "done" ? "text-ok" : "text-muted")} aria-live="polite">
          <span className={cx("w-2.5 h-2.5 rounded-full", status === "playing" ? "bg-book pulse-soft" : status === "done" ? "bg-ok" : "bg-line")} />
          {status === "playing" ? "Playing Audio…" : status === "done" ? "Audio Finished" : "Siap diputar"}
          {status === "playing" && line >= 0 && <span className="text-muted font-normal tabular-nums">({line + 1}/{item.script.length})</span>}
        </span>
        {!TTS.supported && !played && (
          <Btn v="secondary" icon="FileText" onClick={() => { setFallback(true); onPlayed && onPlayed(); }}>Browser tanpa TTS: baca transkrip</Btn>
        )}
        {TTS.supported && status !== "playing" && canPlay && (
          <Btn v="primary" icon={played ? "RotateCcw" : "Play"} onClick={play}>{played ? "Putar ulang" : "Putar audio"}</Btn>
        )}
        {status === "playing" && practice && <Btn v="secondary" icon="Square" onClick={stop}>Stop</Btn>}
      </div>
      {fallback && <div className="px-4 pb-4"><Transcript script={item.script} speakers={item.speakers} /></div>}
    </div>
  );
}

/* ---------- Reading / Listening section runner ---------- */
function MCSection({ section, items, mode, timeLimit, sess, dispatch, onFinish, onExit, step }) {
  const { toast } = React.useContext(AppCtx);
  const practice = mode === "practice";
  const listening = section === "listening";
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [audioStatus, setAudioStatus] = useState("idle");
  const [tab, setTab] = useState("passage");
  const [hlAll, setHlAll] = useState({});
  const [rate, setRate] = useState(1);
  const [txOpen, setTxOpen] = useState(false);
  const item = items[idx];
  const answers = sess.answers, flags = sess.flags, checked = sess.checked, played = sess.played;
  const groups = useMemo(() => { const g = []; items.forEach((it) => { if (!g.includes(it.group.id)) g.push(it.group.id); }); return g; }, [items]);
  const firstUnplayed = groups.findIndex((g) => !played[g]);
  const isLocked = (it) => listening && !practice && firstUnplayed >= 0 && groups.indexOf(it.group.id) > firstUnplayed;
  const groupPlayed = !listening || !!played[item.group.id] || (practice && sess.reveal[item.group.id]);
  const running = !paused && !(listening && audioStatus === "playing");

  function finish(auto) {
    setConfirm(false);
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    onFinish({ auto, timeUsed: timeLimit - leftRef.current });
  }
  const [left] = useCountdown(timeLimit, running, () => { toast("Waktu habis. Jawaban dikirim otomatis.", "warn"); finish(true); }, section);
  const leftRef = useRef(left); leftRef.current = left;

  useEffect(() => { setTxOpen(false); }, [idx]);
  const go = (d) => {
    const n = idx + d;
    if (n < 0 || n >= items.length) return;
    if (isLocked(items[n])) { toast("Putar audio berikutnya terlebih dulu.", "warn"); return; }
    setIdx(n);
  };
  const choose = (i) => {
    if (!groupPlayed) return;
    if (practice && checked[item.qid]) return;
    dispatch({ type: "ANSWER", qid: item.qid, value: i });
  };
  const toggleFlag = () => dispatch({ type: "FLAG", qid: item.qid });

  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tg = e.target;
      if (tg && (tg.tagName === "INPUT" || tg.tagName === "TEXTAREA" || tg.tagName === "SELECT" || tg.isContentEditable)) return;
      if (document.querySelector("[data-modal]") || paused) return;
      const k = e.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(k)) { choose(k.charCodeAt(0) - 97); e.preventDefault(); }
      else if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
      else if (k === "f") toggleFlag();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const unanswered = items.filter((it) => answers[it.qid] === undefined).length;
  const flaggedN = items.filter((it) => flags[it.qid]).length;
  const label = (g, i) => (listening ? "Audio " : "Teks ") + (i + 1);
  const last = idx === items.length - 1;

  const question = (
    <QuestionPane item={item} index={idx} total={items.length} chosen={answers[item.qid]} onChoose={choose} practice={practice}
      checked={!!checked[item.qid]} flagged={!!flags[item.qid]} onFlag={toggleFlag}
      onCheck={() => dispatch({ type: "CHECK", qid: item.qid })} onShowPara={() => setTab("passage")} />
  );

  return (
    <div className="h-full flex flex-col">
      <ExamBar section={section} mode={mode} step={step} left={left} paused={paused} onPause={() => setPaused((p) => !p)} onExit={onExit} onFinish={() => setConfirm(true)}
        extra={listening && practice ? (
          <select value={rate} onChange={(e) => setRate(+e.target.value)} aria-label="Kecepatan audio" className="h-11 rounded-xl border border-line bg-paper px-2 text-[15px]">
            <option value={0.85}>0.85×</option><option value={1}>1×</option><option value={1.15}>1.15×</option>
          </select>) : null} />
      <div className="no-print border-b border-line bg-paper px-3 sm:px-5 py-2.5 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-3 justify-between min-w-0">
          <Navigator items={items} idx={idx} answers={answers} flags={flags} onJump={(i) => { if (!isLocked(items[i])) setIdx(i); }} isLocked={isLocked} groupLabel={label} />
          <div className="hidden xl:block"><NavLegend /></div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        {paused && <PausedCover onResume={() => setPaused(false)} />}
        {section === "reading" ? (
          <div className="h-full flex flex-col lg:grid lg:grid-cols-2 min-h-0">
            <div className="lg:hidden flex gap-1 p-2 border-b border-line bg-surface">
              {[["passage", "Bacaan"], ["question", "Soal " + (idx + 1)]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => setTab(k)} className={cx("flex-1 h-10 rounded-lg font-semibold text-[15px]", tab === k ? "bg-paper border border-line shadow-sm" : "text-muted")}>{l}</button>
              ))}
            </div>
            <div className={cx("min-h-0 flex-1 lg:border-r border-line", tab === "passage" ? "flex flex-col" : "hidden lg:flex lg:flex-col")}>
              <PassagePane passage={item.group} practice={practice} activePara={item.q.paragraph} target={item.q.target || null}
                hl={hlAll[item.group.id] || {}} setHl={(h) => setHlAll((a) => ({ ...a, [item.group.id]: h }))} />
            </div>
            <div className={cx("min-h-0 flex-1 overflow-auto px-4 sm:px-8 py-6", tab === "question" ? "block" : "hidden lg:block")}>
              {question}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto px-4 sm:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-5">
              <AudioPlayer item={item.group} practice={practice} played={!!played[item.group.id]} rate={rate} compact={groupPlayed} autoPlay={!practice}
                onPlayed={() => dispatch({ type: "PLAYED", id: item.group.id })} onStatus={setAudioStatus} />
              {!groupPlayed ? (
                <div className="rounded-2xl border border-dashed border-line p-5 text-center text-muted">
                  <p>Soal akan muncul setelah audio selesai diputar. Timer menjawab berhenti selama audio berjalan.</p>
                  {practice && <Btn v="ghost" className="mt-3" icon="Eye" onClick={() => dispatch({ type: "REVEAL", id: item.group.id })}>Tampilkan soal tanpa audio</Btn>}
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-paper p-4 sm:p-6">
                  {question}
                  {practice && checked[item.qid] && (
                    <div className="mt-4">
                      <Btn v="secondary" icon="FileText" onClick={() => setTxOpen((v) => !v)}>{txOpen ? "Sembunyikan Transkrip" : "Transkrip Audio"}</Btn>
                      {txOpen && <div className="mt-3 rounded-2xl border border-line p-4 bg-surface"><Transcript script={item.group.script} speakers={item.group.speakers} /></div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="no-print border-t border-line bg-paper px-3 sm:px-5 py-2.5 flex items-center gap-2">
        <Btn v="secondary" icon="ChevronLeft" onClick={() => go(-1)} disabled={idx === 0}>Back</Btn>
        <span className="hidden md:inline text-[13px] text-muted ml-2 mr-auto"><Icon name="Keyboard" size={14} className="inline -mt-0.5 mr-1" />A–D pilih · ←/→ pindah · F tandai</span>
        <span className="md:hidden mr-auto" />
        {last
          ? <Btn v="primary" iconRight="CircleCheck" onClick={() => setConfirm(true)}>Selesai section</Btn>
          : <Btn v="primary" iconRight="ChevronRight" onClick={() => go(1)}>Next</Btn>}
      </footer>

      <Modal open={confirm} title={"Akhiri section " + SECTION_META[section].label + "?"} onClose={() => setConfirm(false)}
        actions={<><Btn onClick={() => setConfirm(false)}>Kembali</Btn><Btn v="primary" onClick={() => finish(false)}>Ya, kirim jawaban</Btn></>}>
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="rounded-xl bg-surface p-3"><p className="font-display text-2xl font-bold tabular-nums">{items.length - unanswered}</p><p className="text-[13px] text-muted">Dijawab</p></div>
          <div className="rounded-xl bg-surface p-3"><p className={cx("font-display text-2xl font-bold tabular-nums", unanswered ? "text-bad" : "")}>{unanswered}</p><p className="text-[13px] text-muted">Kosong</p></div>
          <div className="rounded-xl bg-surface p-3"><p className="font-display text-2xl font-bold tabular-nums">{flaggedN}</p><p className="text-[13px] text-muted">Ditandai</p></div>
        </div>
        <p className="text-muted">Setelah dikirim, jawaban section ini tidak dapat diubah. Sisa waktu: <b className="text-ink tabular-nums">{fmtTime(left)}</b>.</p>
      </Modal>
    </div>
  );
}

/* ============================================================
   SPEAKING
   ============================================================ */
/* ---------- Speaking ---------- */
function SampleSpeaker({ text, label = "Dengarkan contoh" }) {
  const [on, setOn] = useState(false);
  const ctl = useRef(null);
  useEffect(() => () => { if (ctl.current) ctl.current.cancel(); }, []);
  if (!TTS.supported) return null;
  return on
    ? <Btn v="secondary" icon="Square" onClick={() => { ctl.current && ctl.current.cancel(); setOn(false); }}>Stop</Btn>
    : <Btn v="secondary" icon="Volume2" onClick={() => { audioCtx(); setOn(true); ctl.current = TTS.play([{ s: "W", t: text }], { W: { gender: "F" } }, { onEnd: () => setOn(false) }); }}>{label}</Btn>;
}

function KeywordChips({ keywords, text }) {
  const low = (text || "").toLowerCase();
  return (
    <div className="flex flex-wrap gap-1.5">
      {keywords.map((k) => <Pill key={k} tone={low.includes(k.toLowerCase()) ? "ok" : "muted"}>{low.includes(k.toLowerCase()) ? <Icon name="Check" size={12} stroke={3} /> : null}{k}</Pill>)}
    </div>
  );
}

function RubricPicker({ value = {}, onChange }) {
  return (
    <div className="space-y-3">
      {SPEAK_RUBRIC.map((r) => (
        <div key={r.key} className="flex flex-col gap-1.5">
          <div><p className="font-semibold text-[15px] leading-tight">{r.label}</p><p className="text-[13px] text-muted">{r.hint}</p></div>
          <div className="flex gap-1" role="radiogroup" aria-label={r.label}>
            {[0, 1, 2, 3, 4].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={value[r.key] === n} onClick={() => onChange({ ...value, [r.key]: n })}
                className={cx("w-10 h-10 rounded-lg border font-display font-bold tabular-nums", value[r.key] === n ? "bg-book text-white border-book" : "bg-paper border-line hover:border-book")}>{n}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpeakingReview({ task, data = {}, url, onRubric }) {
  const text = data.transcript || data.typed || "";
  const score = speakingTaskScore(data);
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <p className="font-display font-bold mb-2">Rekaman Anda</p>
          {url ? <audio controls src={url} className="w-full" /> : <p className="text-[14px] text-muted">Tidak ada rekaman audio pada sesi ini (mikrofon tidak tersedia atau rekaman sudah dibersihkan).</p>}
          <p className="font-display font-bold mt-4 mb-1">Transkrip otomatis</p>
          <p className={cx("text-[15px] leading-relaxed rounded-xl bg-surface p-3 min-h-16", text ? "" : "text-muted")}>{text || "Belum ada transkrip. Speech recognition membutuhkan Chrome/Edge dengan izin mikrofon."}</p>
          <p className="text-[13px] text-muted mt-1 tabular-nums">{countWords(text)} kata{data.auto ? " · target ±" + data.auto.expected + " kata" : ""}</p>
        </div>
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <p className="font-display font-bold">Penilaian</p>
            <p className="font-display font-bold text-2xl tabular-nums">{score === null ? "–" : score.toFixed(1)}<span className="text-[15px] text-muted">/4</span></p>
          </div>
          <p className="text-[13px] text-muted mb-3">{data.auto ? "Estimasi otomatis " + data.auto.score.toFixed(1) + "/4 (panjang jawaban + cakupan poin kunci). " : ""}Nilai diri Anda dengan rubrik ETS di bawah untuk estimasi yang lebih akurat.</p>
          <RubricPicker value={data.rubric || {}} onChange={(r) => onRubric && onRubric(r)} />
        </div>
      </div>
      <div className="rounded-2xl border border-line p-4 bg-paper">
        <p className="font-display font-bold mb-2">Cakupan poin kunci</p>
        <KeywordChips keywords={task.keywords} text={text} />
      </div>
      <div className="rounded-2xl border-2 border-ok/50 bg-oksoft p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="font-display font-bold">Sample High-Scoring Response <Pill tone="ok">4/4</Pill></p>
          <SampleSpeaker text={task.sample} />
        </div>
        <p className="font-serif text-[16.5px] leading-[1.75]">{task.sample}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <p className="font-display font-bold mb-2 flex items-center gap-2"><Icon name="Layers" size={18} />Kerangka jawaban</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[15px]">{task.structure.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <p className="font-display font-bold mb-2 flex items-center gap-2"><Icon name="CircleAlert" size={18} />Jebakan umum</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[15px]">{task.pitfalls.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>
      {task.kind === "integrated" && (
        <details className="rounded-2xl border border-line p-4 bg-paper">
          <summary className="font-display font-bold cursor-pointer">Bacaan & transkrip audio</summary>
          <p className="font-semibold mt-3">{task.reading.title}</p>
          <p className="font-serif text-[15.5px] leading-relaxed mt-1 mb-4">{task.reading.text}</p>
          <Transcript script={task.listening.script} speakers={task.listening.speakers} />
        </details>
      )}
    </div>
  );
}

function SpeakingSection({ tasks, mode, sess, dispatch, recordings, onFinish, onExit, step }) {
  const { toast } = React.useContext(AppCtx);
  const practice = mode === "practice";
  const [ti, setTi] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState("");
  const [audioDone, setAudioDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const rec = useRecorder();
  const task = tasks[ti];
  const integrated = task.kind === "integrated";
  const durations = { reading: integrated ? task.reading.time : 0, prep: task.prepTime, speak: task.speakTime };
  const timed = phase === "reading" || phase === "prep" || phase === "speak";
  const [left, setLeft] = useCountdown(durations[phase] || 0, timed && !paused, () => onExpire(), ti + "-" + attempt + "-" + phase);

  function onExpire() {
    if (phase === "reading") setPhase("listening");
    else if (phase === "prep") startSpeak();
    else if (phase === "speak") endSpeak();
  }
  function startSpeak() { beep(880, 0.32); setPhase("speak"); }
  async function endSpeak() {
    beep(520, 0.4);
    setPhase("saving");
    const { url, transcript } = await rec.stop();
    const text = transcript || typed;
    if (recordings.current[task.id] && recordings.current[task.id] !== url) { try { URL.revokeObjectURL(recordings.current[task.id]); } catch (e) {} }
    if (url) recordings.current[task.id] = url;
    dispatch({ type: "SPEAK", id: task.id, data: { transcript, typed, auto: speakingAuto(task, text) } });
    if (practice) setPhase("review");
    else nextTask();
  }
  function nextTask() {
    if (ti < tasks.length - 1) { setTi(ti + 1); setPhase("intro"); setTyped(""); setAudioDone(false); setPaused(false); }
    else onFinish({});
  }
  useEffect(() => { if (phase === "speak") rec.start(); }, [phase, ti, attempt]);
  useEffect(() => () => { rec.cleanup(); try { window.speechSynthesis.cancel(); } catch (e) {} }, []);

  const begin = () => { audioCtx(); setPhase(integrated ? "reading" : "prep"); };
  const recording = rec.st.status === "recording";
  const nomic = rec.st.status === "nomic";
  const onUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    recordings.current[task.id] = url;
    toast("Rekaman diunggah. Bisa diputar di pembahasan.", "ok");
  };

  const PhaseDots = () => {
    const list = integrated ? ["reading", "listening", "prep", "speak"] : ["prep", "speak"];
    const names = { reading: "Membaca", listening: "Mendengar", prep: "Persiapan", speak: "Berbicara" };
    const cur = list.indexOf(phase);
    return (
      <ol className="flex flex-wrap gap-2 text-[13px] font-semibold">
        {list.map((p, i) => (
          <li key={p} className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 border", i === cur ? "bg-book text-white border-book" : i < cur || phase === "review" ? "bg-oksoft border-ok/40 text-ok" : "bg-paper border-line text-muted")}>{i + 1}. {names[p]}</li>
        ))}
      </ol>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ExamBar section="speaking" mode={mode} step={(step ? step + " · " : "") + "Task " + (ti + 1) + "/" + tasks.length}
        left={timed ? left : undefined} warnAt={10} paused={paused} onPause={timed ? () => setPaused((p) => !p) : null} onExit={onExit}
        onFinish={practice ? () => setConfirm(true) : null} finishLabel="Akhiri latihan" />
      <div className="relative flex-1 min-h-0 overflow-auto">
        {paused && timed && <PausedCover onResume={() => setPaused(false)} />}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-book">{integrated ? "Integrated Speaking" + (task.subtype === "campus" ? " · Campus" : " · Academic") : "Independent Speaking"}</p>
              <h2 className="font-display text-[26px] font-bold leading-tight">{task.title}</h2>
            </div>
            {phase !== "intro" && <PhaseDots />}
          </div>

          {phase === "intro" && (
            <div className="rounded-2xl border border-line bg-paper p-5 space-y-4">
              <p className="text-[16px] leading-relaxed">
                {integrated
                  ? "Anda akan membaca teks singkat (" + task.reading.time + " detik), mendengarkan " + (task.subtype === "campus" ? "percakapan" : "kuliah") + ", lalu menjawab pertanyaan. Persiapan " + task.prepTime + " detik, berbicara " + task.speakTime + " detik."
                  : "Baca pertanyaan, siapkan jawaban selama " + task.prepTime + " detik, lalu bicara selama " + task.speakTime + " detik setelah bunyi beep."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                {integrated && <div className="rounded-xl bg-surface p-3"><p className="font-display text-xl font-bold tabular-nums">{task.reading.time}s</p><p className="text-[13px] text-muted">Membaca</p></div>}
                <div className="rounded-xl bg-surface p-3"><p className="font-display text-xl font-bold tabular-nums">{task.prepTime}s</p><p className="text-[13px] text-muted">Persiapan</p></div>
                <div className="rounded-xl bg-surface p-3"><p className="font-display text-xl font-bold tabular-nums">{task.speakTime}s</p><p className="text-[13px] text-muted">Berbicara</p></div>
              </div>
              {IN_FRAME && <p className="text-[14px] rounded-xl bg-warnsoft border border-warn/40 p-3"><b>Catatan:</b> jika aplikasi dibuka di dalam pratinjau (iframe), browser bisa memblokir mikrofon. Buka file HTML langsung di Chrome/Edge untuk merekam & transkrip otomatis. Tanpa mikrofon, Anda tetap bisa mengetik poin jawaban.</p>}
              <Btn v="primary" icon="Play" onClick={begin}>Mulai task</Btn>
            </div>
          )}

          {phase === "reading" && (
            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-7">
              <p className="text-[13px] font-semibold text-muted mb-1">Reading time</p>
              <h3 className="font-serif text-[22px] font-semibold mb-3">{task.reading.title}</h3>
              <p className="font-serif text-[17.5px] leading-[1.8]">{task.reading.text}</p>
              {practice && <Btn v="ghost" className="mt-4" iconRight="ChevronRight" onClick={() => setPhase("listening")}>Lanjut sekarang</Btn>}
            </div>
          )}

          {phase === "listening" && (
            <div className="space-y-4">
              <AudioPlayer item={{ id: task.id + "-l", kind: task.subtype === "campus" ? "conversation" : "lecture", context: task.listening.context, script: task.listening.script, speakers: task.listening.speakers }}
                practice={practice} played={audioDone} autoPlay={!practice} onPlayed={() => { setAudioDone(true); if (!practice) setTimeout(() => setPhase("prep"), 1200); }} />
              {(practice || audioDone) && <Btn v="primary" iconRight="ChevronRight" onClick={() => setPhase("prep")} disabled={!audioDone && !practice}>Lanjut ke pertanyaan</Btn>}
            </div>
          )}

          {(phase === "prep" || phase === "speak" || phase === "saving") && (
            <div className="rounded-2xl border border-line bg-paper overflow-hidden">
              <div className={cx("px-5 py-4 flex flex-wrap items-center gap-3", phase === "speak" ? "bg-mark text-white" : "bg-book text-white")}>
                <Icon name={phase === "speak" ? "Mic" : "Timer"} size={22} />
                <p className="font-display font-bold text-lg mr-auto">{phase === "prep" ? "Preparation Time" : phase === "speak" ? "Speaking Time" : "Menyimpan jawaban…"}</p>
                {phase !== "saving" && <p className="font-display font-bold text-3xl tabular-nums">{fmtTime(left)}</p>}
              </div>
              <div className="h-1.5 bg-surface"><div className="h-full bg-ink/70 transition-[width] duration-1000 ease-linear" style={{ width: (phase === "saving" ? 100 : 100 - (left / (durations[phase] || 1)) * 100) + "%" }} /></div>
              <div className="p-5 space-y-4">
                <p className="text-[18px] font-semibold leading-snug text-balance">{task.prompt}</p>
                {phase === "prep" && practice && <Btn v="soft" icon="Mic" onClick={startSpeak}>Mulai bicara sekarang</Btn>}
                {phase === "speak" && (
                  <div className="space-y-3">
                    {recording && (
                      <div className="flex items-center gap-3 rounded-xl bg-badsoft border border-bad/30 px-4 py-3">
                        <span className="w-3 h-3 rounded-full bg-bad pulse-soft" />
                        <span className="font-semibold">Merekam…</span>
                        <div className="flex-1"><Wave active bars={18} /></div>
                      </div>
                    )}
                    {rec.st.status === "starting" && <p className="text-muted">Meminta izin mikrofon…</p>}
                    {recording && (rec.st.transcript || rec.st.interim) && (
                      <p className="text-[15px] leading-relaxed rounded-xl bg-surface p-3">{rec.st.transcript}<span className="text-muted">{rec.st.interim}</span></p>
                    )}
                    {recording && !rec.st.srOk && <p className="text-[13px] text-muted">Speech recognition tidak tersedia di browser ini; audio tetap direkam.</p>}
                    {(nomic || (recording && rec.st.srError)) && (
                      <div className="rounded-xl bg-warnsoft border border-warn/40 p-3 space-y-2">
                        <p className="text-[14px]"><b>{nomic ? "Mikrofon tidak tersedia" : "Transkrip otomatis gagal"}</b> ({nomic ? rec.st.error : rec.st.srError}). Bicaralah tetap sesuai waktu, lalu ketik poin jawaban Anda di bawah agar bisa dinilai otomatis.</p>
                        <textarea value={typed} onChange={(e) => setTyped(e.target.value)} rows={4} placeholder="Ketik ringkasan jawaban Anda dalam bahasa Inggris…"
                          className="w-full rounded-xl border border-line bg-paper p-3 text-[16px]" />
                        {nomic && <label className="inline-flex items-center gap-2 text-[14px] font-semibold cursor-pointer"><Icon name="Upload" size={16} />Unggah rekaman (opsional)<input type="file" accept="audio/*" className="sr-only" onChange={onUpload} /></label>}
                      </div>
                    )}
                    <Btn v="secondary" icon="Square" onClick={endSpeak}>Selesai bicara</Btn>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === "review" && (
            <div className="space-y-4">
              <SpeakingReview task={task} data={sess.speaking[task.id]} url={recordings.current[task.id]}
                onRubric={(r) => dispatch({ type: "SPEAK", id: task.id, data: { rubric: r } })} />
              <div className="flex flex-wrap gap-2">
                <Btn v="secondary" icon="RotateCcw" onClick={() => { setAttempt((a) => a + 1); setPhase("intro"); setTyped(""); setAudioDone(false); }}>Ulangi task</Btn>
                <Btn v="primary" iconRight="ChevronRight" onClick={nextTask}>{ti < tasks.length - 1 ? "Task berikutnya" : "Lihat laporan"}</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal open={confirm} title="Akhiri latihan Speaking?" onClose={() => setConfirm(false)}
        actions={<><Btn onClick={() => setConfirm(false)}>Kembali</Btn><Btn v="primary" onClick={() => { setConfirm(false); rec.cleanup(); onFinish({}); }}>Ya, lihat laporan</Btn></>}>
        Task yang belum dikerjakan akan dihitung kosong di laporan.
      </Modal>
    </div>
  );
}

/* ============================================================
   WRITING
   ============================================================ */
/* ---------- Writing ---------- */
function Editor({ value, onChange, minWords, maxWords, disabled }) {
  const { toast } = React.useContext(AppCtx);
  const ta = useRef(null);
  const hist = useRef({ stack: [value || ""], i: 0, t: 0 });
  const clip = useRef("");
  const [showCount, setShowCount] = useState(true);
  const words = countWords(value);

  const setSel = (s, e) => requestAnimationFrame(() => { const el = ta.current; if (el) { el.focus(); try { el.setSelectionRange(s, e === undefined ? s : e); } catch (x) {} } });
  const commit = (text, force) => {
    const h = hist.current; const now = Date.now();
    if (!force && now - h.t < 800 && h.i === h.stack.length - 1 && h.i > 0) h.stack[h.i] = text;
    else { h.stack = h.stack.slice(0, h.i + 1); h.stack.push(text); h.i = h.stack.length - 1; }
    h.t = force ? 0 : now;
    onChange(text);
  };
  const undo = () => { const h = hist.current; if (h.i > 0) { h.i--; h.t = 0; onChange(h.stack[h.i]); } };
  const redo = () => { const h = hist.current; if (h.i < h.stack.length - 1) { h.i++; h.t = 0; onChange(h.stack[h.i]); } };
  const sel = () => { const el = ta.current; return el ? [el.selectionStart, el.selectionEnd] : [0, 0]; };
  const writeSys = (t) => { try { navigator.clipboard && navigator.clipboard.writeText(t).catch(() => {}); } catch (e) {} };
  const cut = () => {
    const [s, e] = sel();
    if (s === e) { toast("Pilih teks terlebih dulu."); return; }
    clip.current = value.slice(s, e); writeSys(clip.current);
    commit(value.slice(0, s) + value.slice(e), true); setSel(s);
  };
  const copy = () => {
    const [s, e] = sel();
    if (s === e) { toast("Pilih teks terlebih dulu."); return; }
    clip.current = value.slice(s, e); writeSys(clip.current); toast("Teks disalin.", "ok"); setSel(s, e);
  };
  const paste = () => {
    if (!clip.current) { toast("Clipboard ujian kosong. Gunakan Cut/Copy dulu.", "warn"); return; }
    const [s, e] = sel();
    commit(value.slice(0, s) + clip.current + value.slice(e), true); setSel(s + clip.current.length);
  };
  const onKey = (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    else if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
  };
  const onClipEvt = () => { const [s, e] = sel(); if (e > s) clip.current = value.slice(s, e); };
  const tone = words === 0 ? "text-muted" : words < minWords ? "text-warn" : maxWords && words > maxWords + 75 ? "text-warn" : "text-ok";
  const tools = [["Scissors", "Cut", cut], ["Copy", "Copy", copy], ["ClipboardPaste", "Paste", paste], ["Undo2", "Undo", undo], ["Redo2", "Redo", redo]];

  return (
    <div className="flex flex-col min-h-0 h-full rounded-2xl border border-line bg-paper overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-2 border-b border-line bg-surface">
        {tools.map(([ic, l, fn]) => (
          <button key={l} type="button" onMouseDown={(e) => e.preventDefault()} onClick={fn} disabled={disabled}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-line bg-paper text-[14px] font-semibold hover:border-book disabled:opacity-40">
            <Icon name={ic} size={16} /><span className="hidden sm:inline">{l}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {showCount && <span className={cx("font-display font-bold tabular-nums text-[15px] whitespace-nowrap", tone)}>Word Count: {words}</span>}
          <button type="button" onClick={() => setShowCount((v) => !v)} className="inline-flex items-center gap-1 h-10 px-2.5 rounded-lg text-[13px] font-semibold text-muted hover:text-ink">
            <Icon name={showCount ? "EyeOff" : "Eye"} size={16} />{showCount ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <textarea ref={ta} id="essay-editor" value={value} disabled={disabled} spellCheck={false} onKeyDown={onKey} onCopy={onClipEvt} onCut={onClipEvt}
        onChange={(e) => commit(e.target.value)} placeholder="Type your response here…"
        className="ruled flex-1 min-h-[300px] w-full resize-none bg-transparent px-5 font-serif text-[17px] text-ink focus:outline-none" />
      <div className="px-4 py-2 border-t border-line text-[13px] text-muted">
        Target: {maxWords ? minWords + "–" + maxWords : minWords + "+"} kata · Paste hanya memakai clipboard ujian (seperti tes asli)
      </div>
    </div>
  );
}

function WritingReview({ task, data = {}, onChecks }) {
  const text = data.text || "";
  const auto = data.auto || writingAuto(task, text);
  const rubric = WRITE_RUBRIC[task.kind];
  const checks = data.checks || rubric.map(() => false);
  const score = writingTaskScore({ ...data, auto });
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <p className="font-display font-bold">Jawaban Anda</p>
            <span className="text-[13px] text-muted tabular-nums">{auto.words} kata · {auto.sentences} kalimat · {auto.trans} transisi</span>
          </div>
          <div className={cx("font-serif text-[16px] leading-[1.75] whitespace-pre-wrap rounded-xl bg-surface p-3 max-h-80 overflow-auto", text ? "" : "text-muted")}>{text || "(kosong)"}</div>
          <p className="font-display font-bold mt-4 mb-2">Cakupan poin kunci</p>
          <KeywordChips keywords={task.keywords} text={text} />
        </div>
        <div className="rounded-2xl border border-line p-4 bg-paper">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <p className="font-display font-bold">Self-Assessment Rubric</p>
            <p className="font-display font-bold text-2xl tabular-nums">{score.toFixed(1)}<span className="text-[15px] text-muted">/5</span></p>
          </div>
          <p className="text-[13px] text-muted mb-3">Estimasi otomatis {auto.score.toFixed(1)}/5. Centang yang benar-benar terpenuhi; skor akhir = 50% otomatis + 50% rubrik.</p>
          <ul className="space-y-2">
            {rubric.map((r, i) => (
              <li key={i}>
                <label className="flex gap-3 items-start cursor-pointer text-[15px] leading-snug">
                  <input type="checkbox" checked={!!checks[i]} onChange={(e) => { const n = checks.slice(); n[i] = e.target.checked; onChecks && onChecks(n); }}
                    className="mt-0.5 w-5 h-5 accent-[var(--book)] shrink-0" />
                  <span>{r}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-ok/50 bg-oksoft p-4 sm:p-5">
        <p className="font-display font-bold mb-2">Sample High-Scoring Essay <Pill tone="ok">5/5</Pill> <span className="text-[13px] text-muted font-normal tabular-nums">{countWords(task.sample)} kata</span></p>
        {task.sample.split("\n\n").map((p, i) => <p key={i} className="font-serif text-[16.5px] leading-[1.75] mb-3 last:mb-0">{p}</p>)}
      </div>
      <div className="rounded-2xl border border-line p-4 bg-paper">
        <p className="font-display font-bold mb-2 flex items-center gap-2"><Icon name="Lightbulb" size={18} />Analisis poin utama</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[15px]">{task.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
      </div>
      {task.kind === "integrated" && (
        <details className="rounded-2xl border border-line p-4 bg-paper">
          <summary className="font-display font-bold cursor-pointer">Bacaan & transkrip ceramah</summary>
          <p className="font-semibold mt-3">{task.reading.title}</p>
          {task.reading.paragraphs.map((p, i) => <p key={i} className="font-serif text-[15.5px] leading-relaxed mt-2">{p}</p>)}
          <div className="mt-4"><Transcript script={task.lecture.script} speakers={task.lecture.speakers} /></div>
        </details>
      )}
    </div>
  );
}

function DiscussionBoard({ task }) {
  const Avatar = ({ n, prof }) => (
    <span className={cx("inline-flex w-10 h-10 shrink-0 rounded-full items-center justify-center font-display font-bold", prof ? "bg-book text-white" : "bg-surface border border-line")}>{n.replace("Dr. ", "")[0]}</span>
  );
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex items-center gap-3 mb-2"><Avatar n={task.professor.name} prof /><div><p className="font-semibold leading-tight">{task.professor.name}</p><p className="text-[13px] text-muted">{task.course} · Professor</p></div></div>
        <p className="text-[16px] leading-relaxed">{task.professor.post}</p>
      </div>
      {task.students.map((s) => (
        <div key={s.name} className="rounded-2xl border border-line bg-surface p-4 ml-3 sm:ml-6">
          <div className="flex items-center gap-3 mb-2"><Avatar n={s.name} /><p className="font-semibold">{s.name}</p></div>
          <p className="text-[16px] leading-relaxed">{s.post}</p>
        </div>
      ))}
    </div>
  );
}

function WritingSection({ tasks, mode, sess, dispatch, onFinish, onExit, step }) {
  const { toast } = React.useContext(AppCtx);
  const practice = mode === "practice";
  const [ti, setTi] = useState(0);
  const task = tasks[ti];
  const integrated = task.kind === "integrated";
  const [phase, setPhase] = useState("intro");
  const [paused, setPaused] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [lectureDone, setLectureDone] = useState(false);
  const [notes, setNotes] = useState("");
  const [showReading, setShowReading] = useState(true);
  const dur = { reading: 180, write: task.time }[phase] || 0;
  const timed = phase === "reading" || phase === "write";
  const [left] = useCountdown(dur, timed && !paused, () => {
    if (phase === "reading") setPhase("lecture");
    else if (phase === "write") { toast("Waktu habis. Respons dikirim otomatis.", "warn"); submit(); }
  }, ti + "-" + phase);
  const data = sess.writing[task.id] || {};
  const text = data.text || "";

  function submit() {
    setConfirm(false);
    dispatch({ type: "WRITE", id: task.id, data: { auto: writingAuto(task, text) } });
    if (practice) setPhase("review"); else next();
  }
  function next() {
    if (ti < tasks.length - 1) { setTi(ti + 1); setPhase("intro"); setLectureDone(false); setNotes(""); setPaused(false); }
    else onFinish({});
  }
  useEffect(() => () => { try { window.speechSynthesis.cancel(); } catch (e) {} }, []);
  const begin = () => { audioCtx(); setPhase(integrated ? "reading" : "write"); };

  return (
    <div className="h-full flex flex-col">
      <ExamBar section="writing" mode={mode} step={(step ? step + " · " : "") + "Task " + (ti + 1) + "/" + tasks.length}
        left={timed ? left : undefined} paused={paused} onPause={timed ? () => setPaused((p) => !p) : null} onExit={onExit}
        onFinish={phase === "write" ? () => setConfirm(true) : null} finishLabel="Kirim respons" />
      <div className="relative flex-1 min-h-0">
        {paused && timed && <PausedCover onResume={() => setPaused(false)} />}

        {phase === "intro" && (
          <div className="h-full overflow-auto"><div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
            <p className="text-[13px] font-semibold text-book">{integrated ? "Integrated Writing" : "Writing for an Academic Discussion"}</p>
            <h2 className="font-display text-[28px] font-bold leading-tight">{task.title}</h2>
            <div className="rounded-2xl border border-line bg-paper p-5 space-y-3 text-[16px] leading-relaxed">
              {integrated ? (
                <>
                  <p>Anda punya <b>3 menit</b> untuk membaca teks. Teks lalu disembunyikan selama ceramah diputar (catat poin penting di kolom catatan). Setelah itu Anda punya <b>20 menit</b> untuk menulis 150–225 kata; teks bacaan tampil kembali.</p>
                  <p className="text-muted">Tugas: rangkum poin-poin ceramah dan jelaskan bagaimana poin itu membantah poin bacaan. Jangan beri opini pribadi.</p>
                </>
              ) : (
                <>
                  <p>Seorang profesor mengajukan pertanyaan di forum kelas dan dua mahasiswa sudah menjawab. Tulis kontribusi Anda dalam <b>10 menit</b>, minimal <b>100 kata</b>.</p>
                  <p className="text-muted">Respons yang efektif menyatakan pendapat dengan jelas dan menambahkan ide baru yang didukung alasan atau contoh.</p>
                </>
              )}
            </div>
            <Btn v="primary" icon="Play" onClick={begin}>Mulai task</Btn>
          </div></div>
        )}

        {phase === "reading" && (
          <div className="h-full overflow-auto"><div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
            <p className="text-[13px] font-semibold text-muted">Reading time · 3 menit</p>
            <h2 className="font-serif text-[25px] font-semibold leading-tight mb-4">{task.reading.title}</h2>
            {task.reading.paragraphs.map((p, i) => <p key={i} className="font-serif text-[17.5px] leading-[1.8] mb-4">{p}</p>)}
            {practice && <Btn v="ghost" iconRight="ChevronRight" onClick={() => setPhase("lecture")}>Lanjut ke ceramah</Btn>}
          </div></div>
        )}

        {phase === "lecture" && (
          <div className="h-full overflow-auto"><div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            <AudioPlayer item={{ id: task.id + "-lec", kind: "lecture", context: task.lecture.context, script: task.lecture.script, speakers: task.lecture.speakers }}
              practice={practice} played={lectureDone} autoPlay={!practice} onPlayed={() => { setLectureDone(true); if (!practice) setTimeout(() => setPhase((ph) => (ph === "lecture" ? "write" : ph)), 1500); }} />
            <label className="block">
              <span className="font-semibold text-[15px]">Catatan Anda</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="energy → ... / safety → ... / economy → ..."
                className="mt-1 w-full rounded-xl border border-line bg-paper p-3 text-[16px]" />
            </label>
            <Btn v="primary" iconRight="ChevronRight" disabled={!lectureDone && !practice} onClick={() => setPhase("write")}>Mulai menulis</Btn>
          </div></div>
        )}

        {phase === "write" && (
          <div className="h-full overflow-auto lg:overflow-hidden grid lg:grid-cols-2 lg:min-h-0">
            <div className={cx("min-h-0 overflow-auto px-4 sm:px-6 py-5 border-b lg:border-b-0 lg:border-r border-line", !showReading ? "hidden lg:block" : "")}>
              {integrated ? (
                <>
                  <p className="text-[15px] font-semibold mb-3 rounded-xl bg-booksoft p-3">{task.prompt}</p>
                  <h3 className="font-serif text-[21px] font-semibold mb-2">{task.reading.title}</h3>
                  {task.reading.paragraphs.map((p, i) => <p key={i} className="font-serif text-[16px] leading-[1.75] mb-3">{p}</p>)}
                  {notes && <div className="mt-4 rounded-xl border border-dashed border-line p-3"><p className="text-[13px] font-semibold text-muted mb-1">Catatan ceramah</p><p className="whitespace-pre-wrap text-[15px]">{notes}</p></div>}
                </>
              ) : <DiscussionBoard task={task} />}
            </div>
            <div className="min-h-0 flex flex-col p-3 sm:p-5 gap-3">
              <button type="button" className="lg:hidden self-start text-[14px] font-semibold text-book" onClick={() => setShowReading((v) => !v)}>{showReading ? "Sembunyikan " : "Tampilkan "}{integrated ? "bacaan" : "diskusi"}</button>
              <div className="flex-1 min-h-[340px]">
                <Editor key={task.id} value={text} onChange={(t) => dispatch({ type: "WRITE", id: task.id, data: { text: t } })} minWords={task.minWords} maxWords={task.maxWords} />
              </div>
              <div className="flex justify-end"><Btn v="primary" iconRight="Send" onClick={() => setConfirm(true)}>Kirim respons</Btn></div>
            </div>
          </div>
        )}

        {phase === "review" && (
          <div className="h-full overflow-auto"><div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            <h2 className="font-display text-[26px] font-bold">Pembahasan: {task.title}</h2>
            <WritingReview task={task} data={sess.writing[task.id]} onChecks={(c) => dispatch({ type: "WRITE", id: task.id, data: { checks: c } })} />
            <div className="flex flex-wrap gap-2">
              <Btn v="primary" iconRight="ChevronRight" onClick={next}>{ti < tasks.length - 1 ? "Task berikutnya" : "Lihat laporan"}</Btn>
            </div>
          </div></div>
        )}
      </div>
      <Modal open={confirm} title="Kirim respons?" onClose={() => setConfirm(false)}
        actions={<><Btn onClick={() => setConfirm(false)}>Kembali menulis</Btn><Btn v="primary" onClick={submit}>Ya, kirim</Btn></>}>
        <p>Jumlah kata saat ini: <b className="tabular-nums">{countWords(text)}</b> (target {task.maxWords ? task.minWords + "–" + task.maxWords : task.minWords + "+"}). Sisa waktu <b className="tabular-nums">{fmtTime(left)}</b>.</p>
      </Modal>
    </div>
  );
}

/* ============================================================
   DASHBOARD, SIMULASI, SCORE REPORT, APP
   ============================================================ */
/* ---------- Session reducer ---------- */
function newSession(mode, plan, label) {
  return {
    id: uid(), mode, label, plan, sections: plan.sections, cur: 0, startedAt: new Date().toISOString(),
    answers: {}, flags: {}, checked: {}, played: {}, reveal: {}, speaking: {}, writing: {}, times: {}
  };
}
function reducer(s, a) {
  if (a.type === "LOAD") return a.session;
  if (!s) return s;
  switch (a.type) {
    case "ANSWER": return { ...s, answers: { ...s.answers, [a.qid]: a.value } };
    case "FLAG": { const f = { ...s.flags }; if (f[a.qid]) delete f[a.qid]; else f[a.qid] = true; return { ...s, flags: f }; }
    case "CHECK": return { ...s, checked: { ...s.checked, [a.qid]: true } };
    case "PLAYED": return { ...s, played: { ...s.played, [a.id]: true } };
    case "REVEAL": return { ...s, reveal: { ...s.reveal, [a.id]: true } };
    case "SPEAK": return { ...s, speaking: { ...s.speaking, [a.id]: { ...(s.speaking[a.id] || {}), ...a.data } } };
    case "WRITE": return { ...s, writing: { ...s.writing, [a.id]: { ...(s.writing[a.id] || {}), ...a.data } } };
    case "TIME": return { ...s, times: { ...s.times, [a.section]: a.value } };
    case "NEXT": return { ...s, cur: s.cur + 1 };
    default: return s;
  }
}
function simPlan() {
  const ind = shuffle(BANK.speaking.filter((t) => t.kind === "independent"))[0];
  const integ = BANK.speaking.filter((t) => t.kind === "integrated");
  const wInt = shuffle(BANK.writing.filter((t) => t.kind === "integrated"))[0];
  const wDis = shuffle(BANK.writing.filter((t) => t.kind === "discussion"))[0];
  return {
    sections: SECTIONS.slice(),
    reading: { ids: BANK.reading.map((p) => p.id), type: null, time: 27 * 60 },
    listening: { ids: BANK.listening.map((a) => a.id), type: null, time: 13 * 60 },
    speaking: { ids: [ind.id, ...integ.map((t) => t.id)] },
    writing: { ids: [wInt.id, wDis.id] }
  };
}
function buildResult(sess) {
  const p = sess.plan;
  const r = { id: sess.id, date: new Date().toISOString(), mode: sess.mode, label: sess.label, sections: sess.sections, answers: sess.answers, flags: sess.flags, mc: {} };
  if (p.sections.includes("reading")) r.mc.reading = { ids: readingItems(p.reading.ids, p.reading.type).map((i) => i.qid) };
  if (p.sections.includes("listening")) r.mc.listening = { ids: listeningItems(p.listening.ids, p.listening.type).map((i) => i.qid) };
  if (p.sections.includes("speaking")) {
    const data = {};
    p.speaking.ids.forEach((id) => { const d = sess.speaking[id]; if (d) data[id] = { transcript: d.transcript || "", typed: d.typed || "", auto: d.auto || null, rubric: d.rubric || {} }; });
    r.speaking = { taskIds: p.speaking.ids, data };
  }
  if (p.sections.includes("writing")) {
    const data = {};
    p.writing.ids.forEach((id) => {
      const d = sess.writing[id] || {}; const t = byId(BANK.writing, id);
      data[id] = { text: d.text || "", auto: d.auto || writingAuto(t, d.text || ""), checks: d.checks || null };
    });
    r.writing = { taskIds: p.writing.ids, data };
  }
  return r;
}

/* ---------- Practice setup ---------- */
function PracticeSetup({ section, onClose, onStart }) {
  const isMC = section === "reading" || section === "listening";
  const pool = section === "reading" ? BANK.reading : section === "listening" ? BANK.listening : section === "speaking" ? BANK.speaking : BANK.writing;
  const types = isMC ? Array.from(new Set(pool.flatMap((g) => g.questions.map((q) => q.type)))) : [];
  const [ids, setIds] = useState(section === "writing" ? [pool[0].id] : pool.map((x) => x.id));
  const [type, setType] = useState(null);
  const toggle = (id) => setIds((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const nQ = isMC ? (section === "reading" ? readingItems(type ? pool.map((p) => p.id) : ids, type) : listeningItems(type ? pool.map((p) => p.id) : ids, type)).length : 0;
  const time = section === "reading" ? Math.max(5, Math.round(nQ * 1.7)) : section === "listening" ? Math.max(3, Math.round(nQ * 0.9)) : 0;
  const ok = isMC ? nQ > 0 : ids.length > 0;
  const start = () => {
    const plan = { sections: [section] };
    if (isMC) plan[section] = { ids: type ? pool.map((p) => p.id) : ids, type, time: time * 60 };
    else plan[section] = { ids: pool.filter((x) => ids.includes(x.id)).map((x) => x.id) };
    onStart(plan, "Latihan " + SECTION_META[section].label + (type ? " · " + TYPE_LABEL[type] : ""));
  };
  const chip = (on) => cx("text-left rounded-xl border-2 px-3 py-2.5 transition", on ? "border-book bg-booksoft" : "border-line bg-paper hover:border-book/50");
  return (
    <Modal open title={"Section Drill: " + SECTION_META[section].label} onClose={onClose} wide
      actions={<><Btn onClick={onClose}>Batal</Btn><Btn v="primary" icon="Play" disabled={!ok} onClick={start}>Mulai latihan</Btn></>}>
      {isMC && (
        <>
          <p className="font-semibold mb-2">Latihan per tipe soal</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <button type="button" className={chip(!type)} onClick={() => setType(null)}><span className="font-semibold text-[14px]">Semua tipe</span></button>
            {types.map((t) => <button type="button" key={t} className={chip(type === t)} onClick={() => setType(t)}><span className="font-semibold text-[14px]">{TYPE_LABEL[t]}</span></button>)}
          </div>
        </>
      )}
      <p className="font-semibold mb-2">{isMC ? (type ? "Soal diambil dari semua " + (section === "reading" ? "bacaan" : "audio") : "Pilih " + (section === "reading" ? "bacaan" : "audio")) : "Pilih task"}</p>
      <div className={cx("grid sm:grid-cols-2 gap-2", isMC && type ? "opacity-40 pointer-events-none" : "")}>
        {pool.map((g, i) => (
          <button type="button" key={g.id} className={chip(ids.includes(g.id))} onClick={() => toggle(g.id)} aria-pressed={ids.includes(g.id)}>
            <span className="block text-[13px] text-muted font-semibold">{g.topic || (g.kind === "conversation" ? "Campus Conversation" : g.kind === "lecture" ? "Academic Lecture" : g.kind === "independent" ? "Independent" : g.kind === "integrated" ? "Integrated" : "Academic Discussion")}</span>
            <span className="block font-semibold text-[15px] leading-snug">{g.title}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-xl bg-surface p-3 text-[14px] flex flex-wrap gap-x-5 gap-y-1">
        {isMC && <span><b className="tabular-nums">{nQ}</b> soal</span>}
        {isMC && <span>Timer <b className="tabular-nums">{time} menit</b> (bisa dijeda)</span>}
        {!isMC && <span><b className="tabular-nums">{ids.length}</b> task dipilih</span>}
        <span>Pembahasan langsung per soal/task</span>
      </div>
    </Modal>
  );
}

/* ---------- Dashboard ---------- */
const BLUEPRINT = [
  { s: "reading", line: "4 bacaan akademik · 16 soal", time: "27 menit", note: "Split-screen, highlighter, kamus kosakata" },
  { s: "listening", line: "2 percakapan + 3 kuliah · 15 soal", time: "±13 menit menjawab", note: "Audio TTS en-US, suara pria & wanita" },
  { s: "speaking", line: "2 independent + 3 integrated", time: "4 task di simulasi", note: "Rekam, transkrip otomatis, contoh 4/4" },
  { s: "writing", line: "3 academic discussion + 2 integrated", time: "2 task di simulasi", note: "Word counter, rubrik, contoh esai" }
];

function Dashboard({ history, onSim, onPractice, onOpen, onDelete, onClear }) {
  const { theme, toggleTheme } = React.useContext(AppCtx);
  const scored = useMemo(() => history.map((r) => ({ r, s: scoreResult(r) })), [history]);
  const latest = scored.find((x) => x.s.complete) || null;
  const avg = {};
  SECTIONS.forEach((sec) => {
    const vals = scored.filter((x) => x.s.sections[sec]).slice(0, 5).map((x) => x.s.sections[sec].scaled);
    avg[sec] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  });
  const agg = {};
  history.forEach((r) => { const t = typeStats(r); Object.keys(t).forEach((k) => { agg[k] = agg[k] || { c: 0, n: 0 }; agg[k].c += t[k].c; agg[k].n += t[k].n; }); });
  const weak = Object.entries(agg).filter(([, v]) => v.n >= 1).map(([k, v]) => ({ k, acc: v.c / v.n, ...v })).sort((a, b) => a.acc - b.acc);
  const [ask, setAsk] = useState(null);

  return (
    <div className="h-full overflow-auto">
      <section className="cover text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-5 pb-10 sm:pb-14">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <span className="inline-flex w-10 h-10 rounded-xl bg-white text-[var(--cover)] items-center justify-center"><Icon name="GraduationCap" size={22} /></span>
            <span className="font-display font-bold text-lg mr-auto">iBT Simulator</span>
            <button type="button" onClick={toggleTheme} aria-label="Ganti tema" className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/12 hover:bg-white/20"><Icon name={theme === "dark" ? "Sun" : "Moon"} /></button>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="font-display font-extrabold text-[clamp(36px,5.4vw,56px)] leading-[1.03] tracking-[-0.02em] text-balance">Simulasi TOEFL iBT, empat section, skor 0–120.</h1>
              <p className="mt-4 text-[17px] text-white/85 max-w-xl">Kerjakan tes lengkap dengan timer resmi, atau latih satu section dengan pembahasan langsung dalam Bahasa Indonesia.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={onSim} className={cx(BTN, "bg-white text-[var(--cover)] hover:bg-white/90 px-5 min-h-12 text-[16px]")}><Icon name="Play" />Mulai Full Simulation</button>
                <button type="button" onClick={() => onPractice("reading")} className={cx(BTN, "border-2 border-white/60 text-white hover:bg-white/10 px-5 min-h-12 text-[16px]")}><Icon name="Target" />Section Drill</button>
              </div>
              <p className="mt-4 text-[14px] text-white/75">Simulasi penuh ±1 jam 40 menit: Reading → Listening → Speaking → Writing.</p>
            </div>
            <div className="label-card text-ink">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display font-bold text-[15px]">Skor simulasi terakhir</p>
                <p className="text-[13px] text-muted">{latest ? fmtDate(latest.r.date) : "Belum ada"}</p>
              </div>
              <div className="flex items-end gap-4 mt-2">
                <p className="font-display font-extrabold text-[clamp(64px,9vw,92px)] leading-none tabular-nums tracking-[-0.03em]">{latest ? latest.s.total : "—"}</p>
                <div className="pb-2">
                  <p className="text-muted text-[15px]">/ 120</p>
                  {latest && <Pill tone="book">CEFR {latest.s.cefr}</Pill>}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
                {SECTIONS.map((sec) => {
                  const v = latest ? latest.s.sections[sec].scaled : 0;
                  return <Bar key={sec} value={v} label={SECTION_META[sec].label} right={latest ? v + "/30" : "–"} />;
                })}
              </div>
              {!latest && <p className="mt-4 text-[14px] text-muted">Kartu ini terisi setelah simulasi penuh pertama Anda.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10">
        <h2 className="font-display text-[28px] sm:text-[32px] font-bold leading-tight mb-1">Latihan per section</h2>
        <p className="text-muted mb-6">Timer bisa dijeda, tombol cek jawaban, dan pembahasan setiap opsi.</p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {BLUEPRINT.map((b) => (
            <div key={b.s} className="rounded-2xl border border-line bg-paper p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex w-11 h-11 rounded-xl bg-booksoft text-book items-center justify-center"><Icon name={SECTION_META[b.s].icon} size={22} /></span>
                <div><p className="font-display font-bold text-[20px] leading-tight">{SECTION_META[b.s].label}</p><p className="text-[13px] text-muted">{b.time}</p></div>
              </div>
              <p className="font-semibold text-[15px]">{b.line}</p>
              <p className="text-[14px] text-muted mt-1 mb-4">{b.note}</p>
              {avg[b.s] !== null && <div className="mb-4"><Bar value={avg[b.s]} label="Rata-rata 5 sesi" right={avg[b.s] + "/30"} tone={avg[b.s] < 18 ? "warn" : "book"} /></div>}
              <Btn v="soft" className="mt-auto" iconRight="ArrowRight" onClick={() => onPractice(b.s)}>Latihan {SECTION_META[b.s].label}</Btn>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-6">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-[22px] font-bold mb-1">Kelemahan per tipe soal</h2>
            <p className="text-[14px] text-muted mb-4">Akurasi gabungan Reading & Listening dari semua sesi.</p>
            {weak.length ? (
              <div className="space-y-3">
                {weak.map((w) => <Bar key={w.k} value={w.acc * 100} max={100} label={TYPE_LABEL[w.k]} right={Math.round(w.acc * 100) + "% · " + w.c + "/" + w.n} tone={w.acc < 0.5 ? "bad" : w.acc < 0.75 ? "warn" : "ok"} />)}
                {weak[0].acc < 0.75 && <p className="text-[14px] rounded-xl bg-warnsoft border border-warn/40 p-3 mt-2"><b>Fokus berikutnya: {TYPE_LABEL[weak[0].k]}.</b> {TYPE_TIPS[weak[0].k]}</p>}
              </div>
            ) : <p className="text-muted text-[15px] rounded-xl border border-dashed border-line p-4">Belum ada data. Kerjakan Reading atau Listening untuk melihat pola kesalahan Anda.</p>}
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-[22px] font-bold">Riwayat sesi</h2>
              {history.length > 0 && <Btn v="ghost" icon="Trash2" onClick={() => setAsk("all")}>Hapus semua</Btn>}
            </div>
            {history.length ? (
              <ul className="divide-y divide-line">
                {scored.map(({ r, s }) => (
                  <li key={r.id} className="py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-0 mr-auto">
                      <p className="font-semibold leading-tight">{r.label}</p>
                      <p className="text-[13px] text-muted">{fmtDate(r.date)}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SECTIONS.filter((x) => s.sections[x]).map((x) => <Pill key={x} tone="muted">{SECTION_META[x].label[0]} {s.sections[x].scaled}</Pill>)}
                    </div>
                    <p className="font-display font-bold text-[22px] tabular-nums w-16 text-right">{s.complete ? s.total : "–"}</p>
                    <div className="flex gap-1">
                      <IconBtn icon="FileText" label="Buka laporan" onClick={() => onOpen(r.id)} />
                      <IconBtn icon="Trash2" label="Hapus sesi" onClick={() => setAsk(r.id)} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted text-[15px] rounded-xl border border-dashed border-line p-4">Riwayat tersimpan di browser ini (LocalStorage). Sesi pertama Anda akan muncul di sini.</p>}
          </div>
        </div>
      </section>
      <footer className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8 text-[13px] text-muted space-y-1">
        <p>Simulasi latihan independen, tidak berafiliasi dengan ETS. Skor Speaking/Writing adalah estimasi dari panjang jawaban, cakupan poin, dan rubrik penilaian diri.</p>
        <p>Sejak 21 Januari 2026, ETS melaporkan skor skala 1–6 dengan padanan 0–120 selama masa transisi hingga Januari 2028.</p>
      </footer>
      <Modal open={!!ask} title={ask === "all" ? "Hapus semua riwayat?" : "Hapus sesi ini?"} onClose={() => setAsk(null)}
        actions={<><Btn onClick={() => setAsk(null)}>Batal</Btn><Btn v="danger" onClick={() => { ask === "all" ? onClear() : onDelete(ask); setAsk(null); }}>Hapus</Btn></>}>
        Data yang dihapus tidak bisa dikembalikan.
      </Modal>
    </div>
  );
}

/* ---------- Simulation intro & transitions ---------- */
function SimIntro({ onStart, onCancel }) {
  const [mic, setMic] = useState(null);
  const [snd, setSnd] = useState(false);
  const testMic = async () => {
    try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop()); setMic("ok"); }
    catch (e) { setMic((e && e.name) || "error"); }
  };
  const testSound = () => { audioCtx(); beep(); setSnd(true); TTS.play([{ s: "W", t: "This is a sound check. If you can hear this, your audio is working." }], { W: { gender: "F" } }, {}); };
  const rows = [
    ["Reading", "16 soal · 4 bacaan", "27 menit"],
    ["Listening", "15 soal · 5 audio (putar 1×)", "13 menit menjawab"],
    ["Speaking", "4 task · 1 independent + 3 integrated", "±12 menit"],
    ["Writing", "Integrated + Academic Discussion", "±36 menit"]
  ];
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-muted hover:text-ink"><Icon name="ArrowLeft" size={17} />Dashboard</button>
        <h1 className="font-display text-[36px] sm:text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em]">Full iBT Simulation</h1>
        <div className="rounded-2xl border border-line bg-paper overflow-hidden">
          <table className="w-full text-[15px]">
            <thead><tr className="bg-surface text-left"><th className="p-3">Section</th><th className="p-3">Isi</th><th className="p-3 text-right">Waktu</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-line"><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3 text-right whitespace-nowrap tabular-nums">{r[2]}</td></tr>)}</tbody>
          </table>
        </div>
        <ul className="space-y-2 text-[15.5px]">
          {["Timer tidak bisa dijeda. Jika waktu habis, jawaban dikirim otomatis.", "Audio Listening hanya bisa diputar satu kali; timer menjawab berhenti selama audio berjalan.", "Pembahasan, transkrip, dan contoh jawaban baru muncul di Score Report.", "Shortcut: A–D pilih jawaban, ←/→ pindah soal, F tandai soal."].map((t) => (
            <li key={t} className="flex gap-2"><Icon name="Check" size={18} className="text-ok mt-0.5" />{t}</li>
          ))}
        </ul>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-semibold mb-2">Cek suara</p>
            <Btn v="secondary" icon="Volume2" onClick={testSound}>Putar tes suara</Btn>
            {snd && !TTS.supported && <p className="text-[14px] text-bad mt-2">Browser ini tidak mendukung text-to-speech.</p>}
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-semibold mb-2">Cek mikrofon</p>
            <Btn v="secondary" icon="Mic" onClick={testMic}>Izinkan mikrofon</Btn>
            {mic === "ok" && <p className="text-[14px] text-ok mt-2 font-semibold">Mikrofon siap.</p>}
            {mic && mic !== "ok" && <p className="text-[14px] text-bad mt-2">Mikrofon diblokir ({mic}). Speaking tetap bisa dikerjakan dengan mengetik poin jawaban.</p>}
          </div>
        </div>
        <Btn v="primary" icon="Play" className="min-h-12 px-6 text-[16px]" onClick={() => { audioCtx(); onStart(); }}>Mulai Reading</Btn>
      </div>
    </div>
  );
}

function Between({ done, next, idx, total, onNext }) {
  return (
    <div className="h-full overflow-auto flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        <span className="inline-flex w-16 h-16 rounded-2xl bg-oksoft text-ok items-center justify-center"><Icon name="CircleCheck" size={34} /></span>
        <h1 className="font-display text-[32px] font-bold leading-tight">{SECTION_META[done].label} selesai</h1>
        <p className="text-muted">Section {idx + 1} dari {total}. Berikutnya: <b className="text-ink">{SECTION_META[next].label}</b>.{next === "speaking" ? " Siapkan mikrofon dan tempat yang tenang." : ""}</p>
        <Btn v="primary" iconRight="ArrowRight" className="min-h-12 px-6" onClick={() => { audioCtx(); onNext(); }}>Lanjut ke {SECTION_META[next].label}</Btn>
      </div>
    </div>
  );
}

/* ---------- Score report ---------- */
function ScoreReport({ result, onChange, onHome, recordings }) {
  const { toast, theme, toggleTheme } = React.useContext(AppCtx);
  const sc = scoreResult(result);
  const ts = typeStats(result);
  const [filter, setFilter] = useState("all");
  const [openTx, setOpenTx] = useState({});
  useEffect(() => {
    const open = () => document.querySelectorAll("details").forEach((d) => { d.open = true; });
    window.addEventListener("beforeprint", open);
    return () => window.removeEventListener("beforeprint", open);
  }, []);
  const mcIds = [...((result.mc.reading || {}).ids || []), ...((result.mc.listening || {}).ids || [])];
  const list = mcIds.map((id) => ({ id, f: findQuestion(id) })).filter((x) => x.f).filter((x) => {
    if (filter === "wrong") return result.answers[x.id] !== x.f.q.answer;
    if (filter === "flag") return result.flags[x.id];
    return true;
  });
  const wrongN = mcIds.filter((id) => { const f = findQuestion(id); return f && result.answers[id] !== f.q.answer; }).length;
  const flagN = mcIds.filter((id) => result.flags[id]).length;
  const weak = Object.entries(ts).map(([k, v]) => ({ k, ...v, acc: v.c / v.n })).sort((a, b) => a.acc - b.acc);
  const prodWeak = ["speaking", "writing"].filter((s) => sc.sections[s] && sc.sections[s].scaled < 20);
  const single = result.sections.length === 1 ? result.sections[0] : null;

  const copySummary = async () => {
    const lines = ["TOEFL iBT Simulation — Score Report", result.label + " · " + fmtDate(result.date)];
    if (sc.complete) lines.push("Total: " + sc.total + "/120 (CEFR " + sc.cefr + ")");
    SECTIONS.forEach((s) => { const x = sc.sections[s]; if (x) lines.push(SECTION_META[s].label + ": " + x.scaled + "/30 (" + x.cefr + ")"); });
    if (weak.length) lines.push("Prioritas belajar: " + weak.slice(0, 3).map((w) => TYPE_LABEL[w.k] + " " + Math.round(w.acc * 100) + "%").join(", "));
    try { await navigator.clipboard.writeText(lines.join("\n")); toast("Ringkasan skor disalin.", "ok"); }
    catch (e) { toast("Clipboard diblokir browser.", "warn"); }
  };
  const doPrint = () => {
    try { window.print(); } catch (e) {}
    if (IN_FRAME) toast("Jika dialog cetak tidak muncul, buka file HTML langsung di browser lalu cetak.", "warn");
  };
  const setSpeak = (id, rubric) => onChange({ ...result, speaking: { ...result.speaking, data: { ...result.speaking.data, [id]: { ...(result.speaking.data[id] || {}), rubric } } } });
  const setChecks = (id, checks) => onChange({ ...result, writing: { ...result.writing, data: { ...result.writing.data, [id]: { ...result.writing.data[id], checks } } } });

  return (
    <div className="h-full overflow-auto print-flow">
      <section className="cover text-white print-plain">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-5 pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-8 no-print">
            <button type="button" onClick={onHome} className="inline-flex items-center gap-1.5 h-11 px-3 rounded-xl bg-white/12 hover:bg-white/20 font-semibold mr-auto"><Icon name="ArrowLeft" size={18} />Dashboard</button>
            <button type="button" onClick={copySummary} className="inline-flex items-center gap-1.5 h-11 px-3 rounded-xl bg-white/12 hover:bg-white/20 font-semibold"><Icon name="ClipboardCopy" size={18} /><span className="hidden sm:inline">Salin ringkasan</span></button>
            <button type="button" onClick={doPrint} className="inline-flex items-center gap-1.5 h-11 px-3 rounded-xl bg-white text-[var(--cover)] font-semibold"><Icon name="Printer" size={18} />Cetak / PDF</button>
            <button type="button" onClick={toggleTheme} aria-label="Ganti tema" className="hidden sm:inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/12 hover:bg-white/20"><Icon name={theme === "dark" ? "Sun" : "Moon"} /></button>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-8 items-end">
            <div>
              <p className="text-white/80 font-semibold">Score Report · {result.label}</p>
              <p className="text-white/70 text-[14px]">{fmtDate(result.date)}</p>
              <div className="flex items-end gap-4 mt-3">
                <p className="font-display font-extrabold leading-none tabular-nums tracking-[-0.03em] text-[clamp(84px,13vw,140px)]">{sc.complete ? sc.total : single ? sc.sections[single].scaled : "–"}</p>
                <div className="pb-3">
                  <p className="text-white/80 text-[18px]">/ {sc.complete ? 120 : 30}</p>
                  <span className="inline-flex rounded-full bg-white text-[var(--cover)] font-bold px-3 py-1 mt-1">CEFR {sc.complete ? sc.cefr : single ? sc.sections[single].cefr : "–"}</span>
                </div>
              </div>
              {sc.pending.includes("speaking") && <p className="mt-3 text-[14px] bg-white/12 rounded-xl p-3">Sebagian task Speaking belum punya transkrip. Isi rubrik penilaian diri di bawah agar skor Speaking akurat.</p>}
            </div>
            <div className="label-card text-ink grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {SECTIONS.filter((s) => sc.sections[s]).map((s) => {
                const x = sc.sections[s];
                return (
                  <div key={s}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold flex items-center gap-1.5"><Icon name={SECTION_META[s].icon} size={16} className="text-book" />{SECTION_META[s].label}</p>
                      <p className="font-display font-bold text-[26px] tabular-nums leading-none">{x.scaled}<span className="text-[14px] text-muted">/30</span></p>
                    </div>
                    <div className="mt-2"><Bar value={x.scaled} /></div>
                    <p className="text-[13px] text-muted mt-1">{s === "reading" || s === "listening" ? x.raw + "/" + x.max + " benar" : "Rata-rata task " + x.raw + "/" + x.max} · {x.cefr}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="rounded-2xl border border-line bg-paper p-5 avoid-break">
          <h2 className="font-display text-[24px] font-bold mb-1 flex items-center gap-2"><Icon name="Target" className="text-book" />Diagnostic Weakness Analyzer</h2>
          <p className="text-muted text-[14px] mb-4">Tipe soal diurutkan dari akurasi terendah.</p>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {weak.length ? weak.map((w) => <Bar key={w.k} value={w.acc * 100} max={100} label={TYPE_LABEL[w.k] + " · " + SECTION_META[w.section].label} right={w.c + "/" + w.n} tone={w.acc < 0.5 ? "bad" : w.acc < 0.75 ? "warn" : "ok"} />)
                : <p className="text-muted">Tidak ada soal pilihan ganda di sesi ini.</p>}
            </div>
            <div className="space-y-3">
              {weak.filter((w) => w.acc < 0.75).slice(0, 3).map((w) => (
                <div key={w.k} className="rounded-xl border border-line bg-surface p-3">
                  <p className="font-semibold">{TYPE_LABEL[w.k]} <span className="text-muted font-normal tabular-nums">({Math.round(w.acc * 100)}%)</span></p>
                  <p className="text-[14.5px] mt-1">{TYPE_TIPS[w.k]}</p>
                </div>
              ))}
              {prodWeak.includes("speaking") && <div className="rounded-xl border border-line bg-surface p-3"><p className="font-semibold">Speaking</p><p className="text-[14.5px] mt-1">Latih template 2 alasan + 1 contoh spesifik dan rekam diri setiap hari. Targetkan ±110 kata untuk 45 detik dan ±140 kata untuk 60 detik tanpa jeda panjang.</p></div>}
              {prodWeak.includes("writing") && <div className="rounded-xl border border-line bg-surface p-3"><p className="font-semibold">Writing</p><p className="text-[14.5px] mt-1">Integrated: petakan 3 poin bacaan vs 3 bantahan ceramah sebelum menulis. Discussion: tulis 1 kalimat posisi, 1 ide baru, 1 contoh, dan 1 tanggapan ke mahasiswa lain.</p></div>}
              {!weak.some((w) => w.acc < 0.75) && !prodWeak.length && <p className="rounded-xl bg-oksoft border border-ok/40 p-3 text-[15px]">Tidak ada kelemahan besar di sesi ini. Naikkan tantangan dengan Full Simulation tanpa jeda.</p>}
            </div>
          </div>
        </div>

        {result.speaking && (
          <div>
            <h2 className="font-display text-[24px] font-bold mb-3">Speaking: rekaman, rubrik & contoh 4/4</h2>
            <div className="space-y-3">
              {result.speaking.taskIds.map((id, i) => {
                const t = byId(BANK.speaking, id); const d = result.speaking.data[id];
                const s = speakingTaskScore(d);
                return (
                  <details key={id} className="rounded-2xl border border-line bg-paper p-4 avoid-break" open={i === 0}>
                    <summary className="cursor-pointer flex flex-wrap items-center gap-2"><span className="font-display font-bold mr-auto">{t.title}</span>{s === null ? <Pill tone="warn">Perlu dinilai</Pill> : <Pill tone="book">{s.toFixed(1)}/4</Pill>}</summary>
                    <div className="mt-4"><p className="mb-3 font-semibold">{t.prompt}</p><SpeakingReview task={t} data={d || {}} url={recordings[id]} onRubric={(r) => setSpeak(id, r)} /></div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {result.writing && (
          <div>
            <h2 className="font-display text-[24px] font-bold mb-3">Writing: esai, rubrik & contoh skor tinggi</h2>
            <div className="space-y-3">
              {result.writing.taskIds.map((id, i) => {
                const t = byId(BANK.writing, id); const d = result.writing.data[id];
                return (
                  <details key={id} className="rounded-2xl border border-line bg-paper p-4 avoid-break" open={i === 0}>
                    <summary className="cursor-pointer flex flex-wrap items-center gap-2"><span className="font-display font-bold mr-auto">{t.title}</span><Pill tone="book">{writingTaskScore(d).toFixed(1)}/5</Pill></summary>
                    <div className="mt-4"><WritingReview task={t} data={d} onChecks={(c) => setChecks(id, c)} /></div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {mcIds.length > 0 && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="font-display text-[24px] font-bold mr-auto">Review soal</h2>
              <div className="inline-flex rounded-xl border border-line bg-paper p-1 no-print" role="tablist">
                {[["all", "Semua", mcIds.length], ["wrong", "Salah", wrongN], ["flag", "Ditandai", flagN]].map(([k, l, n]) => (
                  <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
                    className={cx("h-10 px-3 rounded-lg font-semibold text-[14px]", filter === k ? "bg-book text-white" : "text-ink hover:bg-surface")}>{l} <span className="tabular-nums opacity-80">({n})</span></button>
                ))}
              </div>
            </div>
            {list.length === 0 && <p className="text-muted rounded-xl border border-dashed border-line p-5">Tidak ada soal untuk filter ini.</p>}
            <div className="space-y-4">
              {list.map(({ id, f }) => {
                const n = mcIds.indexOf(id) + 1; const q = f.q; const chosen = result.answers[id];
                return (
                  <article key={id} className="rounded-2xl border border-line bg-paper p-4 sm:p-5 avoid-break">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-display font-bold">No. {n}</span>
                      <SectionTag section={f.section} small />
                      <span className="text-[13px] text-muted truncate max-w-full">{f.group.title}</span>
                      {result.flags[id] && <Pill tone="warn"><Icon name="Flag" size={12} />Ditandai</Pill>}
                      <span className="ml-auto">{chosen === q.answer ? <Pill tone="ok">Benar</Pill> : <Pill tone="bad">{chosen === undefined ? "Kosong" : "Salah"}</Pill>}</span>
                    </div>
                    <p className="font-semibold text-[16.5px] mb-3">{q.prompt}</p>
                    <ol className="space-y-1.5">
                      {q.options.map((o, i) => (
                        <li key={i} className={cx("flex gap-2 rounded-lg px-2.5 py-1.5 text-[15px]", i === q.answer ? "bg-oksoft" : i === chosen ? "bg-badsoft" : "")}>
                          <b className="w-5 shrink-0">{LETTERS[i]}</b><span>{o}</span>
                        </li>
                      ))}
                    </ol>
                    <Explanation q={q} chosen={chosen} />
                    <div className="mt-3 no-print">
                      {f.section === "reading" ? (
                        <details><summary className="cursor-pointer text-[14px] font-semibold text-book">Lihat paragraf {q.paragraph + 1}</summary><p className="font-serif text-[15.5px] leading-relaxed mt-2 rounded-xl bg-surface p-3">{f.group.paragraphs[q.paragraph]}</p></details>
                      ) : (
                        <>
                          <Btn v="secondary" icon="FileText" onClick={() => setOpenTx((o) => ({ ...o, [id]: !o[id] }))}>{openTx[id] ? "Sembunyikan transkrip" : "Transkrip Audio"}</Btn>
                          {openTx[id] && <div className="mt-3 rounded-xl bg-surface p-4"><Transcript script={f.group.script} speakers={f.group.speakers} /></div>}
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
        <p className="text-[13px] text-muted">Konversi skor: Reading/Listening proporsional ke 0–30; Speaking rata-rata task 0–4 dan Writing 0–5 dikonversi ke 0–30. Level CEFR memakai pemetaan ETS untuk skala 0–120.</p>
      </section>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [screen, setScreen] = useState("dash");
  const [sess, dispatch] = useReducer(reducer, null);
  const [history, setHistory] = useState(() => { const h = store.get(HISTORY_KEY, []); return Array.isArray(h) ? h : []; });
  const [reportId, setReportId] = useState(null);
  const [setup, setSetup] = useState(null);
  const [exitAsk, setExitAsk] = useState(false);
  const [pending, setPending] = useState(null);
  const [lastSess, setLastSess] = useState(null);
  const recordings = useRef({});
  const [toast, toastView] = useToast();

  useEffect(() => { window.__appMounted = true; }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  useEffect(() => {
    const mo = new MutationObserver(() => {
      if (store.get(THEME_KEY, null)) return;
      const a = document.documentElement.getAttribute("data-theme");
      if (a === "dark" || a === "light") setTheme(a);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  const toggleTheme = useCallback(() => setTheme((t) => { const n = t === "dark" ? "light" : "dark"; store.set(THEME_KEY, n); return n; }), []);
  const saveHistory = (h) => { const list = h.slice(0, 30); setHistory(list); if (!store.set(HISTORY_KEY, list)) toast("Riwayat tidak bisa disimpan di browser ini.", "warn"); };

  const resetRecordings = () => { Object.values(recordings.current).forEach((u) => { try { URL.revokeObjectURL(u); } catch (e) {} }); recordings.current = {}; };
  const startSim = () => { resetRecordings(); dispatch({ type: "LOAD", session: newSession("sim", simPlan(), "Full iBT Simulation") }); setScreen("intro"); };
  const startPractice = (plan, label) => { resetRecordings(); setSetup(null); audioCtx(); dispatch({ type: "LOAD", session: newSession("practice", plan, label) }); setScreen("exam"); };

  useEffect(() => {
    if (!pending || !sess) return;
    setPending(null);
    const sec = sess.sections[sess.cur];
    if (pending.timeUsed !== undefined) dispatch({ type: "TIME", section: sec, value: pending.timeUsed });
    if (sess.cur < sess.sections.length - 1) { dispatch({ type: "NEXT" }); setScreen("between"); return; }
    const r = buildResult(sess);
    saveHistory([r, ...history.filter((x) => x.id !== r.id)]);
    setLastSess(r.id); setReportId(r.id); setScreen("report");
  }, [pending]);

  const exitExam = () => {
    setExitAsk(false);
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    dispatch({ type: "LOAD", session: null });
    setScreen("dash");
  };
  const ctx = useMemo(() => ({ theme, toggleTheme, toast }), [theme, toggleTheme, toast]);
  const report = reportId ? history.find((r) => r.id === reportId) : null;

  let body = null;
  if (screen === "dash" || (screen === "report" && !report)) {
    body = <Dashboard history={history} onSim={startSim} onPractice={(s) => setSetup(s)} onOpen={(id) => { setReportId(id); setScreen("report"); }}
      onDelete={(id) => saveHistory(history.filter((r) => r.id !== id))} onClear={() => saveHistory([])} />;
  } else if (screen === "intro" && sess) {
    body = <SimIntro onStart={() => setScreen("exam")} onCancel={() => { dispatch({ type: "LOAD", session: null }); setScreen("dash"); }} />;
  } else if (screen === "between" && sess) {
    body = <Between done={sess.sections[sess.cur - 1]} next={sess.sections[sess.cur]} idx={sess.cur - 1} total={sess.sections.length} onNext={() => setScreen("exam")} />;
  } else if (screen === "exam" && sess) {
    const sec = sess.sections[sess.cur];
    const p = sess.plan[sec];
    const step = sess.mode === "sim" ? "Section " + (sess.cur + 1) + "/4" : null;
    const common = { mode: sess.mode, sess, dispatch, onFinish: (info) => setPending({ ...info, n: Date.now() }), onExit: () => setExitAsk(true), step };
    if (sec === "reading") body = <MCSection key={sess.id + sec} section="reading" items={readingItems(p.ids, p.type)} timeLimit={p.time} {...common} />;
    else if (sec === "listening") body = <MCSection key={sess.id + sec} section="listening" items={listeningItems(p.ids, p.type)} timeLimit={p.time} {...common} />;
    else if (sec === "speaking") body = <SpeakingSection key={sess.id + sec} tasks={p.ids.map((id) => byId(BANK.speaking, id))} recordings={recordings} {...common} />;
    else body = <WritingSection key={sess.id + sec} tasks={p.ids.map((id) => byId(BANK.writing, id))} {...common} />;
  } else if (screen === "report" && report) {
    body = <ScoreReport result={report} recordings={report.id === lastSess ? recordings.current : {}} onHome={() => setScreen("dash")}
      onChange={(r) => saveHistory(history.map((x) => (x.id === r.id ? r : x)))} />;
  } else {
    body = <Dashboard history={history} onSim={startSim} onPractice={(s) => setSetup(s)} onOpen={(id) => { setReportId(id); setScreen("report"); }}
      onDelete={(id) => saveHistory(history.filter((r) => r.id !== id))} onClear={() => saveHistory([])} />;
  }

  return (
    <AppCtx.Provider value={ctx}>
      <div className="h-full">{body}</div>
      {setup && (
        <div>
          <PracticeSetup section={setup} onClose={() => setSetup(null)} onStart={startPractice} />
          <div className="fixed z-[55] left-1/2 -translate-x-1/2 top-3 flex gap-1 rounded-xl bg-paper border border-line p-1 shadow-lg no-print">
            {SECTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setSetup(s)} className={cx("h-10 px-3 rounded-lg font-semibold text-[14px] inline-flex items-center gap-1.5", setup === s ? "bg-book text-white" : "hover:bg-surface")}>
                <Icon name={SECTION_META[s].icon} size={16} /><span className="hidden sm:inline">{SECTION_META[s].label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <Modal open={exitAsk} title="Keluar dari ujian?" onClose={() => setExitAsk(false)}
        actions={<><Btn onClick={() => setExitAsk(false)}>Lanjutkan ujian</Btn><Btn v="danger" icon="LogOut" onClick={exitExam}>Keluar tanpa menyimpan</Btn></>}>
        Progres sesi ini tidak akan disimpan ke riwayat.
      </Modal>
      {toastView}
    </AppCtx.Provider>
  );
}

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { console.error(err); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="font-display text-2xl font-bold">Terjadi kesalahan tampilan</p>
          <p className="text-muted">{String(this.state.err && this.state.err.message)}</p>
          <button className={cx(BTN, BTN_V.primary)} onClick={() => this.setState({ err: null })}>Coba lagi</button>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<Boundary><App /></Boundary>);
