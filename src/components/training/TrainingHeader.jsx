export function TrainingHeader({ nome, tela, setTela, onSair }) {
  const navItems = [
    ['home', 'Inicio'],
    ['simulador', 'Simulador'],
    ['gestor', 'Gestor'],
    ['certificado', 'Certificado'],
  ];

  return (
    <header className="training-header">
      <div className="brand-block">
        <strong>Light+ - Treinamento de Protecao</strong>
        <p>Operador: {nome}</p>
      </div>

      <nav className="training-nav">
        {navItems.map(([id, label]) => (
          <button
            key={id}
            className={tela === id ? 'nav-button active' : 'nav-button'}
            onClick={() => setTela(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <button className="exit-button" onClick={onSair}>
        Sair
      </button>
    </header>
  );
}

