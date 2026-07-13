import { useState } from 'react';

import { InfoItem } from './InfoItem';
import './SimuladorView.css';

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M7 9h3l2 3 2-5 3 4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4M12 16h.01" />
    </svg>
  );
}

export function SimuladorView({
  areas,
  filtroArea,
  cenario,
  opcoes,
  selecionada,
  usados,
  totalDaTrilha,
  progressoRodada,
  onTrocarArea,
  onResponder,
  onNovoCenario,
}) {
  const [diagramaAmpliado, setDiagramaAmpliado] = useState(false);
  const respostaCorreta = cenario.alternativas.find(
    (alternativa) => alternativa.id === cenario.respostaCorretaId
  );
  const alternativaSelecionada = cenario.alternativas.find(
    (alternativa) => alternativa.id === selecionada
  );

  return (
    <section className="scada-training-page">
      <header className="scada-page-header">
        <span className="scada-page-icon"><MonitorIcon /></span>
        <div>
          <span className="scada-page-eyebrow">Treinamento técnico operacional</span>
          <h1>Painel SCADA</h1>
          <p>Diagnóstico de comando e sinalização</p>
        </div>
      </header>

      <div className="scada-layout">
        <section className="scada-section scada-context-section" aria-labelledby="contexto-title">
          <div className="scada-section-heading">
            <div>
              <span>01</span>
              <div>
                <h2 id="contexto-title">Contexto técnico da ocorrência</h2>
                <p>Dados operacionais para análise do cenário.</p>
              </div>
            </div>
          </div>

          <div className="scada-context-grid">
            <label className="scada-field scada-trail-field">
              <span>Trilha</span>
              <select
                value={filtroArea}
                onChange={(e) => onTrocarArea(e.target.value)}
              >
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </label>

            <InfoItem label="Área" value={cenario.area} />
            <InfoItem label="Nível" value={cenario.nivel} />
            <InfoItem label="Relé" value={cenario.rele} />
            <InfoItem label="Equipamento" value={cenario.equipamento} />
          </div>

          <div className="scada-operational-alert" role="note">
            <span className="scada-alert-icon"><AlertIcon /></span>
            <div>
              <strong>{cenario.alarme}</strong>
              <p>{cenario.descricao}</p>
            </div>
          </div>
        </section>

        <section className="scada-section scada-question-section" aria-labelledby="diagnostico-title">
          <div className="scada-question-meta">
            <span>Pergunta {cenario.id} de {totalDaTrilha}</span>
            <span>{cenario.area}</span>
          </div>

          <div className="scada-question-copy">
            <span className="scada-section-eyebrow">02 · Diagnóstico</span>
            <h2 id="diagnostico-title">{cenario.titulo}</h2>
            <p>{cenario.descricao}</p>
          </div>

          {cenario.imagem && (
            <figure className="question-diagram">
              <img src={cenario.imagem.src} alt={cenario.imagem.alt} />
              <figcaption>{cenario.imagem.legenda}</figcaption>
              <button type="button" className="diagram-zoom-button" onClick={() => setDiagramaAmpliado(true)}>
                Ampliar diagrama
              </button>
            </figure>
          )}

          <fieldset className="scada-answer-fieldset">
            <legend>{cenario.pergunta}</legend>
            <div className="scada-answer-list">
              {opcoes.map((opcao, index) => {
                const correta = opcao.id === cenario.respostaCorretaId;
                const escolhida = opcao.id === selecionada;
                const className = [
                  'option-button',
                  escolhida ? 'selected' : '',
                  selecionada && correta ? 'correct' : '',
                  selecionada && escolhida && !correta ? 'wrong' : '',
                ].filter(Boolean).join(' ');

                return (
                  <button
                    key={`${cenario.id}-${opcao.id}`}
                    type="button"
                    className={className}
                    onClick={() => onResponder(opcao)}
                    aria-pressed={escolhida}
                  >
                    <span className="option-marker">{String.fromCharCode(65 + index)}</span>
                    <span>{opcao.texto}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {selecionada && (
            <div className={selecionada === cenario.respostaCorretaId ? 'answer-box ok' : 'answer-box bad'}>
              <strong>{selecionada === cenario.respostaCorretaId ? 'Decisão segura' : 'Decisão insegura'}</strong>
              <p>Correto: <strong>{respostaCorreta?.texto}</strong></p>
              {alternativaSelecionada?.feedback && <p>{alternativaSelecionada.feedback}</p>}
              {cenario.explicacaoDetalhada ? (
                <div className="answer-detail">
                  {cenario.explicacaoDetalhada.map((bloco) => (
                    <section key={bloco.titulo}>
                      <h4>{bloco.titulo}</h4>
                      {bloco.itens && <ul>{bloco.itens.map((item) => <li key={item}>{item}</li>)}</ul>}
                      {bloco.texto && <p>{bloco.texto}</p>}
                    </section>
                  ))}
                </div>
              ) : <p>{cenario.explicacao}</p>}
            </div>
          )}

          {selecionada && (
            <button className="primary-button scada-next-button" onClick={onNovoCenario}>
              Próximo cenário sem repetir
            </button>
          )}
        </section>

        <section className="scada-section scada-procedure-section" aria-labelledby="procedimento-title">
          <div className="scada-section-heading">
            <div>
              <span>03</span>
              <div>
                <h2 id="procedimento-title">Procedimento operacional</h2>
                <p>Sequência recomendada para verificação em campo.</p>
              </div>
            </div>
          </div>

          <ol className="scada-checklist">
            {cenario.checklist.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>

          <div className="scada-round-progress">
            <div>
              <span>Progresso da rodada</span>
              <strong>{usados.length} de {totalDaTrilha} perguntas concluídas</strong>
            </div>
            <div className="progress-track" aria-label={`Progresso da rodada: ${progressoRodada}%`}>
              <span style={{ width: `${progressoRodada}%` }} />
            </div>
          </div>
        </section>
      </div>

      {cenario.imagem && diagramaAmpliado && (
        <div className="diagram-modal" role="dialog" aria-modal="true" aria-label="Diagrama ampliado">
          <div className="diagram-modal-content">
            <button type="button" className="diagram-close-button" onClick={() => setDiagramaAmpliado(false)}>Fechar</button>
            <img src={cenario.imagem.src} alt={cenario.imagem.alt} />
          </div>
        </div>
      )}
    </section>
  );
}
