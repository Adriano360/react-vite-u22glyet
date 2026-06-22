# PayPal MFA Bypass Campaign - Hunt Runbook

Use este pacote apenas em contas proprias, ativos autorizados e fluxos onde MFA, SCA ou Step-Up e esperado. O objetivo e identificar bypass direto e claro de MFA sem engenharia social, roubo de sessao, comprometimento do segundo fator, DoS ou automacao agressiva.

## 1. Preparacao

- Crie ou separe 2 contas proprias de teste.
- Configure MFA forte na conta A: app approval/autenticador e fallback SMS ou e-mail.
- Configure MFA equivalente na conta B para validacoes de isolamento.
- Anote:
  - HackerOne username
  - E-mails das contas de teste
  - IP de origem usado nos testes
  - Timezone
  - Metodos MFA configurados
- Inclua, sempre que possivel, o header:

```http
X-PP-BB: HackerOne-<username>
```

## 2. Regras de seguranca operacional

- Teste somente `*.paypal.com` e apps oficiais listados pela campanha.
- Nao use contas de terceiros, dados reais de terceiros ou credenciais que nao sejam suas.
- Nao tente brute force de OTP, rate-limit testing, carga, fuzzing agressivo ou DoS.
- Nao use engenharia social, atendimento, phishing, SIM swap ou tomada de e-mail.
- Pare imediatamente se uma resposta expuser dados fora das suas contas de teste.
- Registre apenas o minimo necessario para provar impacto.

## 3. Ordem de trabalho

1. Execute o baseline legitimo do fluxo, completando MFA normalmente.
2. Registre a sequencia de alto nivel:
   - pre-MFA
   - challenge MFA/SCA/Step-Up
   - validacao MFA
   - estado pos-MFA
3. Repita o fluxo sem completar o segundo fator e observe se a acao protegida continua bloqueada.
4. Compare estados, redirects, cookies, parametros de fluxo, respostas API e indicadores de sessao verificada.
5. Promova para candidato de reporte somente se a acao protegida concluir sem completar MFA/SCA/Step-Up.

## 4. Fluxos prioritarios

- Login web com MFA obrigatorio.
- Alteracoes sensiveis de conta, perfil, seguranca e credenciais.
- Recuperacao de conta.
- Fluxos de pagamento que acionem SCA.
- Login parceiro ou PayPal Connect quando o controle permanecer no PayPal.
- Fluxos multicanal, por exemplo iniciar na web e concluir em outro canal, apenas quando isso provar bypass da verificacao exigida.

## 5. Hipoteses elegiveis

Use a matriz em `test-matrix.csv` para acompanhar os casos. As hipoteses de maior valor sao:

- Acao protegida conclui sem challenge concluido.
- Challenge emitido em um contexto e aceito indevidamente em outro.
- Sessao marcada como verificada antes da validacao real do segundo fator.
- Downgrade de metodo forte para metodo mais fraco sem justificativa de politica.
- Recuperacao de conta remove, substitui ou contorna MFA sem Step-Up adequado.
- Inconsistencia Web/API que permite concluir o fluxo por uma superficie alternativa.

## 6. Padrao minimo para reporte

Um achado so deve ir para HackerOne se houver:

- Titulo com `(Desvio de Campanha-MFA)`.
- Ativo afetado em escopo.
- Duas contas de teste ou justificativa de uma conta.
- Passos reprodutiveis.
- Evidencia de que MFA/SCA/Step-Up era esperado.
- Evidencia de que a acao protegida concluiu sem completar o desafio.
- Requests/responses essenciais, screenshots ou video.
- IP de origem, timestamps com timezone e PayPal-Debug-Id quando existir.
- Declaracao de conformidade com escopo.

## 7. Arquivos deste pacote

- `test-matrix.csv`: fila de testes priorizados.
- `evidence-log.csv`: registro de execucao e evidencias.
- `report-template.md`: modelo de relatorio pronto para preencher.
- `quick-triage.md`: criterios para decidir se o achado pertence a campanha MFA ou ao programa geral.
- `flow-worksheet.md`: ficha por fluxo para documentar baseline, variacao e resultado.
- `safe-proxy-checklist.md`: checklist de captura segura e organizada.
- `finding-decision-tree.md`: arvore de decisao para qualificar um achado antes do reporte.
