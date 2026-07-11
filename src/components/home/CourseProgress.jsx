import { HomeIcon } from './HomeIcon';

export function CourseProgress({
  progress,
  completedModules,
  totalModules,
  lessonsCompleted,
  diagramsViewed,
  evaluationStatus,
  certificateStatus,
}) {
  return (
    <section className="home-progress-card">
      <h2>Seu progresso geral</h2>

      <div className="home-progress-body">
        <div
          className="home-progress-ring"
          style={{ '--progress-angle': `${progress * 3.6}deg` }}
          aria-label={`${progress}% do curso concluído`}
        >
          <div>
            <strong>{progress}%</strong>
            <span>do curso concluído</span>
          </div>
        </div>

        <dl className="home-progress-list">
          <div>
            <dt><HomeIcon name="check" size={18} /> Módulos concluídos</dt>
            <dd>{completedModules} de {totalModules}</dd>
          </div>
          <div>
            <dt><HomeIcon name="lessons" size={18} /> Aulas concluídas</dt>
            <dd>{lessonsCompleted}</dd>
          </div>
          <div>
            <dt><HomeIcon name="diagram" size={18} /> Diagramas visualizados</dt>
            <dd>{diagramsViewed}</dd>
          </div>
          <div>
            <dt><HomeIcon name="clipboard" size={18} /> Avaliação</dt>
            <dd>{evaluationStatus}</dd>
          </div>
          <div>
            <dt><HomeIcon name="certificate" size={18} /> Certificado</dt>
            <dd>{certificateStatus}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
