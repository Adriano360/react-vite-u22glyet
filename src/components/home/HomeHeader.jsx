import { HomeIcon } from './HomeIcon';

export function HomeHeader({
  isMobile,
  isSidebarOpen,
  isSidebarCollapsed,
  onMenuClick,
  nome,
  onSair,
}) {
  const isExpanded = isMobile ? isSidebarOpen : !isSidebarCollapsed;

  return (
    <header className="home-top-header">
      <button
        type="button"
        className="home-menu-button"
        onClick={onMenuClick}
        aria-label={isExpanded ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isExpanded}
        aria-controls="main-sidebar"
      >
        <HomeIcon name={isMobile && isSidebarOpen ? 'close' : 'menu'} />
      </button>

      <div className="home-header-actions">
        <button type="button" className="home-notification" aria-label="Notificações">
          <HomeIcon name="bell" />
          <span aria-hidden="true" />
        </button>

        <span className="home-user-avatar" aria-hidden="true">
          <HomeIcon name="user" />
        </span>

        <div className="home-user-copy">
          <strong>Olá, {nome || 'Mantenedor'}</strong>
          <small>Mantenedor</small>
        </div>

        <button type="button" className="home-logout-button" onClick={onSair}>
          <HomeIcon name="logout" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
