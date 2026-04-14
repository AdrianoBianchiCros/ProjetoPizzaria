# ProjetoPizzaria

Documentação geral do projeto `ProjetoPizzaria`.

## Visão Geral

No estado atual, o projeto contém o módulo `BackEnd`, responsável pela API REST da pizzaria.

## Estrutura do Projeto

```text
ProjetoPizzaria/
|-- .idea/
|-- BackEnd/
|   |-- .vscode/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- @types/
|   |   |-- config/
|   |   |-- controllers/
|   |   |   |-- category/
|   |   |   |-- order/
|   |   |   |-- product/
|   |   |   `-- user/
|   |   |-- generated/
|   |   |-- middlewares/
|   |   |-- prisma/
|   |   |-- schemas/
|   |   |-- services/
|   |   |   |-- category/
|   |   |   |-- order/
|   |   |   |-- product/
|   |   |   `-- user/
|   |   |-- routes.ts
|   |   `-- server.ts
|   |-- .env
|   |-- .gitignore
|   |-- CONTEXTO_PROJETO.md
|   |-- package-lock.json
|   |-- package.json
|   |-- prisma.config.ts
|   |-- README.md
|   `-- tsconfig.json
`-- README.md
```

## BackEnd

O backend foi desenvolvido com:

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- Multer
- Cloudinary

### Responsabilidades do BackEnd

- autenticação de usuários com JWT
- controle de acesso por perfil (`STAFF` e `ADMIN`)
- gerenciamento de categorias
- gerenciamento de produtos com upload de imagem
- gerenciamento de pedidos e itens

### Principais diretórios do BackEnd

- `src/controllers`: entrada das requisições por domínio
- `src/services`: regras de negócio
- `src/schemas`: validação com Zod
- `src/middlewares`: autenticação, autorização e validação
- `src/prisma`: inicialização do Prisma Client
- `prisma`: schema e migrations do banco

## Arquivos de documentação

- `README.md`: documentação geral do projeto
- `BackEnd/README.md`: documentação específica da API
- `BackEnd/CONTEXTO_PROJETO.md`: contexto técnico complementar do backend

## Observação

Se houver um módulo `FrontEnd` no futuro, ele ainda não faz parte da estrutura atual desta pasta `ProjetoPizzaria`.