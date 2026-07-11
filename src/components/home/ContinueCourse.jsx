import { HomeIcon } from './HomeIcon';

export function ContinueCourse({ progress, onContinue }) {
  return (
    <section className="home-continue-card">
      <h2>Continue de onde parou</h2>

      <div className="home-continue-summary">
        <span className="home-continue-icon" aria-hidden="true">
          <HomeIcon name="shield" size={34} />
        </span>
        <div>
          <strong>Proteções de Subestação</strong>
          <p>Princípios, condições de atuação e sequência operacional.</p>
        </div>
      </div>

      <div className="home-continue-progress" aria-label={`${progress}% concluído`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <small>{progress}% concluído</small>

      <button type="button" className="home-primary-button" onClick={onContinue}>
        Continuar curso
        <HomeIcon name="play" size={18} />
      </button>
    </section>
  );
}
