import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, XCircle, Zap } from 'lucide-react';
import './ProtecaoBloqueioReverso.css';

// Fonte técnica: apresentação "07.1 - Proteção de barras - Bloqueio Reverso"
// (CFM - Curso de Formação de Mantenedores). Conteúdo restrito ao que está no material.

const roteiro = [
  { id: 'introducao', label: 'Conceito' },
  { id: 'reles', label: 'Relés' },
  { id: 'simulador', label: 'Simulador' },
  { id: 'seletividade', label: 'Qual 86-3?' },
  { id: 'teste', label: 'Teste' },
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
      resumo: `Só o alimentador ${alim} é desligado. A barra continua energizada.`,
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
    resumo: `Só a seção ${lado} fica sem energia. A seção ${lado === 'A' ? 'B' : 'A'} continua alimentada.`,
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
        texto: `O 86-3 (${geral}) abre o geral ${geral} e bloqueia o fechamento da junção J (que já fica aberta). A seção ${lado} e seus alimentadores ficam sem energia.`,
        reles: { [geral]: 'opera' },
        abertos: [geral, 'J'],
        bloqueados: ['J'],
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
      '50BN (2A) → 86-3 (2A) → abre 2A e bloqueia o fechamento de J',
      '50/51N do alimentador → abre o alimentador',
      '50BN (J) → abre 2A e 2B',
    ],
    certa: 1,
    porque: 'Com os gerais fechados e a junção normalmente aberta: 50BN (2A) → 86-3 (2A), com abertura do disjuntor 2A e bloqueio do fechamento da junção J.',
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

function Disjuntor({ x, y, id, aberto, fechamentoBloqueado = false, vertical = true }) {
  const w = vertical ? 18 : 26;
  const h = vertical ? 26 : 18;
  return (
    <g className="br-disjuntor">
      <title>{`Disjuntor ${id}: ${aberto ? 'aberto' : 'fechado'}${fechamentoBloqueado ? ', fechamento bloqueado' : ''}`}</title>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx="3"
        fill={aberto ? '#16a34a' : '#dc2626'}
        stroke={fechamentoBloqueado ? '#4f46e5' : '#0f172a'}
        strokeWidth={fechamentoBloqueado ? 3 : 1.2}
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
  }

  function reiniciar() {
    setLocal(null);
    setPasso(0);
    setAuto(false);
  }

  const reles = atual?.reles || {};
  const abertos = new Set(['J', ...(atual?.abertos || [])]);
  const bloqueados = new Set(atual?.bloqueados || []);
  const sufixo = tipo === 'ft' ? 'N' : '';
  const secaoEnergizada = (lado) => !abertos.has(`2${lado}`)
    || (!abertos.has('J') && !abertos.has(`2${lado === 'A' ? 'B' : 'A'}`));
  const corCircuito = (energizado) => (energizado ? '#0f766e' : '#94a3b8');
  const corBarra = (lado) => corCircuito(secaoEnergizada(lado));

  const pontos = {
    alimA: { x: 210, y: 268 },
    barraA: { x: 150, y: 160 },
    barraB: { x: 570, y: 160 },
    alimB: { x: 510, y: 268 },
  };

  return (
    <div className="br-sim">
      <div className="br-segmented" role="group" aria-label="Tipo de defeito">
        <button type="button" className={tipo === 'ft' ? 'ativo' : ''} onClick={() => { setTipo('ft'); setPasso(0); }}>
          Fase-terra
        </button>
        <button type="button" className={tipo === 'ff' ? 'ativo' : ''} onClick={() => { setTipo('ff'); setPasso(0); }}>
          Fase-fase
        </button>
      </div>

      <svg viewBox="0 0 720 330" className="br-sim-svg" role="img" aria-label="Diagrama unifilar simplificado: dois disjuntores gerais, junção de barras normalmente aberta e dois alimentadores">
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
            <line x1={t.x} y1="71" x2={t.x} y2="115" stroke="#334155" strokeWidth="3" />
            <line x1={t.x} y1="115" x2={t.x} y2="160" stroke={corBarra(t.x < 360 ? 'A' : 'B')} strokeWidth="3" />
          </g>
        ))}

        {/* Barramento 13,8 kV em duas seções */}
        <line x1="40" y1="160" x2="342" y2="160" stroke={corBarra('A')} strokeWidth="7" strokeLinecap="round" />
        <line x1="378" y1="160" x2="680" y2="160" stroke={corBarra('B')} strokeWidth="7" strokeLinecap="round" />
        <line x1="342" y1="160" x2="360" y2="160" stroke={corBarra('A')} strokeWidth="3" />
        <line x1="360" y1="160" x2="378" y2="160" stroke={corBarra('B')} strokeWidth="3" />
        <text x="60" y="150" className="br-svg-small">Seção A</text>
        <text x="660" y="150" textAnchor="end" className="br-svg-small">Seção B</text>

        {/* Alimentadores */}
        {[{ x: 210, n: '4A' }, { x: 510, n: '4B' }].map((a) => (
          <g key={a.n}>
            <line x1={a.x} y1="160" x2={a.x} y2="215" stroke={corBarra(a.n.slice(-1))} strokeWidth="3" />
            <line x1={a.x} y1="215" x2={a.x} y2="310" stroke={corCircuito(secaoEnergizada(a.n.slice(-1)) && !abertos.has(a.n))} strokeWidth="3" />
            <path d={`M${a.x - 6} 300 L${a.x} 312 L${a.x + 6} 300`} fill="none" stroke={corCircuito(secaoEnergizada(a.n.slice(-1)) && !abertos.has(a.n))} strokeWidth="2" />
          </g>
        ))}

        <Disjuntor x={100} y={115} id="2A" aberto={abertos.has('2A')} />
        <Disjuntor x={620} y={115} id="2B" aberto={abertos.has('2B')} />
        <Disjuntor x={360} y={160} id="J" aberto={abertos.has('J')} fechamentoBloqueado={bloqueados.has('J')} vertical={false} />
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

      <p className="br-caption">Normal: gerais 2A e 2B fechados · junção J aberta.</p>

      {!cenario && (
        <>
          <p className="br-cta">Onde ocorre o defeito?</p>
          <div className="br-locais br-grid2">
            {locais.map((l) => (
              <button key={l.id} type="button" onClick={() => escolher(l.id)}>
                <Zap size={14} /> {l.label}
              </button>
            ))}
          </div>
        </>
      )}

      {cenario && (
        <div className="br-passo" aria-live="polite">
          <div className="br-passo-topo">
            <span className="br-chip-local"><Zap size={13} /> {locais.find((l) => l.id === local)?.label}</span>
            <span className="br-dots" aria-label={`Passo ${passo + 1} de ${cenario.passos.length}`}>
              {cenario.passos.map((_, i) => <i key={i} className={i <= passo ? 'on' : ''} />)}
            </span>
          </div>
          <p key={`${local}-${tipo}-${passo}`} className="br-passo-texto">
            <strong>{passo + 1}.</strong> {atual.texto}
          </p>
          {ultimo && <p className="br-resumo"><CheckCircle2 size={18} /> {cenario.resumo}</p>}
          <div className="br-passo-acoes">
            <button type="button" className="sec icone" aria-label="Passo anterior" disabled={passo === 0}
              onClick={() => { setPasso((v) => Math.max(v - 1, 0)); setAuto(false); }}>
              <ChevronLeft size={18} />
            </button>
            {!ultimo ? (
              <button type="button" onClick={() => { setPasso((v) => v + 1); setAuto(false); }}>
                Próximo <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={reiniciar}>
                <RotateCcw size={16} /> Outro defeito
              </button>
            )}
          </div>
        </div>
      )}

      <details className="br-legenda-box">
        <summary>Legenda</summary>
        <div className="br-legenda">
          <span><i style={{ background: '#0f766e' }} /> Energizado</span>
          <span><i style={{ background: '#94a3b8' }} /> Sem energia</span>
          <span><i style={{ background: '#dc2626' }} /> Disjuntor fechado</span>
          <span><i style={{ background: '#16a34a' }} /> Disjuntor aberto</span>
          <span><i style={{ background: '#16a34a', borderColor: '#4f46e5' }} /> Fechamento bloqueado</span>
          <span><i style={{ background: '#fef3c7', borderColor: '#d97706' }} /> Relé sensibiliza</span>
          <span><i style={{ background: '#e0e7ff', borderColor: '#4f46e5' }} /> Relé bloqueado</span>
          <span><i style={{ background: '#fee2e2', borderColor: '#dc2626' }} /> Relé opera</span>
        </div>
      </details>
    </div>
  );
}

function Consulta863() {
  const secoes = [1, 3, 4, 6, 7, 9, 10];
  const [secao, setSecao] = useState(null);
  const linha = tabela863.find((l) => l.secoes.includes(secao));

  return (
    <div className="br-863">
      <p className="br-cta">Defeito em qual seção da barra 3P?</p>
      <div className="br-locais br-secoes">
        {secoes.map((s) => (
          <button key={s} type="button" className={secao === s ? 'ativo' : ''} onClick={() => setSecao(s)}>
            {s}
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

      <details className="br-tabela">
        <summary>Ver tabela completa</summary>
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
      <p className="br-fonte">(*) disjuntor desligado e bloqueado.</p>
      </details>
    </div>
  );
}

function TesteRapido() {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState({});
  const total = perguntas.length;
  const fim = indice >= total;
  const acertos = perguntas.filter((p, i) => respostas[i] === p.certa).length;

  if (fim) {
    const pct = Math.round((acertos / total) * 100);
    return (
      <div className="br-quiz-final">
        <span className="br-quiz-nota">{pct}%</span>
        <strong>{acertos} de {total} corretas</strong>
        <button type="button" onClick={() => { setRespostas({}); setIndice(0); }}>
          <RotateCcw size={16} /> Refazer
        </button>
      </div>
    );
  }

  const p = perguntas[indice];
  const r = respostas[indice];
  const feito = r !== undefined;

  return (
    <div className="br-quiz">
      <div className="br-quiz-placar">
        <span>Pergunta {indice + 1} de {total}</span>
        <div className="br-barra"><div style={{ width: `${(indice / total) * 100}%` }} /></div>
      </div>
      <fieldset className="br-quiz-q" key={indice}>
        <legend>{p.q}</legend>
        {p.opcoes.map((o, j) => {
          const estado = feito ? (j === p.certa ? 'certa' : j === r ? 'errada' : '') : '';
          return (
            <button
              key={j}
              type="button"
              className={`br-opcao ${estado}`}
              disabled={feito}
              onClick={() => setRespostas((prev) => ({ ...prev, [indice]: j }))}
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
      {feito && (
        <button type="button" className="br-btn" onClick={() => setIndice((v) => v + 1)}>
          {indice + 1 < total ? 'Próxima pergunta' : 'Ver resultado'} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Conceito() {
  return (
    <>
      <p className="br-lead">
        Protege o barramento de 13,8 kV contra defeitos <strong>fase-fase</strong> e <strong>fase-terra</strong> —
        desligando <strong>só a seção com defeito</strong>.
      </p>
      <div className="br-compare">
        <article>
          <small>Proteção tipo bloqueio</small>
          <strong>Não seletiva</strong>
        </article>
        <article className="destaque">
          <small>Bloqueio reverso</small>
          <strong>Seletiva</strong>
        </article>
      </div>
    </>
  );
}

function Reles() {
  return (
    <>
      <ul className="br-reles">
        <li><span className="br-code">50B</span> Defeito fase-fase</li>
        <li><span className="br-code">50BN</span> Defeito fase-terra</li>
        <li><span className="br-code">86-3</span> Abre o geral, bloqueia a junção e dá alarme</li>
      </ul>
      <div className="br-onde">
        <div><strong>Disjuntor geral</strong><span>50B · 50BN · 86-3</span></div>
        <div><strong>Disjuntor de junção</strong><span>50B · 50BN</span></div>
      </div>
      <details className="br-mais">
        <summary>Circuito de comando</summary>
        <p>
          Os contatos de 50Ba, 50Bb, 50Bc e 50BN, em paralelo no 132 Vcc, energizam o 86-3, que comanda a
          abertura do disjuntor, o alarme e os demais desligamentos do esquema.
        </p>
      </details>
    </>
  );
}

const etapas = [
  { id: 'introducao', titulo: 'O que é o bloqueio reverso', Conteudo: Conceito },
  { id: 'reles', titulo: 'Relés do esquema', Conteudo: Reles },
  { id: 'simulador', titulo: 'Simule um defeito', Conteudo: SimuladorDefeito },
  { id: 'seletividade', titulo: 'Qual 86-3 atua?', Conteudo: Consulta863 },
  { id: 'teste', titulo: 'Teste rápido', Conteudo: TesteRapido },
];

export function ProtecaoBloqueioReversoView({ onBackHome }) {
  const [etapa, setEtapa] = useState(0);
  const { titulo, Conteudo } = etapas[etapa];

  function ir(i) {
    setEtapa(i);
    document.querySelector('.br-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="protection-lesson-page br-page">
      <button type="button" className="lesson-back-button" onClick={onBackHome}>
        <ArrowLeft size={18} />
        Voltar para Início
      </button>

      <section className="br-hero">
        <span className="protection-kicker">Proteção de barras 13,8 kV</span>
        <h1>Bloqueio reverso</h1>
      </section>

      <nav className="br-tabs" aria-label="Etapas da aula">
        {roteiro.map((r, i) => (
          <button
            key={r.id}
            type="button"
            className={i === etapa ? 'ativo' : i < etapa ? 'feito' : ''}
            aria-current={i === etapa ? 'step' : undefined}
            onClick={() => ir(i)}
          >
            <span>{i + 1}</span> {r.label}
          </button>
        ))}
      </nav>

      <section className="br-etapa" key={etapa}>
        <h2>{titulo}</h2>
        <Conteudo />
      </section>

      <div className="br-nav">
        <button type="button" className="sec" disabled={etapa === 0} onClick={() => ir(etapa - 1)}>
          <ChevronLeft size={16} /> Anterior
        </button>
        {etapa < etapas.length - 1 && (
          <button type="button" onClick={() => ir(etapa + 1)}>
            {roteiro[etapa + 1].label} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
