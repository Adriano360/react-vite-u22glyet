import subestacaoBanner from '../../assets/subestacao-banner.png';

const trilhas = {
  'Protecoes Diferenciais': {
    icon: 'network',
    texto: 'Atuação diferencial aplicada a transformadores e barras.',
  },
  Sobrecorrente: {
    icon: 'bolt',
    texto: 'Ajustes, seletividade e coordenação das proteções.',
  },
  Alimentadores: {
    icon: 'tower',
    texto: 'Proteção e análise operacional de alimentadores.',
  },
  'Falha de Disjuntor': {
    icon: 'breaker',
    texto: 'Detecção e tratamento de falhas de abertura.',
  },
  'Religamento Automatico': {
    icon: 'reload',
    texto: 'Lógicas e parâmetros de religamento automático.',
  },
  'Barra 13,8 kV': {
    icon: 'busbar',
    texto: 'Proteções de barra, seccionamentos e atuação.',
  },
  'Diferencial de Barras': {
    icon: 'nodes',
    texto: 'Princípios e lógica da proteção diferencial.',
  },
  'Comando e Sinalizacao': {
    icon: 'panel',
    texto: 'Comandos, intertravamentos e sinalizações.',
  },
  Sistema: {
    icon: 'system',
    texto: 'Visão geral do sistema elétrico e suas proteções.',
  },
  Transformadores: {
    icon: 'transformer',
    texto: 'Proteções, monitoramentos e condições de operação.',
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
    play: <path d="M9 6v12l10-6L9 6Z" />,
    target: <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M15 9l6-6m0 0v5m0-5h-5" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <path d="M12 4a8 8 0 1 0 8 8M12 7v5l3 2" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.system}
    </svg>
  );
}

function SummaryItem({ label, value, detail, icon }) {
  return (
    <article className="home-summary-item">
      <span className="home-summary-icon" aria-hidden="true">
        <TrailIcon type={icon} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
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
      <section className="hero-panel home-hero">
        <div className="home-hero-copy">
          <span className="hero-kicker">Plataforma de capacitação técnica</span>
          <h1>Centro de Treinamento Operacional</h1>
          <p>
            Conteúdo direcionado a mantenedores de subestação, com situações
            práticas de proteção, comando, automação e análise operacional.
          </p>

          <div className="home-hero-actions">
            <button type="button" className="home-primary-action" onClick={onIniciar}>
              <TrailIcon type="play" />
              Iniciar treinamento
            </button>
            <div className="home-hero-counter">
              <strong>{totalCenarios}</strong>
              <span>cenários técnicos disponíveis</span>
            </div>
          </div>
        </div>

        <div className="home-hero-visual">
          <img
            src={subestacaoBanner}
            alt="Instalações de subestação utilizadas no treinamento operacional"
          />
          <div className="home-image-caption">
            <span>Treinamento aplicado</span>
            <strong>Ambiente de subestação</strong>
          </div>
        </div>
      </section>

      <section className="home-summary" aria-label="Resumo do desempenho">
        <SummaryItem
          icon="target"
          label="Aproveitamento"
          value={`${taxa}%`}
          detail="desempenho geral"
        />
        <SummaryItem
          icon="check"
          label="Acertos"
          value={acertos}
          detail={`${tentativas} questões respondidas`}
        />
        <SummaryItem
          icon="bolt"
          label="Pontuação"
          value={pontos}
          detail="pontos acumulados"
        />
        <SummaryItem
          icon="clock"
          label="Trilhas disponíveis"
          value={trilhasDisponiveis.length}
          detail="áreas de capacitação"
        />
      </section>

      <div className="home-main-grid">
        <section className="training-panel home-trails-panel">
          <div className="home-section-heading">
            <div>
              <span>Conteúdo técnico</span>
              <h2>Escolha uma trilha de treinamento</h2>
              <p>Selecione uma área para iniciar uma rodada de questões.</p>
            </div>
            <strong>{trilhasDisponiveis.length} trilhas</strong>
          </div>

          <div className="trail-grid professional-trail-grid">
            {trilhasDisponiveis.map((area) => {
              const meta = trilhas[area] || {
                icon: 'system',
                texto: 'Treinamento operacional de proteção.',
              };

              return (
                <button
                  key={area}
                  type="button"
                  className="trail-card professional-trail-card"
                  onClick={() => onSelecionarTrilha(area)}
                >
                  <span className="trail-icon" aria-hidden="true">
                    <TrailIcon type={meta.icon} />
                  </span>
                  <span className="trail-card-copy">
                    <strong>{area}</strong>
                    <small>{meta.texto}</small>
                  </span>
                  <b className="trail-arrow" aria-hidden="true">›</b>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="home-progress-card">
          <div className="home-progress-heading">
            <span className="home-progress-icon" aria-hidden="true">
              <TrailIcon type="target" />
            </span>
            <div>
              <span>Seu desempenho</span>
              <h2>Progresso geral</h2>
            </div>
          </div>

          <div className="home-progress-circle" style={{ '--progress': `${taxa * 3.6}deg` }}>
            <div>
              <strong>{taxa}%</strong>
              <span>aproveitamento</span>
            </div>
          </div>

          <div className="home-progress-details">
            <div>
              <small>Questões respondidas</small>
              <strong>{tentativas}</strong>
            </div>
            <div>
              <small>Respostas corretas</small>
              <strong>{acertos}</strong>
            </div>
            <div>
              <small>Cenários no banco</small>
              <strong>{totalCenarios}</strong>
            </div>
          </div>

          <button type="button" className="home-secondary-action" onClick={onIniciar}>
            Continuar capacitação
            <span aria-hidden="true">›</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
