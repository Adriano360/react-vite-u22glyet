export function CertificadoView({ nome, pontos, taxa, aprovado, onContinuar }) {
  const statusTexto = aprovado ? 'Aprovado' : 'Não\u00a0aprovado';
  const statusClasse = aprovado ? 'approved' : 'pending';

  return (
    <section className={`certificate-panel ${statusClasse}`}>
      <div className="certificate-shell">
        <header className="certificate-heading">
          <span className="certificate-kicker">
            {aprovado ? 'Operador certificado' : 'Treinamento em andamento'}
          </span>
          <h1>Certificado de Treinamento</h1>
          <h2>{nome || 'Nome não informado'}</h2>
          <p>Treinamento operacional de proteção de subestação.</p>
        </header>

        <div className="certificate-metrics">
          <article>
            <small>Pontuação final</small>
            <strong>{pontos}</strong>
          </article>
          <article>
            <small>Aproveitamento final</small>
            <strong>{taxa}%</strong>
          </article>
          <article className={`certificate-status ${statusClasse}`}>
            <small>Resultado</small>
            <strong>{statusTexto}</strong>
          </article>
        </div>

        <section className="certificate-progress" aria-label="Aproveitamento">
          <div>
            <span>Aproveitamento</span>
            <strong>{taxa}%</strong>
          </div>
          <div className="certificate-progress-track">
            <span style={{ width: `${taxa}%` }} />
          </div>
        </section>

        <section className="certificate-criteria">
          <h3>Critérios de aprovação</h3>
          <p>Mínimo de 70% de acerto e 8 tentativas respondidas.</p>
        </section>

        <div className="certificate-actions">
          {aprovado ? (
            <button className="secondary-button" onClick={() => window.print()}>
              Imprimir ou salvar certificado
            </button>
          ) : (
            <button className="secondary-button" onClick={onContinuar}>
              Continuar treinamento
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
