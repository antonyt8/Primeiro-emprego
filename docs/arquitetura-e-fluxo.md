# Arquitetura e Fluxo de Codigo (Frontend)

## 1. Visao Geral
Este projeto e uma SPA em React + Vite + TypeScript, com foco em:
- landing institucional do programa;
- autenticacao de candidato;
- dashboard do candidato;
- acessibilidade global (alto contraste, atalhos e skip links).

A estrutura esta organizada por camadas leves para facilitar a integracao com backend:
- ui e paginas em `src/components` e `src/pages`;
- contratos e tipos em `src/types`;
- catalogos e dados fixos em `src/constants`;
- regras de negocio locais em `src/services`;
- cliente HTTP e APIs em `src/api`;
- configuracao de ambiente em `src/config`.

## 2. Estrutura de Pastas
```
src/
  api/
    http.ts
    programApi.ts
  config/
    env.ts
  constants/
    program.ts
  services/
    programService.ts
  types/
    program.ts
  components/
    accessibility/
    dashboard/
    landing/
    ui/
  pages/
    Index.tsx
    AuthPage.tsx
    DashboardPage.tsx
    FaqPage.tsx
    PrivacyPolicyPage.tsx
    AccessibilityPage.tsx
    NotFound.tsx
  App.tsx
  main.tsx
```

## 3. Fluxo de Execucao da Aplicacao
### 3.1 Bootstrap
1. `src/main.tsx` monta o React em `#root`.
2. `src/App.tsx` configura providers globais:
   - `QueryClientProvider` (React Query);
   - `TooltipProvider`;
   - Toasters (`Toaster` e `Sonner`);
   - `PortalAccessibility`.
3. Em seguida, o `BrowserRouter` registra as rotas da aplicacao.

### 3.2 Roteamento
Rotas principais:
- `/` -> `Index.tsx` (landing)
- `/auth` -> `AuthPage.tsx` (login/cadastro)
- `/dashboard` -> `DashboardPage.tsx`
- `/faq`, `/politica-de-privacidade`, `/acessibilidade`
- `*` -> `NotFound.tsx`

## 4. Fluxo por Modulo
### 4.1 Landing (`src/pages/Index.tsx`)
Ordem de renderizacao:
1. `Navbar`
2. `HeroSection`
3. `EligibilityFilter` (id `elegibilidade`)
4. `TimelineSection` (id `como-funciona`)
5. `IndigenousProgramSection`
6. `QuotaCards` (id `cotas`)
7. `DocumentsSection` (id `documentos`)
8. `Footer`

Observacao:
- O menu usa ancoras (`#elegibilidade`, `#como-funciona`, etc.) para navegacao interna.

### 4.2 Autenticacao (`src/pages/AuthPage.tsx`)
- Dois modos de tela: `login` e `register`.
- Cadastro em 3 passos com validacoes locais de nome, CPF, email e senha.
- Hoje o fluxo e local: ao validar, navega para `/dashboard`.
- Catalogos de instituicao/curso ja foram extraidos para `src/constants/program.ts`.

### 4.3 Dashboard (`src/pages/DashboardPage.tsx`)
Estados de navegacao:
- `panel`, `profile`, `docs`, `notifications`.

Dentro de `panel`, existe um segundo estado de processo:
- `open-window`, `talent-bank`, `convocation`, `admission`.

Comportamentos importantes:
- Sidebar desktop + menu mobile.
- Modal de recusa em convocacao (`RefuseModal`).
- Componentes de perfil/documentos/notificacoes ainda usam dados mock/local state.

### 4.4 Acessibilidade (`src/components/accessibility/PortalAccessibility.tsx`)
- Atalho Alt+1, Alt+2, Alt+3 para foco em conteudo/menu/rodape.
- Skip links no topo da pagina.
- Botao de alto contraste arrastavel.
- Persistencia em `localStorage` usando chaves de `PROGRAM_STORAGE_KEYS`.

## 5. Camadas de Dominio e Integracao
### 5.1 Tipos (`src/types/program.ts`)
Define contratos centrais do dominio:
- `EligibilitySelection`, `EligibilityResult`
- `UserProfile`
- `DocumentItem`, `NotificationItem`

### 5.2 Constantes (`src/constants/program.ts`)
Centraliza:
- listas de instituicoes/cursos/periodos;
- perfil inicial;
- chaves de persistencia local.

### 5.3 Servicos (`src/services/programService.ts`)
- `programCatalog` para consumo de catalogos no UI.
- `evaluateEligibility` e `normalizePeriod` para regra de elegibilidade local.

### 5.4 API (`src/api/http.ts` e `src/api/programApi.ts`)
- `request<T>()` padroniza chamadas HTTP e erros (`HttpError`).
- `programApi` concentra endpoints do programa:
  - `checkEligibility`;
  - `updateProfile`.

## 6. Estado Atual (Pontos Fortes e Pontos a Evoluir)
### Pontos fortes
- Base de arquitetura em camadas ja iniciada.
- React Query ja disponivel para migrar fetches locais para backend.
- Boa separacao visual entre landing, auth e dashboard.

### Pontos a evoluir
- Fluxo de auth ainda sem token/sessao real.
- Dashboard ainda com dados locais em componentes.
- Falta padronizar hooks de dados (`useQuery`/`useMutation`) por modulo.

## 7. Proximo Passo Recomendado
Criar hooks por caso de uso, mantendo componentes de UI focados em apresentacao:
- `useAuth`, `useProfile`, `useDocuments`, `useNotifications`, `useEligibility`.

Assim, o frontend fica desacoplado e pronto para conectar no backend sem reescrever telas.

## 8. Guia de Integracao com API
Para o passo a passo completo da integracao frontend-backend, consultar:
- [docs/guia-integracao-frontend-api.md](docs/guia-integracao-frontend-api.md)
