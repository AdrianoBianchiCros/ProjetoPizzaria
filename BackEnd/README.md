# Pizzaria Backend

API REST para gerenciamento de uma pizzaria com autenticação JWT, controle de usuários, categorias, produtos e pedidos.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- Multer
- Cloudinary

Documentação complementar do domínio: `CONTEXTO_PROJETO.md`.

## Funcionalidades

- Cadastro e autenticação de usuários
- Controle de acesso por perfil (`STAFF` e `ADMIN`)
- Cadastro e listagem de categorias
- Cadastro, listagem e arquivamento lógico de produtos
- Upload de imagem de produto via Cloudinary
- Abertura, envio, detalhamento, finalização e exclusão de pedidos
- Inclusão e remoção de itens do pedido

## Requisitos

- Node.js
- PostgreSQL
- Conta Cloudinary para upload de imagens

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco?schema=public"
JWT_SECRET="sua-chave-secreta"
PORT=3333

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Banco de dados

Gerar client e aplicar migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Abrir o Prisma Studio:

```bash
npx prisma studio
```

## Execução

```bash
npm run dev
```

O script inicia `tsx watch src/server.ts`.

## Modelos principais

- `User`: nome, email, senha e perfil (`STAFF` por padrão, ou `ADMIN` quando ajustado diretamente no banco)
- `Category`: categorias dos produtos
- `Product`: nome, preço em centavos, descrição, banner e flag de arquivamento lógico (`disabel`)
- `Orders`: mesa, nome do cliente, status e estado de rascunho
- `Item`: itens vinculados a pedido e produto

## Autenticação

- `POST /users` e `POST /session` são públicos
- As demais rotas exigem `Authorization: Bearer <token>`
- Rotas administrativas também exigem o middleware `isAdmin`

## Rotas da API

| Método | Rota | Auth | Regra | Descrição |
| ------ | ---- | ---- | ----- | --------- |
| `POST` | `/users` | Não | Pública | Cadastra usuário |
| `POST` | `/session` | Não | Pública | Autentica usuário |
| `GET` | `/me` | Sim | Usuário logado | Retorna os dados do usuário autenticado |
| `GET` | `/category` | Sim | Usuário logado | Lista categorias |
| `POST` | `/category` | Sim | `ADMIN` | Cria categoria |
| `GET` | `/category/product?category_id=...` | Sim | Usuário logado | Lista produtos por categoria |
| `GET` | `/products?disabled=false` | Sim | Usuário logado | Lista produtos; `disabled` é opcional e padrão `false` |
| `POST` | `/products` | Sim | `ADMIN` | Cria produto com `multipart/form-data` e campo de arquivo `file` |
| `DELETE` | `/products?product_id=...` | Sim | `ADMIN` | Arquiva produto com soft delete (`disabel = true`) |
| `POST` | `/order` | Sim | Usuário logado | Cria pedido com `table` e `name` |
| `GET` | `/orders?draft=true|false` | Sim | Usuário logado | Lista pedidos; sem query, retorna `draft = false` |
| `POST` | `/order/add` | Sim | Usuário logado | Adiciona item ao pedido |
| `GET` | `/order/detail?order_id=...` | Sim | Usuário logado | Retorna detalhes de um pedido |
| `DELETE` | `/order/remove?item_id=...` | Sim | Usuário logado | Remove item do pedido |
| `PUT` | `/order/send` | Sim | Usuário logado | Envia pedido para produção (`draft = false`) |
| `PUT` | `/order/finish` | Sim | Usuário logado | Marca pedido como finalizado (`status = true`) |
| `DELETE` | `/order?order_id=...` | Sim | Usuário logado | Exclui pedido fisicamente do banco |

## Payloads esperados

### `POST /users`

```json
{
  "name": "Administrador",
  "email": "admin@email.com",
  "password": "123456"
}
```

### `POST /session`

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

### `POST /category`

```json
{
  "name": "Pizzas"
}
```

### `POST /products`

Enviar `multipart/form-data` com:

- `name`
- `price` (string numérica em centavos)
- `description`
- `category_id`
- `file` (png, jpg ou jpeg com até 4 MB)

### `POST /order`

```json
{
  "table": 7,
  "name": "Cliente"
}
```

### `POST /order/add`

```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

### `PUT /order/send`

```json
{
  "order_id": "uuid-do-pedido",
  "name": "Cliente"
}
```

### `PUT /order/finish`

```json
{
  "order_id": "uuid-do-pedido"
}
```

## Query params úteis

- `GET /category/product`: exige `category_id`
- `GET /products`: aceita `disabled=true` ou `disabled=false`
- `GET /orders`: aceita `draft=true` ou `draft=false`
- `GET /order/detail`: exige `order_id`
- `DELETE /order/remove`: exige `item_id`
- `DELETE /order`: exige `order_id`
- `DELETE /products`: exige `product_id`

## Estrutura do projeto

```text
BackEnd/
|-- .env
|-- CONTEXTO_PROJETO.md
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- @types/
|   |-- config/
|   |-- controllers/
|   |-- generated/
|   |-- middlewares/
|   |-- prisma/
|   |-- schemas/
|   |-- services/
|   |-- routes.ts
|   `-- server.ts
|-- package-lock.json
|-- package.json
|-- prisma.config.ts
`-- tsconfig.json
```

## Observações

- O campo `price` do produto é salvo como inteiro em centavos.
- O campo `disabel` no modelo `Product` representa o arquivamento lógico e mantém esse nome no banco e no código atual.
- `GET /orders` usa `draft=false` quando a query `draft` não é enviada.

## Licença

ISC
