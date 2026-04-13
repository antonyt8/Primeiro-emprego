# Primeiro Emprego AL

Plataforma web para orientar candidatos no processo de inscrição, acompanhamento de perfil, documentos e notificações. O projeto foi construído com Vite, React, TypeScript, Tailwind CSS e componentes inspirados no shadcn/ui.

## Funcionalidades

- Landing page com apresentação do programa e critérios de elegibilidade.
- Área de autenticação com fluxo de login e cadastro.
- Dashboard com navegação entre Painel, Perfil, Documentos e Notificações.
- Estados de processo do candidato, incluindo banco de talentos, convocação e admissão.
- Interface responsiva, com suporte a desktop e mobile.

## Tecnologias

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- TanStack React Query

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

3. Abra o endereço exibido no terminal, normalmente:

```bash
http://localhost:8080/
```

## Scripts disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento.
- `npm run build` - gera a versão de produção.
- `npm run build:dev` - build usando o modo development.
- `npm run preview` - visualiza o build localmente.
- `npm run lint` - executa o ESLint.
- `npm run test` - executa os testes com Vitest.
- `npm run test:watch` - executa os testes em modo observação.

## Rotas principais

- `/` - página inicial.
- `/auth` - autenticação.
- `/dashboard` - painel do candidato.

## Estrutura do projeto

- `src/pages` - páginas principais da aplicação.
- `src/components/landing` - seções da landing page.
- `src/components/dashboard` - telas e blocos do dashboard.
- `src/components/ui` - biblioteca base de componentes.
- `src/hooks` - hooks reutilizáveis.
- `src/lib` - utilitários compartilhados.

## Observações

- O projeto já está configurado para rodar na porta `8080`.
- As telas do dashboard usam dados e estados locais, então ainda não há integração com backend.

# Primeiro-emprego
