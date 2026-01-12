# Decisões Técnicas

Documentação das principais decisões arquiteturais e tecnológicas do projeto ETEG - Sistema de Cadastro de Clientes.

## Contexto do Projeto

Este projeto é uma resposta ao desafio técnico que solicita um formulário de cadastro de clientes com persistência em PostgreSQL, containerizado com Docker. O cliente fictício "John Doe" necessita de uma solução simples, funcional e preparada para manutenção futura por outra equipe.

## Stack Principal

| Camada    | Tecnologia                    | Versão  |
| --------- | ----------------------------- | ------- |
| Runtime   | Bun                           | 1.3+    |
| Framework | Next.js (App Router)          | 16      |
| UI        | React + Tailwind CSS + ShadCN | 19 / v4 |
| ORM       | Prisma                        | 7       |
| Database  | PostgreSQL                    | 16      |
| Validação | Zod + react-hook-form         | 4 / 7   |

## Decisões Arquiteturais

### Por que Next.js e não um Monorepo?

**Decisão**: Utilizar Next.js como solução full-stack em vez de separar frontend e backend.

**Justificativas**:

1. **Simplicidade**: O requisito é um formulário simples com uma única rota de API. Separar em monorepo adicionaria complexidade desnecessária (configuração de workspaces, builds separados, orquestração de deploy).

2. **Colocação de código**: Com Next.js App Router, validações, tipos e schemas Zod são compartilhados naturalmente entre cliente e servidor no mesmo repositório.

3. **Manutenibilidade futura**: O requisito menciona que "o desenvolvimento futuro será feito por outra equipe". Um projeto unificado é mais fácil de transferir e entender.

4. **Deploy simplificado**: Um único container Docker serve toda a aplicação, facilitando a infraestrutura.

**Trade-offs considerados**:

- Monorepo seria apropriado se houvesse múltiplos frontends ou serviços backend distintos
- A escalabilidade horizontal é limitada (não é requisito para este caso)

### Por que Bun?

**Decisão**: Utilizar Bun como runtime e package manager.

**Justificativas**:

1. **Performance**: Instalação de dependências ~10x mais rápida que npm/yarn
2. **Simplicidade**: Runtime, bundler e package manager unificados
3. **Compatibilidade**: Compatível com ecossistema Node.js/npm existente
4. **TypeScript nativo**: Executa TypeScript sem transpilação

**Trade-offs**:

- Ecossistema menos maduro que Node.js
- Alguns pacotes podem ter incompatibilidades edge-case

### Por que Prisma?

**Decisão**: Utilizar Prisma como ORM.

**Justificativas**:

1. **Type Safety**: Geração automática de tipos TypeScript a partir do schema
2. **Migrations**: Sistema de migrations integrado e declarativo
3. **DX**: Prisma Studio para visualização de dados, autocompletion excelente
4. **Compatibilidade Docker**: Funciona bem em ambientes containerizados

**Alternativas consideradas**:

- **Drizzle**: Mais leve, porém Prisma tem melhor tooling para o escopo do projeto
- **TypeORM**: Mais verboso, padrão decorator menos idiomático com Next.js
- **SQL puro**: Perda de type safety e produtividade

### Por que Zod + react-hook-form?

**Decisão**: Combinar Zod para schemas de validação com react-hook-form para gerenciamento de formulários.

**Justificativas**:

1. **Schema compartilhado**: O mesmo schema Zod valida no cliente e servidor
2. **Performance**: react-hook-form usa refs em vez de re-renders controlados
3. **Integração**: `@hookform/resolvers` integra Zod nativamente
4. **Mensagens de erro**: Validação granular com mensagens customizadas em português

**Estrutura implementada**:

```
lib/validations/customer.ts   → Schema Zod único
components/customer-form.tsx  → Form com useForm + zodResolver
api/customers/route.ts        → Validação server-side com mesmo schema
```

### Por que ShadCN UI?

**Decisão**: Utilizar ShadCN UI como biblioteca de componentes.

**Justificativas**:

1. **Ownership**: Componentes copiados para o projeto, não dependência externa
2. **Customização**: Totalmente customizável via Tailwind
3. **Acessibilidade**: Baseado em Radix UI primitives (ARIA compliant)
4. **Bundle size**: Inclui apenas componentes utilizados

**Alternativas consideradas**:

- **Material UI**: Muito pesado para escopo do projeto
- **Chakra UI**: Boa opção, porém ShadCN oferece melhor DX com Tailwind
- **Componentes próprios**: Reinventar a roda desnecessariamente

### Por que Tailwind CSS v4?

**Decisão**: Adotar Tailwind CSS versão 4.

**Justificativas**:

1. **CSS-first config**: Configuração via CSS nativo, não JavaScript
2. **Performance**: Build mais rápido com engine Oxide
3. **Simplicidade**: Menos configuração, mais convenções
4. **Future-proof**: Versão mais recente e mantida

## Decisões de Infraestrutura

### Docker Multi-Stage Build

**Decisão**: Dockerfile com múltiplos estágios (base, development, dependencies, builder, production).

**Justificativas**:

1. **Imagens menores**: Estágio de produção não inclui devDependencies
2. **Cache otimizado**: Layers separadas para dependencies e código
3. **Flexibilidade**: Mesmo Dockerfile para dev e prod via `target`

**Estágios**:

| Estágio      | Propósito                              |
| ------------ | -------------------------------------- |
| base         | Imagem base com Bun                    |
| development  | Hot-reload para desenvolvimento local  |
| dependencies | Instalação de dependências de produção |
| builder      | Build da aplicação Next.js             |
| production   | Imagem final mínima                    |

### Health Check Endpoint

**Decisão**: Implementar `/api/health` com verificação de conectividade do banco.

**Justificativas**:

1. **Container orchestration**: Docker/K8s precisam saber se a aplicação está saudável
2. **Monitoramento**: Serviços externos podem verificar status
3. **Debugging**: Facilita diagnóstico de problemas de conectividade

**Resposta do endpoint**:

```json
{
	"status": "healthy",
	"timestamp": "2026-01-12T00:00:00.000Z",
	"environment": "production",
	"version": "0.1.0",
	"services": {
		"database": "connected",
		"application": "running"
	}
}
```

## Decisões de Validação

### CPF com `gerador-validador-cpf`

**Decisão**: Utilizar biblioteca externa para validação de CPF.

**Justificativas**:

1. **Algoritmo complexo**: Validação de CPF envolve cálculo de dígitos verificadores
2. **Battle-tested**: Biblioteca com milhões de downloads e casos de uso validados
3. **Manutenção**: Atualizações de regras são responsabilidade do mantenedor

**Alternativas descartadas**:

- Implementação própria: risco de bugs em edge cases
- Regex apenas: não valida dígitos verificadores

### Input Mask para CPF

**Decisão**: Implementar máscara de input (`XXX.XXX.XXX-XX`) usando `react-imask`.

**Justificativas**:

1. **UX**: Usuário visualiza CPF formatado enquanto digita
2. **Flexibilidade**: Backend aceita com ou sem máscara (normalização server-side)
3. **Acessibilidade**: IMask preserva comportamento de cursor e seleção

## Decisões de Segurança

### Validação Server-Side Obrigatória

**Decisão**: Sempre validar no servidor, independente de validação client-side.

**Justificativa**: Client-side validation pode ser bypassada. O servidor é a última linha de defesa.

### Sanitização de CPF

**Decisão**: Armazenar CPF apenas com dígitos (sem pontos/traço).

**Justificativas**:

1. **Consistência**: Formato único no banco de dados
2. **Queries**: Comparações simples sem normalização em runtime
3. **Indexação**: Melhor performance em queries de unicidade

### Environment Variables com T3 Env

**Decisão**: Utilizar `@t3-oss/env-nextjs` para validação de variáveis de ambiente.

**Justificativas**:

1. **Type safety**: Variáveis tipadas com inferência
2. **Fail-fast**: Aplicação não inicia se variáveis obrigatórias estiverem ausentes
3. **Documentação**: Schema serve como documentação das variáveis necessárias

## Princípios Guia

### KISS (Keep It Simple, Stupid)

O projeto prioriza soluções simples e diretas. Evitamos:

- State management global (Context/Redux) - desnecessário para um formulário
- Abstrações prematuras (repositories, use cases) - complexidade sem benefício
- Otimizações prematuras - funcionalidade primeiro

### YAGNI (You Aren't Gonna Need It)

Implementamos apenas o que foi solicitado:

- Uma rota de API (`POST /api/customers`)
- Um formulário de cadastro
- Persistência básica

Funcionalidades não solicitadas (listagem, edição, exclusão) não foram implementadas.

### Código como Documentação

Priorizamos código auto-documentado:

- Nomes descritivos de variáveis e funções
- Tipos TypeScript expressivos
- JSDoc onde complexidade adicional existe

## Referências

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [ShadCN UI](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
