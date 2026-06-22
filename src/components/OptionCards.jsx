import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export default function OptionCards({ options, selectedCode, onSelect }) {
  if (options.length === 0) {
    return <section className="empty-panel">Nenhuma opcao encontrada. Ajuste os filtros ou limpe a busca.</section>;
  }

  return (
    <section className="option-card-list">
      {options.map((option) => (
        <button
          className={`asset-row ${selectedCode === option.code ? 'selected' : ''}`}
          key={option.code}
          type="button"
          onClick={() => onSelect(option)}
        >
          <span className={`asset-logo ${option.type.toLowerCase()}`}>{option.asset.slice(0, 2)}</span>
          <span className="asset-main">
            <strong>{option.asset}</strong>
            <small>{option.code} · {option.type} · {option.flow}</small>
            <b>{formatCurrency(option.underlyingPrice)} <i className={option.underlyingVariation >= 0 ? 'green-text' : 'red-text'}>{formatPercent(option.underlyingVariation)}</i></b>
          </span>
          <span className="asset-count">{formatNumber(option.volume)} contratos</span>
          <span className="asset-day">
            <small>HOJE</small>
            <strong>{option.volumeMultiplier20d.toFixed(1)}x</strong>
            <i>{option.alertLevel}</i>
          </span>
          <span className="asset-total">
            <small>SCORE</small>
            <strong>{option.whaleScore}/100</strong>
            <i>{formatCurrency(option.financialVolume, true)}</i>
          </span>
        </button>
      ))}
    </section>
  );
}
