# Catalogo Completo de Endpoints da API

## 1. Convencoes Gerais
- Base URL (dev): `http://localhost:8000/api`
- Versionamento: `v1` (recomendado): `http://localhost:8000/api/v1`
- Formato padrao: JSON
- Autenticacao: Laravel Sanctum
- Timezone de resposta: UTC (ISO-8601)
- ID principal: UUID

## 2. Autenticacao (Sanctum)
Dois modos possiveis:
1. Token-based (mobile/API clients): `Authorization: Bearer <token>`
2. Cookie-based (SPA): cookie de sessao + CSRF

Recomendacao para este frontend:
- iniciar com token-based para simplificar integracao inicial.

## 3. Headers Padrao
### Request
- `Accept: application/json`
- `Content-Type: application/json` (exceto upload multipart)
- `Authorization: Bearer <token>` quando rota protegida

### Response
- `Content-Type: application/json`

## 4. Envelope de Resposta (Padrao)
### Sucesso
```json
{
  "data": {},
  "meta": {},
  "message": "ok"
}
```

### Erro
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["O campo e-mail e obrigatorio."]
  }
}
```

## 5. Paginacao, Filtros e Ordenacao
Padrrao para listas:
- Query params:
  - `page` (default 1)
  - `per_page` (default 15, max 100)
  - `search` (texto livre)
  - `sort_by`
  - `sort_dir` (`asc` ou `desc`)

Exemplo:
- `GET /v1/me/notifications?page=1&per_page=20&sort_by=created_at&sort_dir=desc`

## 6. Endpoints Publicos
Esses endpoints alimentam landing page e conteudo institucional.

### 6.1 Saude da API
- `GET /v1/health`
  - Auth: publica
  - Uso: status de API para monitoramento

### 6.2 Catalogos Publicos
- `GET /v1/public/institutions`
- `GET /v1/public/courses`
- `GET /v1/public/periods`
  - Auth: publica
  - Uso: formulario de elegibilidade/cadastro

### 6.3 Conteudo Institucional
- `GET /v1/public/landing`
- `GET /v1/public/faqs`
- `GET /v1/public/privacy-policy`
- `GET /v1/public/accessibility`
  - Auth: publica
  - Uso: pagina inicial e paginas institucionais

### 6.4 Documentos Publicos
- `GET /v1/public/documents/notices`
- `GET /v1/public/documents/talent-bank`
- `GET /v1/public/documents/contracted-interns`
  - Auth: publica
  - Uso: secao de documentos da landing

## 7. Endpoints de Autenticacao

### 7.1 Registro
- `POST /v1/auth/register`
  - Auth: publica
  - Body:
```json
{
  "name": "Nome Completo",
  "cpf": "00000000000",
  "email": "email@exemplo.com",
  "password": "Senha@123",
  "password_confirmation": "Senha@123"
}
```

### 7.2 Login
- `POST /v1/auth/login`
  - Auth: publica
  - Body:
```json
{
  "email": "email@exemplo.com",
  "password": "Senha@123"
}
```
  - Response:
```json
{
  "data": {
    "token": "plain_text_token",
    "token_type": "Bearer",
    "user": {
      "id": "uuid",
      "name": "Nome",
      "email": "email@exemplo.com",
      "role": "candidate"
    }
  }
}
```

### 7.3 Usuario autenticado
- `GET /v1/auth/me`
  - Auth: protegida

### 7.4 Logout
- `POST /v1/auth/logout`
  - Auth: protegida
  - Uso: revogar token atual

### 7.5 Logout global (opcional)
- `POST /v1/auth/logout-all`
  - Auth: protegida
  - Uso: revogar todos os tokens do usuario

## 8. Endpoints do Candidato (Area /me)

### 8.1 Perfil
- `GET /v1/me/profile`
- `PUT /v1/me/profile`
  - Auth: protegida (candidate)
  - Body do PUT:
```json
{
  "phone": "82999999999",
  "institution_id": "uuid",
  "course_id": "uuid",
  "period": 5,
  "cr": 8.75
}
```

### 8.2 Elegibilidade
- `POST /v1/me/eligibility/check`
  - Auth: protegida (candidate)
  - Body:
```json
{
  "institution_id": "uuid",
  "course_id": "uuid",
  "period": 5,
  "cr": 8.75
}
```

### 8.3 Inscricoes
- `POST /v1/me/applications`
- `GET /v1/me/applications`
- `GET /v1/me/applications/{application_id}`
- `GET /v1/me/applications/{application_id}/history`
  - Auth: protegida (candidate)

### 8.4 Status de processo atual
- `GET /v1/me/process-status`
  - Auth: protegida (candidate)
  - Retorna etapa atual + prazo de resposta (quando houver)

### 8.5 Documentos do candidato
- `GET /v1/me/documents`
- `POST /v1/me/documents`
- `PUT /v1/me/documents/{document_id}/resend`
- `DELETE /v1/me/documents/{document_id}`
  - Auth: protegida (candidate)

#### Upload de documento
- Content-Type: `multipart/form-data`
- Campos:
  - `type`: `rg | comprovante_residencia | dados_bancarios | outros`
  - `file`: binario

### 8.6 Notificacoes do candidato
- `GET /v1/me/notifications`
- `PATCH /v1/me/notifications/{notification_id}/read`
- `PATCH /v1/me/notifications/read-all`
  - Auth: protegida (candidate)

## 9. Endpoints Administrativos (Area /admin)
Rotas protegidas por auth + policy/role admin.

### 9.1 Usuarios/candidatos
- `GET /v1/admin/users`
- `GET /v1/admin/users/{user_id}`
- `GET /v1/admin/users/{user_id}/profile`

### 9.2 Inscricoes
- `GET /v1/admin/applications`
- `GET /v1/admin/applications/{application_id}`
- `PATCH /v1/admin/applications/{application_id}/status`
- `GET /v1/admin/applications/{application_id}/history`

Body do patch de status:
```json
{
  "to_status": "convocation",
  "note": "Convocado para entrevista",
  "deadline_at": "2026-04-30T23:59:59Z"
}
```

### 9.3 Documentos
- `GET /v1/admin/documents`
- `GET /v1/admin/documents/{document_id}`
- `PATCH /v1/admin/documents/{document_id}/review`

Body da revisao:
```json
{
  "status": "rejected",
  "rejection_reason": "Arquivo ilegivel"
}
```

### 9.4 Notificacoes
- `POST /v1/admin/notifications/broadcast`
- `POST /v1/admin/notifications/users/{user_id}`

### 9.5 Catalogos (instituicao/curso/cotas)
- `POST /v1/admin/institutions`
- `PUT /v1/admin/institutions/{institution_id}`
- `DELETE /v1/admin/institutions/{institution_id}`

- `POST /v1/admin/courses`
- `PUT /v1/admin/courses/{course_id}`
- `DELETE /v1/admin/courses/{course_id}`

- `POST /v1/admin/quota-categories`
- `PUT /v1/admin/quota-categories/{quota_category_id}`
- `DELETE /v1/admin/quota-categories/{quota_category_id}`

## 10. Endpoints de Suporte Operacional
### 10.1 Auditoria (opcional)
- `GET /v1/admin/audit/application-status`
- `GET /v1/admin/audit/document-reviews`

### 10.2 Jobs/Fila (opcional)
- `POST /v1/admin/jobs/retry-failed`
- `GET /v1/admin/jobs/failed`

## 11. Mapa de Permissoes
- Publico: `/public/*`, `/auth/login`, `/auth/register`, `/health`
- Candidate autenticado: `/me/*`, `/auth/me`, `/auth/logout`
- Admin autenticado: `/admin/*`

## 12. Mapa de Status e Enum
### 12.1 Application.status
- `open_window`
- `talent_bank`
- `convocation`
- `admission`
- `rejected`

### 12.2 Document.status
- `pending`
- `approved`
- `rejected`

### 12.3 User.role
- `candidate`
- `admin`

## 13. Codigos HTTP esperados
- `200 OK` (consulta/atualizacao)
- `201 Created` (criacao)
- `204 No Content` (delete sem payload)
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict` (duplicidade/estado invalido)
- `422 Unprocessable Entity` (validacao)
- `429 Too Many Requests`
- `500 Internal Server Error`

## 14. Ordem de Implementacao Recomendada
1. Auth (`/auth/*`)
2. Profile (`/me/profile`)
3. Elegibilidade + Aplicacao (`/me/eligibility/check`, `/me/applications`)
4. Documentos (`/me/documents*`)
5. Notificacoes (`/me/notifications*`)
6. Admin (`/admin/*`)
7. Public content endpoints (`/public/*`) para desacoplar conteudo da landing

## 15. Checklist de Pronto para Frontend
- Endpoints seguem envelope de resposta padrao
- Erros de validacao em formato previsivel
- Paginacao padrao nas listas
- CORS configurado para o dominio do frontend
- Auth Sanctum testada no modo escolhido
- Contratos alinhados com `src/types/program.ts`
