import { useEffect, useState } from 'react';

import subestacaoBanner from '../../assets/subestacao-banner.png';
import subestacaoSlider01 from '../../assets/subestacao-slider-01.webp';
import subestacaoSlider02 from '../../assets/subestacao-slider-02.webp';
import { HomeIcon } from './HomeIcon';

const highlights = [
  ['book', 'Conteúdo técnico objetivo'],
  ['diagram', 'Diagramas originais'],
  ['shield', 'Foco na segurança'],
  ['badge', 'Certificação com 100%'],
];

const slides = [
  {
    src: subestacaoBanner,
    alt: 'Casarão e instalações da subestação utilizados no treinamento Light+',
    position: 'center',
  },
  {
    src: subestacaoSlider01,
    alt: 'Pátio interno de uma subestação de energia elétrica',
    position: 'center',
  },
  {
    src: subestacaoSlider02,
    alt: 'Vista ampla do pátio de uma subestação de energia elétrica',
    position: 'center',
  },
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentSlide = slides[activeSlide];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isPaused || prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % slides.length);
  }

  return (
    <section
      className="home-hero-section home-hero-slider"
      aria-roledescription="carrossel"
      aria-label="Imagens institucionais da plataforma Light+"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="home-hero-slides" aria-live="polite">
        <div className="home-hero-slide active" key={`${activeSlide}-${currentSlide.src}`}>
          <img
            src={currentSlide.src}
            alt={currentSlide.alt}
            style={{ objectPosition: currentSlide.position }}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
      </div>

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

      <div className="home-hero-controls" aria-label="Controles do banner">
        <button
          type="button"
          className="home-hero-arrow previous"
          onClick={showPreviousSlide}
          aria-label="Exibir imagem anterior"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="home-hero-indicators" role="group" aria-label="Escolher imagem">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={index === activeSlide ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Exibir imagem ${index + 1} de ${slides.length}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          className="home-hero-arrow next"
          onClick={showNextSlide}
          aria-label="Exibir próxima imagem"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
