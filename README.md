# Eteg - Sistema de Cadastro de Clientes

Um formulário simples de registro de clientes construído com Next.js 15, React 19, Tailwind CSS v4 e PostgreSQL.

## Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, ShadCN UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 16
- **Runtime**: Bun

## Iniciando

### Pré-requisitos

- [Bun](https://bun.sh/) (versão mais recente)
- [Docker](https://www.docker.com/) (para PostgreSQL)

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
2. **CPF**: Digite o CPF do cliente (com ou sem máscara, ex: `529.982.247-25` ou `52998224725`)
3. **Email**: Digite um endereço de email válido
4. **Cor Favorita**: Selecione uma das cores do arco-íris no dropdown
5. **Observações** (opcional): Adicione notas adicionais sobre o cliente (máximo 1000 caracteres)
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

### Início Rápido (Desenvolvimento)

Execute a aplicação completa com um único comando:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Isso iniciará:

- **PostgreSQL 16** na porta 5432
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
