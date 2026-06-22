import { formatCurrency } from '../utils/formatters';

function Bar({ label, value, max, tone = 'cyan' }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track">
        <i className={tone} style={{ width: `${Math.max(6, (value / max) * 100)}%` }} />
      </div>
      <b>{Math.round(value)}</b>
    </div>
  );
}

export default function Charts({ options }) {
  const volumeByAsset = Object.values(
    options.reduce((acc, option) => {
      acc[option.asset] ||= { asset: option.asset, volume: 0, financial: 0 };
      acc[option.asset].volume += option.volume;
      acc[option.asset].financial += option.financialVolume;
      return acc;
    }, {})
  ).sort((a, b) => b.financial - a.financial);

  const maxVolume = Math.max(...volumeByAsset.map((item) => item.volume), 1);
  const maxScore = Math.max(...options.map((item) => item.whaleScore), 1);
  const calls = options.filter((item) => item.type === 'CALL').length;
  const puts = options.filter((item) => item.type === 'PUT').length;

  return (
    <section className="charts-grid">
      <article className="chart-card">
        <h2>Volume por ativo</h2>
        {volumeByAsset.map((item) => (
          <Bar key={item.asset} label={item.asset} value={item.volume} max={maxVolume} />
        ))}
      </article>

      <article className="chart-card">
        <h2>Whale Score</h2>
        {options.slice(0, 6).map((item) => (
          <Bar key={item.code} label={item.code} value={item.whaleScore} max={maxScore} tone={item.type === 'CALL' ? 'green' : 'red'} />
        ))}
      </article>

      <article className="chart-card split-chart">
        <h2>CALLs x PUTs</h2>
        <div className="donut" style={{ '--call': `${(calls / Math.max(calls + puts, 1)) * 100}%` }}>
          <span>{calls + puts}</span>
        </div>
        <div className="legend">
          <span><i className="call-dot" /> CALLs {calls}</span>
          <span><i className="put-dot" /> PUTs {puts}</span>
        </div>
      </article>

      <article className="chart-card">
        <h2>Top ativos por financeiro</h2>
        {volumeByAsset.slice(0, 5).map((item) => (
          <div className="money-row" key={item.asset}>
            <strong>{item.asset}</strong>
            <span>{formatCurrency(item.financial, true)}</span>
          </div>
        ))}
      </article>
    </section>
  );
}
