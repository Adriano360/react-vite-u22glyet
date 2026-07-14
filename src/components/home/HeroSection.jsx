import { useCallback, useEffect, useRef, useState } from 'react';

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

const SLIDES = [
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

const AUTOPLAY_DELAY = 6000;

function getNextAvailableSlide(currentIndex, direction, failedSlides) {
  for (let step = 1; step <= SLIDES.length; step += 1) {
    const candidate =
      (currentIndex + direction * step + SLIDES.length) % SLIDES.length;

    if (!failedSlides.has(candidate)) return candidate;
  }

  return currentIndex;
}

function decodeImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = 'async';
    image.onload = async () => {
      try {
        await image.decode?.();
      } catch {
        // O evento load já confirmou que o arquivo foi carregado.
      }
      resolve();
    };
    image.onerror = reject;
    image.src = src;
  });
}

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedSlides, setFailedSlides] = useState(() => new Set());

  const activeSlideRef = useRef(0);
  const failedSlidesRef = useRef(new Set());
  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  useEffect(() => {
    SLIDES.forEach((slide, index) => {
      if (index !== activeSlideRef.current) {
        decodeImage(slide.src).catch(() => {
          // Uma falha transitória no pré-carregamento não remove o slide.
        });
      }
    });
  }, []);

  const registerFailedSlide = useCallback((index) => {
    if (failedSlidesRef.current.has(index)) {
      return failedSlidesRef.current;
    }

    const next = new Set(failedSlidesRef.current);
    next.add(index);
    failedSlidesRef.current = next;
    setFailedSlides(next);
    return next;
  }, []);

  const showSlide = useCallback(
    async (index) => {
      if (
        index === activeSlideRef.current ||
        failedSlidesRef.current.has(index)
      ) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      try {
        await decodeImage(SLIDES[index].src);

        if (!mountedRef.current || requestId !== requestIdRef.current) return;

        activeSlideRef.current = index;
        setActiveSlide(index);
      } catch {
        if (!mountedRef.current) return;

        const failed = registerFailedSlide(index);
        const fallback = getNextAvailableSlide(
          activeSlideRef.current,
          1,
          failed
        );

        if (fallback !== activeSlideRef.current) {
          void showSlide(fallback);
        }
      }
    },
    [registerFailedSlide]
  );

  const moveSlide = useCallback(
    (direction) => {
      const nextIndex = getNextAvailableSlide(
        activeSlideRef.current,
        direction,
        failedSlidesRef.current
      );

      void showSlide(nextIndex);
    },
    [showSlide]
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isPaused || prefersReducedMotion || failedSlides.size >= SLIDES.length - 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      moveSlide(1);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, [failedSlides.size, isPaused, moveSlide]);

  const currentSlide = SLIDES[activeSlide];

  function handleActiveImageError() {
    const failed = registerFailedSlide(activeSlide);
    const nextIndex = getNextAvailableSlide(activeSlide, 1, failed);

    if (nextIndex !== activeSlide) {
      void showSlide(nextIndex);
    }
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
      <img
        key={currentSlide.src}
        className="home-hero-image"
        src={currentSlide.src}
        alt={currentSlide.alt}
        style={{ objectPosition: currentSlide.position }}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        draggable="false"
        onError={handleActiveImageError}
      />

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
          disabled={failedSlides.size >= SLIDES.length - 1}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="home-hero-indicators" role="group" aria-label="Escolher imagem">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={index === activeSlide ? 'active' : ''}
              onClick={() => void showSlide(index)}
              aria-label={`Exibir imagem ${index + 1} de ${SLIDES.length}`}
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
          disabled={failedSlides.size >= SLIDES.length - 1}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
