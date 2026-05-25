# Primeiro Emprego 2026 - Planejamento SCRUM

## 1. Contexto
- Projeto: Primeiro Emprego 2026
- Envolvidos institucionais: Secretaria de Estado do Planejamento, Gestao e Patrimonio
- Evento: Fluxo do Desenvolvimento do Sistema
- Data do evento: 31/03/2026
- Fonte de requisitos (levantamento):
  - https://docs.google.com/document/d/1PNL9RLOxNG7jmio-N_3ZBS5SoDM7usELdNbPgfLGhCI/edit?tab=t.0

## 2. Estrutura SCRUM do Projeto
### 2.1 Papeis
- Product Owner (PO): Emanuelle e Barboza
- Scrum Master: Barboza
- Time de Desenvolvimento: Cayo Capuxy, Caio Ricardo, Anthony

## 3. Ciclo SCRUM
Cada sprint segue o ciclo:
1. Sprint Planning
2. Desenvolvimento (com Daily)
3. Sprint Review
4. Sprint Retrospective

## 4. Product Backlog Macro (por Modulos)
### 4.1 Modulo Aluno
- Cadastro
- Login
- Inscricao em edital
- Envio de documentos
- Complementacao de documentos

### 4.2 RH do Orgao
- Solicitacao de estagiarios
- Recebimento de candidatos
- Entrevista
- Contratacao
- Renovacao
- Desligamento

### 4.3 RH Central
- Editais
- Banco de talentos
- Algoritmo de selecao
- Gestao de usuarios
- Relatorios

## 5. Roadmap de Sprints
### Sprint 0 - Setup (Fundacao do Projeto)
- Status: Em andamento
- Data de entrega: 06/04/2026
- Objetivo: preparar o ambiente
- Entregas:
  - Definicao da arquitetura: PHP 8.2 + Laravel + PostgreSQL
  - Configuracao do repositorio (Git)
  - Setup de autenticacao basica
  - Modelagem inicial do banco (usuarios, aluno)
- Reunioes:
  - Kickoff do projeto e definicao de stack
  - Data informada: 15/04/2026

### Sprint 1 - Modulo Aluno
- Objetivo: permitir entrada de usuarios no sistema
- Entregas:
  - Cadastro de aluno (CPF, email, etc.)
  - Envio de senha por email
  - Login
  - Alteracao de senha
- Valor entregue:
  - Sistema ja tem usuarios reais cadastrando

### Sprint 2 - Editais + Inscricao
- Objetivo: permitir inicio real do programa
- Entregas:
  - CRUD de editais (RH Central)
  - Publicacao de edital
  - Visualizacao de edital pelo aluno
  - Inscricao no edital
  - Formulario com dados pessoais e academicos
- Valor entregue:
  - Processo seletivo comeca a existir

### Sprint 3 - Upload de Documentos
- Objetivo: formalizar inscricoes
- Entregas:
  - Upload de documentos obrigatorios
  - Validacao de arquivos
  - Visualizacao da inscricao
  - Status da inscricao
- Valor entregue:
  - Banco de talentos comeca a ser formado

## 6. Pendencias para Refinamento
- Confirmar cronologia oficial entre data do evento (31/03/2026), entrega da Sprint 0 (06/04/2026) e kickoff informado (15/04/2026).
- Definir criterios de pronto (Definition of Done) por sprint.
- Definir indicadores de acompanhamento por modulo (cadastros, inscricoes, documentos aprovados, tempo medio por etapa).
- Quebrar backlog macro em historias de usuario com criterios de aceite.

## 7. Proxima Acao Recomendada
Na proxima Sprint Planning, transformar os itens macro em backlog executavel:
1. Epicos -> historias
2. Historias -> tarefas tecnicas
3. Tarefas -> estimativas e responsaveis
4. Definicao de entregaveis demonstraveis para Review
