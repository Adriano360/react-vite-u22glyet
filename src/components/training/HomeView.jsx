import './CourseHomeV2.css';
import './ResponsiveTraining.css';
import subestacaoBanner from '../../assets/subestacao-banner.png';

const modules = [
  { title: 'Fundamentos', text: 'Conceitos básicos de sistemas elétricos.', icon: 'book', area: 'Sistema' },
  { title: 'Transformadores de Instrumentos', text: 'TCs, TPs e suas aplicações em subestações.', icon: 'transformer', area: 'Transformadores' },
  { title: 'Proteções', text: 'Sistemas de proteção de subestações.', icon: 'shield', area: 'Diferencial de Barras' },
  { title: 'Automatismos', text: 'Lógicas, intertravamentos e sistemas auxiliares.', icon: 'automation', area: 'Religamento Automatico' },
  { title: 'Diagramas', text: 'Diagramas elétricos originais e explicados.', icon: 'diagram', area: 'Comando e Sinalizacao' },
  { title: 'Avaliação', text: 'Teste seus conhecimentos e conquiste o certificado.', icon: 'clipboard', target: 'simulador' },
];

function Icon({ type }) {
  const icons = {
    book: <path d="M4 5.5C7 4.5 9.5 5 12 7v13c-2.5-2-5-2.5-8-1.5v-13Zm16 0c-3-1-5.5-.5-8 1.5v13c2.5-2 5-2.5 8-1.5v-13Z" />,
    transformer: <path d="M7 7h10v10H7V7Zm-3 3h3m10 0h3M4 14h3m10 0h3M9 4v3m6-3v3M9 17v3m6-3v3" />,
    shield: <path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
    automation: <path d="M6 4h12v5H6V4Zm0 11h12v5H6v-5ZM9 9v6m6-6v6M3 12h18" />,
    diagram: <path d="M5 5h5v5H5V5Zm9 9h5v5h-5v-5ZM14 5h5v5h-5V5ZM7.5 10v4h9M16.5 10v4" />,
    clipboard: <path d="M8 5h8m-7-2h6l1 3H8l1-3ZM6 5H5v16h14V5h-1M8 11h8m-8 4h8" />,
    badge: <path d="M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-3 8 2 2 4-5M8 15l-1 6 5-3 5 3-1-6" />,
    play: <path d="M9 6v12l10-6L9 6Z" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[type] || icons.book}</svg>;
}

export function HomeView({
  totalCenarios,
  tentativas,
  acertos,
  taxa,
  areas,
  onIniciar,
  onSelecionarTrilha,
}) {
  const totalModulos = modules.length;
  const concluidos = Math.min(totalModulos, Math.floor(tentativas / 5));
  const progressoCurso = Math.min(100, Math.max(taxa, Math.round((concluidos / totalModulos) * 100)));

  function abrirModulo(module) {
    if (module.area && areas.includes(module.area)) onSelecionarTrilha(module.area);
    else onIniciar();
  }

  return (
    <div className="course-home">
      <section className="course-hero" style={{ '--course-hero': `url(${subestacaoBanner})` }}>
        <div className="course-hero-overlay">
          <div className="course-hero-copy">
            <h1>Bem-vindo ao Curso Técnico para Mantenedores de Subestação</h1>
            <p>
              Aprenda de forma prática e segura sobre os principais sistemas de proteção,
              instrumentação e automatismos utilizados em subestações de energia elétrica.
            </p>
            <div className="course-benefits">
              <article><Icon type="book" /><span>Conteúdo técnico com linguagem objetiva</span></article>
              <article><Icon type="diagram" /><span>Diagramas originais e explicações detalhadas</span></article>
              <article><Icon type="shield" /><span>Foco na segurança e na prática do dia a dia</span></article>
              <article><Icon type="badge" /><span>Certificação Light+ apenas com 100% de acerto</span></article>
            </div>
          </div>
        </div>
      </section>

      <section className="progress-resume-card">
        <div className="progress-overview">
          <h2>Seu progresso geral</h2>
          <div className="progress-overview-body">
            <div className="progress-ring" style={{ '--progress': `${progressoCurso * 3.6}deg` }}>
              <div><strong>{progressoCurso}%</strong><span>do curso concluído</span></div>
            </div>
            <dl>
              <div><dt>Módulos concluídos</dt><dd>{concluidos} de {totalModulos}</dd></div>
              <div><dt>Aulas concluídas</dt><dd>{tentativas}</dd></div>
              <div><dt>Respostas corretas</dt><dd>{acertos}</dd></div>
              <div><dt>Avaliação</dt><dd>{tentativas ? 'Em andamento' : 'Não iniciada'}</dd></div>
              <div><dt>Certificado</dt><dd>{taxa === 100 ? 'Liberado' : 'Bloqueado'}</dd></div>
            </dl>
          </div>
        </div>

        <div className="continue-card">
          <h2>Continue de onde parou</h2>
          <div className="continue-content">
            <span className="continue-icon"><Icon type="shield" /></span>
            <div><strong>Proteções de Subestação</strong><p>Princípios, condições de atuação e sequência operacional.</p></div>
          </div>
          <div className="continue-track"><span style={{ width: `${Math.max(10, progressoCurso)}%` }} /></div>
          <button type="button" onClick={onIniciar}>Continuar curso <Icon type="play" /></button>
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading"><h2>Módulos do curso</h2><span>{totalCenarios} cenários técnicos</span></div>
        <div className="module-grid">
          {modules.map((module, index) => (
            <button key={module.title} type="button" className="module-card" onClick={() => abrirModulo(module)}>
              <span className={index === 2 ? 'module-icon orange' : 'module-icon'}><Icon type={module.icon} /></span>
              <strong>{index + 1}. {module.title}</strong>
              <p>{module.text}</p>
              <small>{index < concluidos ? 'Concluído' : index === concluidos ? 'Em andamento' : 'Não iniciada'}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="course-info-grid">
        <article><h3>Para quem é este curso?</h3><p>Voltado para mantenedores, técnicos e profissionais que atuam ou desejam atuar na operação e manutenção de subestações.</p></article>
        <article><h3>O que você vai aprender?</h3><ul><li>Proteções elétricas e suas aplicações</li><li>Instrumentação e medições</li><li>Automatismos e intertravamentos</li><li>Leitura e interpretação de diagramas</li></ul></article>
        <article className="certificate-info"><h3>Certificação</h3><p>Para obter o certificado Light+, você deve atingir 100% de acerto na avaliação final.</p><Icon type="badge" /></article>
      </section>

      <section className="quick-access">
        <h2>Acesso rápido</h2>
        <div>
          <button type="button" onClick={onIniciar}>Meu Progresso</button>
          <button type="button" onClick={onIniciar}>Últimas Aulas</button>
          <button type="button" onClick={() => onSelecionarTrilha('Comando e Sinalizacao')}>Diagramas</button>
          <button type="button" onClick={onIniciar}>Avaliação</button>
          <button type="button" onClick={onIniciar}>Certificado</button>
        </div>
      </section>

      <footer className="course-footer">
        <div><strong>Light<span>+</span></strong><p>Transmissão de energia com responsabilidade e segurança.</p></div>
        <div><h4>Curso</h4><p>Sobre o curso</p><p>Metodologia</p><p>Conteúdo programático</p></div>
        <div><h4>Suporte</h4><p>Guia do curso</p><p>Perguntas frequentes</p><p>Fale com o suporte</p></div>
        <div><h4>Institucional</h4><p>Política de privacidade</p><p>Termos de uso</p><p>Versão 1.0.0</p></div>
      </footer>
    </div>
  );
}
