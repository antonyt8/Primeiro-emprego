# RFS - Requisitos Funcionais do Sistema

## 1. Objetivo
Definir os requisitos funcionais do Primeiro Emprego 2026 em alinhamento ao planejamento SCRUM documentado em [docs/planejamento-scrum-2026.md](docs/planejamento-scrum-2026.md).

## 2. Escopo
O sistema deve cobrir os seguintes modulos de negocio:
- Modulo Aluno.
- RH do Orgao.
- RH Central.

## 3. Atores do Sistema
- Candidato (Aluno).
- RH do Orgao.
- RH Central.
- Administrador de sistema.

## 4. Roadmap de Referencia
Este RFS esta alinhado ao roadmap:
1. Sprint 0 - Setup (fundacao tecnica).
2. Sprint 1 - Modulo Aluno (cadastro, login e senha).
3. Sprint 2 - Editais e Inscricao.
4. Sprint 3 - Upload de Documentos.

## 5. Requisitos Funcionais

### 5.1 Modulo Aluno
#### RF-001 - Cadastro de aluno
O sistema deve permitir cadastro de aluno com dados obrigatorios, incluindo CPF e email unicos.

#### RF-002 - Login
O sistema deve permitir autenticacao por credenciais validas.

#### RF-003 - Recuperacao/definicao de senha
O sistema deve permitir envio de senha ou fluxo de redefinicao por email.

#### RF-004 - Alteracao de senha
O usuario autenticado deve poder alterar a propria senha.

#### RF-005 - Visualizacao de edital
O aluno deve visualizar editais publicados e seus detalhes.

#### RF-006 - Inscricao em edital
O aluno deve poder realizar inscricao em edital disponivel.

#### RF-007 - Formulario de inscricao
O sistema deve coletar dados pessoais e academicos no fluxo de inscricao.

#### RF-008 - Upload de documentos
O aluno deve enviar documentos obrigatorios da inscricao.

#### RF-009 - Complementacao de documentos
O aluno deve reenviar ou complementar documentos quando solicitado.

#### RF-010 - Visualizacao de status da inscricao
O aluno deve acompanhar status da inscricao e da validacao documental.

### 5.2 RH do Orgao
#### RF-011 - Solicitacao de estagiarios
O RH do Orgao deve registrar solicitacoes de vagas/estagiarios.

#### RF-012 - Recebimento de candidatos
O RH do Orgao deve receber lista de candidatos encaminhados.

#### RF-013 - Registro de entrevista
O RH do Orgao deve registrar agendamento e resultado de entrevista.

#### RF-014 - Contratacao
O RH do Orgao deve registrar contratacao de candidato aprovado.

#### RF-015 - Renovacao
O RH do Orgao deve registrar renovacoes contratuais.

#### RF-016 - Desligamento
O RH do Orgao deve registrar desligamentos e motivo.

### 5.3 RH Central
#### RF-017 - CRUD de editais
O RH Central deve criar, editar, publicar e encerrar editais.

#### RF-018 - Banco de talentos
O RH Central deve consultar e gerenciar candidatos no banco de talentos.

#### RF-019 - Algoritmo de selecao
O sistema deve executar criterios de selecao definidos para classificacao de candidatos.

#### RF-020 - Gestao de usuarios
O RH Central deve administrar usuarios e perfis de acesso.

#### RF-021 - Relatorios
O RH Central deve emitir relatorios operacionais e gerenciais.

## 6. Regras de Negocio
- RN-001: CPF e email devem ser unicos por aluno.
- RN-002: Apenas usuarios autenticados acessam funcionalidades internas.
- RN-003: Cada inscricao deve estar vinculada a um edital ativo.
- RN-004: Upload deve validar tipo e tamanho de arquivo.
- RN-005: Status de inscricao deve ser rastreavel por historico de mudanca.
- RN-006: Operacoes de RH do Orgao e RH Central exigem perfil autorizado.

## 7. Criterios de Aceite por Sprint
### 7.1 Sprint 0
- CA-001: Ambiente backend inicializado com stack definida.
- CA-002: Repositorio e padroes de desenvolvimento configurados.

### 7.2 Sprint 1
- CA-003: Aluno consegue cadastrar conta valida.
- CA-004: Aluno consegue autenticar e acessar area interna.
- CA-005: Fluxo de senha (envio/alteracao) funcional.

### 7.3 Sprint 2
- CA-006: RH Central consegue publicar edital.
- CA-007: Aluno consegue visualizar edital publicado.
- CA-008: Aluno consegue concluir inscricao com formulario completo.

### 7.4 Sprint 3
- CA-009: Aluno consegue enviar documentos obrigatorios.
- CA-010: Sistema valida e registra status dos documentos.
- CA-011: Aluno consegue visualizar andamento da inscricao.

## 8. Matriz de Rastreabilidade (Sprint x RF)
- Sprint 1: RF-001, RF-002, RF-003, RF-004.
- Sprint 2: RF-005, RF-006, RF-007, RF-017.
- Sprint 3: RF-008, RF-009, RF-010.
- Backlog futuro (apos Sprint 3): RF-011 a RF-016, RF-018 a RF-021.

## 9. Dependencias e Integracoes
- API backend Laravel para autenticacao, editais, inscricao e documentos.
- Banco PostgreSQL para persistencia transacional.
- Servico de email para fluxos de senha e comunicacoes.

## 10. Referencias
- Planejamento SCRUM: [docs/planejamento-scrum-2026.md](docs/planejamento-scrum-2026.md)
- Arquitetura frontend: [docs/arquitetura-e-fluxo.md](docs/arquitetura-e-fluxo.md)
- Backend e banco: [docs/backend-e-banco.md](docs/backend-e-banco.md)
- Catalogo de endpoints: [docs/endpoints-api.md](docs/endpoints-api.md)
