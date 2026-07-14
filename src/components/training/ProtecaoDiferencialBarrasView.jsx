import { useState } from 'react';
import { ArrowLeft, Maximize2, X } from 'lucide-react';

const lessonSections = [
  {
    id: 'conceito-basico',
    navLabel: 'Conceito b&aacute;sico',
    title: 'Conceito b&aacute;sico da prote&ccedil;&atilde;o diferencial',
    explanation:
      'A prote&ccedil;&atilde;o diferencial compara as correntes de entrada e sa&iacute;da de um trecho protegido. Em condi&ccedil;&atilde;o normal, a soma das correntes tende ao equil&iacute;brio. Quando existe defeito dentro da zona protegida, aparece corrente diferencial e o rel&eacute; atua.',
    operationalNote:
      'Ao analisar uma atua&ccedil;&atilde;o, confirme primeiro se o defeito pertence &agrave; zona protegida antes de interpretar o evento como falha interna de barra.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-02.png',
        alt: 'Slide original sobre comparacao entre correntes que entram e saem da zona protegida',
        caption: 'Slide original - compara&ccedil;&atilde;o entre correntes de entrada e sa&iacute;da.',
      },
    ],
  },
  {
    id: 'tcs-exclusivos',
    navLabel: 'TCs exclusivos',
    title: 'TCs exclusivos da diferencial de barras',
    explanation:
      'Os TCs da diferencial de barras s&atilde;o exclusivos. N&atilde;o s&atilde;o os mesmos TCs usados na prote&ccedil;&atilde;o dos alimentadores, bancos de capacitores, medi&ccedil;&atilde;o ou prote&ccedil;&atilde;o diferencial do transformador.',
    operationalNote:
      'Em manuten&ccedil;&otilde;es, identifique fisicamente os circuitos secund&aacute;rios antes de qualquer interven&ccedil;&atilde;o. A troca de circuito pode comprometer a seletividade.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-03.png',
        alt: 'Slide original com TCs exclusivos da protecao diferencial de barras',
        caption: 'Slide original - TCs exclusivos da prote&ccedil;&atilde;o diferencial de barras.',
      },
    ],
  },
  {
    id: 'malha-diferencial',
    navLabel: 'Malha diferencial',
    title: 'Malha diferencial dos secund&aacute;rios dos TCs',
    explanation:
      'A malha diferencial &eacute; formada pelas liga&ccedil;&otilde;es dos secund&aacute;rios dos TCs envolvidos. Essa malha permite que o rel&eacute; compare as correntes da zona protegida.',
    operationalNote:
      'Circuitos de corrente nunca devem ser abertos inadvertidamente. Siga o procedimento interno para curto-circuito, bloqueios e libera&ccedil;&atilde;o da prote&ccedil;&atilde;o.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-05.png',
        alt: 'Slide original da malha diferencial',
        caption: 'Slide original - forma&ccedil;&atilde;o da malha diferencial.',
      },
    ],
  },
  {
    id: 'protecao-monofasica-trifasica',
    navLabel: 'Prote&ccedil;&atilde;o monof&aacute;sica e trif&aacute;sica',
    title: 'Prote&ccedil;&atilde;o monof&aacute;sica e trif&aacute;sica',
    explanation:
      'Na prote&ccedil;&atilde;o trif&aacute;sica existem rel&eacute;s associados &agrave;s fases, como 87B-A, 87B-B, 87B-C, al&eacute;m do 87BN.',
    operationalNote:
      'Registre quais elementos operaram. A combina&ccedil;&atilde;o entre fases e neutro ajuda a confirmar o tipo de defeito e a se&ccedil;&atilde;o afetada.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-06.png',
        alt: 'Slide original da protecao diferencial monofasica',
        caption: 'Slide original - prote&ccedil;&atilde;o diferencial monof&aacute;sica.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-07.png',
        alt: 'Slide original da protecao diferencial trifasica',
        caption: 'Slide original - prote&ccedil;&atilde;o diferencial trif&aacute;sica.',
      },
    ],
  },
  {
    id: 'operacao-normal',
    navLabel: 'Opera&ccedil;&atilde;o normal',
    title: 'Situa&ccedil;&atilde;o normal de opera&ccedil;&atilde;o',
    explanation:
      'Em opera&ccedil;&atilde;o normal, as correntes se anulam nos pontos indicados. Por isso, o rel&eacute; diferencial n&atilde;o deve operar.',
    operationalNote:
      'Na condi&ccedil;&atilde;o normal, uma indica&ccedil;&atilde;o diferencial persistente merece verifica&ccedil;&atilde;o de polaridade, rela&ccedil;&atilde;o de TC, fia&ccedil;&atilde;o e bornes.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-08.png',
        alt: 'Slide original mostrando correntes que se anulam na protecao monofasica',
        caption: 'Slide original - correntes se anulam na prote&ccedil;&atilde;o monof&aacute;sica.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-09.png',
        alt: 'Slide original mostrando correntes que se anulam na protecao trifasica',
        caption: 'Slide original - correntes se anulam na prote&ccedil;&atilde;o trif&aacute;sica.',
      },
    ],
  },
  {
    id: 'defeitos-externos',
    navLabel: 'Defeitos externos',
    title: 'Defeito fora da zona protegida',
    explanation:
      'Quando o defeito est&aacute; fora da zona protegida, a prote&ccedil;&atilde;o diferencial n&atilde;o deve atuar. A corrente entra e sai da zona monitorada mantendo o equil&iacute;brio da malha.',
    operationalNote:
      'Se a diferencial atuar em defeito externo, investigue satura&ccedil;&atilde;o de TC, liga&ccedil;&otilde;es incorretas, circuito aberto ou erro de seletividade.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-10.png',
        alt: 'Slide original de defeito fase-terra fora da zona protegida na protecao monofasica',
        caption: 'Slide original - defeito fase-terra externo, rel&eacute; n&atilde;o opera.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-11.png',
        alt: 'Slide original de defeito fase-terra fora da zona protegida na protecao trifasica',
        caption: 'Slide original - defeito externo sem opera&ccedil;&atilde;o de rel&eacute;s.',
      },
    ],
  },
  {
    id: 'defeitos-barramento',
    navLabel: 'Defeitos no barramento',
    title: 'Defeito no barramento protegido',
    explanation:
      'Quando o defeito ocorre dentro do barramento, a corrente diferencial aparece e os rel&eacute;s correspondentes operam.',
    operationalNote:
      'Defeito interno de barra &eacute; evento cr&iacute;tico. Mantenha a se&ccedil;&atilde;o isolada, registre os rel&eacute;s atuados e aguarde libera&ccedil;&atilde;o t&eacute;cnica antes da normaliza&ccedil;&atilde;o.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-12.png',
        alt: 'Slide original de defeito fase-terra no barramento em protecao monofasica',
        caption: 'Slide original - defeito fase-terra no barramento, rel&eacute; opera.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-13.png',
        alt: 'Slide original de defeito fase-terra no barramento em protecao trifasica',
        caption: 'Slide original - defeito fase-terra no barramento, rel&eacute;s operam.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-14.png',
        alt: 'Slide original de defeito bifasico no barramento em protecao monofasica',
        caption: 'Slide original - defeito bif&aacute;sico no barramento, prote&ccedil;&atilde;o monof&aacute;sica.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-15.png',
        alt: 'Slide original de defeito bifasico no barramento em protecao trifasica',
        caption: 'Slide original - defeito bif&aacute;sico no barramento, prote&ccedil;&atilde;o trif&aacute;sica.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-16.png',
        alt: 'Slide original de defeito trifasico no barramento em protecao monofasica',
        caption: 'Slide original - defeito trif&aacute;sico no barramento, prote&ccedil;&atilde;o monof&aacute;sica.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-17.png',
        alt: 'Slide original de defeito trifasico no barramento em protecao trifasica',
        caption: 'Slide original - defeito trif&aacute;sico no barramento, prote&ccedil;&atilde;o trif&aacute;sica.',
      },
    ],
  },
  {
    id: 'seletividade',
    navLabel: 'Seletividade da prote&ccedil;&atilde;o',
    title: 'Seletividade por se&ccedil;&atilde;o de barra',
    explanation:
      'Existe um rel&eacute; diferencial F.87B associado a cada se&ccedil;&atilde;o de barra. Em defeito na se&ccedil;&atilde;o 1, a sequ&ecirc;ncia &eacute; 87B-1 e 86-3 da se&ccedil;&atilde;o 1. Em defeito na se&ccedil;&atilde;o 2, a sequ&ecirc;ncia &eacute; 87B-2 e 86-3 da se&ccedil;&atilde;o 2.',
    operationalNote:
      'Confira a se&ccedil;&atilde;o indicada pelo 87B e o bloqueio associado pelo 86-3. A recomposi&ccedil;&atilde;o deve respeitar a se&ccedil;&atilde;o isolada.',
    diagrams: [
      {
        src: '/images/protecao-diferencial-barras/slide-18.png',
        alt: 'Slide original sobre rel&eacute; diferencial F87B por secao de barra',
        caption: 'Slide original - F.87B associado a cada se&ccedil;&atilde;o de barra.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-19.png',
        alt: 'Slide original da seletividade com defeito na secao 1',
        caption: 'Slide original - defeito na se&ccedil;&atilde;o 1, sequ&ecirc;ncia 87B-1 e 86-3.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-20.png',
        alt: 'Slide original da seletividade com defeito na secao 2',
        caption: 'Slide original - defeito na se&ccedil;&atilde;o 2, sequ&ecirc;ncia 87B-2 e 86-3.',
      },
      {
        src: '/images/protecao-diferencial-barras/slide-21.png',
        alt: 'Slide original de arranjo particular entre TCs e JB',
        caption: 'Slide original - arranjo particular entre TCs e JB.',
      },
    ],
  },
];

const quickReference = [
  {
    item: 'TCs exclusivos',
    meaning: 'Transformadores de corrente dedicados &agrave; diferencial de barras.',
    remember: 'N&atilde;o confundir com TCs de alimentador, medi&ccedil;&atilde;o ou transformador.',
  },
  {
    item: 'Malha diferencial',
    meaning: 'Liga&ccedil;&atilde;o dos secund&aacute;rios dos TCs da zona protegida.',
    remember: 'Permite comparar correntes que entram e saem da barra.',
  },
  {
    item: '87B',
    meaning: 'Rel&eacute; diferencial de barra.',
    remember: 'Opera para defeito interno na se&ccedil;&atilde;o protegida.',
  },
  {
    item: '87BN',
    meaning: 'Elemento diferencial associado ao neutro/terra.',
    remember: 'Ajuda na identifica&ccedil;&atilde;o de defeitos fase-terra.',
  },
  {
    item: '86-3',
    meaning: 'Rel&eacute; de bloqueio da se&ccedil;&atilde;o de barra.',
    remember: 'Mant&eacute;m a se&ccedil;&atilde;o isolada at&eacute; libera&ccedil;&atilde;o.',
  },
  {
    item: 'Defeito externo',
    meaning: 'Defeito fora da zona diferencial.',
    remember: 'A diferencial deve permanecer est&aacute;vel.',
  },
  {
    item: 'Defeito no barramento',
    meaning: 'Defeito dentro da zona protegida.',
    remember: 'Gera corrente diferencial e atua&ccedil;&atilde;o dos rel&eacute;s.',
  },
  {
    item: 'Seletividade por se&ccedil;&atilde;o',
    meaning: 'Cada se&ccedil;&atilde;o possui seu 87B associado.',
    remember: 'Defeito na se&ccedil;&atilde;o 1 atua 87B-1/86-3; na se&ccedil;&atilde;o 2 atua 87B-2/86-3.',
  },
];

function HtmlText({ as: Tag = 'span', html, className }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function DiagramFigure({ diagram, onOpen }) {
  return (
    <figure className="protection-diagram-figure">
      <button
        type="button"
        className="protection-diagram-open"
        onClick={() => onOpen(diagram)}
        aria-label="Ampliar diagrama"
      >
        <img src={diagram.src} alt={diagram.alt} loading="lazy" />
        <span>
          <Maximize2 size={16} />
          Ampliar diagrama
        </span>
      </button>
      <figcaption>
        <HtmlText html={diagram.caption} />
      </figcaption>
    </figure>
  );
}

export function ProtecaoDiferencialBarrasView({ onBackHome }) {
  const [activeDiagram, setActiveDiagram] = useState(null);

  return (
    <div className="protection-lesson-page">
      <button type="button" className="lesson-back-button" onClick={onBackHome}>
        <ArrowLeft size={18} />
        Voltar para In&iacute;cio
      </button>

      <section className="protection-hero">
        <img
          className="protection-hero-bg"
          src="/images/protecao-diferencial-barras/painel-subestacao-13-8kv.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="protection-hero-overlay" aria-hidden="true" />

        <div className="protection-hero-content">
          <span className="protection-kicker">Aula t&eacute;cnica para mantenedores</span>
          <h1>Prote&ccedil;&atilde;o diferencial de barras<span className="protection-title-break" />13,8&nbsp;kV</h1>
          <p>
            Entenda a compara&ccedil;&atilde;o das correntes, a malha diferencial, os TCs
            exclusivos, a atua&ccedil;&atilde;o do 87B/87BN e a seletividade com 86-3.
          </p>
        </div>
      </section>

      <div className="protection-layout">
        <aside className="protection-sidebar" aria-label="Roteiro lateral da aula">
          <strong>Roteiro da aula</strong>
          <nav>
            {lessonSections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <HtmlText html={section.navLabel} />
              </a>
            ))}
            <a href="#consulta-rapida">Consulta r&aacute;pida</a>
          </nav>
        </aside>

        <div className="protection-content">
          {lessonSections.map((section) => (
            <section key={section.id} id={section.id} className="protection-section">
              <div className="protection-section-copy">
                <HtmlText as="h2" html={section.title} />
                <HtmlText as="p" html={section.explanation} />
              </div>

              <div className="protection-diagram-grid">
                {section.diagrams.map((diagram) => (
                  <DiagramFigure key={diagram.src} diagram={diagram} onOpen={setActiveDiagram} />
                ))}
              </div>

              <div className="protection-maintainer-note">
                <strong>Observa&ccedil;&atilde;o operacional</strong>
                <HtmlText as="p" html={section.operationalNote} />
              </div>
            </section>
          ))}

          <section id="consulta-rapida" className="protection-section protection-reference-section">
            <div className="protection-section-copy">
              <h2>Consulta r&aacute;pida</h2>
              <p>
                Resumo dos pontos que o aluno deve reconhecer durante a an&aacute;lise de
                eventos da prote&ccedil;&atilde;o diferencial de barras.
              </p>
            </div>

            <div className="protection-table-wrap">
              <table className="protection-reference-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>O que significa</th>
                    <th>O que o aluno deve lembrar</th>
                  </tr>
                </thead>
                <tbody>
                  {quickReference.map((row) => (
                    <tr key={row.item}>
                      <td>{row.item}</td>
                      <td><HtmlText html={row.meaning} /></td>
                      <td><HtmlText html={row.remember} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {activeDiagram && (
        <div
          className="protection-diagram-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Diagrama ampliado"
          onClick={() => setActiveDiagram(null)}
        >
          <div className="protection-diagram-modal-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="protection-modal-close" onClick={() => setActiveDiagram(null)}>
              <X size={18} />
              Fechar
            </button>
            <img src={activeDiagram.src} alt={activeDiagram.alt} />
            <p><HtmlText html={activeDiagram.caption} /></p>
          </div>
        </div>
      )}
    </div>
  );
}
