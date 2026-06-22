import { formatCurrency, formatNumber } from '../utils/formatters';

const items = [
  ['extreme', 'Alertas extremos hoje'],
  ['calls', 'CALLs incomuns'],
  ['puts', 'PUTs incomuns'],
  ['topScore', 'Maior Whale Score'],
  ['totalFinancial', 'Financeiro monitorado'],
  ['concentration', 'Maior concentracao'],
];

export default function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      {items.map(([key, label]) => {
        const value =
          key === 'topScore'
            ? `${summary.topScore?.whaleScore || 0}/100`
            : key === 'totalFinancial'
              ? formatCurrency(summary.totalFinancial, true)
              : key === 'concentration'
                ? summary.concentration
                : formatNumber(summary[key] || 0);

        return (
          <article className="summary-card" key={key}>
            <span>{label}</span>
            <strong>{value}</strong>
            {key === 'topScore' && <small>{summary.topScore?.code}</small>}
          </article>
        );
      })}
    </section>
  );
}
