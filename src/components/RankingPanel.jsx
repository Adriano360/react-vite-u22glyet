import { formatCurrency } from '../utils/formatters';

function RankingList({ title, items, metric }) {
  return (
    <section className="ranking-list">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <div className="ranking-row" key={`${title}-${item.code}`}>
          <span>{index + 1}</span>
          <div>
            <strong>{item.code}</strong>
            <small>{item.asset} · {item.type} · {item.alertLevel}</small>
          </div>
          <b>{metric(item)}</b>
        </div>
      ))}
    </section>
  );
}

export default function RankingPanel({ options }) {
  const byScore = [...options].sort((a, b) => b.whaleScore - a.whaleScore).slice(0, 5);
  const byFinancial = [...options].sort((a, b) => b.financialVolume - a.financialVolume).slice(0, 5);
  const byMultiplier = [...options].sort((a, b) => b.volumeMultiplier20d - a.volumeMultiplier20d).slice(0, 5);
  const byConfidence = [...options].sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 5);

  return (
    <aside className="ranking-panel">
      <RankingList title="Top Whale Score" items={byScore} metric={(item) => item.whaleScore} />
      <RankingList title="Maior financeiro" items={byFinancial} metric={(item) => formatCurrency(item.financialVolume, true)} />
      <RankingList title="Volume incomum" items={byMultiplier} metric={(item) => `${item.volumeMultiplier20d.toFixed(1)}x`} />
      <RankingList title="Sinais confiaveis" items={byConfidence} metric={(item) => item.confidenceScore} />
    </aside>
  );
}
