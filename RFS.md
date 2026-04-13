# RFS - Requisitos Funcionais do Sistema

## 1. Objetivo
Este documento descreve os requisitos funcionais da plataforma Primeiro Emprego AL, com foco em inscrição, autenticação, acompanhamento de perfil, documentos e notificações do candidato.

## 2. Escopo
A plataforma deve permitir:
- acesso à página institucional do programa;
- cadastro e autenticação de candidatos;
- visualização do painel do candidato;
- gestão de perfil e documentos;
- acompanhamento de convocações e notificações.

## 3. Requisitos Funcionais

### RF-001 - Exibir Página Inicial
O sistema deve exibir uma landing page com seções de apresentação, elegibilidade, funcionamento e cotas.

### RF-002 - Cadastro de Candidato
O sistema deve permitir o cadastro de novos candidatos com validações de campos obrigatórios.

### RF-003 - Login de Candidato
O sistema deve permitir login com credenciais válidas e redirecionar para o painel.

### RF-004 - Recuperação de Estado de Sessão
O sistema deve manter o estado da sessão do usuário autenticado durante a navegação (quando integrado ao backend).

### RF-005 - Acesso ao Dashboard
O sistema deve disponibilizar uma área de dashboard para o candidato autenticado.

### RF-006 - Navegação por Módulos do Dashboard
O sistema deve permitir navegação entre as áreas:
- Painel;
- Perfil;
- Documentos;
- Notificações.

### RF-007 - Visualização de Status do Processo
O sistema deve apresentar os status do processo do candidato, incluindo:
- inscrições abertas;
- banco de talentos;
- convocatória;
- admissão.

### RF-008 - Gestão de Perfil
O sistema deve permitir ao candidato visualizar e editar seus dados pessoais e acadêmicos.

### RF-009 - Gestão de Documentos
O sistema deve permitir envio, visualização e acompanhamento de status dos documentos.

### RF-010 - Notificações
O sistema deve exibir notificações relacionadas ao processo do candidato e permitir marcar como lidas.

### RF-011 - Logout
O sistema deve permitir encerrar a sessão e retornar para a página inicial.

## 4. Regras de Negócio
- RN-001: Campos obrigatórios devem ser validados antes de avançar etapas de cadastro.
- RN-002: Apenas usuários autenticados devem acessar o dashboard.
- RN-003: Documentos podem assumir status: pendente, aprovado ou rejeitado.
- RN-004: Convocações devem indicar prazo de resposta.

## 5. Critérios de Aceite (resumo)
- CA-001: Usuário consegue abrir landing page sem autenticação.
- CA-002: Usuário consegue cadastrar conta com dados válidos.
- CA-003: Usuário autenticado acessa dashboard.
- CA-004: Usuário consegue navegar entre módulos do dashboard.
- CA-005: Usuário consegue visualizar status do processo e notificações.

## 6. Observações
Este RFS representa a versão inicial funcional do projeto. Recomenda-se evoluir o documento junto da integração backend e definição de requisitos não funcionais.
