# Proposta de Backend e Banco de Dados (Laravel)

## 1. Objetivo
Definir, de forma detalhada, como ficara o backend e o banco para suportar os fluxos atuais do frontend:
- autenticacao e sessao;
- perfil do candidato;
- elegibilidade e inscricao;
- documentos e validacao;
- notificacoes;
- ciclo do processo seletivo.

## 2. Stack Recomendada
- Laravel 11 (PHP 8.2+)
- PostgreSQL
- Eloquent ORM
- Laravel Sanctum para autenticacao (token ou cookie-based)
- Redis (opcional para cache, fila e sessao)
- Laravel Queue + Scheduler para tarefas assincronas
- Storage local/S3 para arquivos de documentos

## 3. Arquitetura do Backend (Laravel)
Estrutura sugerida:
```
backend/
  app/
    Http/
      Controllers/
        AuthController.php
        ProfileController.php
        ApplicationController.php
        DocumentController.php
        NotificationController.php
      Requests/
        Auth/
        Profile/
        Application/
        Document/
      Resources/
    Models/
      User.php
      CandidateProfile.php
      Application.php
      ApplicationStepHistory.php
      Document.php
      Notification.php
      Institution.php
      Course.php
      QuotaCategory.php
    Services/
      AuthService.php
      EligibilityService.php
      ApplicationService.php
      DocumentService.php
      NotificationService.php
    Policies/
    Jobs/
    Notifications/
  database/
    migrations/
    seeders/
    factories/
  routes/
    api.php
  config/
  storage/
  tests/
```

### 3.1 Responsabilidade de cada camada
- Controller: recebe request, chama service, retorna resource/json.
- Form Request: valida payload e autoriza operacoes sensiveis.
- Service: concentra regras de negocio e transacoes.
- Model (Eloquent): mapeia tabelas, relacoes e escopos.
- Policy/Gate: garante que cada usuario acesse apenas seus dados.
- Job: processamento assincrono (ex.: disparo de notificacao e revisao em lote).
- Notification: envio por email/database/channels futuros.

## 4. Modulos de Dominio
### 4.1 Auth
Responsavel por registro, login, logout e usuario autenticado.

### 4.2 Profile
Responsavel pelos dados pessoais e academicos do candidato.

### 4.3 Application
Responsavel por inscricao no processo e estado atual (pipeline).

### 4.4 Documents
Responsavel por upload, consulta, reenvio e exclusao de documentos.

### 4.5 Notifications
Responsavel por listar, marcar como lida e limpar notificacoes.

### 4.6 Process
Responsavel por historico de mudancas de etapa e rastreabilidade.

## 5. Modelo de Banco de Dados (Detalhado)
Obs.: usar UUID como chave primaria para entidades principais.

### 5.1 users
- id (uuid, pk)
- name (varchar)
- email (varchar, unique, index)
- cpf (varchar, unique, index)
- password (varchar)
- role (enum: candidate, admin)
- email_verified_at (timestamp, nullable)
- created_at, updated_at

### 5.2 candidate_profiles
- id (uuid, pk)
- user_id (uuid, fk users.id, unique)
- phone (varchar)
- institution_id (uuid, fk institutions.id)
- course_id (uuid, fk courses.id)
- period (smallint)
- cr (numeric(4,2), nullable)
- created_at, updated_at

### 5.3 institutions
- id (uuid, pk)
- name (varchar, unique)
- created_at, updated_at

### 5.4 courses
- id (uuid, pk)
- name (varchar, unique)
- created_at, updated_at

### 5.5 quota_categories
- id (uuid, pk)
- code (varchar, unique)
- name (varchar)
- created_at, updated_at

### 5.6 applications
- id (uuid, pk)
- user_id (uuid, fk users.id, index)
- edital_number (varchar, index)
- quota_category_id (uuid, fk quota_categories.id, nullable)
- status (enum: open_window, talent_bank, convocation, admission, rejected)
- eligibility_result (enum: eligible, ineligible)
- eligibility_reason (text, nullable)
- applied_at (timestamp)
- created_at, updated_at

### 5.7 application_step_histories
- id (uuid, pk)
- application_id (uuid, fk applications.id, index)
- from_status (varchar, nullable)
- to_status (varchar)
- changed_by (uuid, fk users.id, nullable)
- changed_at (timestamp, index)
- note (text, nullable)

### 5.8 documents
- id (uuid, pk)
- user_id (uuid, fk users.id, index)
- type (enum: rg, comprovante_residencia, dados_bancarios, outros)
- original_name (varchar)
- mime_type (varchar)
- size_bytes (bigint)
- file_path (varchar)
- file_url (varchar, nullable)
- status (enum: pending, approved, rejected, index)
- rejection_reason (text, nullable)
- uploaded_at (timestamp)
- reviewed_at (timestamp, nullable)
- reviewed_by (uuid, fk users.id, nullable)
- created_at, updated_at

### 5.9 notifications
- id (uuid, pk)
- user_id (uuid, fk users.id, index)
- title (varchar)
- message (text)
- type (varchar, nullable)
- data_json (jsonb, nullable)
- read_at (timestamp, nullable, index)
- created_at, updated_at

### 5.10 personal_access_tokens (Sanctum)
Tabela padrao do Sanctum para tokens quando o modo for token-based.

## 6. Relacionamentos Eloquent
- User hasOne CandidateProfile
- User hasMany Application
- User hasMany Document
- User hasMany Notification
- CandidateProfile belongsTo User
- CandidateProfile belongsTo Institution
- CandidateProfile belongsTo Course
- Application belongsTo User
- Application belongsTo QuotaCategory
- Application hasMany ApplicationStepHistory
- Document belongsTo User
- Notification belongsTo User

## 7. Regras de Negocio (Detalhadas)
### 7.1 Cadastro e autenticacao
- email e cpf unicos.
- senha com politica minima (8+, recomendavel letras/numero/simbolo).
- login bloqueado por rate-limit apos tentativas excessivas.

### 7.2 Elegibilidade
- regra inicial: period >= 3.
- candidato ineligible nao cria application ativa.
- regra deve ser centralizada em EligibilityService.

### 7.3 Inscricao/processo
- cada usuario pode ter no maximo 1 inscricao ativa por edital.
- mudanca de status deve gravar historico obrigatoriamente.
- transicao invalida de status deve ser bloqueada.

### 7.4 Documentos
- upload aceita apenas mime types permitidos e limite de tamanho.
- documento rejeitado exige rejection_reason.
- reenvio cria nova revisao ou atualiza status para pending, conforme estrategia.

### 7.5 Notificacoes
- cada transicao importante de processo gera notificacao.
- leitura individual e leitura em lote devem atualizar read_at.

## 8. Endpoints REST (MVP)
### 8.1 Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/logout`
- GET `/auth/me`

### 8.2 Perfil
- GET `/me/profile`
- PUT `/me/profile`

### 8.3 Elegibilidade e inscricao
- POST `/program/eligibility`
- POST `/applications`
- GET `/applications/me`
- GET `/applications/{id}/history`

### 8.4 Documentos
- GET `/me/documents`
- POST `/me/documents` (multipart/form-data)
- PUT `/me/documents/{id}/resend`
- DELETE `/me/documents/{id}`

### 8.5 Notificacoes
- GET `/me/notifications`
- PATCH `/me/notifications/{id}/read`
- PATCH `/me/notifications/read-all`

### 8.6 Processo
- GET `/me/process-status`

## 9. Contratos de API (Exemplos)
### 9.1 POST /auth/login (request)
```json
{
  "email": "candidato@exemplo.com",
  "password": "Senha@123"
}
```

### 9.2 POST /auth/login (response)
```json
{
  "user": {
    "id": "uuid",
    "name": "Nome",
    "email": "candidato@exemplo.com",
    "role": "candidate"
  },
  "token": "plain_text_token"
}
```

### 9.3 POST /program/eligibility (response)
```json
{
  "eligible": true,
  "reason": null
}
```

### 9.4 GET /me/documents (response)
```json
[
  {
    "id": "uuid",
    "type": "rg",
    "status": "approved",
    "rejection_reason": null,
    "uploaded_at": "2026-04-15T12:00:00Z"
  }
]
```

## 10. Fluxos de Negocio (Passo a Passo)
### 10.1 Fluxo de login
1. Front envia credenciais.
2. Laravel autentica e emite token Sanctum (ou cookie).
3. Front chama `/auth/me`.
4. Front libera acesso ao dashboard.

### 10.2 Fluxo de inscricao
1. Front verifica elegibilidade.
2. Se elegivel, cria application.
3. Backend inicia status em `open_window` e registra historico.
4. Notificacao inicial e criada para o candidato.

### 10.3 Fluxo de documentos
1. Front envia arquivo multipart.
2. Backend valida arquivo e salva no storage.
3. Registro em `documents` com status `pending`.
4. Admin revisa e altera para `approved`/`rejected`.
5. Sistema notifica o candidato.

### 10.4 Fluxo de transicao de status
1. Admin/sistema muda status da application.
2. Service valida transicao permitida.
3. Salva novo status + historico em transacao.
4. Dispara notificacao (queue).

## 11. Indices e Performance
Criar indices para consultas mais frequentes:
- users(email), users(cpf)
- candidate_profiles(user_id)
- applications(user_id, status)
- applications(edital_number)
- documents(user_id, status)
- notifications(user_id, read_at)
- application_step_histories(application_id, changed_at)

Boas praticas:
- paginação padrao nas listas (`paginate`).
- eager loading (`with`) para evitar N+1.
- cache para catalogos fixos (instituicoes/cursos).

## 12. Seguranca e Conformidade
- Hash de senha com Argon2id (padrao Laravel atual) ou bcrypt.
- TLS em todos os ambientes.
- CORS restrito ao dominio do frontend.
- Rate-limit em auth e uploads.
- Validacao forte com Form Requests.
- Antivirus/scan de arquivo (opcional, recomendado em producao).
- Logs de auditoria para mudancas de status e revisao de documentos.

## 13. Estrategia de Implementacao (Sprints)
### Sprint 1 - Fundacao
- estrutura Laravel + Sanctum + migrations base
- auth/register/login/logout/me

### Sprint 2 - Perfil e Elegibilidade
- profile CRUD do candidato
- endpoint de elegibilidade

### Sprint 3 - Inscricao e Processo
- criacao de application
- historico de status
- endpoint de process-status

### Sprint 4 - Documentos
- upload, listagem, reenvio, remocao
- validacoes de arquivo e status

### Sprint 5 - Notificacoes e Endurecimento
- notificacoes e leitura
- fila, logs, rate-limits, testes de integracao

## 14. Resultado Esperado
Com esse desenho, a aplicacao passa de um frontend com estados locais para uma arquitetura Laravel completa, escalavel e auditavel, com banco relacional preparado para evolucao de regras de negocio sem retrabalho das telas atuais.

## 15. Referencia de Endpoints
Para o catalogo completo de rotas (publicas, candidato e admin), consultar:
- `docs/endpoints-api.md`
