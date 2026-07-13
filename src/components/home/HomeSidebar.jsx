import { useEffect, useState } from 'react';
import { HomeIcon } from './HomeIcon';
import './HomeSidebar.css';

const primaryItems = [
  { id: 'home', label: 'Início', icon: 'home', target: 'home' },
  { id: 'progress', label: 'Meu Progresso', icon: 'progress', target: 'gestor' },
  { id: 'fundamentos', label: 'Fundamentos', icon: 'book', area: 'Sistema elétrico' },
  {
    id: 'transformadores',
    label: 'Transformadores de Instrumentos',
    icon: 'transformer',
    area: 'Transformadores',
  },
];

const protectionItems = [
  { id: 'introducao', label: 'Introdução', area: 'Sistema elétrico', target: 'simulador' },
  { id: 'visao-sistema', label: 'Visão do sistema elétrico 1', area: 'Sistema elétrico', target: 'simulador' },
  { id: 'trafos-instrumentos', label: 'Transformadores de instrumentos', area: 'Transformadores', target: 'simulador' },
  { id: 'circuitos-auxiliares', label: 'Circuitos auxiliares e de controle', area: 'Comando e sinalização', target: 'simulador' },
  { id: 'nocoes-reles', label: 'Noções básicas sobre relés', area: 'Sistema elétrico', target: 'simulador' },
  { id: 'alimentadores', label: 'Proteções de alimentadores', area: 'Alimentadores', target: 'simulador' },
  { id: 'bancos-capacitores', label: 'Proteções de bancos de capacitores', target: 'simulador' },
  { id: 'bloqueio-reverso', label: 'Proteção de barras — Bloqueio Reverso', area: 'Barra 13,8 kV', target: 'simulador' },
  { id: 'barra-terra-isolada', label: 'Proteção de barra 13 kV — Terra Isolada', area: 'Barra 13,8 kV', target: 'simulador' },
  { id: 'barras-bloqueio', label: 'Proteção de barras — Bloqueio', area: 'Falha de disjuntor', target: 'simulador' },
  { id: 'diferencial-barras', label: 'Proteção diferencial de barras', area: 'Diferencial de barras', target: 'simulador' },
  { id: 'transformadores-terra', label: 'Proteções de transformadores — Terra', area: 'Sobrecorrente', target: 'simulador' },
  { id: 'internas-transformadores', label: 'Proteções internas de transformadores', area: 'Transformadores', target: 'simulador' },
  { id: 'comutadores', label: 'Proteção de comutadores', area: 'Transformadores', target: 'simulador' },
  { id: 'sobrecorrente-transformadores', label: 'Proteção de sobrecorrente de transformadores', area: 'Sobrecorrente', target: 'simulador' },
  { id: 'diferencial-transformadores', label: 'Proteção diferencial de transformadores', area: 'Proteções diferenciais', target: 'simulador' },
  { id: 'barras-138', label: 'Proteção de barras de 138 kV', area: 'Diferencial de barras', target: 'simulador' },
  { id: 'erac', label: 'ERAC', area: 'Sistema elétrico', target: 'simulador' },
  { id: 'para-raios', label: 'Pára-raios', target: 'simulador' },
  { id: 'lts-138', label: 'Proteção de LTS 138 kV', target: 'simulador' },
  { id: 'lta', label: 'Proteção de LTA', area: 'Religamento automático', target: 'simulador' },
  { id: 'geradores-motores-bombas', label: 'Proteção de geradores, motores e bombas', target: 'simulador' },
  { id: 'reles-digitais', label: 'Relés digitais', target: 'simulador' },
];

const finalItems = [
  { id: 'automatismos', label: 'Automatismos', icon: 'automation', area: 'Religamento automático' },
  { id: 'diagramas', label: 'Diagramas', icon: 'diagram', area: 'Comando e sinalização' },
  { id: 'avaliacao', label: 'Avaliação', icon: 'clipboard', target: 'simulador' },
  { id: 'certificado', label: 'Certificado', icon: 'certificate', target: 'certificado' },
];

function SidebarItem({ item, active, collapsed, onClick }) {
  return (
    <button
      type="button"
      className={active ? 'home-sidebar-item active' : 'home-sidebar-item'}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
    >
      <span className="home-sidebar-item-icon" aria-hidden="true">
        <HomeIcon name={item.icon} />
      </span>
      <span className="home-sidebar-item-label">{item.label}</span>
    </button>
  );
}

function ProtectionItem({ item, active, onClick }) {
  return (
    <button
      type="button"
      className={active ? 'home-sidebar-protection-item active' : 'home-sidebar-protection-item'}
      onClick={onClick}
      title={item.label}
    >
      <span>{item.label}</span>
    </button>
  );
}

export function HomeSidebar({
  isOpen,
  isCollapsed,
  isMobile,
  tela,
  filtroArea,
  areas,
  onNavigate,
}) {
  const collapsed = !isMobile && isCollapsed;
  const [protectionOpen, setProtectionOpen] = useState(false);

  useEffect(() => {
    const hasActiveProtection = protectionItems.some(
      (item) => item.area && item.area === filtroArea
    );

    if (tela === 'simulador' && hasActiveProtection) {
      setProtectionOpen(true);
    }
  }, [filtroArea, tela]);

  function isActive(item) {
    if (item.area) return tela === 'simulador' && filtroArea === item.area;
    return tela === item.target;
  }

  function handleNavigate(item) {
    if (item.area && areas.includes(item.area)) {
      onNavigate({ type: 'area', value: item.area });
      return;
    }

    onNavigate({ type: 'screen', value: item.target || 'home' });
  }

  function renderItems(items) {
    return items.map((item) => (
      <SidebarItem
        key={item.id}
        item={item}
        active={isActive(item)}
        collapsed={collapsed}
        onClick={() => handleNavigate(item)}
      />
    ));
  }

  return (
    <aside
      id="main-sidebar"
      className={[
        'home-sidebar',
        isOpen ? 'open' : '',
        collapsed ? 'collapsed' : '',
      ].filter(Boolean).join(' ')}
      aria-label="Navegação principal"
    >
      <div className="home-sidebar-brand">
        <strong>Light<span>+</span></strong>
        <small>Treinamento Operacional</small>
      </div>

      <nav className="home-sidebar-nav">
        {renderItems(primaryItems)}

        <button
          type="button"
          className={protectionOpen
            ? 'home-sidebar-protection-toggle open'
            : 'home-sidebar-protection-toggle'}
          onClick={() => setProtectionOpen((open) => !open)}
          aria-expanded={protectionOpen}
          aria-controls="protection-submenu"
          title={collapsed ? 'Proteção' : undefined}
          aria-label={collapsed ? 'Proteção' : undefined}
        >
          <span className="home-sidebar-protection-icon" aria-hidden="true">
            <HomeIcon name="shield" />
          </span>
          <span className="home-sidebar-protection-label">Proteção</span>
          <HomeIcon
            name="arrow"
            size={16}
            className="home-sidebar-protection-chevron"
          />
        </button>

        {protectionOpen && !collapsed && (
          <div id="protection-submenu" className="home-sidebar-protection-list">
            {protectionItems.map((item) => (
              <ProtectionItem
                key={item.id}
                item={item}
                active={Boolean(
                  item.area && tela === 'simulador' && filtroArea === item.area
                )}
                onClick={() => handleNavigate(item)}
              />
            ))}
          </div>
        )}

        {renderItems(finalItems)}
      </nav>

      <div className="home-help-card">
        <span aria-hidden="true"><HomeIcon name="help" /></span>
        <div>
          <strong>Precisa de ajuda?</strong>
          <small>Acesse o guia do curso ou fale com o suporte.</small>
        </div>
      </div>
    </aside>
  );
}
