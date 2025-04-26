# Simulador de Sistema Bancário

Sistema backend RESTful para simulação de operações bancárias como criação de contas, depósitos, saques, transferências e agendamentos, com suporte a execução automática via cron e testes automatizados com Jest e Supertest.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod (validação)
- node-cron (agendamentos)
- Jest + Supertest (testes)




## Funcionalidades

- Criação, listagem e remoção de contas bancárias
- Operações de depósito, saque e transferência
- Agendamento de transações para execução futura
- Processamento automático de transações agendadas
- Endpoint manual para disparo de scheduler
- Testes com ambiente isolado de banco de dados

## Requisitos

- Node.js v18+
- PostgreSQL (local ou Docker)
- npm 

## Configuração

Crie o arquivo `.env` com o seguinte conteúdo:

```

```

Para o ambiente de testes (`.env.test`):

```
DATABASE_URL="postgresql://postgres:123456@localhost:5432/simulador_bancario_test"
```

## Instalação

```bash
npm install
```

## Banco de Dados

### Criar banco principal e de testes

No PostgreSQL:

```sql
CREATE DATABASE simulador_bancario;
CREATE DATABASE simulador_bancario_test;
```

### Rodar as migrações

```bash
npx prisma migrate dev --name init
```

Ambiente de testes:

```bash
npm run migrate:test
```

## Execução

```bash
npm run dev
```

Servidor disponível em: `http://localhost:3000`


## Testes

Executar todos os testes com Jest:

```bash
npm run test
```

Modo observador:

```bash
npm run test:watch
```

Rodar migração de testes:

```bash
npm run migrate:test
```

## Docker (PostgreSQL)

```bash
docker run --name banco-bancario 
```

## Scripts disponíveis

```json
"scripts": {
  "dev": "nodemon --watch src --exec \"ts-node src/server.ts\"",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/server.js",
  "start:prod": "npm run build && npm run start",
  "prisma": "prisma",
  "test": "cross-env NODE_ENV=test dotenv -e .env.test -- jest --coverage",
  "test:watch": "cross-env NODE_ENV=test dotenv -e .env.test -- jest --watch",
  "migrate:test": "cross-env NODE_ENV=test dotenv -e .env.test -- prisma migrate dev --name init"
}
```

## Licença

Este projeto está licenciado sob os termos da licença MIT.
