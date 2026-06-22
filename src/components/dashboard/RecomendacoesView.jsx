import AlertCard from '../AlertCard';
import OptionCards from '../OptionCards';

export default function RecomendacoesView({ options, topAlert, onSelect, selectedCode }) {
  const recommended = options.filter((option) => option.whaleScore >= 51).slice(0, 6);

  return (
    <section className="section-shell">
      <div className="section-header">
        <div>
          <span className="section-kicker">Recomendacoes</span>
          <h2>Alertas priorizados pelo motor quantitativo</h2>
          <p>Lista de fluxos com maior score, maior financeiro e melhor confianca operacional.</p>
        </div>
      </div>
      <AlertCard option={topAlert} />
      <OptionCards options={recommended} selectedCode={selectedCode} onSelect={onSelect} />
    </section>
  );
}
