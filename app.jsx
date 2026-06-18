import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// DESIGN SYSTEM
// Fonts: Unbounded (geometric brutal) + Cormorant Garamond (editorial elegant) + IBM Plex Mono (technical)
// Color: electric lime #C8FF00 on near-black — confident, designed, NOT trendy
// ═══════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

:root {
  --bg: #050506;
  --fg: #F0E9DC;
  --accent: #C8FF00;
  --muted: rgba(240,233,220,0.18);
  --border: rgba(240,233,220,0.065);
  --border-mid: rgba(240,233,220,0.11);
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; cursor:none; }
body { cursor:none; background:var(--bg); }
a, button { cursor:none; }

::-webkit-scrollbar { width:2px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:var(--accent); }

/* ── Animations ── */
@keyframes mq    { from{transform:translateX(0)}   to{transform:translateX(-50%)} }
@keyframes mqRev { from{transform:translateX(-50%)} to{transform:translateX(0)} }

@keyframes grain {
  0%,100%{transform:translate(0,0)}   20%{transform:translate(-1.2%,-1%)}
  40%{transform:translate(1.1%,.9%)}  60%{transform:translate(-1%,0)}
  80%{transform:translate(.9%,-1.2%)}
}

@keyframes fadeIn {
  from { opacity:0; transform:translateY(38px); }
  to   { opacity:1; transform:translateY(0); }
}

@keyframes heroReveal {
  from { opacity:0; transform:translateY(60px) skewY(1.5deg); }
  to   { opacity:1; transform:translateY(0)   skewY(0); }
}

/* ── Scroll reveal ── */
.rv { opacity:0; transform:translateY(44px); transition:opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1); }
.rv.in { opacity:1; transform:translateY(0); }
.d1{transition-delay:.08s} .d2{transition-delay:.2s} .d3{transition-delay:.34s} .d4{transition-delay:.5s}

/* ── Hero type lines ── */
.hline {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:clamp(50px,12vw,152px); line-height:.88;
  letter-spacing:-.045em; user-select:none; display:block;
}
.hline-stroke { color:transparent; -webkit-text-stroke:1.5px rgba(240,233,220,.2); }
.hline-solid  { color:var(--fg); }
.hline-accent { color:transparent; -webkit-text-stroke:2px var(--accent); }

/* ── Project rows ── */
.prow {
  border-top:1px solid var(--border); padding:56px 0;
  display:grid; grid-template-columns:80px 1fr 1fr; gap:48px; align-items:start;
  transition:border-color .35s ease;
}
.prow:hover { border-color:var(--accent); }
.prow:hover .pnum-lbl { color:var(--accent); }
.prow .pdesc { opacity:0; transform:translateX(18px); transition:opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1); }
.prow:hover .pdesc { opacity:1; transform:translateX(0); }

/* ── Experience rows ── */
.erow {
  border-top:1px solid var(--border); padding:30px 0;
  display:grid; grid-template-columns:190px 1fr 90px; gap:40px; align-items:start;
  transition:background .22s ease;
}
.erow:last-of-type { border-bottom:1px solid var(--border); }
.erow:hover { background:rgba(200,255,0,.018); }

/* ── Skill rows ── */
.skrow {
  border-top:1px solid var(--border); padding:38px 0;
  display:grid; grid-template-columns:240px 1fr; gap:60px; align-items:start;
  transition:background .22s ease;
}
.skrow:last-of-type { border-bottom:1px solid var(--border); }
.skrow:hover { background:rgba(200,255,0,.014); }

/* ── Utility ── */
.mono { font-family:'IBM Plex Mono',monospace; }
.serif { font-family:'Cormorant Garamond',serif; }
.ub   { font-family:'Unbounded',sans-serif; }

.sec-tag {
  display:flex; align-items:center; gap:18px; margin-bottom:72px;
}
.sec-tag-num {
  font-family:'IBM Plex Mono',monospace; font-size:10px;
  letter-spacing:.22em; color:var(--accent); opacity:.55;
}
.sec-tag-line { flex:1; height:1px; background:var(--border); }
.sec-tag-label {
  font-family:'IBM Plex Mono',monospace; font-size:10px;
  letter-spacing:.22em; color:rgba(240,233,220,.22); text-transform:uppercase;
}

.alink {
  font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em;
  text-decoration:none; text-transform:uppercase; color:var(--fg); position:relative; padding-bottom:3px;
}
.alink::after {
  content:''; position:absolute; left:0; bottom:0; width:100%; height:1px;
  background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .25s ease;
}
.alink:hover::after { transform:scaleX(1); }

.alink-dim { color:rgba(240,233,220,.32); }
.alink-dim::after { background:rgba(240,233,220,.25); }

/* ── Responsive ── */
@media(max-width:900px){
  .hline { font-size:clamp(42px,13.5vw,152px) !important; }
  .prow  { grid-template-columns:60px 1fr; gap:20px; }
  .prow .pdesc { opacity:1; transform:none; }
  .erow  { grid-template-columns:1fr; gap:10px; }
  .skrow { grid-template-columns:1fr; gap:14px; }
  .about-cols { grid-template-columns:1fr !important; gap:36px !important; }
  .stats-row  { gap:40px !important; }
}
@media(max-width:600px){
  .prow { grid-template-columns:1fr; }
  .prow .pnum-lbl { display:none; }
  .nav-links { display:none !important; }
  .contact-bottom { flex-direction:column !important; align-items:flex-start !important; }
}
`;

// ═══════════════════════════════════════════════════════════
// CURSOR — ref-based, zero state updates, pure RAF
// ═══════════════════════════════════════════════════════════
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let raf, mx = -200, my = -200, rx = -200, ry = -200;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mx - 4}px,${my - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 22}px,${ry - 22}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dotRef}  style={{ position:"fixed", zIndex:9999, pointerEvents:"none", top:0, left:0, width:8, height:8, background:"var(--accent)", borderRadius:"50%" }} />
      <div ref={ringRef} style={{ position:"fixed", zIndex:9998, pointerEvents:"none", top:0, left:0, width:44, height:44, border:"1px solid rgba(200,255,0,.4)", borderRadius:"50%" }} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// GRAIN — animated SVG fractal noise overlay
// ═══════════════════════════════════════════════════════════
function Grain() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, pointerEvents:"none", overflow:"hidden" }}>
      <svg style={{ position:"absolute", width:0, height:0 }}>
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div style={{ position:"absolute", inset:"-200%", width:"400%", height:"400%", filter:"url(#gn)", opacity:.038, animation:"grain .32s steps(1) infinite", background:"white", mixBlendMode:"overlay" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const linkStyle = { fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".18em", color:"rgba(240,233,220,.32)", textDecoration:"none", textTransform:"uppercase", transition:"color .2s" };

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:500, padding:"0 6%", height:62, display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? "rgba(5,5,6,.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition:"all .4s ease" }}>
      <div style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:15, letterSpacing:"-.025em", color:"var(--fg)" }}>
        ASB<span style={{ color:"var(--accent)" }}>.</span>
      </div>
      <div className="nav-links" style={{ display:"flex", gap:40 }}>
        {[["#about","00"],["#projects","01"],["#experience","02"],["#contact","03"]].map(([h, n]) => (
          <a key={h} href={h} style={linkStyle}
            onMouseEnter={e => e.target.style.color = "var(--fg)"}
            onMouseLeave={e => e.target.style.color = "rgba(240,233,220,.32)"}>
            {n}
          </a>
        ))}
      </div>
      <a href="mailto:akshayashreebaskar.ai@gmail.com"
        style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, letterSpacing:".12em", color:"var(--accent)", textDecoration:"none", textTransform:"uppercase", border:"1px solid rgba(200,255,0,.28)", padding:"9px 18px", transition:"background .2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,0,.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        Hire →
      </a>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// MARQUEE
// ═══════════════════════════════════════════════════════════
function Marquee({ items, rev }) {
  const text = items.join("  ·  ") + "  ·  ";
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"13px 0" }}>
      <div style={{ display:"inline-flex", whiteSpace:"nowrap", animation:`${rev ? "mqRev" : "mq"} 30s linear infinite` }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".22em", color:"rgba(240,233,220,.18)", textTransform:"uppercase", paddingRight:80 }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// useReveal — IntersectionObserver scroll triggers
// ═══════════════════════════════════════════════════════════
function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.07 }
    );
    ref.current.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ═══════════════════════════════════════════════════════════
// SECTION TAG — reusable "00 — Label" header
// ═══════════════════════════════════════════════════════════
function SectionTag({ num, label }) {
  return (
    <div className="sec-tag rv">
      <span className="sec-tag-num">{num}</span>
      <div className="sec-tag-line" />
      <span className="sec-tag-label">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════
const CYCLE = ["THINKS.", "PERSISTS.", "ADAPTS.", "REMEMBERS."];

function Hero() {
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % CYCLE.length); setVis(true); }, 380);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"108px 6% 64px", position:"relative", zIndex:2, overflow:"hidden" }}>

      {/* Ghost letters — decorative background */}
      <div style={{ position:"absolute", right:"-8%", top:"50%", transform:"translateY(-50%)", fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:"clamp(180px,32vw,500px)", color:"transparent", WebkitTextStroke:"1px rgba(240,233,220,.025)", lineHeight:.9, pointerEvents:"none", userSelect:"none", letterSpacing:"-.06em", zIndex:0 }}>
        ASB
      </div>

      {/* Top metadata */}
      <div style={{ display:"flex", justifyContent:"space-between", opacity:.28, zIndex:1 }}>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".22em", color:"var(--fg)", textTransform:"uppercase" }}>
          Portfolio · 2025
        </span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".22em", color:"var(--fg)", textTransform:"uppercase" }}>
          Tiruchirappalli, India
        </span>
      </div>

      {/* Core type block */}
      <div style={{ position:"relative", zIndex:1 }}>
        <span className="hline hline-stroke" style={{ animation:"heroReveal 1.2s cubic-bezier(.16,1,.3,1) .1s both" }}>
          I BUILD
        </span>
        <span className="hline hline-solid" style={{ animation:"heroReveal 1.2s cubic-bezier(.16,1,.3,1) .26s both" }}>
          <span style={{ color:"var(--accent)" }}>AI</span>&nbsp;THAT
        </span>
        <span className="hline hline-accent" style={{ opacity: vis ? 1 : 0, transition:"opacity .38s ease", animation:"heroReveal 1.2s cubic-bezier(.16,1,.3,1) .42s both" }}>
          {CYCLE[idx]}
        </span>

        {/* Name + descriptor */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:52, flexWrap:"wrap", gap:24, animation:"heroReveal 1.2s cubic-bezier(.16,1,.3,1) .65s both" }}>
          <div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".2em", color:"rgba(240,233,220,.26)", textTransform:"uppercase", marginBottom:14 }}>
              Akshaya Shree Baskar
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(17px,1.8vw,24px)", color:"rgba(240,233,220,.52)", fontWeight:300, lineHeight:1.65, maxWidth:460 }}>
              Full Stack AI Engineer — RAG systems,<br />conversational agents & memory-aware intelligence.
            </p>
          </div>
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            <a href="#projects" className="alink">View Work ↓</a>
            <a href="#contact"  className="alink alink-dim">Contact</a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:14, zIndex:1, animation:"fadeIn .8s ease 1.3s both" }}>
        <div style={{ width:32, height:1, background:"rgba(240,233,220,.18)" }} />
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, letterSpacing:".2em", color:"rgba(240,233,220,.18)", textTransform:"uppercase" }}>Scroll</span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════
function About() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="about" ref={ref} style={{ padding:"120px 6%", position:"relative", zIndex:2 }}>
      <SectionTag num="00" label="About" />

      {/* Oversized editorial pull quote */}
      <blockquote className="rv d1" style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:"clamp(26px,4.8vw,66px)", lineHeight:1.2, letterSpacing:"-.01em", color:"var(--fg)", maxWidth:980, marginBottom:80 }}>
        "I don't build features.<br />
        I architect{" "}
        <span style={{ color:"var(--accent)", fontStyle:"normal" }}>intelligence</span>
        {" "}—<br />systems that persist, reason, and adapt."
      </blockquote>

      {/* Body columns */}
      <div className="rv d2 about-cols" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, maxWidth:920, marginBottom:72 }}>
        {[
          "My work lives at the edge of intelligent systems and human experience. From RAG pipelines serving agricultural knowledge to gesture systems that translate motion into intent — I'm drawn to problems where technology understands what a human needs before they fully articulate it.",
          "I operate best at the threshold of research and production. Where an idea must become a system, and a system must feel like a conversation. Currently building full-stack AI at a US startup, always looking for the next problem worth solving with depth and precision."
        ].map((t, i) => (
          <p key={i} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(17px,1.4vw,20px)", lineHeight:1.88, color:"rgba(240,233,220,.48)", fontWeight:300 }}>
            {t}
          </p>
        ))}
      </div>

      {/* Stats */}
      <div className="rv d3 stats-row" style={{ display:"flex", gap:64, paddingTop:52, borderTop:"1px solid var(--border)", flexWrap:"wrap" }}>
        {[["4+","Years engineering AI"],["3","Production deployments"],["1","Patent published & filed"]].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:"clamp(26px,3.5vw,52px)", letterSpacing:"-.04em", color:"var(--fg)", lineHeight:1 }}>{n}</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".16em", color:"rgba(240,233,220,.25)", marginTop:10, textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════
const PROJECTS = [
  {
    num: "01",
    name: "UzhavarIndex",
    sub: "Domain-Specific Agro RAG System",
    badge: "Production",
    desc: "A RAG pipeline built for farmers — vector search, metadata-aware retrieval, and session-persistent conversational memory. A system that genuinely knows what a farmer needs across multiple conversations over time.",
    stack: "RAG · Embeddings · Vector DB · FastAPI · SLMs · Memory Architecture",
  },
  {
    num: "02",
    name: "AirRealm",
    sub: "Gesture-Controlled Desktop Interaction",
    badge: "Patent Filed ◆",
    desc: "Hands-free desktop control where gesture replaces peripherals. Computer vision interprets motion as precise intent — cursor, clicks, and full UI interaction through air alone. Filed as patent, now published.",
    stack: "OpenCV · MediaPipe · Real-time CV · Gesture ML · HCI Research",
  },
];

function Projects() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="projects" ref={ref} style={{ padding:"0 6% 120px", position:"relative", zIndex:2 }}>
      <SectionTag num="01" label="Projects" />
      <div>
        {PROJECTS.map((p, i) => (
          <div key={p.name} className={`prow rv d${i + 1}`}>
            {/* Number */}
            <div className="pnum-lbl" style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, letterSpacing:".1em", color:"rgba(240,233,220,.18)", paddingTop:8, transition:"color .3s ease" }}>
              {p.num}
            </div>

            {/* Title + badge */}
            <div>
              <div style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:"clamp(28px,5vw,68px)", letterSpacing:"-.04em", color:"var(--fg)", lineHeight:.9, marginBottom:18 }}>
                {p.name}
              </div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:".1em", color:"var(--accent)", opacity:.7, marginBottom:16 }}>
                {p.sub}
              </div>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".1em", color:"var(--accent)", background:"rgba(200,255,0,.08)", border:"1px solid rgba(200,255,0,.2)", padding:"4px 12px" }}>
                {p.badge}
              </span>
            </div>

            {/* Description — reveals on hover */}
            <div className="pdesc">
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,1.35vw,19px)", lineHeight:1.8, color:"rgba(240,233,220,.48)", fontWeight:300, marginBottom:24 }}>
                {p.desc}
              </p>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, letterSpacing:".06em", color:"rgba(240,233,220,.26)", lineHeight:2 }}>
                {p.stack}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════════════════════
const JOBS = [
  {
    role: "Full Stack Developer — AI/ML",
    co: "US-Based AI Startup (Remote)",
    period: "Jan 2026 →",
    desc: "Building LLM-powered full-stack products. RAG pipelines, conversational agents, memory architectures, FastAPI backend services.",
    current: true,
  },
  {
    role: "AI Engineer Intern",
    co: "NIMIR Corporation, USA",
    period: "Sep – Dec 2025",
    desc: "Enterprise RAG with persistent multi-session memory. SLM reasoning workflows. Voice-driven conversational AI interfaces.",
    current: false,
  },
  {
    role: "AI Research Intern",
    co: "Renault Nissan, India",
    period: "Jun 2024 – Jun 2025",
    desc: "Computer vision for fatigue detection, gesture recognition, in-cabin AI. Smart cockpit integrations. Patent prior-art research. Published work.",
    current: false,
  },
];

function Experience() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="experience" ref={ref} style={{ padding:"0 6% 120px", position:"relative", zIndex:2 }}>
      <SectionTag num="02" label="Experience" />
      {JOBS.map((j, i) => (
        <div key={j.co} className={`erow rv d${i + 1}`}>
          {/* Period + company */}
          <div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, letterSpacing:".1em", color: j.current ? "var(--accent)" : "rgba(240,233,220,.3)", textTransform:"uppercase", marginBottom:7 }}>
              {j.period}
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".08em", color:"rgba(240,233,220,.22)" }}>
              {j.co}
            </div>
          </div>

          {/* Role + desc */}
          <div>
            <div style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:700, fontSize:"clamp(14px,1.7vw,21px)", letterSpacing:"-.02em", color:"var(--fg)", marginBottom:14, lineHeight:1.2 }}>
              {j.role}
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(15px,1.3vw,18px)", lineHeight:1.78, color:"rgba(240,233,220,.44)", fontWeight:300 }}>
              {j.desc}
            </p>
          </div>

          {/* Status badge */}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            {j.current && (
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, letterSpacing:".14em", color:"var(--accent)", background:"rgba(200,255,0,.07)", border:"1px solid rgba(200,255,0,.2)", padding:"6px 11px", whiteSpace:"nowrap", alignSelf:"flex-start" }}>
                ● NOW
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Earlier roles footnote */}
      <div className="rv d4" style={{ paddingTop:28, display:"flex", gap:16, alignItems:"baseline" }}>
        <div style={{ width:20, height:1, background:"rgba(240,233,220,.1)", flexShrink:0, transform:"translateY(-3px)" }} />
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".08em", color:"rgba(240,233,220,.2)", lineHeight:1.8 }}>
          Earlier: EMGLITZ (2023) · Accent Techno (2022) · TwirlTact (2021)<br />
          AI-driven apps · Cloud AI components · IoT automation
        </span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════
const DOMAINS = [
  { name:"AI / LLM\nEngineering",         skills:["Retrieval-Augmented Generation","LangChain","Hugging Face","Prompt Engineering","Memory Architectures","Conversational AI","SLM Reasoning","Embeddings"] },
  { name:"Machine Learning\n& CV",         skills:["PyTorch","TensorFlow","Keras","OpenCV","MediaPipe","Gesture Detection","Fatigue Monitoring","Scikit-learn"] },
  { name:"Backend\n& Full Stack",          skills:["FastAPI","REST APIs","Session Architecture","State Management","Streamlit","Authentication"] },
  { name:"Tooling\n& Research",            skills:["Git / GitHub","Docker","Power BI","Technical Writing","Patent Research","Research → Production","Metrics & Evaluation"] },
];

function Skills() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{ padding:"0 6% 120px", position:"relative", zIndex:2 }}>
      <SectionTag num="03" label="Capabilities" />
      {DOMAINS.map((d, i) => (
        <div key={d.name} className={`skrow rv d${(i % 4) + 1}`}>
          <div style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:"clamp(16px,2.6vw,32px)", letterSpacing:"-.03em", color:"var(--fg)", lineHeight:1.15, whiteSpace:"pre-line" }}>
            {d.name}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 28px", alignContent:"center" }}>
            {d.skills.map(s => (
              <span key={s} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11.5, color:"rgba(240,233,220,.4)", letterSpacing:".04em", transition:"color .2s" }}
                onMouseEnter={e => e.target.style.color = "var(--fg)"}
                onMouseLeave={e => e.target.style.color = "rgba(240,233,220,.4)"}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Certifications */}
      <div className="rv d4" style={{ marginTop:40, paddingTop:32, borderTop:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:"8px 0", alignItems:"baseline" }}>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".16em", color:"rgba(240,233,220,.2)", textTransform:"uppercase", marginRight:24, flexShrink:0 }}>
          Certifications:
        </span>
        {["NVIDIA Deep Learning","IBM AI Engineering","Elements of AI","Oracle Foundations","HackerRank Python"].map((c, i, arr) => (
          <span key={c} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10.5, color:"rgba(240,233,220,.32)", letterSpacing:".04em" }}>
            {c}{i < arr.length - 1 ? <span style={{ color:"rgba(240,233,220,.12)", margin:"0 14px" }}>·</span> : null}
          </span>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════
function Contact() {
  const ref = useRef(null);
  useReveal(ref);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText("akshayashreebaskar.ai@gmail.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" ref={ref} style={{ padding:"0 6% 80px", position:"relative", zIndex:2 }}>
      <SectionTag num="04" label="Contact" />

      {/* Pre-line italic */}
      <p className="rv d1" style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(18px,2.8vw,36px)", color:"rgba(240,233,220,.42)", fontWeight:300, maxWidth:620, lineHeight:1.5, marginBottom:52 }}>
        If you're building something that needs<br />real intelligence — let's talk.
      </p>

      {/* BIG email — full-width anchor */}
      <a href="mailto:akshayashreebaskar.ai@gmail.com" className="rv d2"
        style={{ display:"block", fontFamily:"'Unbounded',sans-serif", fontWeight:900,
          fontSize:"clamp(13px,2.8vw,42px)", letterSpacing:"-.03em", color:"var(--fg)",
          textDecoration:"none", borderTop:"1px solid var(--border-mid)", borderBottom:"1px solid var(--border-mid)",
          padding:"42px 0", lineHeight:1, wordBreak:"break-all", transition:"color .25s ease" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--fg)"}>
        akshayashreebaskar
        <span style={{ color:"var(--accent)" }}>.ai</span>
        @gmail.com
      </a>

      {/* Social + copy-email */}
      <div className="rv d3 contact-bottom" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:40, flexWrap:"wrap", gap:24 }}>
        <div style={{ display:"flex", gap:36 }}>
          {[["LinkedIn","https://linkedin.com"],["GitHub","https://github.com"],["Medium","https://medium.com"]].map(([n, h]) => (
            <a key={n} href={h} target="_blank" rel="noopener noreferrer" className="alink alink-dim">{n} ↗</a>
          ))}
        </div>
        <button onClick={copy}
          style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".14em",
            color: copied ? "var(--accent)" : "rgba(240,233,220,.28)",
            background:"transparent", border:"1px solid var(--border)", padding:"10px 22px",
            cursor:"none", transition:"all .2s", textTransform:"uppercase" }}>
          {copied ? "✓ Copied" : "Copy Email"}
        </button>
      </div>

      {/* Footer */}
      <div style={{ marginTop:88, paddingTop:32, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <span style={{ fontFamily:"'Unbounded',sans-serif", fontWeight:900, fontSize:14, letterSpacing:"-.02em", color:"rgba(240,233,220,.18)" }}>
          ASB<span style={{ color:"rgba(200,255,0,.22)" }}>.</span>
        </span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".1em", color:"rgba(240,233,220,.14)" }}>
          © 2025 Akshaya Shree Baskar — Built with intention.
        </span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════
export default function Portfolio() {
  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background:"var(--bg)", color:"var(--fg)", minHeight:"100vh", overflowX:"hidden" }}>
        <Grain />
        <Cursor />
        <Nav />
        <Hero />
        <Marquee items={["RAG Systems","Memory Agents","Computer Vision","Conversational AI","LLM Engineering","FastAPI","Full Stack AI"]} />
        <About />
        <Projects />
        <Marquee items={["UzhavarIndex","AirRealm","Patent Filed","Production Systems","Research → Reality","Human-AI Interaction"]} rev />
        <Experience />
        <Skills />
        <Contact />
      </div>
    </>
  );
}