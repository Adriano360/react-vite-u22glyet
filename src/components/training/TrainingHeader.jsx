import { useEffect } from 'react';

const mainItems = [
  { id: 'home', label: 'Início', icon: 'home', target: 'home' },
  { id: 'progress', label: 'Meu Progresso', icon: 'progress', target: 'gestor' },
  { id: 'fundamentos', label: 'Fundamentos', icon: 'book', area: 'Sistema' },
  {
    id: 'transformadores',
    label: 'Transformadores de Instrumentos',
    icon: 'transformer',
    area: 'Transformadores',
  },
];

const protectionItems = [
  { id: 'diferencial', label: 'Diferencial de Barra', icon: 'shield', area: 'Diferencial de Barras' },
  { id: 'bloqueio-reverso', label: 'Bloqueio Reverso', icon: 'shield', area: 'Barra 13,8 kV' },
  { id: 'tipo-bloqueio', label: 'Tipo Bloqueio', icon: 'shield', area: 'Falha de Disjuntor' },
  { id: 'terra-isolada', label: 'Terra Isolada', icon: 'shield', area: 'Sobrecorrente' },
];

const finalItems = [
  { id: 'automatismos', label: 'Automatismos', icon: 'automation', area: 'Religamento Automatico' },
  { id: 'diagramas', label: 'Diagramas', icon: 'diagram', area: 'Comando e Sinalizacao' },
  { id: 'avaliacao', label: 'Avaliação', icon: 'clipboard', target: 'simulador' },
  { id: 'certificado', label: 'Certificado', icon: 'certificate', target: 'certificado' },
];

function MenuIcon({ type }) {
  const icons = {
    home: <path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9 20v-6h6v6" />,
    progress: <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M15 9l6-6m0 0v5m0-5h-5" />,
    book: <path d="M4 5.5C7 4.5 9.5 5 12 7v13c-2.5-2-5-2.5-8-1.5v-13Zm16 0c-3-1-5.5-.5-8 1.5v13c2.5-2 5-2.5 8-1.5v-13Z" />,
    transformer: <path d="M7 7h10v10H7V7Zm-3 3h3m10 0h3M4 14h3m10 0h3M9 4v3m6-3v3M9 17v3m6-3v3" />,
    shield: <path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
    automation: <path d="M6 4h12v5H6V4Zm0 11h12v5H6v-5ZM9 9v6m6-6v6M3 12h18" />,
    diagram: <path d="M5 5h5v5H5V5Zm9 9h5v5h-5v-5ZM14 5h5v5h-5V5ZM7.5 10v4h9M16.5 10v4" />,
    clipboard: <path d="M8 5h8m-7-2h6l1 3H8l1-3ZM6 5H5v16h14V5h-1M8 11h8m-8 4h8" />,
    certificate: <path d="M7 4h10v9H7V4Zm2 12 3-2 3 2v5l-3-2-3 2v-5Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />,
    user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-4 3.2-6 7-6s6.2 2 7 6" />,
    exit: <path d="M10 5H5v14h5M14 8l4 4-4 4m4-4H9" />,
    help: <path d="M12 18h.01M9.7 9a2.4 2.4 0 1 1 3.8 2c-1 .7-1.5 1.2-1.5 2.5M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.home}
    </svg>
  );
}

function SidebarButton({ item, active, onClick, tabIndex }) {
  return (
    <button
      type="button"
      className={active ? 'sidebar-link active' : 'sidebar-link'}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <span className="sidebar-link-icon" aria-hidden="true">
        <MenuIcon type={item.icon} />
      </span>
      <span>{item.label}</span>
    </button>
  );
}

export function TrainingHeader({
  nome,
  tela,
  filtroArea,
  areas,
  setTela,
  onSelecionarTrilha,
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

  function navegar(item) {
    if (item.area && areas.includes(item.area)) {
      onSelecionarTrilha(item.area);
    } else {
      setTela(item.target || 'home');
    }

    if (window.innerWidth < 1024) onCloseMenu();
  }

  function itemAtivo(item) {
    if (item.area) return tela === 'simulador' && filtroArea === item.area;
    return tela === item.target;
  }

  return (
    <>
      <header className="training-header professional-header">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleMenu}
          aria-label={menuAberto ? 'Recolher menu lateral' : 'Abrir menu lateral'}
          aria-expanded={menuAberto}
          aria-controls="training-sidebar"
        >
          <MenuIcon type="menu" />
        </button>

        <div className="header-user-area">
          <button type="button" className="header-notification" aria-label="Notificações">
            <MenuIcon type="bell" />
            <span aria-hidden="true" />
          </button>
          <span className="header-user-icon" aria-hidden="true">
            <MenuIcon type="user" />
          </span>
          <div className="header-user-copy">
            <strong>Olá, {nome || 'Mantenedor'}</strong>
            <small>Mantenedor</small>
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
        <div className="sidebar-brand">
          <strong>Light<span>+</span></strong>
          <small>Treinamento Operacional</small>
        </div>

        <nav className="sidebar-nav">
          {mainItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              active={itemAtivo(item)}
              onClick={() => navegar(item)}
              tabIndex={menuAberto ? 0 : -1}
            />
          ))}

          <span className="sidebar-group-title">Proteções</span>
          {protectionItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              active={itemAtivo(item)}
              onClick={() => navegar(item)}
              tabIndex={menuAberto ? 0 : -1}
            />
          ))}

          {finalItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              active={itemAtivo(item)}
              onClick={() => navegar(item)}
              tabIndex={menuAberto ? 0 : -1}
            />
          ))}
        </nav>

        <div className="sidebar-support-card">
          <span className="support-icon" aria-hidden="true">
            <MenuIcon type="help" />
          </span>
          <div>
            <strong>Precisa de ajuda?</strong>
            <small>Acesse o guia do curso ou fale com o suporte.</small>
          </div>
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
