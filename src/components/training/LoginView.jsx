import lightLogo from '../../assets/light-logo.png';

export function LoginView({ nome, setNome, erroLogin, onEntrar }) {
  return (
    <main className="training-app login-screen">
      <section className="training-login">
        <img className="training-logo" src={lightLogo} alt="Light+" />
        <h1>Treinamento de Proteção</h1>
        <p>
          Simulador operacional para capacitação de mantenedores e operadores
          de subestações.
        </p>

        <label className="login-field">
          <span>Nome do operador</span>
          <span className="login-input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
            </svg>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              aria-invalid={Boolean(erroLogin)}
            />
          </span>
        </label>
        {erroLogin && <p className="login-error">{erroLogin}</p>}

        <button className="primary-button login-submit" onClick={onEntrar}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
          Entrar na Plataforma
        </button>
        <p className="login-helper">
          Seu nome será usado no certificado e nos resultados do treinamento.
        </p>
      </section>

      <footer className="login-footer">
        Light+ · Treinamento Operacional · Versão 1.0
      </footer>
    </main>
  );
}
