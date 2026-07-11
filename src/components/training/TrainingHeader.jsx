import { useEffect } from 'react';

const navItems = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'simulador', label: 'Treinamentos', icon: 'training' },
  { id: 'gestor', label: 'Desempenho', icon: 'chart' },
  { id: 'certificado', label: 'Certificado', icon: 'certificate' },
];

function MenuIcon({ type }) {
  const icons = {
    home: <path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9 20v-6h6v6" />,
    training: <path d="M4 5.5h16v13H4v-13Zm3 3h10M7 12h7M7 15.5h5" />,
    chart: <path d="M5 20V10m7 10V4m7 16v-7M3 20h18" />,
    certificate: <path d="M7 4h10v9H7V4Zm2 12 3-2 3 2v5l-3-2-3 2v-5Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-4 3.2-6 7-6s6.2 2 7 6" />,
    exit: <path d="M10 5H5v14h5M14 8l4 4-4 4m4-4H9" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.home}
    </svg>
  );
}

export function TrainingHeader({
  nome,
  tela,
  setTela,
  menuAberto,
  onToggleMenu,
  onCloseMenu,
  onSair,
}) {
  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === 'Escape') onCloseMenu();
    }

    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [onCloseMenu]);

  function navegar(id) {
    setTela(id);
    if (window.innerWidth < 1024) onCloseMenu();
  }

  return (
    <>
      <header className="training-header professional-header">
        <div className="header-left">
          <button
            type="button"
            className="menu-toggle"
            onClick={onToggleMenu}
            aria-label={menuAberto ? 'Fechar menu lateral' : 'Abrir menu lateral'}
            aria-expanded={menuAberto}
            aria-controls="training-sidebar"
          >
            <MenuIcon type="menu" />
          </button>

          <div className="header-branding">
            <strong className="light-wordmark">
              Light<span>+</span>
            </strong>
            <span className="header-brand-divider" aria-hidden="true" />
            <div>
              <b>Centro de Treinamento Operacional</b>
              <small>Capacitação técnica para mantenedores</small>
            </div>
          </div>
        </div>

        <div className="header-user-area">
          <span className="header-user-icon" aria-hidden="true">
            <MenuIcon type="user" />
          </span>
          <div className="header-user-copy">
            <small>Operador</small>
            <strong>{nome}</strong>
          </div>
          <button type="button" className="header-exit-button" onClick={onSair}>
            <MenuIcon type="exit" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <aside
        id="training-sidebar"
        className={menuAberto ? 'training-sidebar open' : 'training-sidebar'}
        aria-label="Navegação principal"
        aria-hidden={!menuAberto}
      >
        <div className="sidebar-heading">
          <span>Menu principal</span>
          <small>Treinamento Light+</small>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tela === item.id ? 'sidebar-link active' : 'sidebar-link'}
              onClick={() => navegar(item.id)}
              tabIndex={menuAberto ? 0 : -1}
            >
              <span className="sidebar-link-icon" aria-hidden="true">
                <MenuIcon type={item.icon} />
              </span>
              <span>{item.label}</span>
              <b aria-hidden="true">›</b>
            </button>
          ))}
        </nav>

        <div className="sidebar-support-card">
          <span>Ambiente de capacitação</span>
          <strong>Proteção e operação de subestações</strong>
          <small>Conteúdo técnico organizado por trilhas.</small>
        </div>
      </aside>

      <button
        type="button"
        className={menuAberto ? 'sidebar-backdrop visible' : 'sidebar-backdrop'}
        aria-label="Fechar menu lateral"
        onClick={onCloseMenu}
        tabIndex={menuAberto ? 0 : -1}
      />
    </>
  );
}
