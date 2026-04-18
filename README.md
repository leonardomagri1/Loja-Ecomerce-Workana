# CasaVitrine

Marketplace em React com home publica, catalogo separado, detalhe de produto, carrinho em pagina propria, area de conta, pedidos com acompanhamento e uma central da loja acessivel conforme a conta autenticada.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- CSS customizado com foco em performance
- Vitest + Testing Library

## Como abrir

```bash
npm install
npm run dev
```

## Perfis disponiveis

- `helena@casavitrine.com` / `Aurora2026!`
- `rafael@casavitrine.com` / `Compras2026!`

## Validacao executada

```bash
npm run lint
npm run test
npm run build
```

## Estrutura principal

- `src/App.tsx`: rotas, autenticacao, catalogo, conta, carrinho e central da loja
- `src/mockData.ts`: produtos, perfis, pedidos, pagamentos e enderecos
- `src/App.css`: layout, componentes visuais, modais e responsividade
- `src/App.test.tsx`: testes de home publica, login sob demanda, conta e central da loja

## Build

A pasta `dist/` foi gerada com sucesso e esta pronta para preview ou publicacao.
