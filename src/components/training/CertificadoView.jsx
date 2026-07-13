import './CertificadoView.css';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CertificadoView({ nome, pontos, taxa, onContinuar }) {
  const certificadoLiberado = taxa === 100 && pontos > 0;
  const statusClasse = certificadoLiberado ? 'approved' : 'pending';
  const participante = nome || 'Nome não informado';
  const progressoEmGraus = Math.max(0, Math.min(100, taxa)) * 3.6;

  if (certificadoLiberado) {
    return (
      <section className="certification-page approved">
        <div className="certification-frame">
          <header className="certification-masthead">
            <div className="certification-brand">
              Light<span>+</span>
              <small>Treinamento Operacional</small>
            </div>
            <span className="certification-status-pill">Certificado liberado</span>
          </header>

          <article className="certificate-document">
            <div className="certificate-document-brand">Light<span>+</span></div>
            <div className="certificate-document-body">
              <span>Certificado de conclusão</span>
              <h1>Treinamento de Proteção de Subestações</h1>
              <p>Certificamos que</p>
              <h2>{participante}</h2>
              <p>
                concluiu o treinamento operacional com aproveitamento integral,
                demonstrando domínio dos conteúdos e procedimentos apresentados.
              </p>
              <div className="certificate-document-seal">
                <div>
                  <strong>100%</strong>
                  <small>Aproveitamento</small>
                </div>
              </div>
            </div>
            <footer className="certificate-document-footer">
              <span>Light+ · Treinamento Operacional</span>
              <span>Documento emitido pelo ambiente de capacitação técnica.</span>
            </footer>
          </article>

          <div className="certificate-document-actions">
            <button
              type="button"
              className="certification-primary-action"
              onClick={() => window.print()}
            >
              Imprimir ou salvar certificado
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`certification-page ${statusClasse}`}>
      <div className="certification-frame">
        <header className="certification-masthead">
          <div className="certification-brand">
            Light<span>+</span>
            <small>Treinamento Operacional</small>
          </div>
          <span className="certification-status-pill">Formação em andamento</span>
        </header>

        <section className="certification-hero">
          <div>
            <span className="certification-eyebrow">Jornada de certificação</span>
            <h1>Seu progresso rumo à certificação técnica</h1>
            <p>
              Acompanhe seu desempenho e conclua a avaliação com 100% de
              aproveitamento para liberar o certificado Light+.
            </p>
          </div>

          <div
            className="certification-score-ring"
            style={{ '--cert-progress': `${progressoEmGraus}deg` }}
            aria-label={`${taxa}% de aproveitamento`}
          >
            <div>
              <strong>{taxa}%</strong>
              <span>Aproveitamento</span>
            </div>
          </div>
        </section>

        <div className="certification-content-grid">
          <section className="certification-card certification-overview">
            <header className="certification-card-heading">
              <div>
                <span>Resumo individual</span>
                <h2>Desempenho do participante</h2>
                <p>Dados atualizados conforme as respostas registradas.</p>
              </div>
              <strong className="certification-result-label">Em andamento</strong>
            </header>

            <div className="certification-stats">
              <article className="certification-stat">
                <small>Participante</small>
                <strong title={participante}>{participante}</strong>
              </article>
              <article className="certification-stat">
                <small>Pontuação acumulada</small>
                <strong>{pontos}</strong>
              </article>
              <article className="certification-stat">
                <small>Aproveitamento</small>
                <strong>{taxa}%</strong>
              </article>
            </div>

            <div className="certification-progress-block">
              <div className="certification-progress-copy">
                <span>Progresso da avaliação</span>
                <strong>{taxa}% de 100%</strong>
              </div>
              <div className="certification-progress-track">
                <span style={{ width: `${Math.max(0, Math.min(100, taxa))}%` }} />
              </div>
            </div>

            <div className="certification-requirements">
              <article className={taxa > 0 ? 'certification-requirement complete' : 'certification-requirement'}>
                <span className="certification-requirement-icon"><CheckIcon /></span>
                <div>
                  <strong>Iniciar a avaliação técnica</strong>
                  <small>Responda aos cenários operacionais disponíveis.</small>
                </div>
                <span>{taxa > 0 ? 'Concluído' : 'Pendente'}</span>
              </article>

              <article className={taxa === 100 ? 'certification-requirement complete' : 'certification-requirement'}>
                <span className="certification-requirement-icon"><CheckIcon /></span>
                <div>
                  <strong>Atingir aproveitamento integral</strong>
                  <small>O certificado é liberado somente com 100% de acerto.</small>
                </div>
                <span>{taxa === 100 ? 'Concluído' : 'Pendente'}</span>
              </article>
            </div>
          </section>

          <aside className="certification-card certification-next-step">
            <span className="certification-step-number">01</span>
            <span className="certification-eyebrow">Próxima etapa</span>
            <h2>Continue a avaliação</h2>
            <p>
              Retorne aos cenários, revise os conteúdos necessários e complete a
              avaliação com aproveitamento integral.
            </p>

            <div className="certification-policy-note">
              <strong>Critério institucional</strong>
              <small>
                A emissão permanece bloqueada até que o participante alcance
                100% de aproveitamento.
              </small>
            </div>

            <button
              type="button"
              className="certification-primary-action"
              onClick={onContinuar}
            >
              Continuar treinamento
            </button>
          </aside>
        </div>

        <footer className="certification-footnote">
          O certificado Light+ comprova a conclusão da trilha após o atendimento
          integral dos critérios de avaliação.
        </footer>
      </div>
    </section>
  );
}
