import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export default function OptionsTable({ options, selectedCode, onSelect }) {
  if (options.length === 0) {
    return <section className="empty-panel">Nenhuma opcao encontrada. Ajuste os filtros ou limpe a busca.</section>;
  }

  return (
    <section className="table-panel">
      <div className="section-title">
        <h2>Tabela principal</h2>
        <span>{options.length} opcoes filtradas</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Opcao</th>
              <th>Tipo</th>
              <th>Strike</th>
              <th>Moneyness</th>
              <th>Vencimento</th>
              <th>Dias</th>
              <th>Volume</th>
              <th>Media</th>
              <th>Mult.</th>
              <th>Financeiro</th>
              <th>Score</th>
              <th>Conf.</th>
              <th>Classificacao</th>
              <th>Interpretacao</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr
                className={selectedCode === option.code ? 'selected-row' : ''}
                key={option.code}
                onClick={() => onSelect(option)}
              >
                <td>{option.asset}</td>
                <td><strong>{option.code}</strong></td>
                <td><span className={`type-pill ${option.type.toLowerCase()}`}>{option.type}</span></td>
                <td>{formatCurrency(option.strike)}</td>
                <td>{option.moneyness}</td>
                <td>{formatDate(option.expirationDate)}</td>
                <td>{option.daysToExpiration}</td>
                <td>{formatNumber(option.volume)}</td>
                <td>{formatNumber(option.averageVolume20d)}</td>
                <td>{option.volumeMultiplier20d.toFixed(1)}x</td>
                <td>{formatCurrency(option.financialVolume, true)}</td>
                <td><span className="score-badge">{option.whaleScore}</span></td>
                <td><span className="confidence-badge">{option.confidenceScore}</span></td>
                <td>{option.alertLevel}</td>
                <td>{option.flow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
