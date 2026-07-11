import { HomeIcon } from './HomeIcon';

const primaryItems = [
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

        <span className="home-sidebar-group-title">Proteções</span>
        {renderItems(protectionItems)}

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
