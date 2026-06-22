import { formatCurrency, formatDate, formatNumber, formatPercent } from '../utils/formatters';

function Metric({ label, value }) {
  return (
    <div className="detail-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function OptionDetail({ option, onClose }) {
  if (!option) return null;

  return (
    <aside className="detail-drawer" aria-label="Detalhe da opcao">
      <div className="detail-header">
        <div>
          <span className="alert-kicker">Leitura institucional</span>
          <h2>{option.asset} · {option.code}</h2>
          <p>{option.assetName}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar detalhe">×</button>
      </div>

      <div className="detail-score-grid">
        <Metric label="Whale Score" value={`${option.whaleScore}/100`} />
        <Metric label="Confianca" value={`${option.confidenceScore}/100`} />
        <Metric label="Classificacao" value={option.alertLevel} />
        <Metric label="Fluxo provavel" value={option.flow} />
      </div>

      <div className="confidence-meter">
        <span style={{ width: `${option.confidenceScore}%` }} />
      </div>

      <section className="detail-section">
        <h3>Estrutura da opcao</h3>
        <div className="detail-grid">
          <Metric label="Tipo" value={option.type} />
          <Metric label="Strike" value={formatCurrency(option.strike)} />
          <Metric label="Vencimento" value={formatDate(option.expirationDate)} />
          <Metric label="Dias para vencer" value={option.daysToExpiration} />
          <Metric label="Moneyness" value={option.moneyness} />
          <Metric label="Distancia do strike" value={`${option.strikeDistancePct.toFixed(2)}%`} />
        </div>
      </section>

      <section className="detail-section">
        <h3>Anomalia e liquidez</h3>
        <div className="detail-grid">
          <Metric label="Volume atual" value={formatNumber(option.volume)} />
          <Metric label="Media 5 pregoes" value={formatNumber(option.averageVolume5d)} />
          <Metric label="Media 20 pregoes" value={formatNumber(option.averageVolume20d)} />
          <Metric label="Multiplicador 20d" value={`${option.volumeMultiplier20d.toFixed(1)}x`} />
          <Metric label="Financeiro" value={formatCurrency(option.financialVolume)} />
          <Metric label="Negocios" value={formatNumber(option.trades)} />
          <Metric label="Spread" value={formatPercent(option.spreadPct)} />
          <Metric label="Open interest" value={formatNumber(option.openInterest)} />
        </div>
      </section>

      <section className="detail-section">
        <h3>Greeks e contexto</h3>
        <div className="detail-grid">
          <Metric label="Vol. implicita" value={formatPercent(option.impliedVolatility)} />
          <Metric label="Delta" value={option.delta?.toFixed(2)} />
          <Metric label="Gamma" value={option.gamma?.toFixed(2)} />
          <Metric label="Theta" value={option.theta?.toFixed(3)} />
          <Metric label="Vega" value={option.vega?.toFixed(2)} />
          <Metric label="Ativo" value={formatCurrency(option.underlyingPrice)} />
          <Metric label="Var. ativo" value={formatPercent(option.underlyingVariation)} />
          <Metric label="Var. opcao" value={formatPercent(option.optionChangePct)} />
        </div>
      </section>

      <section className="detail-section">
        <h3>Sinais detectados</h3>
        <div className="flag-list">
          {option.signalFlags.map((flag) => (
            <span key={flag}>{flag}</span>
          ))}
        </div>
        <p>{option.interpretation}</p>
      </section>
    </aside>
  );
}
