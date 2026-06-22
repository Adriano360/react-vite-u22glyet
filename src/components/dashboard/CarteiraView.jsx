import AlertCard from '../AlertCard';
import Filters from '../Filters';
import OptionCards from '../OptionCards';
import OptionDetail from '../OptionDetail';
import OptionsTable from '../OptionsTable';
import SummaryCards from '../SummaryCards';

export default function CarteiraView({
  activeOption,
  assets,
  expirations,
  filteredOptions,
  filters,
  levelOrder,
  onReset,
  onSelect,
  onUpdateFilter,
  selectedCode,
  setViewMode,
  summary,
  topAlert,
  viewMode,
}) {
  return (
    <>
      <div className="page-actions">
        {['Agrupado', 'Cards', 'Lista'].map((mode) => (
          <button
            className={`tab-button ${viewMode === mode ? 'active' : ''}`}
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
        <button className="tab-button muted" type="button" onClick={() => setViewMode('Agrupado')}>
          Alocacao
        </button>
      </div>

      <section className="command-grid">
        <div className="main-stack">
          <section className="wallet-panel">
            <div className="panel-toolbar">
              <Filters
                filters={filters}
                assets={assets}
                levels={levelOrder}
                expirations={expirations}
                onChange={onUpdateFilter}
                onReset={onReset}
              />
            </div>
            <SummaryCards summary={summary} />
            {viewMode === 'Lista' ? (
              <OptionsTable options={filteredOptions} selectedCode={selectedCode} onSelect={onSelect} />
            ) : (
              <OptionCards options={filteredOptions} selectedCode={selectedCode} onSelect={onSelect} />
            )}
          </section>
        </div>

        <div className="side-stack">
          <OptionDetail option={activeOption} onClose={() => onSelect(null)} />
        </div>
      </section>

      <AlertCard option={topAlert} />
      {viewMode !== 'Lista' && (
        <OptionsTable options={filteredOptions} selectedCode={selectedCode} onSelect={onSelect} />
      )}
    </>
  );
}
