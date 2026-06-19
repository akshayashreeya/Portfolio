import { useState, useEffect, useRef, Fragment } from "react";

const PROJECTS = [
  {
    num: "01", name: "VisionGuard AI", sub: "Real-Time Trespass Detection & Zone Analytics",
    badge: "Production System",
    desc: "Built a real-time computer vision surveillance system for detecting unauthorized entry into restricted zones using dynamic polygon-based Regions of Interest (ROI). Continuous video analysis, intrusion detection, visual event overlays, and analytics through an interactive monitoring dashboard.",
    stack: "YOLOv8 · OpenCV · Streamlit · ROI Analytics · Real-Time Video Processing · Event Detection",
  },
  {
    num: "02", name: "Identity Tracking Pipeline", sub: "Face Recognition & Persistent Person Identification",
    badge: "Computer Vision",
    desc: "Intelligent identity tracking pipeline combining person detection, tracking, and facial recognition. Maintains identity consistency across frames using face embeddings and tracking algorithms for real-time recognition of known individuals.",
    stack: "YOLOv8 · DeepSort · InsightFace · ArcFace · Face Embeddings · OpenCV",
  },
  {
    num: "03", name: "UzhavarIndex", sub: "Agricultural Knowledge Retrieval Platform",
    badge: "Applied AI",
    desc: "Retrieval-Augmented Generation (RAG) platform for agricultural advisory and knowledge discovery. Semantic search pipelines, vector databases, contextual retrieval workflows, and conversational memory for accurate domain-specific responses.",
    stack: "RAG · FAISS · SentenceTransformers · FastAPI · LLMs · Conversational Memory",
  },
  {
    num: "04", name: "AirRealm", sub: "Gesture-Controlled Human Computer Interaction",
    badge: "Patent Published",
    desc: "Touchless interaction system transforming hand gestures into desktop commands — cursor movement, clicks, and system navigation through real-time gesture recognition. Research led to patent publication and technical documentation.",
    stack: "OpenCV · MediaPipe · Gesture Recognition · Human-Computer Interaction · Computer Vision",
  },
];

const JOBS = [
  {
    yr: "2026", span: "May 2026 → Present",
    role: "Associate AI/ML Engineer", co: "Genevix Solutions · Coimbatore, TN",
    tag: "CURRENT", tagFilled: true,
    pts: [
      "Real-time computer vision pipelines for identity tracking and facial recognition in production video feeds",
      "Optimizing high-speed video analytics and recognition workflows with deep learning frameworks",
      "Improving recognition precision, tracking stability, and preprocessing throughput for deployment-grade performance",
      "Collaborating with the team to diagnose and resolve pipeline failures across recognition and tracking components",
    ],
  },
  {
    yr: "2025", span: "Sep 2025 → Mar 2026",
    role: "Full Stack AI/ML Engineer", co: "NIMIR Corporation, USA (Remote)",
    tag: null, tagFilled: false,
    pts: [
      "Enterprise-grade RAG pipelines with persistent multi-session conversational memory using LangChain + vector databases",
      "SLM-based reasoning workflows and voice-enabled conversational AI interfaces for client-facing use",
      "FastAPI session and conversation history architecture enabling context continuity across user sessions",
      "Communicated AI capabilities and progress to non-technical stakeholders on a US-based client team",
    ],
  },
  {
    yr: "2024", span: "Jun 2024 → Jun 2025",
    role: "AI Research Intern", co: "Renault Nissan Technology & Business Centre India",
    tag: "", tagFilled: false,
    pts: [
      "CV systems for real-time gesture detection, driver fatigue monitoring, and in-cabin AI applications",
      "Gesture-controlled interaction research that led to a published paper and a patent filing",
      "Patent prior-art analysis and technical documentation for engineering and innovation review boards",
    ],
  },
];

const CLUSTERS = [
  { label: "Computer Vision",     skills: ["OpenCV","MediaPipe","Facial Recognition","Object Detection","Gesture Detection","Fatigue Monitoring","Video Analytics"] },
  { label: "AI / LLM",            skills: ["LangChain","RAG Pipelines","Vector Embeddings","Prompt Engineering","Conversational AI","Voice-Enabled AI","SLM Reasoning"] },
  { label: "ML Frameworks",       skills: ["PyTorch","TensorFlow","Keras","Scikit-learn"] },
  { label: "Backend / APIs",      skills: ["FastAPI","REST APIs","Session Management","Authentication","Streamlit"] },
  { label: "Tools + Soft Skills", skills: ["Git","Docker","Vector Databases","Patent Prior-Art Analysis","Technical Writing","Client-Facing Communication","Business Requirements Translation"] },
];

const STATS = [
  { value: 2, prefix: "~", label: "YRS EXPERIENCE" },
  { value: 1, pad: 2,      label: "PATENT PENDING" },
  { value: 4,              label: "PROJECTS SHIPPED" },
];

const MARQUEE_ITEMS = [
  "REAL-TIME VISION","OBJECT DETECTION","IDENTITY TRACKING","RAG PIPELINES",
  "ZONE ANALYTICS","GESTURE RECOGNITION","FASTAPI","PATENT PUBLISHED","SYSTEM ONLINE",
];

const SECTION_IDS = ["about", "projects", "experience", "skills", "contact"];

/* ─── CSS ──────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,900&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --paper:    #EFF1EA;
  --paper-2:  #E5E8DF;
  --ink:      #14181C;
  --ink-dim:  rgba(20,24,28,0.62);
  --ink-faint:rgba(20,24,28,0.36);
  --line:     rgba(20,24,28,0.14);
  --line-s:   rgba(20,24,28,0.26);
  --signal:   #FF2E3E;
  --signal-d: rgba(255,46,62,0.12);
  --negative: #15181C;
  --on-neg:   #EFF1EA;
  --on-neg-d: rgba(239,241,234,0.62);
  --on-neg-f: rgba(239,241,234,0.34);
  --line-neg: rgba(239,241,234,0.14);
  --line-neg-s:rgba(239,241,234,0.28);
  /* live-dot: deeper, higher-contrast red for light backgrounds vs the
     brighter signal red used on dark backgrounds. Same hue family,
     swapped by context so the dot stays legible on both. */
  --live-on-light: #C81E2C;
  --live-on-dark:  #FF2E3E;
  --disp: 'Barlow Condensed', sans-serif;
  --body: 'Hanken Grotesk', sans-serif;
  --mono: 'IBM Plex Mono', monospace;
  --max: 1240px;
  --gutter: 48px;
}

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; font-size:16px; }
body { background:var(--paper); color:var(--ink); font-family:var(--body); overflow-x:hidden; cursor:none; }
a,button { cursor:none; }
@media (hover:none) { body,a,button { cursor:auto; } #reticle { display:none !important; } }

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--signal); }

/* ── RETICLE CURSOR ── */
#reticle { position:fixed; width:26px; height:26px; pointer-events:none; z-index:9999; transform:translate(-50%,-50%);
  transition:left .09s linear, top .09s linear, width .25s cubic-bezier(.16,1,.3,1), height .25s cubic-bezier(.16,1,.3,1); }
.ret-c { position:absolute; width:7px; height:7px; }
.ret-c::before,.ret-c::after { content:''; position:absolute; background:#fff; mix-blend-mode:difference; }
.ret-c::before { width:100%; height:1.4px; }
.ret-c::after  { width:1.4px; height:100%; }
.ret-tl{top:0;left:0;} .ret-tl::before{top:0;left:0;} .ret-tl::after{top:0;left:0;}
.ret-tr{top:0;right:0;} .ret-tr::before{top:0;right:0;} .ret-tr::after{top:0;right:0;}
.ret-bl{bottom:0;left:0;} .ret-bl::before{bottom:0;left:0;} .ret-bl::after{bottom:0;left:0;}
.ret-br{bottom:0;right:0;} .ret-br::before{bottom:0;right:0;} .ret-br::after{bottom:0;right:0;}
.ret-dot { position:absolute; top:50%; left:50%; width:4px; height:4px; border-radius:50%; background:var(--signal);
  transform:translate(-50%,-50%); box-shadow:0 0 7px rgba(255,46,62,.8); }
body:has(a:hover) #reticle, body:has(button:hover) #reticle { width:46px; height:46px; }

/* ── SCROLL PROGRESS ── */
#sprog { position:fixed; top:0; left:0; right:0; height:2px; z-index:700; background:rgba(20,24,28,.07); }
#sprog > div { height:100%; background:var(--signal); transition:width .08s linear; }

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(20px); transition:opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
.rv.on { opacity:1; transform:none; }
.d1{transition-delay:.05s} .d2{transition-delay:.12s} .d3{transition-delay:.19s} .d4{transition-delay:.26s} .d5{transition-delay:.33s}

.wipe { overflow:hidden; }
.wipe > * { transform:translateY(100%); transition:transform .75s cubic-bezier(.16,1,.3,1); }
.wipe.on > * { transform:translateY(0); }
.wipe-line { position:relative; }
.wipe-line::after { content:''; position:absolute; left:0; bottom:-2px; height:2px; width:0; background:var(--signal); transition:width .6s cubic-bezier(.16,1,.3,1) .4s; }
.wipe-line.on::after { width:64px; }

/* ── CORNER BRACKETS ── */
.vfc { position:absolute; }
.vfc::before,.vfc::after { content:''; position:absolute; background:var(--ink); transition:width .25s ease, height .25s ease, background .2s; }
.vfc::before { width:60%; height:1.4px; }
.vfc::after  { width:1.4px; height:60%; }
.vfc-tl{top:0;left:0;} .vfc-tl::before{top:0;left:0;} .vfc-tl::after{top:0;left:0;}
.vfc-tr{top:0;right:0;} .vfc-tr::before{top:0;right:0;} .vfc-tr::after{top:0;right:0;}
.vfc-bl{bottom:0;left:0;} .vfc-bl::before{bottom:0;left:0;} .vfc-bl::after{bottom:0;left:0;}
.vfc-br{bottom:0;right:0;} .vfc-br::before{bottom:0;right:0;} .vfc-br::after{bottom:0;right:0;}
.pc:hover .vfc::before,.pc:hover .vfc::after,
.frame-hover:hover .vfc::before,.frame-hover:hover .vfc::after { width:100%; height:100%; background:var(--signal); }

/* ── FRAME LABEL ── */
.fr-label { font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--signal);
  display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.fr-tag { border:1px solid currentColor; padding:2px 8px; font-size:10px; }

/* ── SCAN SWEEP ── */
@keyframes sweepdown { 0%{ top:-10%; opacity:0; } 8%{ opacity:.9; } 92%{ opacity:.9; } 100%{ top:108%; opacity:0; } }
.sweep { position:absolute; left:0; right:0; height:120px; top:-10%;
  background:linear-gradient(to bottom, transparent, var(--signal-d) 45%, var(--signal-d) 55%, transparent);
  pointer-events:none; animation:sweepdown 1.6s cubic-bezier(.4,0,.2,1) .25s 1 both; }

/* ── GRAIN ── */
#grain { position:fixed; inset:0; opacity:.035; pointer-events:none; z-index:1; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:170px; }

/* ── GLYPH RAIN (signature ambient layer) ── */
#glyph-rain { position:fixed; inset:0; z-index:40; pointer-events:none; }
@media (prefers-reduced-motion:reduce) { #glyph-rain { display:none; } }

/* ── DRIFTING GRID ── */
.gridshift { position:absolute; inset:0; pointer-events:none; opacity:.5;
  background-image:linear-gradient(var(--line-neg) 1px,transparent 1px),linear-gradient(90deg,var(--line-neg) 1px,transparent 1px);
  background-size:42px 42px; animation:griddrift 26s linear infinite; }
@keyframes griddrift { from{background-position:0 0;} to{background-position:84px 84px;} }

@media (prefers-reduced-motion:reduce) {
  .sweep,.gridshift { animation:none !important; }
  .rv,.wipe>*,.wipe-line::after { transition:none !important; }
}

/* ── NAV ── */
.nav-wrap { position:fixed; top:0; left:0; right:0; z-index:500; height:56px; display:flex; align-items:center;
  justify-content:space-between; padding:0 var(--gutter);
  transition:background .3s,border-color .3s,backdrop-filter .3s; border-bottom:1px solid transparent; }
.nav-wrap.scrolled { background:rgba(239,241,234,0.88); backdrop-filter:blur(16px); border-bottom-color:var(--line); }
.nav-logo { font-family:var(--disp); font-weight:900; font-size:22px; letter-spacing:-.01em; text-transform:uppercase; }
.nav-links { display:flex; gap:26px; align-items:center; }
.nav-link { font-family:var(--mono); font-size:11px; letter-spacing:.1em; color:var(--ink-faint); text-decoration:none;
  display:flex; align-items:center; gap:7px; transition:color .2s; }
.nav-link::before { content:''; width:4px; height:4px; border-radius:50%; background:var(--ink-faint); transition:background .2s,box-shadow .2s; }
.nav-link:hover { color:var(--ink); }
.nav-link.active { color:var(--ink); }
.nav-link.active::before { background:var(--signal); box-shadow:0 0 6px rgba(255,46,62,.6); }
.nav-up { font-family:var(--mono); font-size:11px; color:var(--ink-faint); letter-spacing:.08em; display:flex; align-items:center; gap:6px; line-height:1; height:32px; }
.nav-up b { color:var(--ink); font-weight:600; }
.dot-blink { width:5px; height:5px; border-radius:50%; background:var(--live-on-light); flex-shrink:0; display:inline-block;
  animation:blink 2s step-end infinite; box-shadow:0 0 0 1px rgba(20,24,28,0.18); }
.dot-blink.on-dark { background:var(--live-on-dark); box-shadow:0 0 6px rgba(255,46,62,.6); }
.nav-resume { font-family:var(--mono); font-size:11px; letter-spacing:.1em; color:var(--paper); background:var(--ink);
  padding:8px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:background .18s;
  line-height:1; height:32px; box-sizing:border-box; }
.nav-resume:hover { background:var(--signal); }
@keyframes blink { 0%,45%{opacity:1} 50%,95%{opacity:.15} 100%{opacity:1} }

/* ── LAYOUT ── */
.wrap { max-width:var(--max); margin:0 auto; padding:0 var(--gutter); position:relative; }

/* ── DISPLAY TYPE ── */
.dh { font-family:var(--disp); font-weight:900; letter-spacing:-.02em; text-transform:uppercase;
  display:block; transform:scaleY(1.2); transform-origin:left top; line-height:.9; }

/* ── BUTTONS ── */
.btn-pri,.btn-out { font-family:var(--mono); font-size:11.5px; letter-spacing:.08em; text-transform:uppercase;
  padding:12px 22px; text-decoration:none; display:inline-flex; align-items:center; gap:9px;
  transition:background .2s,color .2s,border-color .2s; white-space:nowrap; }
.btn-pri { background:var(--ink); color:var(--paper); border:1px solid var(--ink); }
.btn-pri:hover { background:var(--signal); border-color:var(--signal); color:#fff; }
.btn-out { background:transparent; color:var(--ink); border:1px solid var(--line-s); }
.btn-out:hover { border-color:var(--ink); }

/* ── CHIP ── */
.chip { border:1px solid var(--line); padding:6px 11px; font-family:var(--mono); font-size:10px; color:var(--ink-dim);
  display:inline-flex; align-items:center; gap:7px; transition:border-color .16s,color .16s,background .16s; }
.chip::before { content:''; width:3px; height:3px; border-radius:50%; background:currentColor; flex-shrink:0; }
.chip:hover { border-color:var(--signal); color:var(--signal); background:var(--signal-d); }

/* ── ABOUT CARD ── */
.note { border:1px solid var(--line); padding:22px; position:relative; transition:border-color .25s; }
.note:hover { border-color:var(--line-s); }

/* ── PROJECT CARD ── */
.pc { background:rgba(239,241,234,0.02); border:1px solid var(--line-neg); position:relative; overflow:hidden;
  transition:border-color .3s,background .3s; }
.pc:hover { background:rgba(239,241,234,0.045); }
.pc-spot { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .3s;
  background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),var(--signal-d),transparent 65%); }
.pc:hover .pc-spot { opacity:1; }
.pc-inner { padding:26px 24px 32px; position:relative; }
.pc-num { font-family:var(--disp); font-weight:900; font-size:100px; line-height:1; color:transparent;
  -webkit-text-stroke:1px var(--line-neg); position:absolute; bottom:-8px; right:10px;
  pointer-events:none; user-select:none; transition:-webkit-text-stroke .3s; }
.pc:hover .pc-num { -webkit-text-stroke:1px rgba(255,46,62,.4); }

/* ── EXPERIENCE TIMELINE ── */
.tl-item { border-top:1px solid var(--line); padding:24px 0; display:grid;
  grid-template-columns:110px 1fr; gap:32px; align-items:start;
  border-left:2px solid transparent; padding-left:18px; margin-left:-18px;
  transition:border-left-color .2s,background .2s; }
.tl-item:hover { border-left-color:var(--signal); background:var(--signal-d); }

/* ── INLINE LINK ── */
.hl { color:var(--ink-dim); text-decoration:none; font-family:var(--mono); font-size:12px; letter-spacing:.05em;
  display:inline-flex; align-items:center; gap:6px; transition:color .16s; }
.hl:hover { color:var(--signal); }

/* ── RESPONSIVE ── */
@media(max-width:960px) {
  :root { --gutter:20px; }
  .hero-sub  { grid-template-columns:1fr !important; gap:28px !important; }
  .abt-grid  { grid-template-columns:1fr !important; }
  .abt-cards { grid-template-columns:1fr !important; }
  .proj-grid { grid-template-columns:1fr !important; }
  .tl-item   { grid-template-columns:1fr !important; gap:6px !important; }
  .nav-links { display:none !important; }
  .stat-strip{ flex-wrap:wrap; }
  .stat-div  { display:none !important; }
  .hero-corners { display:none !important; }
}
@media(max-width:600px) { .contact-row { grid-template-columns:1fr !important; } }
`;

/* ── DH wrapper ── */
function DH({ tag: Tag = "h2", size, color, stroke, style: extra = {}, children }) {
  return (
    <div style={{ overflow: "visible", paddingBottom: "0.22em" }}>
      <Tag className="dh" style={{ fontSize: size, color: color || "inherit", WebkitTextStroke: stroke, ...extra }}>
        {children}
      </Tag>
    </div>
  );
}

/* ── LIVE DOT ──────────────────────────────────────────────────────────
   Theme-aware "live" indicator. Pass onDark={true} when the dot sits on
   the dark/negative sections so it keeps the bright signal red it always
   had; on the light paper background it switches to a deeper, higher-
   contrast red plus a faint ring so it stays legible against the light
   surface. Animation/behavior is identical either way. */
function LiveDot({ onDark = false, style = {} }) {
  return <span className={`dot-blink${onDark ? " on-dark" : ""}`} style={style} />;
}

function Reticle() {
  const ref = useRef(null);
  useEffect(() => {
    const mv = e => { if (ref.current) { ref.current.style.left = e.clientX+"px"; ref.current.style.top = e.clientY+"px"; } };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);
  return (
    <div id="reticle" ref={ref}>
      <span className="ret-c ret-tl"/><span className="ret-c ret-tr"/>
      <span className="ret-c ret-bl"/><span className="ret-c ret-br"/>
      <span className="ret-dot"/>
    </div>
  );
}

/* ── GLYPH RAIN ──────────────────────────────────────────────────────────
   Ambient signature layer. Replaces the old petal drift with a slow,
   sparse fall of single kanji — the vocabulary of her own pipelines
   (視 sight, 識 recognize, 析 analyze, 動 motion, 監 surveil...) read the
   way a recognition system would log a frame. Woven into the same stream,
   at low frequency, are the five katakana of her own name, アクシャヤ
   (Akshaya), rendered in signal red: a quiet signature inside the system
   rather than a caption beside it. */
const KANJI_POOL = ["視","識","析","動","監","録","解","走","査","信","号","検","知","域","紋","影","光","網","線","算"];
const NAME_CHARS = ["ア","ク","シ","ャ","ヤ"];

function GlyphRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion:reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const REDS = ["255,46,62","255,100,112","255,150,158"];
    const PAPER = "239,241,234";
    let w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let glyphs = [], raf, paused = false;

    const randomKanji = () => KANJI_POOL[Math.floor(Math.random() * KANJI_POOL.length)];

    const make = fresh => {
      const isName = Math.random() < 0.1;
      return {
        x: Math.random() * w,
        y: fresh ? Math.random() * h : -28,
        size: isName ? 17 + Math.random() * 4 : 13 + Math.random() * 7,
        speedY: 0.22 + Math.random() * 0.34,
        swayAmp: 0.25 + Math.random() * 0.4,
        swayFreq: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        isName,
        char: isName ? NAME_CHARS[0] : randomKanji(),
        nameIdx: 0,
        life: 0,
        flicker: 60 + Math.floor(Math.random() * 90),
        opacity: isName ? 0.55 + Math.random() * 0.25 : 0.16 + Math.random() * 0.18,
        color: isName ? REDS[Math.floor(Math.random() * REDS.length)] : PAPER,
      };
    };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 640 ? 14 : w < 1100 ? 22 : 30;
      glyphs = Array.from({ length: count }, () => make(true));
    };

    const drawGlyph = g => {
      ctx.save();
      ctx.globalAlpha = g.opacity;
      ctx.font = `${g.size}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgb(${g.color})`;
      if (g.isName) {
        ctx.shadowColor = "rgba(255,46,62,0.55)";
        ctx.shadowBlur = 7;
      }
      ctx.fillText(g.char, g.x, g.y);
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const g of glyphs) {
        g.life++;
        g.y += g.speedY;
        g.x += Math.sin(g.life * 0.012 * g.swayFreq + g.phase) * g.swayAmp;
        if (g.isName) {
          if (g.life % 26 === 0) {
            g.nameIdx = (g.nameIdx + 1) % NAME_CHARS.length;
            g.char = NAME_CHARS[g.nameIdx];
          }
        } else if (g.life % g.flicker === 0) {
          g.char = randomKanji();
        }
        if (g.y > h + 28) { const fx = g.x; Object.assign(g, make(false), { x: fx }); }
        if (g.x < -20) g.x = w + 20; else if (g.x > w + 20) g.x = -20;
        drawGlyph(g);
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden && !paused) { paused = true; cancelAnimationFrame(raf); }
      else if (!document.hidden && paused) { paused = false; raf = requestAnimationFrame(tick); }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas id="glyph-rain" ref={canvasRef} />;
}

function ScrollProgress() {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const fn=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;setP(max>0?(h.scrollTop/max)*100:0);};
    fn(); window.addEventListener("scroll",fn,{passive:true}); window.addEventListener("resize",fn);
    return()=>{window.removeEventListener("scroll",fn);window.removeEventListener("resize",fn);};
  },[]);
  return <div id="sprog"><div style={{width:`${p}%`}}/></div>;
}

function useActiveSection() {
  const [active,setActive]=useState("about");
  useEffect(()=>{
    const fn=()=>{let cur=active;for(const id of SECTION_IDS){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=120)cur=id;}setActive(cur);};
    fn(); window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return active;
}

function useUptime() {
  const [s,setS]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setS(v=>v+1),1000);return()=>clearInterval(id);},[]);
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

function useReveal(ref) {
  useEffect(()=>{
    if(!ref.current)return;
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target);}}),{threshold:.06});
    ref.current.querySelectorAll(".rv,.wipe,.wipe-line").forEach(el=>io.observe(el));
    return()=>io.disconnect();
  },[]);
}

function useCountUp(target,start,duration=1200) {
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!start)return;
    let raf,t0;
    const step=t=>{if(!t0)t0=t;const p=Math.min(1,(t-t0)/duration);setVal(target*(1-Math.pow(1-p,3)));if(p<1)raf=requestAnimationFrame(step);};
    raf=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(raf);
  },[start,target,duration]);
  return val;
}

function Corners({size=16,inset=0}) {
  return (<>
    <span className="vfc vfc-tl" style={{width:size,height:size,top:inset,left:inset}}/>
    <span className="vfc vfc-tr" style={{width:size,height:size,top:inset,right:inset}}/>
    <span className="vfc vfc-bl" style={{width:size,height:size,bottom:inset,left:inset}}/>
    <span className="vfc vfc-br" style={{width:size,height:size,bottom:inset,right:inset}}/>
  </>);
}

function Magnetic({as:Tag="a",className,children,...rest}) {
  const ref=useRef(null);
  const onMove=e=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();el.style.transition="transform .08s linear";el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.22}px,${(e.clientY-(r.top+r.height/2))*.32}px)`;};
  const onLeave=()=>{const el=ref.current;if(!el)return;el.style.transition="transform .45s cubic-bezier(.16,1,.3,1)";el.style.transform="translate(0,0)";};
  return <Tag ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>{children}</Tag>;
}

function Marquee() {
  const doubled=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div style={{background:"var(--negative)",padding:"12px 0",overflow:"hidden",position:"relative",zIndex:5,borderTop:"1px solid var(--line-neg)",borderBottom:"1px solid var(--line-neg)"}}>
      <div style={{display:"flex",whiteSpace:"nowrap",animation:"mq 24s linear infinite"}} onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"} onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
        <style>{`@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        {doubled.map((x,i)=>(
          <span key={i} style={{fontFamily:"var(--mono)",fontSize:"11px",color:"var(--on-neg-d)",letterSpacing:".12em",padding:"0 18px",display:"flex",alignItems:"center",gap:"18px"}}>
            {x}<span style={{color:"var(--signal)"}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled,setScrolled]=useState(false);
  const active=useActiveSection();
  const up=useUptime();
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const links=[["projects","WORK"],["experience","LOG"],["skills","STACK"],["contact","CONTACT"]];
  return (
    <nav className={`nav-wrap${scrolled?" scrolled":""}`}>
      <div className="nav-logo">ASB<span style={{color:"var(--signal)"}}>_</span></div>
      <div className="nav-links">
        {links.map(([id,label])=>(
          <a key={id} href={`#${id}`} className={`nav-link${active===id?" active":""}`}>{label}</a>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
        <span className="nav-up"><LiveDot/>UPTIME <b>{up}</b></span>
        <Magnetic href="https://drive.google.com/uc?export=download&id=1HIKOItMQr1uYCRjT5d_1I6PCSMII0UCD" target="_blank" rel="noopener noreferrer" className="nav-resume">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>
          RESUME
        </Magnetic>
      </div>
    </nav>
  );
}

function Hero() {
  const [on,setOn]=useState(false);
  const words=["SEE.","REMEMBER.","RESPOND.","SEE."];
  const [wi,setWi]=useState(0);
  const [typed,setTyped]=useState("");
  const [del,setDel]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>setOn(true),90);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    const w=words[wi];let t;
    if(!del&&typed.length<w.length) t=setTimeout(()=>setTyped(w.slice(0,typed.length+1)),80);
    else if(!del&&typed.length===w.length) t=setTimeout(()=>setDel(true),2300);
    else if(del&&typed.length>0) t=setTimeout(()=>setTyped(w.slice(0,typed.length-1)),40);
    else if(del&&typed.length===0){setDel(false);setWi((wi+1)%words.length);}
    return()=>clearTimeout(t);
  },[typed,del,wi]);

  return (
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"72px 0 48px",position:"relative",zIndex:2,overflow:"hidden"}}>
      {on&&<div className="sweep"/>}
      {/* rule-of-thirds grid */}
      <div style={{position:"absolute",inset:"28px",pointerEvents:"none",zIndex:0}}>
        {[33.33,66.66].map(p=>(
          <Fragment key={p}>
            <div style={{position:"absolute",top:0,bottom:0,left:`${p}%`,width:"1px",background:"var(--line)"}}/>
            <div style={{position:"absolute",left:0,right:0,top:`${p}%`,height:"1px",background:"var(--line)"}}/>
          </Fragment>
        ))}
      </div>
      <div className="hero-corners" style={{position:"absolute",inset:"24px",pointerEvents:"none",zIndex:1,opacity:on?1:0,transition:"opacity .6s ease"}}>
        <Corners size={22}/>
      </div>

      <div className="wrap" style={{position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column"}}>

        {/* meta strip */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"14px",borderBottom:"1px solid var(--line)",marginBottom:"32px",opacity:on?1:0,transform:on?"none":"translateY(8px)",transition:"all .6s ease .02s"}}>
          <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink-faint)",letterSpacing:".14em"}}>PORTFOLIO / 2026</span>
            <div style={{width:"1px",height:"12px",background:"var(--line-s"}}/>
            <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink-faint)",letterSpacing:".14em"}}>COIMBATORE, IN</span>
          </div>
          {/* frame + signature */}
          <div style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink-faint)",letterSpacing:".14em",textAlign:"right",lineHeight:1.7}}>
            <span style={{display:"block"}}>FRAME — 001</span>
            <span style={{display:"block",fontSize:"9px",letterSpacing:".18em",textTransform:"uppercase"}}>
              AKSHAYA SHREE
            </span>
          </div>
        </div>

        {/* eyebrow */}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px",opacity:on?1:0,transform:on?"none":"translateY(10px)",transition:"all .65s ease .08s"}}>
          <div style={{width:"20px",height:"1px",background:"var(--signal)",flexShrink:0}}/>
          <span style={{fontFamily:"var(--mono)",fontSize:"11px",color:"var(--signal)",letterSpacing:".12em",textTransform:"uppercase"}}>
            Associate AI/ML Engineer — Computer Vision, RAG Systems &amp; Intelligent AI Applications
          </span>
        </div>

        {/* available badge */}
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"10px",opacity:on?1:0,transform:on?"none":"translateY(10px)",transition:"all .6s ease .12s"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",border:"1px solid var(--line-s)",padding:"5px 12px",alignSelf:"flex-start"}}>
            <LiveDot/>
            <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink)",letterSpacing:".12em"}}>[ AVAILABLE FOR HIRE ]</span>
          </div>
          <div style={{height:"1px",flex:1,background:"var(--line)"}}/>
        </div>

        {/* headline */}
        <div style={{marginBottom:"20px"}}>
          {["BUILDING","SYSTEMS THAT"].map((word,i)=>(
            <div key={word} className={`wipe${on?" on":""}`} style={{transitionDelay:`${.16+i*.09}s`,overflow:"hidden",lineHeight:0.86}}>
              <h1 className="dh" style={{fontSize:"clamp(60px,10vw,148px)",color:"var(--ink)",lineHeight:0.86}}>{word}</h1>
            </div>
          ))}
          <div style={{overflow:"hidden",lineHeight:0.86,opacity:on?1:0,transform:on?"none":"translateY(28px)",transition:"all .8s cubic-bezier(.16,1,.3,1) .32s"}}>
            <h1 className="dh" style={{fontSize:"clamp(60px,10vw,148px)",color:"transparent",WebkitTextStroke:"2.5px var(--signal)",lineHeight:0.86}}>
              {typed}<span style={{display:"inline-block",width:"3px",height:"0.78em",background:"var(--signal)",marginLeft:"4px",animation:"blink 1s step-end infinite",verticalAlign:"-.05em"}}/>
            </h1>
          </div>
        </div>

        {/* body + stats */}
        <div className="hero-sub" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"56px",alignItems:"end",opacity:on?1:0,transform:on?"none":"translateY(14px)",transition:"all .65s ease .46s"}}>
          <div>
            <p style={{fontSize:"14.5px",lineHeight:1.78,color:"var(--ink-dim)",marginBottom:"24px",maxWidth:"460px"}}>
              Computer vision pipelines, RAG systems, and intelligent AI applications — built for production, explained in plain language for the people who fund and use them.
            </p>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
              <Magnetic href="#projects" className="btn-pri">See the work ↗</Magnetic>
              <Magnetic href="#contact" className="btn-out">Let's talk</Magnetic>
              <Magnetic href="https://drive.google.com/uc?export=download&id=1HIKOItMQr1uYCRjT5d_1I6PCSMII0UCD" target="_blank" rel="noopener noreferrer" className="btn-out">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>
                Resume
              </Magnetic>
            </div>
          </div>
          <div>
            <div style={{height:"1px",background:"var(--line)",marginBottom:"22px"}}/>
            <div className="stat-strip" style={{display:"flex",alignItems:"flex-start"}}>
              {STATS.map((st,i)=>{
                const val=useCountUp(st.value,on);
                const display=st.pad?String(Math.round(val)).padStart(st.pad,"0"):Math.round(val);
                return (
                  <Fragment key={st.label}>
                    {i>0&&<div className="stat-div" style={{width:"1px",background:"var(--line)",height:"48px",flexShrink:0,marginRight:"24px"}}/>}
                    <div style={{paddingRight:i<STATS.length-1?"24px":0}}>
                      <div className="dh" style={{fontSize:"46px",color:"var(--ink)",lineHeight:.9}}>{st.prefix||""}{display}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".1em",marginTop:"6px"}}>{st.label}</div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* bottom tags */}
        <div style={{marginTop:"auto",paddingTop:"28px"}}>
          <div style={{paddingTop:"14px",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px",opacity:on?1:0,transition:"all .55s ease .62s"}}>
            <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
              {["COMPUTER VISION","FACE RECOGNITION","IDENTITY TRACKING","VIDEO ANALYTICS","RAG SYSTEMS","FASTAPI"].map(t=>(
                <span key={t} style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".1em"}}>{t}</span>
              ))}
            </div>
            <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".1em",display:"flex",alignItems:"center",gap:"7px"}}>
              <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"var(--signal)"}}/>
              SCROLL TO CONTINUE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const ref=useRef(null);
  useReveal(ref);
  const cards=[
    {lead:"I think in pipelines.",body:"Frames decode, identity resolves, context accumulates, meaning emerges. Whether it's a video feed or a conversation thread, I see every problem as a flow — and I obsess over where it breaks."},
    {lead:"Built for the camera, explained for the client.",body:"I'm equally comfortable optimizing recognition precision in a production CV pipeline and walking a non-technical stakeholder through what the system actually does and why it matters."},
    {lead:"Research is only half.",body:"The other half is surviving contact with reality. I work the seam between prototype and deployed system — where ideas stop being experiments and start being things people depend on."},
  ];
  return (
    <section id="about" ref={ref} style={{padding:"80px 0",position:"relative",zIndex:2}}>
      <div className="wrap">
        <div className="abt-grid rv" style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:"64px",alignItems:"start"}}>
          {/* left column */}
          <div>
            <div className="fr-label"><span className="fr-tag">FRAME 02</span>ABOUT</div>
            <DH tag="div" size="76px" color="transparent" stroke="1px var(--line-s)" style={{marginBottom:"18px",userSelect:"none"}}>WHO</DH>
            <div style={{height:"1px",background:"var(--line)",marginBottom:"18px",position:"relative"}}>
              <div style={{position:"absolute",right:0,top:"-3px",width:"5px",height:"5px",borderRadius:"50%",background:"var(--signal)"}}/>
            </div>
            <div style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink-faint)",lineHeight:1.9,letterSpacing:".06em"}}>
              B.TECH AI/ML<br/>HINDUSTHAN COLLEGE<br/>COIMBATORE, INDIA<br/>2020 – 2024
            </div>
            {/* identity block */}
            <div style={{marginTop:"16px",fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".12em",lineHeight:1.8,textTransform:"uppercase"}}>
              OPERATED BY<br/>
              <span style={{color:"var(--ink)"}}>AKSHAYA SHREE</span>
            </div>
            <div style={{marginTop:"22px",padding:"16px",border:"1px solid var(--line)",position:"relative"}}>
              <Corners size={10}/>
              <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".1em",marginBottom:"8px"}}>// CURRENTLY BUILDING AT</div>
              <div style={{fontFamily:"var(--body)",fontWeight:600,fontSize:"14px",color:"var(--ink)"}}>Genevix Solutions</div>
              <div style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--signal)",marginTop:"4px"}}>Associate AI/ML Engineer · May 2026 →</div>
            </div>
          </div>
          {/* right column */}
          <div className="abt-cards" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",alignContent:"start"}}>
            {cards.map(({lead,body},i)=>(
              <div key={i} className="note frame-hover" style={i===2?{gridColumn:"1 / -1"}:{}}>
                <Corners size={9}/>
                <p style={{fontFamily:"var(--body)",fontWeight:600,fontSize:"14px",color:"var(--ink)",marginBottom:"8px",fontStyle:"italic"}}>"{lead}"</p>
                <p style={{fontFamily:"var(--body)",fontSize:"13px",color:"var(--ink-dim)",lineHeight:1.78}}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({p,idx}) {
  const ref=useRef(null);
  const onMove=e=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty("--mx",`${e.clientX-r.left}px`);el.style.setProperty("--my",`${e.clientY-r.top}px`);};
  const tags=p.stack.split(" · ");
  return (
    <div className={`rv d${(idx%4)+1}`}>
      <div style={{height:"2px",background:"var(--signal)"}}/>
      <div className="pc" ref={ref} onMouseMove={onMove}>
        <div className="pc-spot"/>
        <Corners size={16}/>
        <div className="pc-inner">
          <div className="pc-num">{p.num}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px",gap:"12px"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--on-neg-f)",letterSpacing:".12em",lineHeight:1.5}}>{p.sub.toUpperCase()}</span>
            <span style={{fontFamily:"var(--mono)",fontSize:"8.5px",color:"var(--signal)",letterSpacing:".08em",border:"1px solid var(--signal)",padding:"3px 8px",flexShrink:0,whiteSpace:"nowrap"}}>CLASS — {p.badge}</span>
          </div>
          <DH tag="h3" size="clamp(30px,4vw,52px)" color="var(--on-neg)" style={{marginBottom:"14px",letterSpacing:"-.02em"}}>{p.name}</DH>
          <p style={{fontFamily:"var(--body)",fontSize:"13px",lineHeight:1.78,color:"var(--on-neg-d)",marginBottom:"18px"}}>{p.desc}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
            {tags.map(t=><span key={t} className="chip" style={{fontSize:"9px"}}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section id="projects" ref={ref} style={{
      padding:"80px 0",position:"relative",zIndex:2,background:"var(--negative)",overflow:"hidden",
      "--ink":"var(--on-neg)","--ink-dim":"var(--on-neg-d)","--ink-faint":"var(--on-neg-f)",
      "--line":"var(--line-neg)","--line-s":"var(--line-neg-s)",color:"var(--ink)",
    }}>
      <div className="gridshift"/>
      <div className="wrap">
        <div className="rv" style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"44px",flexWrap:"wrap",gap:"20px"}}>
          <div>
            <div className="fr-label"><span className="fr-tag">FRAME 03</span>SELECTED WORK</div>
            <div className="wipe-line" style={{display:"inline-block"}}>
              <DH tag="h2" size="clamp(52px,9vw,118px)" color="var(--on-neg)">THE WORK</DH>
            </div>
          </div>
          <p style={{maxWidth:"220px",fontFamily:"var(--body)",fontSize:"13px",color:"var(--on-neg-d)",lineHeight:1.78,marginBottom:"4px",textAlign:"left"}}>
            Four systems, shown here the way a detector would log them — frame, class, confidence in the description.
          </p>
        </div>
        <div className="proj-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px"}}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.num} p={p} idx={i}/>)}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section id="experience" ref={ref} style={{padding:"80px 0",position:"relative",zIndex:2}}>
      <div className="wrap">
        <div className="rv" style={{marginBottom:"44px"}}>
          <div className="fr-label"><span className="fr-tag">FRAME 04</span>EXPERIENCE</div>
          <div className="wipe-line" style={{display:"inline-block"}}>
            <DH tag="h2" size="clamp(42px,7.5vw,108px)" color="var(--ink)">WHERE I'VE BEEN</DH>
          </div>
        </div>
        {JOBS.map((j,i)=>(
          <div key={j.co} className={`tl-item rv d${i+1}`}>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".12em",marginBottom:"4px"}}>LOG_{j.yr}</div>
              <div className="dh" style={{fontSize:"36px",color:"var(--ink-dim)"}}>{j.yr}</div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"16px",flexWrap:"wrap",marginBottom:"4px"}}>
                <div>
                  <DH tag="h3" size="clamp(20px,2.8vw,32px)" color="var(--ink)">{j.role}</DH>
                  <div style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--ink-faint)",marginTop:"6px",letterSpacing:".05em"}}>{j.co}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap",paddingTop:"4px"}}>
                  {j.tag&&(
                    <span style={{fontFamily:"var(--mono)",fontSize:"8.5px",letterSpacing:".1em",padding:"3px 9px",
                      color:j.tagFilled?"#fff":"var(--signal)",background:j.tagFilled?"var(--signal)":"transparent",border:"1px solid var(--signal)"}}>{j.tag}</span>
                  )}
                  <span style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".06em"}}>{j.span}</span>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"7px",marginTop:"14px"}}>
                {j.pts.map((pt,k)=>(
                  <div key={k} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                    <span style={{color:"var(--signal)",fontFamily:"var(--mono)",fontSize:"11px",marginTop:"2px",flexShrink:0}}>→</span>
                    <span style={{fontFamily:"var(--body)",fontSize:"13.5px",color:"var(--ink-dim)",lineHeight:1.72}}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section id="skills" ref={ref} style={{
      padding:"80px 0",position:"relative",zIndex:2,background:"var(--negative)",overflow:"hidden",
      "--ink":"var(--on-neg)","--ink-dim":"var(--on-neg-d)","--ink-faint":"var(--on-neg-f)",
      "--line":"var(--line-neg)","--line-s":"var(--line-neg-s)",color:"var(--ink)",
    }}>
      <div className="gridshift"/>
      <div className="wrap">
        <div className="rv" style={{marginBottom:"44px"}}>
          <div className="fr-label"><span className="fr-tag">FRAME 05</span>STACK</div>
          <div className="wipe-line" style={{display:"inline-block"}}>
            <DH tag="h2" size="clamp(52px,9vw,118px)" color="var(--on-neg)">THE STACK</DH>
          </div>
        </div>
        {CLUSTERS.map((c,ci)=>(
          <div key={c.label} className={`rv d${(ci%4)+1}`} style={{borderTop:"1px solid var(--line)",padding:"20px 0",display:"flex",gap:"32px",alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",minWidth:"175px",flexShrink:0}}>
              <div style={{width:"2px",height:"14px",background:"var(--signal)",flexShrink:0}}/>
              <span style={{fontFamily:"var(--mono)",fontSize:"9.5px",color:"var(--signal)",letterSpacing:".12em",textTransform:"uppercase"}}>CLASS — {c.label}</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px",flex:1}}>
              {c.skills.map(s=><div key={s} className="chip">{s}</div>)}
            </div>
          </div>
        ))}
        <div className="rv" style={{borderTop:"1px solid var(--line)",padding:"18px 0",marginTop:"4px",display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--signal)",letterSpacing:".12em",flexShrink:0}}>CERTIFIED —</span>
          {["NVIDIA Deep Learning","IBM AI Engineering","Elements of AI","Oracle Cloud Foundations","HackerRank Python"].map(c=>(
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section id="contact" ref={ref} style={{padding:"80px 0 60px",position:"relative",zIndex:2}}>
      <div className="wrap">
        {/* heading */}
        <div className="rv" style={{borderTop:"1px solid var(--line)",paddingTop:"52px",marginBottom:"44px"}}>
          <div className="fr-label"><span className="fr-tag">FRAME 06</span>CONTACT</div>
          <div style={{marginTop:"12px"}}>
            <DH tag="h2" size="clamp(48px,9.5vw,130px)" color="var(--ink)">LET'S BUILD</DH>
            <DH tag="h2" size="clamp(48px,9.5vw,130px)" color="transparent" stroke="2.5px var(--signal)">SOMETHING</DH>
            <DH tag="h2" size="clamp(48px,9.5vw,130px)" color="var(--ink)">THAT MATTERS</DH>
          </div>
        </div>

        {/* body row */}
        <div className="rv d2 contact-row" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"48px",alignItems:"end"}}>
          <div>
            <p style={{fontFamily:"var(--body)",fontSize:"14.5px",color:"var(--ink-dim)",lineHeight:1.8,maxWidth:"420px",marginBottom:"28px"}}>
              Open to applied AI roles in computer vision, AI implementation, or AI solutions engineering. If there's a problem worth solving, I want to hear about it.
            </p>
            <Magnetic href="mailto:akshayashreebaskar.ai@gmail.com" className="btn-pri">
              akshayashreebaskar.ai@gmail.com ↗
            </Magnetic>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"flex-end",paddingBottom:"3px"}}>
            {[["LinkedIn","https://www.linkedin.com/in/akshaya-shree-b-496b79229/"],["GitHub","https://github.com/akshayashreeya"],["Medium","https://medium.com/@Akshaya-TechandThoughts"]].map(([label,href])=>(
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hl">
                {label}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            ))}
          </div>
        </div>

        {/* footer with name */}
        <div className="rv d3" style={{marginTop:"64px",paddingTop:"20px",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
          <span className="dh" style={{fontSize:"18px",color:"var(--ink)",display:"flex",alignItems:"baseline",gap:"6px"}}>
            ASB<span style={{color:"var(--signal)",fontFamily:"var(--mono)",fontWeight:400}}>_</span>
            <span style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".16em",textTransform:"uppercase"}}>
              AKSHAYA SHREE
            </span>
          </span>
          <span style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--ink-faint)",letterSpacing:".07em"}}>© 2026 — DESIGNED WITH INTENTION. BUILT FOR CLARITY.</span>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=CSS;
    document.head.appendChild(s);
    return()=>{try{document.head.removeChild(s);}catch(_){}}; 
  },[]);
  return (
    <div style={{background:"var(--paper)",color:"var(--ink)",fontFamily:"var(--body)",minHeight:"100vh",overflowX:"hidden"}}>
      <div id="grain"/>
      <GlyphRain/>
      <ScrollProgress/>
      <Reticle/>
      <Nav/>
      <Hero/>
      <Marquee/>
      <About/>
      <Projects/>
      <Experience/>
      <Skills/>
      <Contact/>
    </div>
  );
}