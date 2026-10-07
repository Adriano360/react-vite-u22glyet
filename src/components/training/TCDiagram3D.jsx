// Diagrama 3D animado do Transformador de Corrente (TC) — SVG + React, sem dependências.
// Uso: import TCDiagram3D from "./TCDiagram3D"; ... <TCDiagram3D />
// Props opcionais: ip (corrente primária nominal, A), is (secundária nominal, A)

import { useEffect, useRef, useState } from "react";

const TAU = Math.PI * 2;
const F_VIS = 0.5;     // 60 Hz mostrado em câmera lenta (0,5 ciclo por segundo)
const PICKUP = 1.2;    // partida da 51 em 1,2 × In (valor de exemplo para o treinamento)
const fmt = (v, d = 2) => v.toFixed(d).replace(".", ",");

export default function TCDiagram3D({ ip = 600, is = 5 }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [load, setLoad] = useState(1); // corrente primária em p.u. da nominal
  const last = useRef(null);

  // Começa parado para quem configurou o sistema para reduzir movimento
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) { last.current = null; return; }
    let id;
    const loop = (now) => {
      if (last.current != null) setT((v) => v + (now - last.current) / 1000);
      last.current = now;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  // ---------- Geometria 3D (núcleo balança lentamente em torno do eixo vertical) ----------
  const cx = 210, cy = 165;
  const yaw = ((30 + 9 * Math.sin((TAU * t) / 8)) * Math.PI) / 180;
  const O = { rx: 96 * Math.sin(yaw), ry: 96 };
  const I = { rx: 54 * Math.sin(yaw), ry: 54 };
  const depth = 17 * Math.cos(yaw);
  const pt = (e, deg) => ({
    x: cx + e.rx * Math.cos((deg * Math.PI) / 180),
    y: cy + e.ry * Math.sin((deg * Math.PI) / 180),
  });
  const turns = [];
  for (let a = 205; a <= 335; a += 13) turns.push({ a: pt(I, a), b: pt(O, a) });
  const s1 = pt(O, 244);
  const s2 = pt(O, 296);

  // ---------- Grandezas elétricas (CA senoidal) ----------
  const phase = TAU * F_VIS * t;
  const wave = Math.sin(phase);                 // forma de onda normalizada
  const drift = -Math.cos(phase);               // integral da corrente → deslocamento das cargas
  const ipRms = ip * load;
  const isRms = is * load;
  const isInst = isRms * Math.SQRT2 * wave;
  const trip = load >= PICKUP;
  const ratio = Math.round(ip / is);

  const annulus =
    `M${cx - O.rx},${cy} a${O.rx},${O.ry} 0 1,0 ${2 * O.rx},0 a${O.rx},${O.ry} 0 1,0 ${-2 * O.rx},0 Z ` +
    `M${cx - I.rx},${cy} a${I.rx},${I.ry} 0 1,0 ${2 * I.rx},0 a${I.rx},${I.ry} 0 1,0 ${-2 * I.rx},0 Z`;

  // Seta que inverte com o sentido da corrente e cresce com o módulo
  const arrowT = (c, y) => {
    const s = (wave >= 0 ? 1 : -1) * Math.max(0.2, Math.abs(wave));
    return `translate(${c} ${y}) scale(${s} 1) translate(${-c} ${-y})`;
  };

  // Mini-osciloscópio do relé (2 ciclos rolando)
  const scope = { x: 372, y: 72, w: 124, h: 36 };
  const amp = Math.min(16, 9 * load);
  const pts = [];
  for (let i = 0; i <= 62; i++) {
    const x = scope.x + (i / 62) * scope.w;
    const back = ((62 - i) / 62) * 2 * TAU;
    pts.push(`${x.toFixed(1)},${(scope.y + scope.h / 2 - amp * Math.sin(phase - back)).toFixed(1)}`);
  }
  const pickY = 9 * PICKUP;

  const chip = {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px",
    borderRadius: 999, fontSize: 13, fontWeight: 600, background: "#f0fdfa",
    color: "#0f766e", border: "1px solid #99f6e4",
  };

  return (
    <figure style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>
      <svg viewBox="0 0 520 300" width="100%" role="img"
        aria-label="Transformador de corrente animado: corrente alternada na barra primária, fluxo magnético no núcleo e corrente secundária chegando ao relé de proteção">
        <style>{`.tc3d-t{font-family:Inter,system-ui,sans-serif;fill:#0f172a}`}</style>
        <defs>
          <linearGradient id="tc3d-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafc" /><stop offset="1" stopColor="#eef2f7" />
          </linearGradient>
          <pattern id="tc3d-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
          <linearGradient id="tc3d-cu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbd3a6" /><stop offset="0.35" stopColor="#d9884a" />
            <stop offset="0.7" stopColor="#a8571f" /><stop offset="1" stopColor="#6b3410" />
          </linearGradient>
          <linearGradient id="tc3d-cu-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a4a1c" /><stop offset="1" stopColor="#3b1c08" />
          </linearGradient>
          <radialGradient id="tc3d-core" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#f1f5f9" /><stop offset="0.55" stopColor="#a3b1c2" />
            <stop offset="1" stopColor="#5f6d80" />
          </radialGradient>
          <linearGradient id="tc3d-core-back" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#475569" /><stop offset="1" stopColor="#334155" />
          </linearGradient>
          <radialGradient id="tc3d-hole" cx="0.6" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#1e293b" /><stop offset="1" stopColor="#0b1220" />
          </radialGradient>
          <radialGradient id="tc3d-shadow">
            <stop offset="0" stopColor="#0f172a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <filter id="tc3d-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="tc3d-hole-clip"><ellipse cx={cx} cy={cy} rx={I.rx} ry={I.ry} /></clipPath>
          <clipPath id="tc3d-scope-clip"><rect x={scope.x} y={scope.y} width={scope.w} height={scope.h} rx="4" /></clipPath>
          <marker id="tc3d-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#0f172a" />
          </marker>
          <marker id="tc3d-arrow-s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="#0d9488" />
          </marker>
        </defs>

        {/* Fundo */}
        <rect width="520" height="300" rx="16" fill="url(#tc3d-bg)" />
        <rect width="520" height="300" rx="16" fill="url(#tc3d-grid)" opacity="0.6" />
        <ellipse cx={cx + depth} cy="280" rx={60 + O.rx} ry="9" fill="url(#tc3d-shadow)" />
        <ellipse cx="260" cy={cy + 22} rx="250" ry="5" fill="url(#tc3d-shadow)" opacity="0.6" />

        {/* Barra primária — trecho atrás do núcleo */}
        <rect x={cx} y={cy - 12} width={500 - cx} height="24" fill="url(#tc3d-cu)" />
        <ellipse cx="500" cy={cy} rx="5" ry="12" fill="#c77a3e" stroke="#7a3d14" strokeWidth="0.8" />
        <line x1={cx + depth + O.rx + 4} y1={cy} x2="494" y2={cy} stroke="#fff" strokeOpacity="0.8"
          strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 13" strokeDashoffset={drift * 60 * load} />

        {/* Núcleo: face traseira, janela e barra vista pelo furo */}
        <ellipse cx={cx + depth} cy={cy} rx={O.rx} ry={O.ry} fill="url(#tc3d-core-back)" />
        <ellipse cx={cx} cy={cy} rx={I.rx} ry={I.ry} fill="url(#tc3d-hole)" />
        <g clipPath="url(#tc3d-hole-clip)">
          <rect x={cx} y={cy - 12} width={I.rx + depth} height="24" fill="url(#tc3d-cu-dark)" />
        </g>
        {/* Núcleo: face frontal */}
        <path d={annulus} fillRule="evenodd" fill="url(#tc3d-core)" stroke="#475569" strokeWidth="1" />

        {/* Fluxo magnético Φ circulando no núcleo */}
        <ellipse cx={cx} cy={cy} rx={(O.rx + I.rx) / 2} ry={(O.ry + I.ry) / 2} fill="none"
          stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 9"
          strokeDashoffset={drift * 45 * load} opacity={0.25 + 0.7 * Math.abs(wave) * Math.min(load, 1.2)}
          filter="url(#tc3d-glow)" />
        <text x={cx + O.rx + depth + 6} y={cy - 70} className="tc3d-t" fontSize="16" fontWeight="700"
          fill="#4f46e5" opacity={0.35 + 0.65 * Math.abs(wave)}>Φ</text>

        {/* Enrolamento secundário */}
        {turns.map(({ a, b }, i) => (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#9a4a17" strokeWidth="5" strokeLinecap="round" />
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f2a96a" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ))}

        {/* Barra primária — trecho à frente do núcleo */}
        <rect x="22" y={cy - 12} width={cx - 22} height="24" fill="url(#tc3d-cu)" />
        <ellipse cx="22" cy={cy} rx="5" ry="12" fill="#f0b47c" stroke="#7a3d14" strokeWidth="0.8" />
        <line x1="30" y1={cy} x2={cx - 4} y2={cy} stroke="#fff" strokeOpacity="0.8" strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray="7 13" strokeDashoffset={drift * 60 * load} />

        {/* Corrente primária (seta inverte a cada semiciclo) */}
        <line x1="48" y1="131" x2="140" y2="131" stroke="#0f172a" strokeWidth="2.2"
          markerEnd="url(#tc3d-arrow)" transform={arrowT(94, 131)} />
        <text x="48" y="118" className="tc3d-t" fontSize="15" fontWeight="700">Ip</text>
        <text x="68" y="118" className="tc3d-t" fontSize="12" fill="#475569">{Math.round(ipRms)} A rms</text>

        {/* Polaridade */}
        <circle cx="40" cy="191" r="4" fill="#0f172a" />
        <text x="50" y="196" className="tc3d-t" fontSize="12" fontWeight="600">P1</text>
        <text x="496" y="196" className="tc3d-t" fontSize="12" fontWeight="600" textAnchor="end">P2</text>

        {/* Ligações do secundário */}
        {[
          `M${s1.x} ${s1.y} V36 H360`,
          `M360 54 H${s2.x} V${s2.y}`,
        ].map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"
              strokeDasharray="5 9" strokeDashoffset={drift * 42 * load} />
          </g>
        ))}
        <circle cx={s1.x} cy={s1.y} r="3.5" fill="#0f172a" />
        <circle cx={s2.x} cy={s2.y} r="3.5" fill="#0f172a" />
        <text x={s1.x - 8} y={s1.y - 6} className="tc3d-t" fontSize="12" fontWeight="600" textAnchor="end">● S1</text>
        <text x={s2.x + 8} y={s2.y - 6} className="tc3d-t" fontSize="12" fontWeight="600">S2</text>

        {/* Corrente secundária */}
        <line x1="266" y1="22" x2="334" y2="22" stroke="#0d9488" strokeWidth="2.2"
          markerEnd="url(#tc3d-arrow-s)" transform={arrowT(300, 22)} />
        <text x="196" y="27" className="tc3d-t" fontSize="15" fontWeight="700" fill="#0d9488">Is</text>
        <text x="214" y="27" className="tc3d-t" fontSize="12" fill="#0f766e">{fmt(isRms)} A</text>

        {/* Relé de proteção com osciloscópio */}
        <g>
          <rect x="360" y="8" width="148" height="134" rx="10" fill="#fff" stroke="#cbd5e1" />
          <path d="M360 30 V18 a10 10 0 0 1 10 -10 H498 a10 10 0 0 1 10 10 V30 Z" fill="#0f766e" />
          <text x="434" y="24" className="tc3d-t" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">Relé 50/51</text>
          <rect x="372" y="38" width="124" height="28" rx="4" fill="#0f172a" />
          <text x="380" y="57" fontFamily="ui-monospace, monospace" fontSize="12" fill="#5eead4">Ia {fmt(isRms)} A</text>
          <text x="489" y="57" fontFamily="ui-monospace, monospace" fontSize="10" fill="#94a3b8" textAnchor="end">
            {isInst >= 0 ? "+" : "−"}{fmt(Math.abs(isInst), 1)}
          </text>
          <rect x={scope.x} y={scope.y} width={scope.w} height={scope.h} rx="4" fill="#0b1220" />
          <g clipPath="url(#tc3d-scope-clip)">
            <line x1={scope.x} y1={scope.y + scope.h / 2} x2={scope.x + scope.w} y2={scope.y + scope.h / 2} stroke="#1e293b" />
            <line x1={scope.x} y1={scope.y + scope.h / 2 - pickY} x2={scope.x + scope.w} y2={scope.y + scope.h / 2 - pickY}
              stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity="0.7" />
            <line x1={scope.x} y1={scope.y + scope.h / 2 + pickY} x2={scope.x + scope.w} y2={scope.y + scope.h / 2 + pickY}
              stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity="0.7" />
            <polyline points={pts.join(" ")} fill="none" stroke={trip ? "#f87171" : "#2dd4bf"} strokeWidth="1.8" />
            <circle cx={scope.x + scope.w - 2} cy={scope.y + scope.h / 2 - amp * wave} r="2.6" fill="#fff" />
          </g>
          <circle cx="378" cy="126" r="4.5" fill={trip ? "#f59e0b" : "#22c55e"}
            opacity={trip ? 0.5 + 0.5 * Math.abs(Math.sin(phase * 3)) : 1} />
          <text x="388" y="130" className="tc3d-t" fontSize="10.5" fill={trip ? "#b45309" : "#475569"} fontWeight={trip ? 700 : 400}>
            {trip ? "Partida 51 (I > 1,2·In)" : "Em serviço"}
          </text>
          <circle cx="360" cy="36" r="3" fill="#475569" />
          <circle cx="360" cy="54" r="3" fill="#475569" />
        </g>

        {/* Legenda */}
        <path d={`M${cx + O.rx + depth - 4} 228 L296 250`} stroke="#94a3b8" strokeWidth="1" />
        <text x="300" y="254" className="tc3d-t" fontSize="12" fill="#475569">Núcleo toroidal + enrolamento N2</text>
        <text x="300" y="270" className="tc3d-t" fontSize="12" fill="#475569">Primário: barra passante (N1 = 1)</text>
        <text x="300" y="286" className="tc3d-t" fontSize="10.5" fill="#94a3b8">60 Hz em câmera lenta</text>
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 12 }}>
        <button type="button" onClick={() => setPlaying((p) => !p)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #0f766e", background: playing ? "#fff" : "#0f766e",
            color: playing ? "#0f766e" : "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          {playing ? "❚❚ Pausar" : "▶ Animar"}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", flex: "1 1 220px" }}>
          Carga
          <input type="range" min="0.2" max="2" step="0.05" value={load}
            onChange={(e) => setLoad(Number(e.target.value))} style={{ flex: 1, accentColor: "#0f766e" }} />
          <strong style={{ minWidth: 64, textAlign: "right" }}>{fmt(load * 100, 0)}% In</strong>
        </label>
      </div>

      <figcaption style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        <span style={chip}>RTC {ip}-{is} A ({ratio}:1)</span>
        <span style={chip}>Ip / Is = N2 / N1</span>
        <span style={{ ...chip, background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>
          ⚠ Nunca abra o secundário com o primário energizado
        </span>
      </figcaption>
    </figure>
  );
}
