import { formatDate } from '../utils/formatters';

export default function Heatmap({ options }) {
  return (
    <section className="heatmap-panel">
      <div className="section-title">
        <h2>Mapa de calor por strike e vencimento</h2>
        <span>intensidade pelo Whale Score</span>
      </div>
      <div className="heatmap-grid">
        {options
          .slice()
          .sort((a, b) => b.whaleScore - a.whaleScore)
          .map((option) => (
            <div
              className={`heat-cell ${option.type.toLowerCase()}`}
              key={option.code}
              style={{ opacity: 0.35 + option.whaleScore / 155 }}
              title={`${option.code} · ${option.whaleScore}`}
            >
              <strong>{option.asset}</strong>
              <span>{option.strike.toFixed(2)}</span>
              <small>{formatDate(option.expirationDate)}</small>
            </div>
          ))}
      </div>
    </section>
  );
}
