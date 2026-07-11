import { HomeIcon } from './HomeIcon';

const modules = [
  { title: 'Fundamentos', text: 'Conceitos básicos de sistemas elétricos.', icon: 'book', area: 'Sistema' },
  { title: 'Transformadores de Instrumentos', text: 'TCs, TPs e suas aplicações em subestações.', icon: 'transformer', area: 'Transformadores' },
  { title: 'Proteções', text: 'Sistemas de proteção de subestações.', icon: 'shield', area: 'Diferencial de Barras' },
  { title: 'Automatismos', text: 'Lógicas, intertravamentos e sistemas auxiliares.', icon: 'automation', area: 'Religamento Automatico' },
  { title: 'Diagramas', text: 'Diagramas elétricos originais e explicados.', icon: 'diagram', area: 'Comando e Sinalizacao' },
  { title: 'Avaliação', text: 'Teste seus conhecimentos e conquiste o certificado.', icon: 'clipboard', target: 'simulador' },
];

export function CourseModules({ completedModules, onOpenModule }) {
  return (
    <section className="home-modules-section">
      <div className="home-section-heading">
        <h2>Módulos do curso</h2>
        <span>Conteúdo técnico organizado por etapas</span>
      </div>

      <div className="home-module-grid">
        {modules.map((module, index) => {
          const status = index < completedModules
            ? 'Concluído'
            : index === completedModules
              ? 'Em andamento'
              : 'Não iniciada';

          return (
            <button
              key={module.title}
              type="button"
              className="home-module-card"
              onClick={() => onOpenModule(module)}
            >
              <span className={index === 2 ? 'home-module-icon accent' : 'home-module-icon'}>
                <HomeIcon name={module.icon} size={31} />
              </span>
              <strong>{index + 1}. {module.title}</strong>
              <p>{module.text}</p>
              <small>{status}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
