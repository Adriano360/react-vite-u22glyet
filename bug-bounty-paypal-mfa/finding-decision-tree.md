# Finding Decision Tree

Use este guia antes de gastar tempo escrevendo o relatorio.

## 1. O alvo esta em escopo?

- Sim: continue.
- Nao: pare ou redirecione para o programa correto.
- Incerto: nao teste mais ate confirmar no escopo oficial.

## 2. Existe MFA/SCA/Step-Up esperado?

- Sim, o desafio apareceu: continue.
- Sim, a politica indica que deveria aparecer: documente a evidencia da expectativa e continue com cuidado.
- Nao: provavelmente nao e campanha MFA; avalie o programa geral.

## 3. A acao protegida concluiu sem completar o desafio?

- Sim: forte candidato para campanha MFA.
- Nao, apenas UI ficou confusa: nao e suficiente.
- Nao, apenas houve erro diferente: registre como observacao, mas nao reporte como bypass.

## 4. O achado depende de pre-condicao proibida?

Fora da campanha se depender de:

- sessao, cookie ou token roubado
- e-mail, SMS, WhatsApp, IVR ou app da vitima comprometido
- engenharia social
- acesso fisico
- brute force ou rate limit de OTP
- DoS ou alto volume

## 5. Qual impacto demonstravel?

- Login completo sem MFA: candidato alto/critico conforme alcance.
- Mudanca de credenciais/seguranca sem Step-Up: candidato alto.
- Pagamento ou acao financeira sem SCA: candidato alto/critico conforme risco.
- Recuperacao de conta que substitui MFA: candidato alto.
- Estado inconsistente sem acao protegida: investigacao incompleta.

## 6. Evidencia pronta?

Antes de reportar, confirme:

- passos reprodutiveis
- baseline legitimo
- timestamps
- IP de origem
- contas de teste
- header `X-PP-BB`
- requests/responses essenciais
- screenshots ou video
- escopo e limitacoes
