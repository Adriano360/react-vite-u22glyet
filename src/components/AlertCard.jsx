import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export default function AlertCard({ option }) {
  if (!option) return null;

  return (
    <article className={`alert-card ${option.type.toLowerCase()}`}>
      <div className="alert-card-header">
        <span className="alert-kicker">Alerta de Baleia</span>
        <strong>{option.alertLevel}</strong>
      </div>

      <div className="alert-main">
        <div>
          <small>Ativo</small>
          <strong>{option.asset}</strong>
        </div>
        <div>
          <small>Codigo</small>
          <strong>{option.code}</strong>
        </div>
        <div>
          <small>Tipo</small>
          <strong>{option.type}</strong>
        </div>
        <div>
          <small>Whale Score</small>
          <strong>{option.whaleScore}/100</strong>
        </div>
      </div>

      <dl className="alert-details">
        <div><dt>Strike</dt><dd>{formatCurrency(option.strike)}</dd></div>
        <div><dt>Vencimento</dt><dd>{formatDate(option.expirationDate)}</dd></div>
        <div><dt>Volume atual</dt><dd>{formatNumber(option.volume)}</dd></div>
        <div><dt>Media historica</dt><dd>{formatNumber(option.averageVolume20d)}</dd></div>
        <div><dt>Multiplicador</dt><dd>{option.volumeMultiplier20d.toFixed(1)}x</dd></div>
        <div><dt>Financeiro</dt><dd>{formatCurrency(option.financialVolume)}</dd></div>
      </dl>

      <p>{option.interpretation}</p>
      <small className="risk">Este alerta nao e recomendacao de compra ou venda. Confirme tendencia, liquidez, spread, risco e contexto do ativo antes de qualquer decisao.</small>
    </article>
  );
}
