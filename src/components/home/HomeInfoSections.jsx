import { HomeIcon } from './HomeIcon';

export function HomeInfoSections() {
  return (
    <section className="home-info-grid">
      <article>
        <h3>Para quem é este curso?</h3>
        <p>
          Voltado para mantenedores, técnicos e profissionais que atuam ou desejam
          atuar na operação e manutenção de subestações de energia elétrica.
        </p>
      </article>

      <article>
        <h3>O que você vai aprender?</h3>
        <ul>
          <li>Proteções elétricas e suas aplicações</li>
          <li>Instrumentação e medições</li>
          <li>Automatismos e intertravamentos</li>
          <li>Leitura e interpretação de diagramas</li>
          <li>Segurança operacional</li>
        </ul>
      </article>

      <article className="home-certification-info">
        <h3>Certificação</h3>
        <p>
          Para obter o certificado Light+, é necessário atingir 100% de
          aproveitamento na avaliação final.
        </p>
        <HomeIcon name="badge" size={72} />
      </article>
    </section>
  );
}

export function QuickAccess({ onNavigate }) {
  const items = [
    ['progress', 'Meu progresso', { type: 'screen', value: 'gestor' }],
    ['clock', 'Últimas aulas', { type: 'screen', value: 'simulador' }],
    ['diagram', 'Diagramas', { type: 'area', value: 'Comando e Sinalizacao' }],
    ['clipboard', 'Avaliação', { type: 'screen', value: 'simulador' }],
    ['certificate', 'Certificado', { type: 'screen', value: 'certificado' }],
  ];

  return (
    <section className="home-quick-access">
      <h2>Acesso rápido</h2>
      <div>
        {items.map(([icon, label, destination]) => (
          <button key={label} type="button" onClick={() => onNavigate(destination)}>
            <HomeIcon name={icon} />
            <span>{label}</span>
            <HomeIcon name="arrow" size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="home-course-footer">
      <div>
        <strong>Light<span>+</span></strong>
        <p>Transmissão de energia com responsabilidade e segurança.</p>
      </div>
      <div><h4>Curso</h4><p>Sobre o curso</p><p>Metodologia</p><p>Conteúdo programático</p></div>
      <div><h4>Suporte</h4><p>Guia do curso</p><p>Perguntas frequentes</p><p>Fale com o suporte</p></div>
      <div><h4>Institucional</h4><p>Política de privacidade</p><p>Termos de uso</p><p>Versão 1.0.0</p></div>
      <div className="home-footer-rights"><p>© 2026 Light+. Todos os direitos reservados.</p></div>
    </footer>
  );
}
