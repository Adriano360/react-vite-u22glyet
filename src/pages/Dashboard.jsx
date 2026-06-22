import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import CarteiraView from '../components/dashboard/CarteiraView';
import EducacaoView from '../components/dashboard/EducacaoView';
import MercadoView from '../components/dashboard/MercadoView';
import OperarView from '../components/dashboard/OperarView';
import RecomendacoesView from '../components/dashboard/RecomendacoesView';
import { fetchOptions, fetchSummary } from '../services/api';

const levelOrder = [
  'Movimento fraco',
  'Atencao leve',
  'Movimento relevante',
  'Alerta forte',
  'Alerta extremo',
];

const defaultFilters = {
  asset: 'Todos',
  type: 'Todos',
  expiration: 'Todos',
  level: 'Todos',
  moneyness: 'Todos',
  minFinancial: 0,
  minScore: 0,
};

export default function Dashboard() {
  const [options, setOptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('Agrupado');
  const [marketTab, setMarketTab] = useState('Operacoes');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [activeSection, setActiveSection] = useState('Carteira');

  useEffect(() => {
    async function loadData() {
      const enriched = await fetchOptions();
      const ordered = enriched.sort((a, b) => b.whaleScore - a.whaleScore);
      setOptions(ordered);
      setSummary(await fetchSummary(ordered));
    }

    loadData();
  }, []);

  const assets = useMemo(() => [...new Set(options.map((option) => option.asset))].sort(), [options]);
  const expirations = useMemo(() => [...new Set(options.map((option) => option.expirationDate))].sort(), [options]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return options.filter((option) => {
      const byAsset = filters.asset === 'Todos' || option.asset === filters.asset;
      const byType = filters.type === 'Todos' || option.type === filters.type;
      const byExpiration = filters.expiration === 'Todos' || option.expirationDate === filters.expiration;
      const byLevel = filters.level === 'Todos' || option.alertLevel === filters.level;
      const byMoneyness = filters.moneyness === 'Todos' || option.moneyness === filters.moneyness;
      const byFinancial = option.financialVolume >= filters.minFinancial;
      const byScore = option.whaleScore >= filters.minScore;
      const bySearch =
        !term ||
        option.asset.toLowerCase().includes(term) ||
        option.code.toLowerCase().includes(term) ||
        option.assetName.toLowerCase().includes(term);

      return byAsset && byType && byExpiration && byLevel && byMoneyness && byFinancial && byScore && bySearch;
    });
  }, [filters, options, searchTerm]);

  const topAlert = filteredOptions.find((option) => option.whaleScore >= 71) || filteredOptions[0];
  const activeOption = selectedOption && filteredOptions.some((option) => option.code === selectedOption.code)
    ? selectedOption
    : topAlert;

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSearchTerm('');
    setSelectedOption(null);
  }

  if (!summary) {
    return <main className="dashboard-shell"><p>Carregando Radar das Baleias...</p></main>;
  }

  return (
    <main className="dashboard-shell">
      <Header
        updatedAt={options[0]?.collectedAt || new Date()}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {activeSection === 'Carteira' && (
        <CarteiraView
          activeOption={activeOption}
          assets={assets}
          expirations={expirations}
          filteredOptions={filteredOptions}
          filters={filters}
          levelOrder={levelOrder}
          onReset={resetFilters}
          onSelect={setSelectedOption}
          onUpdateFilter={updateFilter}
          selectedCode={activeOption?.code}
          setViewMode={setViewMode}
          summary={summary}
          topAlert={topAlert}
          viewMode={viewMode}
        />
      )}

      {activeSection === 'Recomendacoes' && (
        <RecomendacoesView
          options={filteredOptions}
          topAlert={topAlert}
          onSelect={setSelectedOption}
          selectedCode={activeOption?.code}
        />
      )}

      {activeSection === 'Mercado' && (
        <MercadoView
          activeOption={activeOption}
          marketTab={marketTab}
          selectedStrategy={selectedStrategy}
          onTabChange={setMarketTab}
          onStrategySelect={setSelectedStrategy}
          options={filteredOptions}
        />
      )}

      {activeSection === 'Operar' && (
        <OperarView
          activeOption={activeOption}
          selectedStrategy={selectedStrategy}
          onStrategySelect={setSelectedStrategy}
        />
      )}

      {activeSection === 'Educacao' && <EducacaoView />}

      <footer className="legal-note">
        Este sistema tem finalidade educacional e analitica. Os alertas exibidos nao representam recomendacao de compra ou venda de ativos, acoes ou opcoes. Operar opcoes envolve risco elevado.
      </footer>
    </main>
  );
}
