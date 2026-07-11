const iconPaths = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  home: <path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9 20v-6h6v6" />,
  progress: <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M15 9l6-6m0 0v5m0-5h-5" />,
  book: <path d="M4 5.5C7 4.5 9.5 5 12 7v13c-2.5-2-5-2.5-8-1.5v-13Zm16 0c-3-1-5.5-.5-8 1.5v13c2.5-2 5-2.5 8-1.5v-13Z" />,
  transformer: <path d="M7 7h10v10H7V7Zm-3 3h3m10 0h3M4 14h3m10 0h3M9 4v3m6-3v3M9 17v3m6-3v3" />,
  shield: <path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
  automation: <path d="M6 4h12v5H6V4Zm0 11h12v5H6v-5ZM9 9v6m6-6v6M3 12h18" />,
  diagram: <path d="M5 5h5v5H5V5Zm9 9h5v5h-5v-5ZM14 5h5v5h-5V5ZM7.5 10v4h9M16.5 10v4" />,
  clipboard: <path d="M8 5h8m-7-2h6l1 3H8l1-3ZM6 5H5v16h14V5h-1M8 11h8m-8 4h8" />,
  certificate: <path d="M7 4h10v9H7V4Zm2 12 3-2 3 2v5l-3-2-3 2v-5Z" />,
  help: <path d="M12 18h.01M9.7 9a2.4 2.4 0 1 1 3.8 2c-1 .7-1.5 1.2-1.5 2.5M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" />,
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-4 3.2-6 7-6s6.2 2 7 6" />,
  logout: <path d="M10 5H5v14h5M14 8l4 4-4 4m4-4H9" />,
  play: <path d="M9 6v12l10-6L9 6Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  target: <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1" />,
  clock: <path d="M12 4a8 8 0 1 0 8 8M12 7v5l3 2" />,
  arrow: <path d="m9 5 7 7-7 7" />,
  badge: <path d="M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-3 8 2 2 4-5M8 15l-1 6 5-3 5 3-1-6" />,
  lessons: <path d="M4 5h16v14H4V5Zm4 3h8M8 12h8M8 16h5" />,
};

export function HomeIcon({ name, size = 22, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[name] || iconPaths.home}
    </svg>
  );
}
