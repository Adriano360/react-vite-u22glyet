export default function Filters({ filters, assets, levels, expirations, onChange, onReset }) {
  return (
    <section className="filters-bar">
      <label>
        Ativo
        <select value={filters.asset} onChange={(event) => onChange('asset', event.target.value)}>
          <option value="Todos">Todos</option>
          {assets.map((asset) => (
            <option key={asset} value={asset}>{asset}</option>
          ))}
        </select>
      </label>

      <label>
        Tipo
        <select value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
          <option value="Todos">CALL e PUT</option>
          <option value="CALL">CALL</option>
          <option value="PUT">PUT</option>
        </select>
      </label>

      <label>
        Vencimento
        <select value={filters.expiration} onChange={(event) => onChange('expiration', event.target.value)}>
          <option value="Todos">Todos</option>
          {expirations.map((expiration) => (
            <option key={expiration} value={expiration}>{expiration}</option>
          ))}
        </select>
      </label>

      <label>
        Alerta
        <select value={filters.level} onChange={(event) => onChange('level', event.target.value)}>
          <option value="Todos">Todos</option>
          {levels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>

      <label>
        Moneyness
        <select value={filters.moneyness} onChange={(event) => onChange('moneyness', event.target.value)}>
          <option value="Todos">Todos</option>
          <option value="ATM">ATM</option>
          <option value="ITM">ITM</option>
          <option value="OTM">OTM</option>
        </select>
      </label>

      <label>
        Financeiro min.
        <input
          type="number"
          min="0"
          step="50000"
          value={filters.minFinancial}
          onChange={(event) => onChange('minFinancial', Number(event.target.value))}
        />
      </label>

      <label>
        Score min.
        <input
          type="range"
          min="0"
          max="100"
          value={filters.minScore}
          onChange={(event) => onChange('minScore', Number(event.target.value))}
        />
        <span className="range-value">{filters.minScore}</span>
      </label>

      <button className="filter-reset" type="button" onClick={onReset}>
        Limpar
      </button>
    </section>
  );
}
