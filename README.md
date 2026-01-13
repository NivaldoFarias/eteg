<div align="center">
	<img src="./public/android-chrome-512x512.png" alt="Eteg Logo" width="150"  />
</div>

# Eteg - Sistema de Cadastro de Clientes

Um formulário simples de registro de clientes construído com Next.js, React, Tailwind CSS, Prisma e PostgreSQL.

> [!IMPORTANT]
> **Live Demo**: [https://eteg-7xyk.onrender.com](https://eteg-7xyk.onrender.com)

<div align="center">

[![CI Status](https://github.com/NivaldoFarias/eteg/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NivaldoFarias/eteg/actions/workflows/ci.yml)
[![API Health](https://img.shields.io/website?url=https%3A%2F%2Feteg-7xyk.onrender.com%2Fapi%2Fhealth&label=API%20Status&up_message=healthy&down_message=down)](https://eteg-7xyk.onrender.com/api/health/ready)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3.5-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, ShadCN UI
- **Backend**: Next.js API Routes, Prisma ORM v7
- **Database**: PostgreSQL v17
- **Runtime**: Bun v1.3

## Iniciando

### Pré-requisitos

- [Bun](https://bun.sh/): v1.3.5+ _(versão mais recente)_
- [Docker](https://www.docker.com/) v28.x+ _(para PostgreSQL em desenvolvimento)_

### Desenvolvimento

1. Instale as dependências:

```bash
bun install
```

2. Inicie o PostgreSQL via Docker:

```bash
bun run docker:up
```

3. Execute as migrações do banco de dados:

```bash
bun run db:migrate
```

4. Inicie o servidor de desenvolvimento:

```bash
bun run dev
```

Abra [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## Uso da Aplicação

### Formulário de Cadastro

O formulário de cadastro de clientes está disponível na página principal da aplicação. Para cadastrar um novo cliente:

1. **Nome Completo**: Digite o nome completo do cliente (mínimo 2 caracteres)
2. **CPF**: Digite o CPF do cliente
3. **Email**: Digite um endereço de email válido
4. **Cor Favorita**: Selecione uma das cores do arco-íris no dropdown
5. **Observações** (opcional): Adicione notas adicionais sobre o cliente
6. Clique em **Enviar Cadastro**

### Validações

O formulário realiza validação em tempo real:

- **CPF**: Deve ser um CPF brasileiro válido (verificação de dígitos)
- **Email**: Deve ser um formato de email válido e único no sistema
- **Campos obrigatórios**: Nome, CPF, Email e Cor Favorita são obrigatórios

### Mensagens de Erro

- **Dados inválidos**: Erros de validação são exibidos abaixo de cada campo
- **CPF/Email duplicado**: Mensagem de erro indica qual campo já está cadastrado
- **Erro de servidor**: Mensagem genérica solicitando nova tentativa

### Sucesso

Após cadastro bem-sucedido:

- Uma notificação de sucesso é exibida
- O formulário é limpo automaticamente
- O cliente é persistido no banco de dados

## Scripts

| Comando               | Descrição                               |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Iniciar servidor de desenvolvimento     |
| `bun run build`       | Build para produção                     |
| `bun run start`       | Iniciar servidor de produção            |
| `bun run lint`        | Executar ESLint                         |
| `bun run type-check`  | Executar verificação de tipo TypeScript |
| `bun run test`        | Executar testes unitários               |
| `bun run test:watch`  | Executar testes em modo watch           |
| `bun run db:migrate`  | Executar migrações do banco             |
| `bun run db:studio`   | Abrir Prisma Studio                     |
| `bun run docker:up`   | Iniciar container PostgreSQL            |
| `bun run docker:down` | Parar container PostgreSQL              |

## Schema do Banco de Dados

### Tabela Customer

| Campo           | Tipo                 | Descrição                                   |
| --------------- | -------------------- | ------------------------------------------- |
| `id`            | `String` (CUID)      | Chave primária                              |
| `fullName`      | `String`             | Nome completo do cliente (2-255 caracteres) |
| `cpf`           | `String` (único)     | CPF (11 dígitos)                            |
| `email`         | `String` (único)     | Endereço de email                           |
| `favoriteColor` | `FavoriteColor` enum | Uma das cores do arco-íris                  |
| `observations`  | `String?`            | Notas opcionais (máx 1000 caracteres)       |
| `createdAt`     | `DateTime`           | Timestamp do cadastro                       |

### Enum FavoriteColor

`RED` | `ORANGE` | `YELLOW` | `GREEN` | `BLUE` | `INDIGO` | `VIOLET`

## Referência da API

### POST /api/customers

Cria um novo registro de cliente.

#### Corpo da Solicitação

```json
{
	"fullName": "João Silva",
	"cpf": "529.982.247-25",
	"email": "joao@example.com",
	"favoriteColor": "BLUE",
	"observations": "Notas opcionais"
}
```

| Campo           | Tipo     | Obrigatório | Descrição                                                |
| --------------- | -------- | ----------- | -------------------------------------------------------- |
| `fullName`      | `string` | Sim         | 2-255 caracteres                                         |
| `cpf`           | `string` | Sim         | CPF válido (com ou sem máscara)                          |
| `email`         | `string` | Sim         | Endereço de email válido                                 |
| `favoriteColor` | `string` | Sim         | Uma de: RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET |
| `observations`  | `string` | Não         | Máx 1000 caracteres                                      |

#### Respostas

**201 Created** - Cliente registrado com sucesso

```json
{
	"success": true,
	"data": {
		"id": "clx1234567890",
		"fullName": "João Silva",
		"email": "joao@example.com",
		"favoriteColor": "BLUE",
		"createdAt": "2026-01-09T00:00:00.000Z"
	}
}
```

**400 Bad Request** - Erro de validação

```json
{
	"success": false,
	"error": "VALIDATION_ERROR",
	"message": "CPF é inválido"
}
```

**409 Conflict** - CPF ou email duplicado

```json
{
	"success": false,
	"error": "DUPLICATE_ENTRY",
	"message": "Um cliente com este CPF já existe"
}
```

**500 Internal Server Error** - Erro de servidor

```json
{
	"success": false,
	"error": "INTERNAL_ERROR",
	"message": "Ocorreu um erro inesperado. Tente novamente mais tarde."
}
```

## Docker

> [!NOTE]
> O `docker-compose.yml` é apenas para **desenvolvimento local**.
> Para deploy em produção, apenas o `Dockerfile` é usado (conectando a um banco de dados gerenciado externo). Veja [DEPLOY.md](docs/DEPLOY.md) para instruções de produção.

### Início Rápido (Desenvolvimento)

Execute a aplicação completa com um único comando:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Isso iniciará:

- **PostgreSQL 18** na porta 5432 (banco de dados local)
- **Aplicação Next.js** na porta 3000 (modo desenvolvimento com hot-reload)

Acesse [http://localhost:3000](http://localhost:3000) para usar a aplicação.

### Comandos Docker

| Comando                                               | Descrição                          |
| ----------------------------------------------------- | ---------------------------------- |
| `docker compose -f docker/docker-compose.yml up -d`   | Iniciar em segundo plano           |
| `docker compose -f docker/docker-compose.yml down`    | Parar containers                   |
| `docker compose -f docker/docker-compose.yml logs`    | Ver logs                           |
| `docker compose -f docker/docker-compose.yml down -v` | Parar e remover volumes (reset DB) |

Ou use os scripts npm:

```bash
bun run docker:up      # Iniciar containers
bun run docker:down    # Parar containers
bun run docker:logs    # Ver logs
```

### Ambiente de Produção

Para construir e executar em produção:

```bash
# Construir imagem de produção
docker build -f docker/Dockerfile -t eteg --target production .

# Executar com variáveis de ambiente
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NODE_ENV="production" \
  eteg
```

### Variáveis de Ambiente

| Variável            | Padrão                                             | Descrição                 |
| ------------------- | -------------------------------------------------- | ------------------------- |
| `DATABASE_URL`      | `postgresql://eteg:eteg_dev_password@db:5432/eteg` | URL de conexão PostgreSQL |
| `NODE_ENV`          | `development`                                      | Ambiente de execução      |
| `DATABASE_NAME`     | `eteg`                                             | Nome do banco de dados    |
| `DATABASE_USER`     | `eteg`                                             | Usuário do banco          |
| `DATABASE_PASSWORD` | `eteg_dev_password`                                | Senha do banco            |
