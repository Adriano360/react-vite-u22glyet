import { useEffect, useState } from 'react';
import { HomeHeader } from './HomeHeader';
import { HomeSidebar } from './HomeSidebar';
import { MobileOverlay } from './MobileOverlay';

const DESKTOP_QUERY = '(min-width: 1024px)';

export function MainLayout({
  children,
  nome,
  tela,
  filtroArea,
  areas,
  onNavigate,
  onSair,
}) {
  const [isMobile, setIsMobile] = useState(
    () => !window.matchMedia(DESKTOP_QUERY).matches
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);

    function handleViewportChange(event) {
      const mobile = !event.matches;
      setIsMobile(mobile);
      setIsSidebarOpen(event.matches);
      if (mobile) setIsSidebarCollapsed(false);
    }

    media.addEventListener('change', handleViewportChange);
    return () => media.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && isMobile) setIsSidebarOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, isSidebarOpen]);

  function handleMenuClick() {
    if (isMobile) {
      setIsSidebarOpen((previous) => !previous);
      return;
    }

    setIsSidebarCollapsed((previous) => !previous);
  }

  function handleNavigate(destination) {
    onNavigate(destination);
    if (isMobile) setIsSidebarOpen(false);
  }

  const layoutClassName = [
    'home-app-layout',
    isSidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClassName}>
      <HomeSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        tela={tela}
        filtroArea={filtroArea}
        areas={areas}
        onNavigate={handleNavigate}
      />

      <MobileOverlay
        visible={isMobile && isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="home-main-area">
        <HomeHeader
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          onMenuClick={handleMenuClick}
          nome={nome}
          onSair={onSair}
        />

        <main className="home-page-content">{children}</main>
      </div>
    </div>
  );
}
