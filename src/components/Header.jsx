import lightLogo from '../assets/light-logo.png';
import { BRAND } from '../constants/brand';
import { formatDateTime } from '../utils/formatters';

const navItems = ['Carteira', 'Recomendacoes', 'Mercado', 'Operar', 'Educacao'];

export default function Header({ updatedAt, searchTerm, onSearch, activeSection, onSectionChange }) {
  return (
    <header className="top-shell">
      <div className="brand-lockup">
        <img src={lightLogo} alt={BRAND.fullName} />
        <strong>Treinamento de Protecao</strong>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input
          placeholder="Analise um ativo"
          aria-label="Analise um ativo"
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>

      <nav className="main-nav" aria-label="Navegacao principal">
        {navItems.map((item) => (
          <button
            className={activeSection === item ? 'active' : ''}
            key={item}
            type="button"
            onClick={() => onSectionChange(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <span>Visao</span>
        <span>Banco</span>
        <span>?</span>
        <span>Sino</span>
        <b>A</b>
      </div>

      <div className="update-pill">
        Atualizado {formatDateTime(updatedAt)}
      </div>
    </header>
  );
}
