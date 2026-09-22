import lightLogo from '../../assets/light-logo.png';
import './LoginView.css';

export function LoginView({ nome, setNome, erroLogin, onEntrar }) {
  function enviarFormulario(event) {
    event.preventDefault();
    onEntrar();
  }

  return (
    <main className="training-app login-screen">
      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-title">
          <div className="login-brand">
            <img src={lightLogo} alt="Light+" />
            <span>Treinamento Operacional</span>
          </div>

          <div className="login-intro-copy">
            <span className="login-kicker">Capacitação técnica</span>
            <h1 id="login-title">Operação de Subestações</h1>
            <p className="login-description">
              Desenvolva seus conhecimentos em sistemas elétricos, equipamentos
              e proteção com trilhas de aprendizagem e cenários didáticos.
            </p>

            <div className="login-highlights" aria-label="Recursos do curso">
              <div className="login-highlight">
                <span>01</span>
                <div>
                  <strong>Estude</strong>
                  <small>Fundamentos e equipamentos</small>
                </div>
              </div>
              <div className="login-highlight">
                <span>02</span>
                <div>
                  <strong>Pratique</strong>
                  <small>Cenários de treinamento</small>
                </div>
              </div>
              <div className="login-highlight">
                <span>03</span>
                <div>
                  <strong>Acompanhe</strong>
                  <small>Seu progresso no curso</small>
                </div>
              </div>
            </div>
          </div>
          <div className="login-ornament" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="training-login" aria-labelledby="access-title">
          <div className="login-panel-heading">
            <span className="login-panel-mark" aria-hidden="true">+</span>
            <span>Área do participante</span>
          </div>
          <h2 id="access-title">Vamos começar</h2>
          <p className="login-panel-description">
            Informe seu nome para acessar o treinamento.
          </p>

          <form onSubmit={enviarFormulario}>
            <label className="login-field" htmlFor="operator-name">
              <span>Nome do operador</span>
              <span className="login-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                </svg>
                <input
                  id="operator-name"
                  name="operatorName"
                  type="text"
                  autoComplete="name"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome"
                  aria-invalid={Boolean(erroLogin)}
                  aria-describedby={erroLogin ? 'login-error' : 'login-helper'}
                />
              </span>
            </label>

            {erroLogin && (
              <p className="login-error" id="login-error" role="alert">
                {erroLogin}
              </p>
            )}

            <button className="primary-button login-submit" type="submit">
              <span>Acessar treinamento</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13m-5-5 5 5-5 5" />
              </svg>
            </button>
          </form>

          <p className="login-helper" id="login-helper">
            Seu nome aparecerá no certificado e nos resultados do treinamento.
          </p>
          <div className="login-panel-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.3 2.6 7.8 7 10 4.4-2.2 7-5.7 7-10V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Ambiente de aprendizagem Light+</span>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <span>Light+ · Treinamento Operacional</span>
        <span>Versão 1.0</span>
      </footer>
    </main>
  );
}
