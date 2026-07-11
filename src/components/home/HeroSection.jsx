import subestacaoBanner from '../../assets/subestacao-banner.png';
import { HomeIcon } from './HomeIcon';

const highlights = [
  ['book', 'Conteúdo técnico objetivo'],
  ['diagram', 'Diagramas originais'],
  ['shield', 'Foco na segurança'],
  ['badge', 'Certificação com 100%'],
];

export function HeroSection() {
  return (
    <section
      className="home-hero-section"
      style={{ '--home-hero-image': `url(${subestacaoBanner})` }}
    >
      <div className="home-hero-overlay">
        <div className="home-hero-copy">
          <h1>Bem-vindo ao Curso Técnico para Mantenedores de Subestação</h1>
          <p>
            Aprenda de forma prática e segura sobre proteções, instrumentação,
            automatismos, segurança e operação de subestações de energia elétrica.
          </p>

          <div className="home-highlight-grid">
            {highlights.map(([icon, label]) => (
              <article key={label}>
                <HomeIcon name={icon} size={30} />
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
