function ManagerIcon({ type }) {
  const icons = {
    user: <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />,
    score: <path d="M8 4h8v3a4 4 0 0 1-3 3.87V14h3v2H8v-2h3v-3.13A4 4 0 0 1 8 7V4Zm-3 1h2v2a3 3 0 0 1-3-3h1v1Zm12 0h2V4h1a3 3 0 0 1-3 3V5Z" />,
    percent: <path d="M7.5 8A2.5 2.5 0 1 1 10 5.5 2.5 2.5 0 0 1 7.5 8Zm9 11A2.5 2.5 0 1 1 19 16.5 2.5 2.5 0 0 1 16.5 19ZM6 18 18 6l1.4 1.4-12 12L6 18Z" />,
    status: <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Zm4.8 5.6-5.7 5.7-2.4-2.4-1.4 1.4 3.8 3.8 7.1-7.1-1.4-1.4Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.status}
    </svg>
  );
}

export function GestorView({
  nome,
  pontos,
  taxa,
  aprovado,
  desempenhoPorTrilha,
  recomendacao,
  erros,
  onRefazerErros,
  onReiniciar,
}) {
  const situacao = aprovado ? 'Aprovado' : 'Em treinamento';

  return (
    <section className="training-panel manager-panel">
      <header className="manager-heading">
        <div>
          <h2>Painel do Gestor</h2>
          <p>Acompanhe desempenho e trilhas prioritarias.</p>
        </div>

        <div className="manager-actions">
          {erros.length > 0 && (
            <button className="secondary-button" onClick={onRefazerErros}>
              Refazer perguntas erradas
            </button>
          )}

          <button className="restart-button" onClick={onReiniciar}>
            Reiniciar treinamento
          </button>
        </div>
      </header>

      <section className="manager-metric-grid">
        <article className="manager-stat-card operator">
          <span className="manager-stat-icon">
            <ManagerIcon type="user" />
          </span>
          <small>Operador</small>
          <strong>{nome || 'Nao informado'}</strong>
        </article>

        <article className="manager-stat-card score">
          <span className="manager-stat-icon">
            <ManagerIcon type="score" />
          </span>
          <small>Pontuacao</small>
          <strong>{pontos}</strong>
        </article>

        <article className="manager-stat-card performance">
          <span className="manager-stat-icon">
            <ManagerIcon type="percent" />
          </span>
          <small>Aproveitamento</small>
          <strong>{taxa}%</strong>
        </article>

        <article className="manager-stat-card status">
          <span className="manager-stat-icon">
            <ManagerIcon type="status" />
          </span>
          <small>Situacao atual</small>
          <strong>{situacao}</strong>
        </article>
      </section>

      <section className="manager-grid">
        <article className="manager-card performance-card">
          <h3>Desempenho por trilha</h3>
          <div className="manager-performance-list">
            {desempenhoPorTrilha.map((item) => (
              <div key={item.area} className="trail-score-row">
                <div className="trail-score-heading">
                  <strong>{item.area}</strong>
                  <span>{item.taxa}%</span>
                </div>
                <div className="trail-score-meta">
                  <small>{item.tentativas} tentativas</small>
                  <small>{item.acertos} acertos</small>
                  <small>{item.taxa}% aproveitamento</small>
                </div>
                <div className="trail-score-bar" aria-hidden="true">
                  <span style={{ width: `${item.taxa}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="manager-card recommendation-card">
          <h3>Recomendacao de treino</h3>
          {recomendacao ? (
            <div className="recommendation-box">
              <small>Trilha recomendada</small>
              <strong>{recomendacao.area}</strong>
              <p>
                Motivo: {recomendacao.erros} erro(s) registrados, com
                aproveitamento de {recomendacao.taxa}%.
              </p>
              <button
                className="secondary-button recommendation-button"
                onClick={onRefazerErros}
              >
                Treinar esta trilha
              </button>
            </div>
          ) : (
            <p className="recommendation-empty">
              Responda algumas perguntas para gerar uma recomendacao.
            </p>
          )}
        </article>
      </section>

    </section>
  );
}
