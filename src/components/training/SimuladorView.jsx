import { useState } from 'react';

import { InfoItem } from './InfoItem';

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
    <section className="training-sim-grid">
      <aside className="scada-panel">
        <h2>Painel SCADA</h2>

        <label className="field-label">Trilha</label>
        <select
          value={filtroArea}
          onChange={(e) => onTrocarArea(e.target.value)}
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <InfoItem label="Área" value={cenario.area} />
        <InfoItem label="Nível" value={cenario.nivel} />
        <InfoItem label="Relé" value={cenario.rele} />
        <InfoItem label="Equipamento" value={cenario.equipamento} />

        <div className="alarm-panel">
          <strong>{cenario.alarme}</strong>
          <p>{cenario.descricao}</p>
        </div>
      </aside>

      <section className="question-panel">
        <div className="question-badge">Pergunta #{cenario.id}</div>
        <h2>{cenario.titulo}</h2>
        <p>{cenario.descricao}</p>

        {cenario.imagem && (
          <figure className="question-diagram">
            <img src={cenario.imagem.src} alt={cenario.imagem.alt} />
            <figcaption>{cenario.imagem.legenda}</figcaption>
            <button
              type="button"
              className="diagram-zoom-button"
              onClick={() => setDiagramaAmpliado(true)}
            >
              Ampliar diagrama
            </button>
          </figure>
        )}

        <h3>{cenario.pergunta}</h3>

        {opcoes.map((opcao, index) => {
          const correta = opcao.id === cenario.respostaCorretaId;
          const escolhida = opcao.id === selecionada;
          const className = [
            'option-button',
            selecionada && correta ? 'correct' : '',
            selecionada && escolhida && !correta ? 'wrong' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={`${cenario.id}-${opcao.id}`}
              className={className}
              onClick={() => onResponder(opcao)}
            >
              <strong>{String.fromCharCode(65 + index)}.</strong> {opcao.texto}
            </button>
          );
        })}

        {selecionada && (
          <div
            className={
              selecionada === cenario.respostaCorretaId
                ? 'answer-box ok'
                : 'answer-box bad'
            }
          >
            <strong>
              {selecionada === cenario.respostaCorretaId
                ? 'Decisão segura'
                : 'Decisão insegura'}
            </strong>
            <br />
            Correto: <strong>{respostaCorreta?.texto}</strong>
            {alternativaSelecionada?.feedback && (
              <p>{alternativaSelecionada.feedback}</p>
            )}
            {cenario.explicacaoDetalhada ? (
              <div className="answer-detail">
                {cenario.explicacaoDetalhada.map((bloco) => (
                  <section key={bloco.titulo}>
                    <h4>{bloco.titulo}</h4>
                    {bloco.itens && (
                      <ul>
                        {bloco.itens.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {bloco.texto && <p>{bloco.texto}</p>}
                  </section>
                ))}
              </div>
            ) : (
              <p>{cenario.explicacao}</p>
            )}
          </div>
        )}

        {selecionada && (
          <button className="primary-button" onClick={onNovoCenario}>
            Próximo cenário sem repetir
          </button>
        )}
      </section>

      <aside className="scada-panel">
        <h2>Checklist Operacional</h2>
        {cenario.checklist.map((item) => (
          <div key={item} className="check-row">
            {item}
          </div>
        ))}

        <div className="round-counter">
          Perguntas usadas nesta rodada: {usados.length} de {totalDaTrilha}
        </div>
        <div className="progress-track" aria-label="Progresso da rodada">
          <span style={{ width: `${progressoRodada}%` }} />
        </div>
      </aside>

      {cenario.imagem && diagramaAmpliado && (
        <div
          className="diagram-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Diagrama ampliado"
        >
          <div className="diagram-modal-content">
            <button
              type="button"
              className="diagram-close-button"
              onClick={() => setDiagramaAmpliado(false)}
            >
              Fechar
            </button>
            <img src={cenario.imagem.src} alt={cenario.imagem.alt} />
          </div>
        </div>
      )}
    </section>
  );
}
