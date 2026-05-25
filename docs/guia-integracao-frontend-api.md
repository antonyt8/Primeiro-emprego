# Guia de Integracao Frontend com API

Este documento explica como integrar o frontend com a API atual do projeto Primeiro Emprego.

## 1) Ambiente e URL base

- Ambiente local (Laravel serve): `http://127.0.0.1:8000`
- Prefixo da API: `/api`
- Base final para chamadas: `http://127.0.0.1:8000/api`

Exemplo:
- Login: `POST http://127.0.0.1:8000/api/auth/login`

## 2) Autenticacao (Sanctum com Bearer Token)

A API usa token Bearer.

1. Fazer login ou registro.
2. Receber `token` na resposta.
3. Salvar token no frontend (memoria, store, ou localStorage conforme politica do time).
4. Enviar em todas as rotas protegidas no header:

```http
Authorization: Bearer SEU_TOKEN
```

### Exemplo de cliente Axios

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // redirecionar para login
    }
    return Promise.reject(error);
  }
);
```

## 3) Padrao de erros para o frontend

- `401`: token ausente/invalido
- `404`: recurso nao encontrado ou sem permissao em algumas rotas
- `422`: erro de validacao ou regra de negocio

Formato comum de validacao:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "campo": ["mensagem"]
  }
}
```

Formato comum de regra de negocio:

```json
{
  "message": "Candidato inelegivel para inscricao.",
  "reason": "Periodo minimo para inscricao: 2."
}
```

## 4) Fluxo recomendado por tela

### 4.1 Login/Cadastro

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` para restaurar sessao ao abrir app
- `POST /auth/logout` ao sair

Resposta de login/cadastro:

```json
{
  "user": {
    "id": "uuid",
    "name": "Nome",
    "email": "email@dominio.com",
    "cpf": "12345678901",
    "role": "candidate"
  },
  "token": "plain_text_token"
}
```

### 4.2 Catalogos (combos do formulario)

- `GET /catalog/institutions`
- `GET /catalog/courses`

Uso recomendado:
- Carregar no bootstrap da tela de perfil.
- Cachear em memoria para evitar chamadas repetidas.

### 4.3 Perfil do candidato

- `GET /me/profile`
- `PUT /me/profile`

Se `GET /me/profile` retornar `404`, significa perfil ainda nao cadastrado.

Payload de update:

```json
{
  "phone": "88999990000",
  "institution_id": "uuid",
  "course_id": "uuid",
  "period": 4,
  "cr": 8.5
}
```

### 4.4 Elegibilidade e inscricao

- `POST /program/eligibility`
- `POST /applications`
- `GET /applications/me`
- `GET /applications/{applicationId}/history`
- `GET /me/process-status`

Regras importantes para UI:
- Bloqueio de inscricao quando inelegivel (422).
- Bloqueio de inscricao duplicada ativa no mesmo edital (422).
- Historico so para dono da inscricao (ou admin).

Exemplo de listagem com filtros:
- `GET /applications/me?status=open_window&page=1&per_page=15`

### 4.5 Documentos

- `GET /me/documents`
- `POST /me/documents` (multipart/form-data)
- `PUT /me/documents/{documentId}/resend` (multipart/form-data)
- `DELETE /me/documents/{documentId}`

Campos de upload:
- `application_id`
- `type`: `rg | comprovante_residencia | dados_bancarios | outros`
- `file`

### 4.6 Notificacoes

- `GET /me/notifications?unread_only=1&page=1&per_page=15`
- `PATCH /me/notifications/{notificationId}/read`
- `PATCH /me/notifications/read-all`

## 5) Mapa completo de rotas atuais

### Publicas
- `POST /auth/register`
- `POST /auth/login`
- `GET /catalog/institutions`
- `GET /catalog/courses`

### Protegidas (Bearer token)
- `POST /auth/logout`
- `GET /auth/me`
- `GET /me/profile`
- `PUT /me/profile`
- `POST /program/eligibility`
- `POST /applications`
- `GET /applications/me`
- `GET /applications/{application}/history`
- `GET /me/process-status`
- `GET /me/documents`
- `POST /me/documents`
- `PUT /me/documents/{document}/resend`
- `DELETE /me/documents/{document}`
- `GET /me/notifications`
- `PATCH /me/notifications/{notification}/read`
- `PATCH /me/notifications/read-all`

## 6) Exemplo de funcoes de servico (TypeScript)

```ts
import { api } from './api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function getMyProfile() {
  const { data } = await api.get('/me/profile');
  return data;
}

export async function updateMyProfile(payload: {
  phone: string;
  institution_id: string;
  course_id: string;
  period: number;
  cr: number | null;
}) {
  const { data } = await api.put('/me/profile', payload);
  return data;
}

export async function createApplication(payload: {
  edital_id: string;
  quota_category_id?: string;
}) {
  const { data } = await api.post('/applications', payload);
  return data;
}
```

## 7) Check-list de integracao para o front

- [ ] Configurar `baseURL` para `/api`
- [ ] Adicionar interceptor Bearer token
- [ ] Tratar `401` com redirecionamento para login
- [ ] Tratar `422` exibindo `message` e `errors`/`reason`
- [ ] Implementar fluxo de restauracao com `GET /auth/me`
- [ ] Integrar telas: Perfil, Elegibilidade, Inscricao, Documentos e Notificacoes
- [ ] Validar fluxo completo com usuario real de teste

## 8) Observacao de compatibilidade

Se o frontend ainda estiver apontando para `/api/v1`, ajustar para `/api` para funcionar com as rotas atuais.
