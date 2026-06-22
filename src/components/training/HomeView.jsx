import subestacaoBanner from '../../assets/subestacao-banner.png';
import { MetricCard } from './MetricCard';

const trilhas = {
  'Protecoes Diferenciais': {
    icon: 'network',
    texto: 'Atuacao diferencial para transformadores e barras.',
  },
  Sobrecorrente: {
    icon: 'bolt',
    texto: 'Ajustes e coordenacao de protecoes de sobrecorrente.',
  },
  Alimentadores: {
    icon: 'tower',
    texto: 'Protecao e seletividade em alimentadores.',
  },
  'Falha de Disjuntor': {
    icon: 'breaker',
    texto: 'Deteccao e tratamento de falhas de abertura.',
  },
  'Religamento Automatico': {
    icon: 'reload',
    texto: 'Logicas e parametros de religamento automatico.',
  },
  'Barra 13,8 kV': {
    icon: 'busbar',
    texto: 'Protecoes de barra e seccionamentos.',
  },
  'Diferencial de Barras': {
    icon: 'nodes',
    texto: 'Principios e ajustes da protecao diferencial.',
  },
  'Comando e Sinalizacao': {
    icon: 'panel',
    texto: 'Logicas de comando, intertravamentos e sinalizacoes.',
  },
  Sistema: {
    icon: 'system',
    texto: 'Visao geral do sistema eletrico e suas protecoes.',
  },
  Transformadores: {
    icon: 'transformer',
    texto: 'Protecoes, monitoramentos e curvas de atuacao.',
  },
};

function TrailIcon({ type }) {
  const icons = {
    network: <path d="M6 7a3 3 0 1 1 3 3 3 3 0 0 1-3-3Zm9 10a3 3 0 1 1 3 3 3 3 0 0 1-3-3ZM4 17a3 3 0 1 1 3 3 3 3 0 0 1-3-3Zm5-7 7 5M8 15l1-5" />,
    bolt: <path d="M13 2 5 13h6l-1 9 9-13h-6l1-7Z" />,
    tower: <path d="M12 3v18M7 21l5-18 5 18M6 8h12M8 13h8M5 21h14" />,
    breaker: <path d="M8 4h8v16H8V4Zm3 4h2v5h3l-5 5v-6H8l3-4Z" />,
    reload: <path d="M18 8a7 7 0 1 0 1 6M18 8h-5m5 0V3" />,
    busbar: <path d="M4 8h16M4 16h16M8 8v8m8-8v8M6 20h12" />,
    nodes: <path d="M5 12h14M8 6v12m8-12v12M5 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />,
    panel: <path d="M5 5h14v14H5V5Zm4 4h2v2H9V9Zm4 0h2v2h-2V9Zm-4 4h2v2H9v-2Zm4 0h2v2h-2v-2Z" />,
    system: <path d="M4 17h4l3-10 3 10h6M6 7h2m8 0h2M7 21h10" />,
    transformer: <path d="M7 7h10v10H7V7Zm-3 3h3m10 0h3M4 14h3m10 0h3M9 4v3m6-3v3M9 17v3m6-3v3" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.system}
    </svg>
  );
}

export function HomeView({
  totalCenarios,
  pontos,
  tentativas,
  acertos,
  taxa,
  areas,
  onIniciar,
  onSelecionarTrilha,
}) {
  const trilhasDisponiveis = areas.filter((area) => area !== 'Todas');

  return (
    <div className="home-dashboard">
      <section
        className="hero-panel"
        style={{ '--hero-image': `url(${subestacaoBanner})` }}
      >
        <span className="hero-kicker">Treinamento tecnico interativo</span>
        <h1>Centro de Treinamento Operacional</h1>
        <p>
          Desenvolva suas habilidades de analise e tomada de decisao em
          protecao, automacao e operacao de subestacoes.
        </p>
      </section>

      <section className="metric-grid">
        <MetricCard
          icon="trophy"
          label="Pontuacao"
          value={pontos}
          suffix="pontos"
        />
        <MetricCard
          icon="clipboard"
          label="Tentativas"
          value={tentativas}
          suffix="vezes"
        />
        <MetricCard
          icon="target"
          label="Acertos"
          value={acertos}
          suffix="respostas"
        />
        <MetricCard icon="percent" label="Taxa de acerto" value={`${taxa}%`} />
      </section>

      <section className="training-panel">
        <div className="section-title-row">
          <h2>Escolha uma trilha de treinamento</h2>
          <span>{totalCenarios} perguntas no banco</span>
        </div>

        <div className="trail-grid">
          {trilhasDisponiveis.map((area) => {
            const meta = trilhas[area] || {
              icon: 'system',
              texto: 'Treinamento operacional de protecao.',
            };

            return (
              <button
                key={area}
                type="button"
                className="trail-card"
                onClick={() => onSelecionarTrilha(area)}
              >
                <span className="trail-icon" aria-hidden="true">
                  <TrailIcon type={meta.icon} />
                </span>
                <span>
                  <strong>{area}</strong>
                  <small>{meta.texto}</small>
                </span>
                <b aria-hidden="true">&gt;</b>
              </button>
            );
          })}
        </div>

        <section className="progress-panel">
          <div className="progress-intro">
            <span aria-hidden="true">
              <TrailIcon type="system" />
            </span>
            <div>
              <h3>Seu progresso</h3>
              <p>Acompanhe seu desempenho geral nos treinamentos.</p>
            </div>
          </div>

          <div className="home-progress-track">
            <span style={{ width: `${taxa}%` }} />
          </div>
          <strong className="home-progress-value">{taxa}%</strong>

          <div className="progress-stat">
            <small>Trilhas concluidas</small>
            <strong>0 / {trilhasDisponiveis.length}</strong>
          </div>
          <div className="progress-stat">
            <small>Modulos concluidos</small>
            <strong>{tentativas}</strong>
          </div>
          <div className="progress-stat">
            <small>Tempo total de estudo</small>
            <strong>0h 00m</strong>
          </div>
        </section>

        <button className="primary-button home-start-button" onClick={onIniciar}>
          Iniciar treinamento
        </button>
        <p className="start-note">Comecar nova rodada de perguntas</p>
      </section>
    </div>
  );
}
