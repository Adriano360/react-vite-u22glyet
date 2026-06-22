function MetricIcon({ type }) {
  const icons = {
    trophy: (
      <path d="M8 4h8v3a4 4 0 0 1-3 3.87V14h3v2H8v-2h3v-3.13A4 4 0 0 1 8 7V4Zm-3 1h2v2a3 3 0 0 1-3-3h1v1Zm12 0h2V4h1a3 3 0 0 1-3 3V5Z" />
    ),
    clipboard: (
      <path d="M8 3h8v3H8V3Zm-2 2h1v3h10V5h1a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Zm2 7h8v2H8v-2Zm0 4h6v2H8v-2Z" />
    ),
    target: (
      <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Zm0 4a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3V7Zm7-4v3h3l-8.3 8.3-1.4-1.4L20.6 4H19V3Z" />
    ),
    percent: (
      <path d="M7.5 8A2.5 2.5 0 1 1 10 5.5 2.5 2.5 0 0 1 7.5 8Zm9 11A2.5 2.5 0 1 1 19 16.5 2.5 2.5 0 0 1 16.5 19ZM6 18 18 6l1.4 1.4-12 12L6 18Z" />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type] || icons.target}
    </svg>
  );
}

export function MetricCard({ label, value, icon, suffix }) {
  return (
    <div className={icon ? 'metric-card' : 'metric-card no-icon'}>
      {icon && (
        <span className="metric-icon" aria-hidden="true">
          <MetricIcon type={icon} />
        </span>
      )}
      <span className="metric-content">
        <small>{label}</small>
        <strong>
          {value}
          {suffix && <em>{suffix}</em>}
        </strong>
      </span>
    </div>
  );
}
