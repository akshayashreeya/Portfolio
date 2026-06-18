import { useState, useEffect, useRef, Fragment } from "react";

/* ─── DESIGN: "Neural Brutalism" v4 ────────────────────────────────────────
   Consistent 1200px/64px grid across every section. Hero split into
   two-column bottom half (copy+CTA left, stats right). Unified sec-label
   component. Project accent bar on top. Experience uses CSS grid year col.
   Cursor expand on hover via CSS :has(). Zero layout drift between sections.
──────────────────────────────────────────────────────────────────────────*/

const PROJECTS = [
  {
    num: "01", name: "VisionGuard AI", sub: "Real-Time Trespass Detection & Zone Analytics",
    badge: "Production System", accent: "var(--acid)",
    desc: "Built a real-time computer vision surveillance system for detecting unauthorized entry into restricted zones using dynamic polygon-based Regions of Interest (ROI). Continuous video analysis, intrusion detection, visual event overlays, and analytics through an interactive monitoring dashboard.",
    stack: "YOLOv8 · OpenCV · Streamlit · ROI Analytics · Real-Time Video Processing · Event Detection",
  },
  {
    num: "02", name: "Identity Tracking Pipeline", sub: "Face Recognition & Persistent Person Identification",
    badge: "Computer Vision", accent: "var(--pink)",
    desc: "Intelligent identity tracking pipeline combining person detection, tracking, and facial recognition. Maintains identity consistency across frames using face embeddings and tracking algorithms for real-time recognition of known individuals.",
    stack: "YOLOv8 · DeepSort · InsightFace · ArcFace · Face Embeddings · OpenCV",
  },
  {
    num: "03", name: "UzhavarIndex", sub: "Agricultural Knowledge Retrieval Platform",
    badge: "Applied AI", accent: "var(--acid)",
    desc: "Retrieval-Augmented Generation (RAG) platform for agricultural advisory and knowledge discovery. Semantic search pipelines, vector databases, contextual retrieval workflows, and conversational memory for accurate domain-specific responses.",
    stack: "RAG · FAISS · SentenceTransformers · FastAPI · LLMs · Conversational Memory",
  },
  {
    num: "04", name: "AirRealm", sub: "Gesture-Controlled Human Computer Interaction",
    badge: "Patent Published", accent: "var(--pink)",
    desc: "Touchless interaction system transforming hand gestures into desktop commands — cursor movement, clicks, and system navigation through real-time gesture recognition. Research led to patent publication and technical documentation.",
    stack: "OpenCV · MediaPipe · Gesture Recognition · Human-Computer Interaction · Computer Vision",
  },
];

const JOBS = [
  {
    yr: "2026", span: "May 2026 → Present",
    role: "Associate AI/ML Engineer", co: "Genevix Solutions · Coimbatore, TN",
    tag: "CURRENT", tagAccent: true,
    pts: [
      "Real-time computer vision pipelines for identity tracking and facial recognition in production video feeds",
      "Optimizing high-speed video analytics and recognition workflows with deep learning frameworks",
      "Improving recognition precision, tracking stability, and preprocessing throughput for deployment-grade performance",
      "Collaborating with the team to diagnose and resolve pipeline failures across recognition and tracking components",
    ],
  },
  {
    yr: "2025", span: "Sep 2025 → Mar 2026",
    role: "Full Stack AI/ML Engineer Intern", co: "NIMIR Corporation, USA (Remote)",
    tag: null, tagAccent: false,
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
    tag: "Patent Filed", tagAccent: false,
    pts: [
      "CV systems for real-time gesture detection, driver fatigue monitoring, and in-cabin AI applications",
      "Gesture-controlled interaction research that led to a published paper and a patent filing",
      "Patent prior-art analysis and technical documentation for engineering and innovation review boards",
    ],
  },
];

const CLUSTERS = [
  { label: "Computer Vision",   skills: ["OpenCV","MediaPipe","Facial Recognition","Object Detection","Gesture Detection","Fatigue Monitoring","Video Analytics"] },
  { label: "AI / LLM",          skills: ["LangChain","RAG Pipelines","Vector Embeddings","Prompt Engineering","Conversational AI","Voice-Enabled AI","SLM Reasoning"] },
  { label: "ML Frameworks",     skills: ["PyTorch","TensorFlow","Keras","Scikit-learn"] },
  { label: "Backend / APIs",    skills: ["FastAPI","REST APIs","Session Management","Authentication","Streamlit"] },
  { label: "Tools + Soft Skills", skills: ["Git","Docker","Vector Databases","Patent Prior-Art Analysis","Technical Writing","Client-Facing Communication","Business Requirements Translation"] },
];

/* ─── CSS ──────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Fira+Code:wght@300;400;500&display=swap');

:root {
  --bg:     #08080A;
  --fg:     #F4F4F0;
  --acid:   #AAFF00;
  --acid2:  #C8FF47;
  --pink:   #FF4D7A;
  --dim:    rgba(244,244,240,0.68);
  --dimmer: rgba(244,244,240,0.42);
  --faint:  rgba(244,244,240,0.1);
  --border: rgba(244,244,240,0.12);
  --border-h: rgba(244,244,240,0.28);
  --mono:   'Fira Code', monospace;
  --disp:   'Bebas Neue', sans-serif;
  --body:   'Instrument Sans', sans-serif;
  --max:    1200px;
  --gutter: 64px;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; font-size: 16px; }
body { cursor: none !important; background: var(--bg); color: var(--fg); font-family: var(--body); overflow-x: hidden; }
* { cursor: none !important; }

::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--acid); }

/* CURSOR */
#cdot {
  width: 5px; height: 5px; background: var(--acid); border-radius: 50%;
  position: fixed; pointer-events: none; z-index: 9999;
  transform: translate(-50%, -50%);
}
#cring {
  width: 32px; height: 32px; border: 1px solid rgba(170,255,0,0.5); border-radius: 50%;
  position: fixed; pointer-events: none; z-index: 9998;
  transform: translate(-50%, -50%);
  transition: left .12s ease, top .12s ease, width .2s ease, height .2s ease, border-color .2s ease;
}
body:has(a:hover) #cring,
body:has(button:hover) #cring { width: 48px; height: 48px; border-color: var(--acid); }

/* REVEAL */
.rv { opacity: 0; transform: translateY(20px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.rv.on { opacity: 1; transform: none; }
.d1 { transition-delay: .04s } .d2 { transition-delay: .12s }
.d3 { transition-delay: .2s  } .d4 { transition-delay: .28s } .d5 { transition-delay: .36s }

/* GLITCH */
.gh { position: relative; display: inline-block; }
.gh:hover::before, .gh:hover::after { content: attr(data-t); position: absolute; left: 0; top: 0; font: inherit; }
.gh:hover::before { clip-path: polygon(0 18%, 100% 18%, 100% 46%, 0 46%); color: var(--acid); left: -2px; animation: ga .25s steps(2,end) forwards; }
.gh:hover::after  { clip-path: polygon(0 56%, 100% 56%, 100% 76%, 0 76%); color: var(--pink); left: 2px;  animation: gb .25s steps(2,end) forwards; }
@keyframes ga { 0%{transform:translateX(-3px)} 50%{transform:translateX(2px)}  100%{transform:none} }
@keyframes gb { 0%{transform:translateX(3px)}  50%{transform:translateX(-2px)} 100%{transform:none} }

/* MARQUEE */
@keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.mqw { display: flex; white-space: nowrap; animation: mq 22s linear infinite; }
.mqw:hover { animation-play-state: paused; }

/* SPIN / BLINK */
@keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* NAV */
.nav-wrap {
  position: fixed; top: 0; left: 0; right: 0; z-index: 500; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--gutter);
  transition: background .3s, backdrop-filter .3s, border-bottom .3s;
}
.nav-wrap.scrolled {
  background: rgba(8,8,10,0.88);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.nav-logo { font-family: var(--disp); font-size: 20px; letter-spacing: .06em; }
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-link { font-family: var(--mono); font-size: 10px; letter-spacing: .12em; color: var(--dimmer); text-decoration: none; transition: color .2s; }
.nav-link:hover { color: var(--fg); }
.nav-clock { font-family: var(--mono); font-size: 9.5px; color: var(--dimmer); letter-spacing: .1em; }

/* SECTION LABEL */
.sec-label {
  font-family: var(--mono); font-size: 9px; color: var(--acid);
  letter-spacing: .2em; text-transform: uppercase; margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.sec-label::before { content: ''; width: 18px; height: 1px; background: var(--acid); }

/* WRAPPER */
.wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--gutter); }

/* BUTTONS */
.btn-acid {
  background: var(--acid); color: #000; border: none;
  padding: 13px 26px; font-family: var(--mono); font-size: 11px;
  font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  transition: all .2s ease;
}
.btn-acid:hover { background: var(--acid2); transform: translate(-2px,-2px); box-shadow: 3px 3px 0 var(--fg); }

.btn-wire {
  background: transparent; color: var(--fg); border: 1px solid rgba(244,244,240,0.25);
  padding: 13px 26px; font-family: var(--mono); font-size: 11px;
  letter-spacing: .1em; text-transform: uppercase;
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  transition: all .2s ease;
}
.btn-wire:hover { border-color: rgba(244,244,240,0.6); transform: translate(-2px,-2px); box-shadow: 3px 3px 0 rgba(244,244,240,0.12); }

/* SKILL TAG */
.tag {
  border: 1px solid var(--border); padding: 7px 12px;
  font-family: var(--mono); font-size: 10px; color: var(--dimmer);
  display: inline-flex; align-items: center; gap: 6px;
  transition: all .16s ease; background: rgba(244,244,240,0.01);
}
.tag::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.tag:hover { border-color: var(--acid); color: var(--acid); background: rgba(170,255,0,0.05); }

/* ABOUT CARD */
.abt-card {
  border: 1px solid var(--border); padding: 24px;
  background: rgba(244,244,240,0.012);
  transition: border-color .25s, background .25s;
}
.abt-card:hover { border-color: rgba(170,255,0,.25); background: rgba(170,255,0,.02); }

/* PROJECT CARD */
.pc {
  background: rgba(244,244,240,0.016); border: 1px solid var(--border);
  position: relative; overflow: hidden;
  transition: border-color .3s, background .3s;
}
.pc:hover { border-color: rgba(244,244,240,0.26); background: rgba(244,244,240,0.03); }
.pc-inner { padding: 36px 32px 72px; }
.pc-num {
  font-family: var(--disp); font-size: 120px; line-height: 1;
  color: transparent; -webkit-text-stroke: 1px var(--faint);
  position: absolute; bottom: -8px; right: 16px;
  pointer-events: none; user-select: none;
  transition: -webkit-text-stroke .3s;
}
.pc:hover .pc-num { -webkit-text-stroke: 1px rgba(170,255,0,0.35); }
.pc-vd {
  opacity: 0; transform: translateY(6px);
  transition: opacity .22s, transform .22s;
  position: absolute; bottom: 24px; right: 28px;
  font-family: var(--mono); font-size: 10px; letter-spacing: .08em;
  text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none;
}
.pc:hover .pc-vd { opacity: 1; transform: none; }

/* EXPERIENCE TIMELINE */
.tl-item {
  border-top: 1px solid var(--border); padding: 36px 0;
  display: grid; grid-template-columns: 80px 1fr; gap: 48px; align-items: start;
  border-left: 2px solid transparent; padding-left: 20px; margin-left: -20px;
  transition: border-left-color .2s, background .2s;
}
.tl-item:hover { border-left-color: var(--acid); background: rgba(170,255,0,.02); }

/* INLINE LINK */
.hl {
  color: var(--dim); text-decoration: none; font-family: var(--mono); font-size: 11px;
  letter-spacing: .06em; display: inline-flex; align-items: center; gap: 6px;
  transition: color .16s;
}
.hl:hover { color: var(--acid); }

/* NOISE */
#noise {
  position: fixed; inset: 0; opacity: .018; pointer-events: none; z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

@media(max-width:960px) {
  :root { --gutter: 32px; }
  .hero-sub { grid-template-columns: 1fr !important; gap: 40px !important; }
  .abt-grid  { grid-template-columns: 1fr !important; }
  .abt-cards { grid-template-columns: 1fr !important; }
  .proj-grid { grid-template-columns: 1fr !important; }
  .tl-item   { grid-template-columns: 1fr !important; gap: 10px !important; }
  .nav-links { display: none !important; }
  .spin-wrap { display: none !important; }
  .stat-strip { flex-wrap: wrap; }
  .stat-div   { display: none !important; }
  .pc-vd { position: static !important; opacity: 1 !important; transform: none !important; margin-top: 16px; }
  .pc-inner { padding-bottom: 28px !important; }
}
@media(max-width:600px) {
  .contact-row { grid-template-columns: 1fr !important; }
}
`;

/* ─── CURSOR ───────────────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if (dot.current)  { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);
  return <><div id="cdot" ref={dot}/><div id="cring" ref={ring}/></>;
}

/* ─── REVEAL HOOK ──────────────────────────────────────────────────────── */
function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.07 }
    );
    ref.current.querySelectorAll(".rv").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── CLOCK ────────────────────────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="nav-clock">{t} IST</span>;
}

/* ─── MARQUEE ──────────────────────────────────────────────────────────── */
function Marquee() {
  const items = ["COMPUTER VISION","·","FACE RECOGNITION","·","IDENTITY TRACKING","·","RAG SYSTEMS","·","YOLOv8","·","ZONE ANALYTICS","·","FASTAPI","·","PATENT PUBLISHED","·","VIDEO ANALYTICS","·"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "var(--acid)", padding: "11px 0", overflow: "hidden", position: "relative", zIndex: 5 }}>
      <div className="mqw">
        {doubled.map((x, i) => (
          <span key={i} style={{ fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 500, color: "#000", letterSpacing: ".14em", padding: "0 16px" }}>{x}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── SPIN BADGE ───────────────────────────────────────────────────────── */
function SpinBadge() {
  const text = "ASSOCIATE·AI/ML·ENGINEER·COMPUTER·VISION·RAG·";
  const r = 50;
  return (
    <div className="spin-wrap" style={{ position: "relative", width: "112px", height: "112px", flexShrink: 0 }}>
      <svg viewBox="0 0 112 112" style={{ position: "absolute", inset: 0, animation: "spin 14s linear infinite" }}>
        <defs><path id="cp" d={`M 56,56 m -${r},0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`}/></defs>
        <text fontFamily="var(--mono)" fontSize="8.5" fill="rgba(244,244,240,0.38)" letterSpacing="3.5">
          <textPath href="#cp">{text}</textPath>
        </text>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "24px", height: "24px", border: "1px solid var(--acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "6px", height: "6px", background: "var(--acid)", borderRadius: "50%" }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ──────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo">ASB<span style={{ color: "var(--acid)" }}>_</span></div>
      <div className="nav-links">
        {[["#projects","WORK"],["#experience","EXP"],["#skills","STACK"],["#contact","CONTACT"]].map(([href, label]) => (
          <a key={label} href={href} className="nav-link">{label}</a>
        ))}
      </div>
      <Clock/>
    </nav>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */
function Hero() {
  const [on, setOn] = useState(false);
  const words = ["SEE.", "REMEMBER.", "RESPOND.", "SEE."];
  const [wi, setWi]       = useState(0);
  const [typed, setTyped] = useState("");
  const [del, setDel]     = useState(false);

  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const w = words[wi]; let t;
    if (!del && typed.length < w.length)        t = setTimeout(() => setTyped(w.slice(0, typed.length + 1)), 80);
    else if (!del && typed.length === w.length)  t = setTimeout(() => setDel(true), 2400);
    else if (del && typed.length > 0)            t = setTimeout(() => setTyped(w.slice(0, typed.length - 1)), 40);
    else if (del && typed.length === 0)          { setDel(false); setWi((wi + 1) % words.length); }
    return () => clearTimeout(t);
  }, [typed, del, wi]);

  const stats = [["~2","YRS EXPERIENCE"],["01","PATENT PENDING"],["4","PROJECTS SHIPPED"]];

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 0 72px", position: "relative", zIndex: 2, overflow: "hidden" }}>

      {/* ── decorative background grid lines ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* vertical column lines */}
        {[18, 36, 54, 72, 82].map(pct => (
          <div key={pct} style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: "1px", background: "rgba(244,244,240,0.04)" }}/>
        ))}
        {/* horizontal rule at 40% */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: "1px", background: "rgba(244,244,240,0.04)" }}/>
        {/* acid corner bracket — top left */}
        <div style={{ position: "absolute", top: "88px", left: "64px", width: "28px", height: "28px", borderTop: "1px solid rgba(170,255,0,0.3)", borderLeft: "1px solid rgba(170,255,0,0.3)" }}/>
        {/* acid corner bracket — bottom right */}
        <div style={{ position: "absolute", bottom: "72px", right: "64px", width: "28px", height: "28px", borderBottom: "1px solid rgba(170,255,0,0.3)", borderRight: "1px solid rgba(170,255,0,0.3)" }}/>
        {/* large ghost number */}
        <div style={{ position: "absolute", right: "-1%", bottom: "-10%", fontFamily: "var(--disp)", fontSize: "clamp(220px,30vw,440px)", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(244,244,240,0.055)", userSelect: "none" }}>01</div>
        {/* subtle dot grid — top right quadrant */}
        <svg style={{ position: "absolute", top: "60px", right: "80px", opacity: 0.18 }} width="160" height="160" viewBox="0 0 160 160">
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle key={`${row}-${col}`} cx={col * 28 + 8} cy={row * 28 + 8} r="1.2" fill="rgba(170,255,0,0.7)" />
            ))
          )}
        </svg>
        {/* vertical scroll label — far right edge */}
        <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center", fontFamily: "var(--mono)", fontSize: "8.5px", color: "rgba(244,244,240,0.2)", letterSpacing: ".22em", whiteSpace: "nowrap" }}>
          SCROLL TO EXPLORE
        </div>
        {/* scroll line */}
        <div style={{ position: "absolute", right: "26px", top: "50%", height: "80px", width: "1px", background: "rgba(170,255,0,0.25)", marginTop: "14px" }}/>
      </div>

      {/* ── left accent bar ── */}
      <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: "3px", background: "var(--acid)", opacity: 0.5, zIndex: 1, pointerEvents: "none" }}/>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* eyebrow row — tighter margin now */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transition: "all .65s ease .06s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "20px", height: "1px", background: "var(--acid)", flexShrink: 0 }}/>
            <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--acid)", letterSpacing: ".16em", textTransform: "uppercase", lineHeight: 1.6 }}>
              Associate AI/ML Engineer — Computer Vision, RAG Systems &amp; Intelligent AI Applications
            </span>
          </div>
          <SpinBadge/>
        </div>

        {/* ── availability pill + name row, sits just above headline ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transition: "all .6s ease .1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", border: "1px solid rgba(170,255,0,0.3)", padding: "5px 12px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--acid)", display: "inline-block", boxShadow: "0 0 7px var(--acid)", flexShrink: 0 }}/>
            <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--acid)", letterSpacing: ".14em" }}>AVAILABLE FOR HIRE</span>
          </div>
          <div style={{ height: "1px", flex: 1, background: "var(--border)" }}/>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".1em" }}>COIMBATORE, IN</span>
        </div>

        {/* headline — tighter line height, no gap between lines */}
        {["BUILDING", "SYSTEMS THAT"].map((word, i) => (
          <div key={word} style={{ overflow: "hidden", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(32px)", transition: `all .8s cubic-bezier(.16,1,.3,1) ${0.14 + i * 0.08}s` }}>
            <h1 className="gh" data-t={word} style={{ fontFamily: "var(--disp)", fontSize: "clamp(58px,9.5vw,148px)", lineHeight: .93, letterSpacing: "-.01em", color: "var(--fg)", display: "block" }}>{word}</h1>
          </div>
        ))}
        <div style={{ overflow: "hidden", marginBottom: "36px", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(32px)", transition: "all .8s cubic-bezier(.16,1,.3,1) .3s" }}>
          <h1 style={{ fontFamily: "var(--disp)", fontSize: "clamp(58px,9.5vw,148px)", lineHeight: .93, letterSpacing: "-.01em", color: "transparent", WebkitTextStroke: "2px var(--acid)", display: "block" }}>
            {typed}<span style={{ animation: "blink 1s step-end infinite", WebkitTextFillColor: "var(--acid)" }}>|</span>
          </h1>
        </div>

        {/* body + stats — 2-col grid */}
        <div className="hero-sub" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(14px)", transition: "all .65s ease .42s" }}>
          <div>
            <p style={{ fontSize: "15px", lineHeight: 1.82, color: "var(--dim)", marginBottom: "32px", maxWidth: "480px" }}>
              Computer vision pipelines, RAG systems, and intelligent AI applications — built for production, explained in plain language for the people who fund and use them.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="#projects" className="btn-acid">See the work ↗</a>
              <a href="#contact"  className="btn-wire">Let's talk</a>
            </div>
          </div>

          <div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "28px" }}/>
            <div className="stat-strip" style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
              {stats.map(([n, l], i) => (
                <Fragment key={l}>
                  {i > 0 && <div className="stat-div" style={{ width: "1px", background: "var(--border)", height: "60px", flexShrink: 0, marginRight: "32px" }}/>}
                  <div style={{ paddingRight: i < stats.length - 1 ? "32px" : 0 }}>
                    <div style={{ fontFamily: "var(--disp)", fontSize: "52px", color: "var(--fg)", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".1em", marginTop: "4px" }}>{l}</div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* tags row */}
        <div style={{ marginTop: "52px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", opacity: on ? 1 : 0, transition: "all .55s ease .62s" }}>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            {["COMPUTER VISION","FACE RECOGNITION","IDENTITY TRACKING","VIDEO ANALYTICS","RAG SYSTEMS","FASTAPI"].map(t => (
              <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".1em" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", flexShrink: 0 }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--acid)", display: "inline-block", boxShadow: "0 0 8px var(--acid)" }}/>
            OPEN TO APPLIED AI ROLES
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ────────────────────────────────────────────────────────────── */
function About() {
  const ref = useRef(null);
  useReveal(ref);

  const cards = [
    { lead: "I think in pipelines.", body: "Frames decode, identity resolves, context accumulates, meaning emerges. Whether it's a video feed or a conversation thread, I see every problem as a flow — and I obsess over where it breaks." },
    { lead: "Built for the camera, explained for the client.", body: "I'm equally comfortable optimizing recognition precision in a production CV pipeline and walking a non-technical stakeholder through what the system actually does and why it matters." },
    { lead: "Research is only half.", body: "The other half is surviving contact with reality. I work the seam between prototype and deployed system — where ideas stop being experiments and start being things people depend on." },
  ];

  return (
    <section id="about" ref={ref} style={{ padding: "128px 0", position: "relative", zIndex: 2 }}>
      <div className="wrap">
        <div className="abt-grid rv" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "96px", alignItems: "start" }}>
          {/* left col */}
          <div>
            <div className="sec-label">02 / About</div>
            <div style={{ fontFamily: "var(--disp)", fontSize: "96px", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px var(--faint)", marginBottom: "24px", userSelect: "none" }}>WHO</div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: "-3px", width: "5px", height: "5px", borderRadius: "50%", background: "var(--acid)" }}/>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--dimmer)", lineHeight: 1.9, letterSpacing: ".06em" }}>
              B.TECH AI/ML<br/>HINDUSTHAN COLLEGE<br/>COIMBATORE, INDIA<br/>2020 – 2024
            </div>
            <div style={{ marginTop: "28px", padding: "18px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".1em", marginBottom: "10px" }}>// CURRENTLY BUILDING AT</div>
              <div style={{ fontFamily: "var(--body)", fontWeight: 600, fontSize: "14px", color: "var(--fg)" }}>Genevix Solutions</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--acid)", marginTop: "4px" }}>Associate AI/ML Engineer · May 2026 →</div>
            </div>
          </div>

          {/* right col — cards */}
          <div className="abt-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignContent: "start" }}>
            {cards.map(({ lead, body }, i) => (
              <div key={i} className="abt-card" style={i === 2 ? { gridColumn: "1 / -1" } : {}}>
                <p style={{ fontFamily: "var(--body)", fontWeight: 600, fontSize: "15px", color: "var(--fg)", marginBottom: "10px", fontStyle: "italic" }}>"{lead}"</p>
                <p style={{ fontFamily: "var(--body)", fontSize: "13.5px", color: "var(--dim)", lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ─────────────────────────────────────────────────────────── */
function Projects() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="projects" ref={ref} style={{ padding: "128px 0", background: "#060609", position: "relative", zIndex: 2 }}>
      <div className="wrap">
        <div className="rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "80px", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div className="sec-label">03 / Selected Work</div>
            <h2 className="gh" data-t="THE WORK" style={{ fontFamily: "var(--disp)", fontSize: "clamp(56px,10vw,120px)", lineHeight: .92, color: "var(--fg)" }}>THE WORK</h2>
          </div>
          <p style={{ maxWidth: "240px", fontFamily: "var(--body)", fontSize: "13.5px", color: "var(--dim)", lineHeight: 1.8, marginBottom: "6px" }}>
            Four systems. Built end to end, in production.
          </p>
        </div>

        <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          {PROJECTS.map((p, i) => {
            const tags = p.stack.split(" · ");
            return (
              <div key={p.num} className={`rv d${(i % 4) + 1}`}>
                <div style={{ height: "2px", background: p.accent }}/>
                <div className="pc">
                  <div className="pc-inner">
                    <div className="pc-num">{p.num}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".12em", lineHeight: 1.5 }}>{p.sub.toUpperCase()}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "8.5px", color: p.accent, letterSpacing: ".08em", border: `1px solid ${p.accent}`, padding: "3px 9px", flexShrink: 0, whiteSpace: "nowrap" }}>{p.badge}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--disp)", fontSize: "clamp(34px,4.5vw,58px)", lineHeight: .95, color: "var(--fg)", letterSpacing: "-.01em", marginBottom: "20px" }}>{p.name}</h3>
                    <p style={{ fontFamily: "var(--body)", fontSize: "13.5px", lineHeight: 1.8, color: "var(--dim)", marginBottom: "22px" }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {tags.map(t => <span key={t} className="tag" style={{ fontSize: "9.5px" }}>{t}</span>)}
                    </div>
                  </div>
                  <a href="#" className="pc-vd" style={{ color: p.accent }}>
                    View Details
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="rv" style={{ marginTop: "20px", fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".04em" }}>
          — Wire each "View Details" link to a case-study page, GitHub repo, or architecture deck.
        </p>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ───────────────────────────────────────────────────────── */
function Experience() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="experience" ref={ref} style={{ padding: "128px 0", position: "relative", zIndex: 2 }}>
      <div className="wrap">
        <div className="rv" style={{ marginBottom: "80px" }}>
          <div className="sec-label">04 / Experience</div>
          <h2 className="gh" data-t="WHERE I'VE BEEN" style={{ fontFamily: "var(--disp)", fontSize: "clamp(46px,8.5vw,108px)", lineHeight: .92, color: "var(--fg)" }}>WHERE I'VE BEEN</h2>
        </div>

        {JOBS.map((j, i) => (
          <div key={j.co} className={`tl-item rv d${i + 1}`}>
            <div style={{ fontFamily: "var(--disp)", fontSize: "44px", color: "var(--dimmer)", lineHeight: 1.1, paddingTop: "2px" }}>{j.yr}</div>
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "4px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--disp)", fontSize: "clamp(22px,3.2vw,36px)", color: "var(--fg)", letterSpacing: ".02em", lineHeight: 1.05 }}>{j.role}</h3>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--dimmer)", marginTop: "6px", letterSpacing: ".05em" }}>{j.co}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
                  {j.tag && (
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: "8.5px", letterSpacing: ".1em",
                      padding: "3px 9px",
                      color: j.tagAccent ? "#000" : "var(--acid)",
                      background: j.tagAccent ? "var(--acid)" : "transparent",
                      border: "1px solid var(--acid)",
                    }}>{j.tag}</span>
                  )}
                  <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".06em" }}>{j.span}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "18px" }}>
                {j.pts.map((pt, k) => (
                  <div key={k} style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--acid)", fontFamily: "var(--mono)", fontSize: "11px", marginTop: "3px", flexShrink: 0 }}>→</span>
                    <span style={{ fontFamily: "var(--body)", fontSize: "13.5px", color: "var(--dim)", lineHeight: 1.75 }}>{pt}</span>
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

/* ─── SKILLS ───────────────────────────────────────────────────────────── */
function Skills() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="skills" ref={ref} style={{ padding: "128px 0", background: "#060609", position: "relative", zIndex: 2 }}>
      <div className="wrap">
        <div className="rv" style={{ marginBottom: "72px" }}>
          <div className="sec-label">05 / Stack</div>
          <h2 className="gh" data-t="THE STACK" style={{ fontFamily: "var(--disp)", fontSize: "clamp(56px,10vw,120px)", lineHeight: .92, color: "var(--fg)" }}>THE STACK</h2>
        </div>

        {CLUSTERS.map((c, ci) => (
          <div key={c.label} className={`rv d${(ci % 4) + 1}`} style={{ borderTop: "1px solid var(--border)", padding: "28px 0", display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "180px", flexShrink: 0 }}>
              <div style={{ width: "2px", height: "16px", background: "var(--acid)", flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--acid)", letterSpacing: ".14em", textTransform: "uppercase" }}>{c.label}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flex: 1 }}>
              {c.skills.map(s => <div key={s} className="tag">{s}</div>)}
            </div>
          </div>
        ))}

        <div className="rv" style={{ borderTop: "1px solid var(--border)", padding: "24px 0", marginTop: "4px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--acid)", letterSpacing: ".14em", flexShrink: 0 }}>CERTIFIED :</span>
          {["NVIDIA Deep Learning","IBM AI Engineering","Elements of AI","Oracle Cloud Foundations","HackerRank Python"].map(c => (
            <span key={c} className="tag">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ──────────────────────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="contact" ref={ref} style={{ padding: "128px 0 80px", position: "relative", zIndex: 2 }}>
      <div className="wrap">
        <div className="rv" style={{ borderTop: "1px solid var(--border)", paddingTop: "88px", marginBottom: "72px" }}>
          <div className="sec-label">06 / Contact</div>
          <h2 style={{ fontFamily: "var(--disp)", fontSize: "clamp(48px,10.5vw,136px)", lineHeight: .88, letterSpacing: "-.01em", color: "var(--fg)", marginTop: "18px" }}>
            LET'S BUILD<br/>
            <span style={{ color: "transparent", WebkitTextStroke: "2px var(--acid)" }}>SOMETHING</span><br/>
            THAT MATTERS
          </h2>
        </div>

        <div className="rv d2 contact-row" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px", alignItems: "end" }}>
          <div>
            <p style={{ fontFamily: "var(--body)", fontSize: "15px", color: "var(--dim)", lineHeight: 1.82, maxWidth: "400px", marginBottom: "36px" }}>
              Open to applied AI roles in computer vision, AI implementation, or AI solutions engineering. If there's a problem worth solving, I want to hear about it.
            </p>
            <a href="mailto:akshayashreebaskar.ai@gmail.com" className="btn-acid">
              akshayashreebaskar.ai@gmail.com ↗
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", paddingBottom: "3px" }}>
            {[["LinkedIn","https://linkedin.com"],["GitHub","https://github.com"],["Medium","https://medium.com"]].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hl" style={{ fontSize: "11.5px" }}>
                {label}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            ))}
          </div>
        </div>

        <div className="rv d3" style={{ marginTop: "96px", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontFamily: "var(--disp)", fontSize: "16px", letterSpacing: ".06em" }}>ASB<span style={{ color: "var(--acid)" }}>_</span></span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--dimmer)", letterSpacing: ".07em" }}>© 2026 — DESIGNED WITH INTENTION. BUILT FOR CLARITY.</span>
        </div>
      </div>
    </section>
  );
}

/* ─── ROOT ─────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch (_) {} };
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--body)", minHeight: "100vh", overflowX: "hidden" }}>
      <div id="noise"/>
      <Cursor/>
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