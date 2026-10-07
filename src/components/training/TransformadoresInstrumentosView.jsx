import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Gauge,
  NotebookPen,
  Ruler,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import TCDiagram3D from './TCDiagram3D';

function publicAsset(path) {
  const cleanPath = path.replace(/^\/+/, '');

  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }

  return new URL(`../${cleanPath}`, import.meta.url).href;
}

const transformerTypes = [
  {
    title: 'TC tipo bucha',
    text: 'Instalado sobre a bucha do equipamento. Ideal para aplica&ccedil;&otilde;es em alta tens&atilde;o.',
    image: '/images/transformadores/tc-tipo-bucha.jpg',
  },
  {
    title: 'TC tipo janela',
    text: 'Envolve o condutor que passa pela abertura. Compacto e de f&aacute;cil instala&ccedil;&atilde;o.',
    image: '/images/transformadores/tc-tipo-janela.jpg',
  },
  {
    title: 'TC tipo barra',
    text: 'Usado em barras ou sistemas blindados. Alta resist&ecirc;ncia mec&acirc;nica e t&eacute;rmica.',
    image: '/images/transformadores/tc-tipo-barra.png',
    imageLayout: 'portrait',
  },
  {
    title: 'TC tipo pedestal',
    text: 'Instalado sobre pedestal, oferecendo robustez e isola&ccedil;&atilde;o para alta tens&atilde;o.',
    image: '/images/transformadores/tc-tipo-pedestal.jpg',
  },
  {
    title: 'TP convencional',
    text: 'Converte tens&otilde;es elevadas em valores seguros para medi&ccedil;&atilde;o e prote&ccedil;&atilde;o.',
    image: '/images/transformadores/tp-convencional.svg',
  },
];

function LessonSummaryCard({ title, value }) {
  return (
    <article className="lesson-summary-card">
      <small>{title}</small>
      <strong>{value}</strong>
    </article>
  );
}

function InfoCard({ icon: Icon, title, children, variant = '' }) {
  return (
    <article className={`lesson-info-card ${variant}`}>
      <span className="lesson-card-icon" aria-hidden="true">
        <Icon size={24} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

function TransformerTypeCard({ title, text, image, imageLayout = '' }) {
  return (
    <article className={`transformer-type-card ${imageLayout ? `image-${imageLayout}` : ''}`}>
      <div className="transformer-type-image">
        <ResilientImage src={image} alt={title} loading="lazy" fallbackLabel={title} />
      </div>
      <div>
        <h3>{title}</h3>
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </article>
  );
}

function CurrentTransformerDiagram() {
  return (
    <article className="principle-diagram">
      <h3>Diagrama do TC</h3>
      <TCDiagram3D />
      <p>Reduz corrente elevada para valor padr&atilde;o, exemplo: 5 A ou 1 A.</p>
    </article>
  );
}

function PotentialTransformerDiagram() {
  return (
    <article className="principle-diagram">
      <h3>Diagrama do TP</h3>
      <img
        className="tp-diagram-image"
        src={publicAsset('/images/transformadores/diagrama-tp.png')}
        alt="Slide explicativo com diagramas e componentes de transformadores de potencial"
        loading="lazy"
      />
      <p>Reduz tens&atilde;o elevada para valor padr&atilde;o, exemplo: 115 V ou 63,5 V.</p>
    </article>
  );
}

function ResilientImage({ src, alt, fallbackLabel, ...props }) {
  const [failed, setFailed] = useState(false);
  const label = fallbackLabel || alt || 'Imagem indisponivel';

  if (failed) {
    return (
      <div
        className={`lesson-image-fallback ${props.className || ''}`.trim()}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <span>{label}</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={publicAsset(src)}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

function LessonFooterNavigation({ onBack, onNext }) {
  return (
    <div className="lesson-footer-navigation">
      <button type="button" className="lesson-button lesson-button-secondary" onClick={onBack}>
        <ArrowLeft size={18} />
        Voltar para In&iacute;cio
      </button>
      <button type="button" className="lesson-button lesson-button-primary" onClick={onNext}>
        Pr&oacute;xima aula
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export function TransformadoresInstrumentosView({ onBackHome, onNextLesson }) {
  return (
    <div className="lesson-page">
      <button type="button" className="lesson-back-button" onClick={onBackHome}>
        <ArrowLeft size={18} />
        Voltar para In&iacute;cio
      </button>

      <section className="lesson-hero">
        <div className="lesson-hero-content">
          <span className="hero-kicker">Treinamento t&eacute;cnico interativo</span>
          <h1>1. Transformadores de Instrumentos</h1>
          <p>
            Aprenda a fun&ccedil;&atilde;o dos transformadores de instrumentos e como eles s&atilde;o
            aplicados em sistemas de medi&ccedil;&atilde;o, prote&ccedil;&atilde;o e supervis&atilde;o de subesta&ccedil;&otilde;es.
          </p>
        </div>
        <div className="lesson-hero-visual" aria-hidden="true">
          <ResilientImage
            src="/images/transformadores/transformadores-instrumentos.jpg"
            alt=""
            fallbackLabel="Transformadores de instrumentos"
          />
        </div>
      </section>

      <section className="lesson-summary-grid" aria-label="Resumo da aula">
        <LessonSummaryCard title="Aula" value="1 de 8" />
        <LessonSummaryCard title="Status" value="N&atilde;o conclu&iacute;da" />
      </section>

      <InfoCard icon={Target} title="Objetivo da aula" variant="featured">
        Compreender por que os transformadores de instrumentos s&atilde;o usados em sistemas el&eacute;tricos
        e como eles permitem que rel&eacute;s, medidores e equipamentos de supervis&atilde;o trabalhem com
        sinais reduzidos, seguros e proporcionais &agrave;s grandezas reais do sistema.
      </InfoCard>

      <section className="lesson-content-grid">
        <article className="lesson-text-card">
          <h2>O que s&atilde;o transformadores de instrumentos?</h2>
          <p>
            Os transformadores de instrumentos s&atilde;o equipamentos usados para adaptar valores
            elevados de corrente e tens&atilde;o para n&iacute;veis compat&iacute;veis com instrumentos de medi&ccedil;&atilde;o,
            rel&eacute;s de prote&ccedil;&atilde;o e sistemas de supervis&atilde;o.
          </p>
          <p>
            Eles n&atilde;o t&ecirc;m a fun&ccedil;&atilde;o principal de alimentar cargas comuns. Sua fun&ccedil;&atilde;o &eacute;
            reproduzir, de forma proporcional e segura, as grandezas el&eacute;tricas do sistema de pot&ecirc;ncia.
          </p>
          <p>Os dois principais tipos s&atilde;o:</p>
          <ul>
            <li><strong>TC:</strong> Transformador de Corrente</li>
            <li><strong>TP:</strong> Transformador de Potencial</li>
          </ul>
        </article>

        <div className="lesson-mini-card-grid">
          <InfoCard icon={Gauge} title="Transformador de Corrente - TC">
            Reduz correntes elevadas do circuito prim&aacute;rio para valores secund&aacute;rios padronizados,
            usados por rel&eacute;s, medidores e sistemas de prote&ccedil;&atilde;o.
          </InfoCard>
          <InfoCard icon={Zap} title="Transformador de Potencial - TP">
            Reduz tens&otilde;es elevadas do circuito prim&aacute;rio para valores secund&aacute;rios seguros,
            usados por rel&eacute;s, volt&iacute;metros e sistemas de controle.
          </InfoCard>
        </div>
      </section>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <h2>Princ&iacute;pio de funcionamento</h2>
        </div>
        <div className="principle-grid">
          <CurrentTransformerDiagram />
          <PotentialTransformerDiagram />
        </div>
      </section>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <h2>Tipos mais comuns</h2>
        </div>
        <div className="transformer-type-grid">
          {transformerTypes.map((type) => (
            <TransformerTypeCard key={type.title} {...type} />
          ))}
        </div>
      </section>

      <InfoCard icon={ShieldCheck} title="Aplica&ccedil;&atilde;o pr&aacute;tica na subesta&ccedil;&atilde;o">
        Em uma subesta&ccedil;&atilde;o, os TCs e TPs fornecem sinais para os rel&eacute;s de prote&ccedil;&atilde;o.
        Quando ocorre uma condi&ccedil;&atilde;o anormal, como sobrecorrente, subtens&atilde;o, sobretens&atilde;o ou falta,
        os rel&eacute;s interpretam esses sinais e podem comandar alarmes, bloqueios ou abertura de
        disjuntores, conforme a l&oacute;gica de prote&ccedil;&atilde;o.
      </InfoCard>

      <InfoCard icon={Ruler} title="Exemplo pr&aacute;tico" variant="warning">
        Em um alimentador de 13,8 kV, o TC envia a corrente secund&aacute;ria para o rel&eacute; de sobrecorrente.
        Se ocorrer um defeito no circuito, a corrente aumenta, o rel&eacute; interpreta o sinal recebido e pode
        comandar a abertura do disjuntor.
      </InfoCard>

      <article className="lesson-note-card">
        <div className="lesson-note-heading">
          <span className="lesson-card-icon" aria-hidden="true">
            <NotebookPen size={24} />
          </span>
          <div>
            <h3>Observa&ccedil;&atilde;o do mantenedor</h3>
            <p>
              Antes de qualquer inspe&ccedil;&atilde;o, teste ou interven&ccedil;&atilde;o envolvendo circuitos secund&aacute;rios de
              TC ou TP, o mantenedor deve seguir os procedimentos internos, conferir os diagramas el&eacute;tricos,
              identificar os circuitos e respeitar as normas de seguran&ccedil;a aplic&aacute;veis.
            </p>
          </div>
        </div>
        <textarea placeholder="Digite aqui suas observa&ccedil;&otilde;es sobre esta aula..." />
      </article>

      <LessonFooterNavigation onBack={onBackHome} onNext={onNextLesson} />
    </div>
  );
}
