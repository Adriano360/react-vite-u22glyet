# Safe Proxy Checklist

Use isto para manter a captura organizada e dentro das regras do programa.

## Antes de testar

- Configure o proxy apenas no navegador/perfil de teste.
- Use contas proprias e separadas de contas pessoais.
- Confirme que o header abaixo esta sendo enviado quando tecnicamente possivel:

```http
X-PP-BB: HackerOne-<username>
```

- Desative extensoes desnecessarias no navegador de teste.
- Defina um padrao de nomes para evidencias:

```text
YYYY-MM-DD_paypal-mfa_<test-id>_<flow>_<step>
```

## Durante a captura

- Capture apenas requests/responses necessarios ao fluxo.
- Marque ou exporte:
  - request que inicia o fluxo protegido
  - request/response que apresenta MFA/SCA/Step-Up
  - request/response de validacao do desafio
  - request/response da acao protegida
- Preserve timestamps e timezone.
- Salve `PayPal-Debug-Id` quando aparecer.
- Remova ou mascare segredos antes de compartilhar fora do HackerOne.

## O que nao fazer

- Nao rode scanner ativo contra `*.paypal.com`.
- Nao automatize tentativas de OTP.
- Nao aumente volume de requests para testar rate limit.
- Nao tente explorar DoS ou degradacao.
- Nao capture trafego de contas pessoais ou de terceiros.
- Nao use cookies/tokens roubados como pre-condicao.

## Evidencia ideal para um bypass

- Video curto mostrando o desafio exigido e a acao concluida sem completar o desafio.
- Requests/responses minimos que provem a transicao de estado.
- Comparacao com baseline legitimo, mostrando o ponto em que o controle deveria bloquear.
- Uma frase objetiva explicando: "o atacante possui senha valida, mas nao possui o segundo fator".
