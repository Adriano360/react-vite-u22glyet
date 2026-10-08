import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Pause, Play, RotateCcw, XCircle, Zap } from 'lucide-react';
import './ProtecaoBloqueioReverso.css';

// Fonte técnica: apresentação "07.1 - Proteção de barras - Bloqueio Reverso"
// (CFM - Curso de Formação de Mantenedores). Conteúdo restrito ao que está no material.

const roteiro = [
  { id: 'introducao', label: 'Introdução' },
  { id: 'reles', label: 'Relés do esquema' },
  { id: 'simulador', label: 'Simulador de defeito' },
  { id: 'seletividade', label: 'Seletividade e 86-3' },
  { id: 'teste', label: 'Teste rápido' },
];

const tabela863 = [
  { rele: '86-3 C7', principais: '50B/50BN 7C', disjuntores: '3105 e (*) 3188', juncao: '3188', secoes: [1, 10], barra: '3P (sec. 1 ou 10)' },
  { rele: '86-3 D8', principais: '50B/50BN 8D', disjuntores: '3415 e (*) 3188', juncao: '3188', secoes: [9], barra: '3P (sec. 9)' },
  { rele: '86-3 C8', principais: '50B/50BN 8C', disjuntores: '3211 e (*) 3126', juncao: '3126', secoes: [3], barra: '3P (sec. 3)' },
  { rele: '86-3 C22', principais: '50B/50BN 22C', disjuntores: '3358 e (*) 3126', juncao: '3126', secoes: [4], barra: '3P (sec. 4)' },
  { rele: '86-3 D9', principais: '50B/50BN 9D', disjuntores: '3596 e (*) 3805', juncao: '3805', secoes: [7], barra: '3P (sec. 7)' },
  { rele: '86-3 D21', principais: '50B/50BN 21D', disjuntores: '3457 e (*) 3805', juncao: '3805', secoes: [6], barra: '3P (sec. 6)' },
];

const locais = [
  { id: 'alimA', label: 'Alimentador 4A' },
  { id: 'barraA', label: 'Barra – seção A' },
  { id: 'barraB', label: 'Barra – seção B' },
  { id: 'alimB', label: 'Alimentador 4B' },
];

// Monta a sequência de eventos de cada cenário
function montarCenario(local, tipo) {
  const ft = tipo === 'ft';
  const reBarra = ft ? '50BN' : '50B';
  const reAlim = ft ? '50/51N' : '50/51 (fase)';
  const nomeDefeito = ft ? 'fase-terra' : 'fase-fase';
  const lado = local.endsWith('A') ? 'A' : 'B';
  const geral = `2${lado}`;
  const alim = `4${lado}`;

  if (local.startsWith('alim')) {
    return {
      resumo: `Defeito no alimentador: só o disjuntor ${alim} abre. A barra continua energizada.`,
      passos: [
        {
          texto: `Curto-circuito ${nomeDefeito} no alimentador ${alim}. A corrente de defeito passa pelo disjuntor geral ${geral} e pelo alimentador ${alim}.`,
          reles: { [geral]: 'sensibiliza', [alim]: 'sensibiliza' },
          abertos: [],
        },
        {
          texto: `O ${reBarra} do geral ${geral} sensibiliza, mas NÃO opera: o defeito está no alimentador, não na barra. O relé do alimentador, ao partir, bloqueia a proteção de barra.`,
          reles: { [geral]: 'bloqueado', [alim]: 'sensibiliza' },
          abertos: [],
        },
        {
          texto: `O ${reAlim} do alimentador ${alim} opera e abre o disjuntor ${alim}. A barra e os demais circuitos continuam em serviço.`,
          reles: { [geral]: 'bloqueado', [alim]: 'opera' },
          abertos: [alim],
        },
      ],
    };
  }

  return {
    resumo: `Defeito na seção ${lado}: abrem o geral ${geral} e a junção J. A seção ${lado === 'A' ? 'B' : 'A'} continua alimentada.`,
    passos: [
      {
        texto: `Defeito ${nomeDefeito} na seção ${lado} do barramento, entre o geral ${geral} e a junção J. Nenhum alimentador enxerga o defeito, então não há sinal de bloqueio.`,
        reles: { [geral]: 'sensibiliza' },
        abertos: [],
      },
      {
        texto: `O ${reBarra} (${geral}) opera e energiza o relé auxiliar 86-3 (${geral}).`,
        reles: { [geral]: 'opera' },
        abertos: [],
      },
      {
        texto: `O 86-3 (${geral}) abre o disjuntor geral ${geral} e abre e bloqueia o disjuntor de junção J. Só a seção defeituosa é isolada — essa é a seletividade do esquema.`,
        reles: { [geral]: 'opera' },
        abertos: [geral, 'J'],
        secaoMorta: lado,
      },
    ],
  };
}

const perguntas = [
  {
    q: 'Qual é a finalidade da proteção de barras de 13,8 kV tipo bloqueio reverso?',
    opcoes: [
      'Proteger o transformador contra sobrecarga',
      'Proteger o barramento para defeitos fase-fase e fase-terra',
      'Proteger os alimentadores contra subtensão',
      'Medir a energia entregue pela barra',
    ],
    certa: 1,
    porque: 'O material define: tem por finalidade proteger o barramento para defeitos envolvendo fase-fase e fase-terra.',
  },
  {
    q: 'O que diferencia o bloqueio reverso da proteção de barras tipo bloqueio?',
    opcoes: [
      'O bloqueio reverso é seletivo: identifica e isola só a seção defeituosa',
      'O bloqueio reverso não usa relé 86',
      'O bloqueio reverso só atua para defeito fase-terra',
      'Não há diferença entre os dois esquemas',
    ],
    certa: 0,
    porque: 'Ao contrário da proteção tipo bloqueio, que não é seletiva, o bloqueio reverso identifica a seção de barra defeituosa e isola apenas ela.',
  },
  {
    q: 'Defeito fase-terra no alimentador. O que acontece com o 50BN do disjuntor geral?',
    opcoes: [
      'Opera e desliga a barra inteira',
      'Não enxerga o defeito',
      'Sensibiliza, mas não opera, porque o defeito não está na barra',
      'Opera e abre só a junção',
    ],
    certa: 2,
    porque: 'O 50BN do geral sensibiliza, mas não opera; quem opera é o 50/51N do alimentador.',
  },
  {
    q: 'Defeito na barra entre o geral 2A e a junção J. Qual é a sequência correta?',
    opcoes: [
      '86-3 (2A) → 50BN (2A) → abre 2B',
      '50BN (2A) → 86-3 (2A) → abre 2A e abre e bloqueia J',
      '50/51N do alimentador → abre o alimentador',
      '50BN (J) → abre 2A e 2B',
    ],
    certa: 1,
    porque: 'Sequência do material: 50BN (2A) → 86-3 (2A), com abertura do disjuntor 2A e abertura e bloqueio do disjuntor de junção.',
  },
  {
    q: 'Quais relés de bloqueio reverso existem em cada disjuntor de junção?',
    opcoes: ['50B, 50BN e 86-3', 'Somente 86-3', '50B e 50BN', 'Somente 50/51N'],
    certa: 2,
    porque: 'Cada geral possui 50B, 50BN e 86-3; cada junção possui 50B e 50BN.',
  },
  {
    q: 'Pela tabela da instalação, qual relé auxiliar atua para defeito na seção 9?',
    opcoes: ['86-3 C7', '86-3 D8', '86-3 D9', '86-3 C22'],
    certa: 1,
    porque: '86-3 D8 (principais 50B/50BN 8D) desliga 3415 e desliga/bloqueia 3188 para defeito na 3P seção 9.',
  },
];

// ---------------------------------------------------------------------------

function Disjuntor({ x, y, id, aberto, vertical = true }) {
  const w = vertical ? 18 : 26;
  const h = vertical ? 26 : 18;
  return (
    <g className="br-disjuntor">
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx="3"
        fill={aberto ? '#16a34a' : '#dc2626'}
        stroke="#0f172a"
        strokeWidth="1.2"
        className={aberto ? 'br-abrindo' : ''}
      />
      <text x={x + (vertical ? 14 : 0)} y={y + (vertical ? 4 : -16)} textAnchor={vertical ? 'start' : 'middle'} className="br-svg-label">
        {id}
      </text>
    </g>
  );
}

function ReleTag({ x, y, nomes, estado }) {
  const cores = {
    sensibiliza: ['#fef3c7', '#d97706', 'Sensibiliza'],
    bloqueado: ['#e0e7ff', '#4f46e5', 'Bloqueado'],
    opera: ['#fee2e2', '#dc2626', 'Opera'],
  };
  const [bg, cor, rotulo] = cores[estado] || ['#ffffff', '#94a3b8', ''];
  return (
    <g className={estado ? 'br-rele-ativo' : ''}>
      <rect x={x} y={y} width="128" height={estado ? 50 : 30} rx="7" fill={bg} stroke={cor} strokeWidth={estado ? 2.5 : 1.2} />
      <text x={x + 64} y={y + 21} textAnchor="middle" className="br-svg-rele">{nomes}</text>
      {estado && (
        <text x={x + 64} y={y + 41} textAnchor="middle" className="br-svg-estado" fill={cor}>{rotulo}</text>
      )}
    </g>
  );
}

function SimuladorDefeito() {
  const [local, setLocal] = useState(null);
  const [tipo, setTipo] = useState('ft');
  const [passo, setPasso] = useState(0);
  const [auto, setAuto] = useState(false);

  const cenario = useMemo(() => (local ? montarCenario(local, tipo) : null), [local, tipo]);
  const atual = cenario ? cenario.passos[passo] : null;
  const ultimo = cenario ? passo === cenario.passos.length - 1 : false;

  useEffect(() => {
    if (!auto || !cenario) return undefined;
    if (ultimo) {
      setAuto(false);
      return undefined;
    }
    const id = setTimeout(() => setPasso((p) => p + 1), 2600);
    return () => clearTimeout(id);
  }, [auto, passo, cenario, ultimo]);

  function escolher(id) {
    setLocal(id);
    setPasso(0);
    setAuto(true);
  }

  function reiniciar() {
    setLocal(null);
    setPasso(0);
    setAuto(false);
  }

  const reles = atual?.reles || {};
  const abertos = new Set(atual?.abertos || []);
  const morta = atual?.secaoMorta;
  const sufixo = tipo === 'ft' ? 'N' : '';
  const corBarra = (lado) => (morta === lado ? '#94a3b8' : '#0f766e');

  const pontos = {
    alimA: { x: 210, y: 268 },
    barraA: { x: 150, y: 160 },
    barraB: { x: 570, y: 160 },
    alimB: { x: 510, y: 268 },
  };

  return (
    <div className="br-sim">
      <div className="br-sim-toolbar">
        <div className="br-segmented" role="group" aria-label="Tipo de defeito">
          <button type="button" className={tipo === 'ft' ? 'ativo' : ''} onClick={() => { setTipo('ft'); setPasso(0); }}>
            Fase-terra
          </button>
          <button type="button" className={tipo === 'ff' ? 'ativo' : ''} onClick={() => { setTipo('ff'); setPasso(0); }}>
            Fase-fase
          </button>
        </div>
        <span className="br-sim-hint">
          {local ? 'Acompanhe a sequência ou escolha outro ponto.' : 'Toque em um ponto ⚡ do diagrama para aplicar o defeito.'}
        </span>
      </div>

      <svg viewBox="0 0 720 330" className="br-sim-svg" role="img" aria-label="Diagrama unifilar simplificado: dois disjuntores gerais, junção de barras e dois alimentadores">
        <defs>
          <pattern id="br-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#eef2f7" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="720" height="330" rx="14" fill="#fbfdfd" />
        <rect width="720" height="330" rx="14" fill="url(#br-grid)" />

        {/* Transformadores 138-13,8 kV */}
        {[{ x: 100, n: 'TR A' }, { x: 620, n: 'TR B' }].map((t) => (
          <g key={t.n}>
            <line x1={t.x} y1="10" x2={t.x} y2="30" stroke="#334155" strokeWidth="3" />
            <circle cx={t.x} cy="42" r="13" fill="none" stroke="#334155" strokeWidth="2.5" />
            <circle cx={t.x} cy="58" r="13" fill="none" stroke="#334155" strokeWidth="2.5" />
            <text x={t.x + (t.x < 360 ? -22 : 22)} y="54" textAnchor={t.x < 360 ? 'end' : 'start'} className="br-svg-label">{t.n}</text>
            <text x={t.x + (t.x < 360 ? -22 : 22)} y="68" textAnchor={t.x < 360 ? 'end' : 'start'} className="br-svg-small">138-13,8 kV</text>
            <line x1={t.x} y1="71" x2={t.x} y2="160" stroke="#334155" strokeWidth="3" />
          </g>
        ))}

        {/* Barramento 13,8 kV em duas seções */}
        <line x1="40" y1="160" x2="342" y2="160" stroke={corBarra('A')} strokeWidth="7" strokeLinecap="round" />
        <line x1="378" y1="160" x2="680" y2="160" stroke={corBarra('B')} strokeWidth="7" strokeLinecap="round" />
        <line x1="342" y1="160" x2="378" y2="160" stroke="#334155" strokeWidth="3" />
        <text x="60" y="150" className="br-svg-small">Seção A</text>
        <text x="660" y="150" textAnchor="end" className="br-svg-small">Seção B</text>

        {/* Alimentadores */}
        {[{ x: 210, n: '4A' }, { x: 510, n: '4B' }].map((a) => (
          <g key={a.n}>
            <line x1={a.x} y1="160" x2={a.x} y2="310" stroke={morta === a.n.slice(-1) ? '#94a3b8' : '#334155'} strokeWidth="3" />
            <path d={`M${a.x - 6} 300 L${a.x} 312 L${a.x + 6} 300`} fill="none" stroke="#334155" strokeWidth="2" />
          </g>
        ))}

        <Disjuntor x={100} y={115} id="2A" aberto={abertos.has('2A')} />
        <Disjuntor x={620} y={115} id="2B" aberto={abertos.has('2B')} />
        <Disjuntor x={360} y={160} id="J" aberto={abertos.has('J')} vertical={false} />
        <Disjuntor x={210} y={215} id="4A" aberto={abertos.has('4A')} />
        <Disjuntor x={510} y={215} id="4B" aberto={abertos.has('4B')} />

        <ReleTag x={142} y={78} nomes={`50B${sufixo} · 86-3`} estado={reles['2A']} />
        <ReleTag x={464} y={78} nomes={`50B${sufixo} · 86-3`} estado={reles['2B']} />
        <ReleTag x={296} y={182} nomes="50B · 50BN" estado={reles.J} />
        <ReleTag x={228} y={256} nomes={tipo === 'ft' ? '50/51N' : '50/51'} estado={reles['4A']} />
        <ReleTag x={364} y={256} nomes={tipo === 'ft' ? '50/51N' : '50/51'} estado={reles['4B']} />

        {/* Pontos de defeito clicáveis */}
        {locais.map((l) => {
          const p = pontos[l.id];
          const sel = local === l.id;
          return (
            <g
              key={l.id}
              className={`br-ponto ${sel ? 'sel' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Aplicar defeito: ${l.label}`}
              onClick={() => escolher(l.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') escolher(l.id); }}
            >
              <circle cx={p.x} cy={p.y} r="17" className="br-ponto-anel" />
              <circle cx={p.x} cy={p.y} r="12" fill={sel ? '#f59e0b' : '#ffffff'} stroke="#f59e0b" strokeWidth="2" />
              <path
                d={`M${p.x + 2} ${p.y - 8} L${p.x - 4} ${p.y + 1} L${p.x} ${p.y + 1} L${p.x - 2} ${p.y + 8} L${p.x + 5} ${p.y - 2} L${p.x + 1} ${p.y - 2} Z`}
                fill={sel ? '#ffffff' : '#f59e0b'}
              />
            </g>
          );
        })}
      </svg>

      <div className="br-legenda">
        <span><i style={{ background: '#dc2626' }} /> Disjuntor fechado</span>
        <span><i style={{ background: '#16a34a' }} /> Disjuntor aberto</span>
        <span><i style={{ background: '#fef3c7', borderColor: '#d97706' }} /> Sensibiliza</span>
        <span><i style={{ background: '#e0e7ff', borderColor: '#4f46e5' }} /> Bloqueado</span>
        <span><i style={{ background: '#fee2e2', borderColor: '#dc2626' }} /> Opera</span>
      </div>

      <div className="br-locais">
        {locais.map((l) => (
          <button key={l.id} type="button" className={local === l.id ? 'ativo' : ''} onClick={() => escolher(l.id)}>
            <Zap size={14} /> {l.label}
          </button>
        ))}
      </div>

      {cenario && (
        <div className="br-passos" aria-live="polite">
          <ol>
            {cenario.passos.map((p, i) => (
              <li key={i} className={i === passo ? 'atual' : i < passo ? 'feito' : ''}>
                <button type="button" onClick={() => { setPasso(i); setAuto(false); }}>
                  <span className="br-num">{i + 1}</span>
                  <span>{p.texto}</span>
                </button>
              </li>
            ))}
          </ol>
          {ultimo && <p className="br-resumo"><CheckCircle2 size={18} /> {cenario.resumo}</p>}
          <div className="br-passos-acoes">
            <button type="button" onClick={() => setAuto((a) => !a)} disabled={ultimo}>
              {auto ? <Pause size={16} /> : <Play size={16} />} {auto ? 'Pausar' : 'Reproduzir'}
            </button>
            <button type="button" onClick={() => { setPasso((p) => Math.min(p + 1, cenario.passos.length - 1)); setAuto(false); }} disabled={ultimo}>
              Próximo passo <ChevronRight size={16} />
            </button>
            <button type="button" className="sec" onClick={reiniciar}>
              <RotateCcw size={16} /> Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Consulta863() {
  const secoes = [1, 3, 4, 6, 7, 9, 10];
  const [secao, setSecao] = useState(null);
  const linha = tabela863.find((l) => l.secoes.includes(secao));

  return (
    <div className="br-863">
      <p className="br-863-pergunta">Defeito em qual seção da barra 3P?</p>
      <div className="br-locais">
        {secoes.map((s) => (
          <button key={s} type="button" className={secao === s ? 'ativo' : ''} onClick={() => setSecao(s)}>
            Seção {s}
          </button>
        ))}
      </div>

      {linha && (
        <div className="br-863-resposta" key={linha.rele}>
          <div><small>Relé auxiliar que atua</small><strong>{linha.rele}</strong></div>
          <div><small>Relés principais</small><strong>{linha.principais}</strong></div>
          <div><small>Desliga e (*) bloqueia</small><strong>{linha.disjuntores}</strong></div>
          <div><small>Disjuntor de junção</small><strong>{linha.juncao} aberto ou fechado</strong></div>
        </div>
      )}

      <div className="protection-table-wrap">
        <table className="protection-reference-table">
          <thead>
            <tr>
              <th>Relé auxiliar</th>
              <th>Relés principais</th>
              <th>Desliga e (*) bloqueia</th>
              <th>Estado da junção</th>
              <th>Barra com defeito</th>
            </tr>
          </thead>
          <tbody>
            {tabela863.map((l) => (
              <tr key={l.rele} className={linha?.rele === l.rele ? 'br-linha-ativa' : ''}>
                <td>{l.rele}</td>
                <td>{l.principais}</td>
                <td>{l.disjuntores}</td>
                <td>{l.juncao} ⇒ aberto ou fechado</td>
                <td>{l.barra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="br-fonte">Tabela da instalação apresentada no material do curso. (*) disjuntor desligado e bloqueado.</p>
    </div>
  );
}

function TesteRapido() {
  const [respostas, setRespostas] = useState({});
  const total = perguntas.length;
  const respondidas = Object.keys(respostas).length;
  const acertos = perguntas.filter((p, i) => respostas[i] === p.certa).length;

  return (
    <div className="br-quiz">
      <div className="br-quiz-placar">
        <span>{respondidas} de {total} respondidas</span>
        <div className="br-barra"><div style={{ width: `${(respondidas / total) * 100}%` }} /></div>
        <strong>{acertos} acerto{acertos === 1 ? '' : 's'}</strong>
      </div>

      {perguntas.map((p, i) => {
        const r = respostas[i];
        const feito = r !== undefined;
        return (
          <fieldset key={i} className="br-quiz-q">
            <legend>{i + 1}. {p.q}</legend>
            {p.opcoes.map((o, j) => {
              const estado = feito ? (j === p.certa ? 'certa' : j === r ? 'errada' : '') : '';
              return (
                <button
                  key={j}
                  type="button"
                  className={`br-opcao ${estado}`}
                  disabled={feito}
                  onClick={() => setRespostas((prev) => ({ ...prev, [i]: j }))}
                >
                  {estado === 'certa' && <CheckCircle2 size={16} />}
                  {estado === 'errada' && <XCircle size={16} />}
                  {o}
                </button>
              );
            })}
            {feito && (
              <p className={`br-feedback ${r === p.certa ? 'ok' : 'nok'}`}>
                <strong>{r === p.certa ? 'Correto!' : 'Ainda não.'}</strong> {p.porque}
              </p>
            )}
          </fieldset>
        );
      })}

      {respondidas === total && (
        <div className="br-quiz-final">
          <strong>Resultado: {acertos} de {total} ({Math.round((acertos / total) * 100)}%)</strong>
          <button type="button" onClick={() => setRespostas({})}><RotateCcw size={16} /> Refazer teste</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function ProtecaoBloqueioReversoView({ onBackHome }) {
  return (
    <div className="protection-lesson-page br-page">
      <button type="button" className="lesson-back-button" onClick={onBackHome}>
        <ArrowLeft size={18} />
        Voltar para Início
      </button>

      <section className="protection-hero">
        <img
          className="protection-hero-bg"
          src="/images/protecao-diferencial-barras/painel-subestacao-13-8kv.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="protection-hero-overlay" aria-hidden="true" />
        <div className="protection-hero-content">
          <span className="protection-kicker">Aula técnica para mantenedores</span>
          <h1>Proteção de barras 13,8&nbsp;kV <span className="protection-title-break" />Bloqueio reverso</h1>
          <p>
            Entenda como o esquema identifica a seção de barra com defeito, por que o relé do geral
            não atua para defeitos no alimentador e qual 86-3 opera em cada seção.
          </p>
        </div>
      </section>

      <div className="protection-layout">
        <aside className="protection-sidebar" aria-label="Roteiro lateral da aula">
          <strong>Roteiro da aula</strong>
          <nav>
            {roteiro.map((r) => (
              <a key={r.id} href={`#${r.id}`}>{r.label}</a>
            ))}
          </nav>
        </aside>

        <div className="protection-content">
          <section id="introducao" className="protection-section">
            <div className="protection-section-copy">
              <h2>Introdução</h2>
              <p>
                A proteção de barras de 13,8 kV tem por finalidade proteger o barramento para defeitos
                envolvendo <strong>fase-fase</strong> e <strong>fase-terra</strong>.
              </p>
              <p>
                Ao contrário da proteção tipo bloqueio, que não é seletiva, o bloqueio reverso consegue
                identificar a <strong>seção de barra defeituosa</strong> e isolar somente ela. Essa
                seletividade é a característica principal do esquema.
              </p>
            </div>
            <div className="br-compare">
              <article>
                <small>Proteção tipo bloqueio</small>
                <strong>Não seletiva</strong>
                <p>Não identifica qual seção da barra está com defeito.</p>
              </article>
              <article className="destaque">
                <small>Bloqueio reverso</small>
                <strong>Seletiva</strong>
                <p>Isola só a seção com defeito; as demais seguem em serviço.</p>
              </article>
            </div>
          </section>

          <section id="reles" className="protection-section">
            <div className="protection-section-copy">
              <h2>Relés que compõem o esquema</h2>
            </div>
            <div className="br-cards">
              <article>
                <span className="br-code">F.50B</span>
                <p>Sobrecorrente instantânea de barra para defeito <strong>fase-fase</strong> (fases a, b, c).</p>
              </article>
              <article>
                <span className="br-code">F.50BN</span>
                <p>Sobrecorrente instantânea de barra para defeito <strong>fase-terra</strong>.</p>
              </article>
              <article>
                <span className="br-code">F.86-3</span>
                <p>Relé auxiliar de bloqueio: abre e bloqueia os disjuntores da seção defeituosa e dá alarme.</p>
              </article>
            </div>
            <div className="br-onde">
              <div><strong>Cada disjuntor geral</strong><span>50B · 50BN · 86-3</span></div>
              <div><strong>Cada disjuntor de junção</strong><span>50B · 50BN</span></div>
            </div>
            <div className="protection-maintainer-note">
              <strong>Circuito de comando</strong>
              <p>
                Os contatos de 50Ba, 50Bb, 50Bc e 50BN, em paralelo no 132 Vcc, energizam o 86-3, que comanda a
                abertura do disjuntor, o alarme e os demais desligamentos do esquema.
              </p>
            </div>
          </section>

          <section id="simulador" className="protection-section">
            <div className="protection-section-copy">
              <h2>Simulador de defeito</h2>
              <p>
                Escolha o tipo e o local do defeito e veja, passo a passo, quais relés sensibilizam, quais são
                bloqueados e quais disjuntores abrem.
              </p>
            </div>
            <SimuladorDefeito />
            <div className="protection-maintainer-note">
              <strong>Observação operacional</strong>
              <p>
                Diagrama didático simplificado. Na análise de uma ocorrência real, siga os diagramas da
                instalação e os procedimentos internos.
              </p>
            </div>
          </section>

          <section id="seletividade" className="protection-section">
            <div className="protection-section-copy">
              <h2>Seletividade: qual 86-3 atua?</h2>
              <p>
                Cada geral possui o seu 50B, 50BN e 86-3, e cada junção possui o seu 50B e 50BN. É isso que
                permite ao esquema desligar somente a seção com defeito. Escolha uma seção para consultar.
              </p>
            </div>
            <Consulta863 />
          </section>

          <section id="teste" className="protection-section">
            <div className="protection-section-copy">
              <h2>Teste rápido</h2>
              <p>Responda e veja a explicação na hora.</p>
            </div>
            <TesteRapido />
          </section>
        </div>
      </div>
    </div>
  );
}
