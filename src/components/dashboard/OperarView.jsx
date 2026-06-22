import MarketWorkspace from '../MarketWorkspace';

export default function OperarView({ activeOption, selectedStrategy, onStrategySelect }) {
  return (
    <section className="section-shell">
      <div className="section-header">
        <div>
          <span className="section-kicker">Operar</span>
          <h2>Assistente de estrategias</h2>
          <p>Selecione uma estrutura para estudar o fluxo detectado. Nada aqui e uma ordem real.</p>
        </div>
      </div>
      <MarketWorkspace
        activeOption={activeOption}
        activeTab="Operacoes"
        selectedStrategy={selectedStrategy}
        onTabChange={() => {}}
        onStrategySelect={onStrategySelect}
      />
    </section>
  );
}
