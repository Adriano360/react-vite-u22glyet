import Charts from '../Charts';
import Heatmap from '../Heatmap';
import MarketWorkspace from '../MarketWorkspace';
import RankingPanel from '../RankingPanel';

export default function MercadoView({
  activeOption,
  marketTab,
  selectedStrategy,
  onTabChange,
  onStrategySelect,
  options,
}) {
  return (
    <>
      <MarketWorkspace
        activeOption={activeOption}
        activeTab={marketTab}
        selectedStrategy={selectedStrategy}
        onTabChange={onTabChange}
        onStrategySelect={onStrategySelect}
      />
      <Charts options={options} />
      <Heatmap options={options} />
      <RankingPanel options={options} />
    </>
  );
}
