import { formatCurrency, formatPercent } from '../utils/formatters';

const candles = [
  34, 33, 35, 36, 34, 35, 37, 38, 36, 39, 41, 40, 42, 44, 43, 45, 47, 49, 48, 50,
  47, 46, 48, 49, 51, 50, 52, 53, 51, 54, 55, 53,
];

const marketTabs = ['Operacoes', 'Acompanhamento Diario', 'Visao Macro'];

export default function MarketWorkspace({
  activeOption,
  activeTab,
  selectedStrategy,
  onTabChange,
  onStrategySelect,
}) {
  if (!activeOption) {
    return (
      <section className="empty-panel">
        Nenhuma opcao encontrada com os filtros atuais.
      </section>
    );
  }

  return (
    <section className="market-workspace">
      <div className="market-toolbar">
        {marketTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            type="button"
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="tab-button" type="button" onClick={() => onTabChange('Componentes')}>
          + Adicionar Componentes
        </button>
        <button className="tab-button" type="button" onClick={() => onTabChange('Organizar')}>
          Organizar
        </button>
        <button className="round-button" type="button" onClick={() => onTabChange('Operacoes')}>
          R
        </button>
      </div>

      <div className="terminal-grid">
        <article className="chart-terminal">
          <div className="chart-toolbar">
            <button type="button">Tempo</button>
            <button type="button">Indicadores</button>
            <button type="button">S/R</button>
            <button type="button">Ajustes</button>
            <select aria-label="Padrao">
              <option>Padrao</option>
              <option>Volume</option>
            </select>
          </div>

          <div className="ticker-strip">
            <span className="ticker-chip muted">ITUB4 <small>-2,21%</small></span>
            <span className="ticker-chip active">{activeOption.asset} <small>{formatPercent(activeOption.underlyingVariation)}</small></span>
            <span className="ticker-chip muted">IBOV <small>-1,19%</small></span>
          </div>

          <div className="mock-chart" aria-label="Grafico simulado do ativo">
            {candles.map((value, index) => (
              <i
                key={`${value}-${index}`}
                className={index % 5 === 0 || index % 7 === 0 ? 'down' : 'up'}
                style={{
                  height: `${Math.max(18, value * 2.1)}px`,
                  left: `${index * 3}%`,
                }}
              />
            ))}
            <b className="price-marker">{formatCurrency(activeOption.underlyingPrice)}</b>
            <b className="volume-marker">{(activeOption.volume / 1000).toFixed(1)}M</b>
          </div>
        </article>

        <article className="strategy-card">
          <div className="strategy-heading">
            <span className="br-badge">BR</span>
            <div>
              <h2>{activeOption.asset} {formatCurrency(activeOption.underlyingPrice)}</h2>
              <small className={activeOption.underlyingVariation >= 0 ? 'positive-pill' : 'negative-pill'}>
                {formatPercent(activeOption.underlyingVariation)}
              </small>
            </div>
            <button className="icon-button" type="button">⌕</button>
          </div>

          <h3>Escolha uma Estrategia</h3>
          <p>Selecione um setup para acompanhar o fluxo incomum detectado.</p>

          <div className="plan-row">
            <span>Plano</span>
            <strong>Limitado:</strong>
            <small> voce utilizou 0 de 3 sugestoes hoje.</small>
          </div>

          <small className="section-label">ESTRATEGIAS DE SPREAD</small>
          {['Trava de Alta', 'Trava de Baixa', 'Compra Direcional'].map((strategy) => (
            <button
              className={`strategy-option ${selectedStrategy === strategy ? 'selected' : ''}`}
              key={strategy}
              type="button"
              onClick={() => onStrategySelect(strategy)}
            >
              <span>{strategy === 'Trava de Baixa' ? '↓' : '↑'}</span>
              <div>
                <strong>{strategy}</strong>
                <small>
                  {strategy === 'Trava de Alta'
                    ? 'Ganhe quando a acao subir moderadamente'
                    : strategy === 'Trava de Baixa'
                      ? 'Estruture protecao ou movimento direcional'
                      : 'Acompanhe fluxo agressivo em opcao unica'}
                </small>
              </div>
            </button>
          ))}

          {selectedStrategy && (
            <div className="selected-strategy">
              Estrategia selecionada: <strong>{selectedStrategy}</strong>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
