import { useEffect, useMemo, useState } from 'react';

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
  const [failedSlides, setFailedSlides] = useState(() => new Set());

  const availableSlides = useMemo(
    () => slides.map((_, index) => index).filter((index) => !failedSlides.has(index)),
    [failedSlides]
  );

  useEffect(() => {
    if (!availableSlides.length || availableSlides.includes(activeSlide)) return;
    setActiveSlide(availableSlides[0]);
  }, [activeSlide, availableSlides]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isPaused || prefersReducedMotion || availableSlides.length < 2) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const currentPosition = availableSlides.indexOf(activeSlide);
      const nextPosition = (currentPosition + 1) % availableSlides.length;
      setActiveSlide(availableSlides[nextPosition]);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeSlide, availableSlides, isPaused]);

  function moveSlide(direction) {
    if (availableSlides.length < 2) return;

    const currentPosition = availableSlides.indexOf(activeSlide);
    const nextPosition =
      (currentPosition + direction + availableSlides.length) % availableSlides.length;
    setActiveSlide(availableSlides[nextPosition]);
  }

  function handleImageError(index) {
    setFailedSlides((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
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
      <div className="home-hero-media" aria-live="off">
        {slides.map((slide, index) => (
          <img
            key={slide.src}
            className={
              index === activeSlide
                ? 'home-hero-image active'
                : 'home-hero-image'
            }
            src={slide.src}
            alt={index === activeSlide ? slide.alt : ''}
            aria-hidden={index !== activeSlide}
            style={{ objectPosition: slide.position }}
            loading="eager"
            decoding="async"
            onError={() => handleImageError(index)}
          />
        ))}
      </div>

      <div className="home-hero-scrim" aria-hidden="true" />

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
          onClick={() => moveSlide(-1)}
          aria-label="Exibir imagem anterior"
          disabled={availableSlides.length < 2}
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
              disabled={failedSlides.has(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="home-hero-arrow next"
          onClick={() => moveSlide(1)}
          aria-label="Exibir próxima imagem"
          disabled={availableSlides.length < 2}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
