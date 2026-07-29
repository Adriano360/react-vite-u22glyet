# Treinamento de Proteção Light+

Aplicação React criada com Vite para treinamento operacional de proteção de subestações.

## Abrir a versão atualizada

Use este endereço para abrir no StackBlitz a versão mais recente da branch `main` do GitHub:

https://stackblitz.com/github/Adriano360/react-vite-u22glyet?file=src%2FApp.jsx

> Não utilize mais o endereço antigo `https://stackblitz.com/edit/react-vite-u22glyet`, pois ele abre uma cópia independente e desatualizada do projeto.

## Requisitos

- Node.js 20.19 ou superior
- npm

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite no terminal, normalmente
`http://localhost:5173`.

## Ativar o Agente Light+

O botão **Pergunte ao Agente Light+** abre uma conversa para dúvidas sobre o
curso e sobre subestações. A integração usa um endpoint no servidor para não
expor a chave da IA no navegador do aluno.

1. Copie `.env.example` para `.env`.
2. Preencha `OPENAI_API_KEY` com a chave do projeto na OpenAI.
3. Execute `npm run dev`.

O servidor carrega o arquivo `.env` automaticamente ao iniciar. Em uma
hospedagem, cadastre `OPENAI_API_KEY` como variável secreta no painel do
provedor e execute a aplicação com `npm start`.

Nunca coloque a chave em um nome iniciado por `VITE_` e nunca envie o arquivo
`.env` para o GitHub.

O modelo pode ser alterado pela variável `OPENAI_MODEL`. O padrão do projeto é
`gpt-5.6-terra`, equilibrando qualidade e custo.

## Build

```bash
npm run build
```

Para gerar e visualizar o build com o endpoint do agente:

```bash
npm run preview
```

## Compatibilidade com Bolt

As versões do Vite e do plugin React estão fixadas no `package.json` para
evitar incompatibilidade do Vite 8/Rolldown com o WebContainer do Bolt.
