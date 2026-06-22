export default function EducacaoView() {
  return (
    <section className="section-shell education-grid">
      <article>
        <span className="section-kicker">Educacao</span>
        <h2>Como ler o Radar das Baleias</h2>
        <p>Whale Score mede intensidade do movimento. Confianca mede qualidade do sinal, considerando spread, negocios, financeiro e repeticao.</p>
      </article>
      <article>
        <h3>CALL</h3>
        <p>Pode sugerir fluxo de alta, trava, venda coberta ou especulacao, dependendo de strike, prazo e comportamento do ativo.</p>
      </article>
      <article>
        <h3>PUT</h3>
        <p>Pode sugerir protecao, fluxo direcional de baixa ou hedge institucional quando aparece com volume e volatilidade acima do normal.</p>
      </article>
      <article>
        <h3>Risco</h3>
        <p>Opcoes podem perder valor rapidamente. Sempre confira liquidez, spread, vencimento e contexto antes de qualquer decisao.</p>
      </article>
    </section>
  );
}
