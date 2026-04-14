# Contexto do Projeto Backend Pizzaria

## Visao geral

Este projeto e uma API backend para uma pizzaria construida com Node.js, TypeScript, Express, Prisma e PostgreSQL.

O estado atual do codigo implementa:

- cadastro de usuario
- autenticacao com JWT
- consulta do usuario autenticado
- cadastro de categoria restrito a administrador
- listagem de categorias
- listagem de produtos por categoria
- listagem de produtos com filtro opcional por `disabled`
- cadastro de produto com upload de imagem (Cloudinary) restrito a administrador
- arquivamento logico de produto via campo `disabel`
- criacao de pedido
- listagem de pedidos por status de `draft`
- adicao e remocao de itens do pedido
- detalhamento de pedido por `order_id`
- envio de pedido para producao
- finalizacao de pedido
- exclusao fisica de pedido

## Arquitetura usada

O projeto segue uma arquitetura em camadas simples:

`Rotas > Middlewares > Controller > Service > Prisma > PostgreSQL`

Fluxo padrao:

1. A rota recebe a requisicao HTTP.
2. Middlewares executam autenticacao, autorizacao e validacao.
3. O controller extrai os dados da requisicao e chama o service.
4. O service concentra a regra de negocio.
5. O service acessa o banco via Prisma Client.
6. O controller devolve a resposta ao cliente.

## Stack e versoes usadas

### Ambiente

- Node.js `v22.19.0`
- npm `10.9.3`

### Dependencias de producao

- `@prisma/adapter-pg` `7.5.0`
- `@prisma/client` `7.5.0`
- `bcryptjs` `3.0.3`
- `cloudinary` `2.9.0`
- `cors` `2.8.6`
- `dotenv` `17.3.1`
- `express` `5.2.1`
- `jsonwebtoken` `9.0.3`
- `multer` `2.1.1`
- `pg` `8.20.0`
- `tsx` `4.21.0`
- `zod` `4.3.6`

### Dependencias de desenvolvimento

- `@types/cors` `2.8.19`
- `@types/express` `5.0.6`
- `@types/jsonwebtoken` `9.0.10`
- `@types/multer` `2.1.0`
- `@types/node` `25.5.0`
- `@types/pg` `8.18.0`
- `prisma` `7.5.0`
- `typescript` `5.9.3`

## Configuracao do projeto

### Script disponivel

```bash
npm run dev
```

Comando executado:

```bash
tsx watch src/server.ts
```

### TypeScript

Principais opcoes de `tsconfig.json`:

- `target: ES2020`
- `module: commonjs`
- `moduleResolution: node`
- `rootDir: ./src`
- `outDir: ./dist`
- `strict: true`
- `esModuleInterop: true`
- `resolveJsonModule: true`
- `sourceMap: true`
- `skipLibCheck: true`

## Variaveis de ambiente

O projeto depende destas variaveis:

- `PORT`: porta HTTP da API
- `DATABASE_URL`: string de conexao PostgreSQL
- `JWT_SECRET`: segredo usado para assinar e validar tokens JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: credenciais do Cloudinary para upload de imagens

## Organizacao de pastas

Estrutura atual relevante:

```text
BackEnd/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- @types/
|   |   `-- express/
|   |-- config/
|   |-- controllers/
|   |   |-- category/
|   |   |-- order/
|   |   |-- product/
|   |   `-- user/
|   |-- middlewares/
|   |-- prisma/
|   |-- schemas/
|   |-- services/
|   |   |-- category/
|   |   |-- order/
|   |   |-- product/
|   |   `-- user/
|   |-- routes.ts
|   `-- server.ts
|-- .env
|-- CONTEXTO_PROJETO.md
|-- package.json
|-- package-lock.json
|-- prisma.config.ts
|-- README.md
`-- tsconfig.json
```

### Responsabilidade de cada pasta

- `src/server.ts`: sobe o Express, registra `express.json`, `cors`, rotas e middleware global de erro
- `src/routes.ts`: centraliza o cadastro das rotas HTTP
- `src/controllers`: camada HTTP; recebe `Request` e responde `Response`
- `src/services`: camada de regra de negocio e acesso ao banco
- `src/schemas`: schemas Zod usados na validacao de entrada
- `src/middlewares`: autenticacao, autorizacao e validacao
- `src/prisma`: instancia o Prisma Client com adapter PostgreSQL
- `src/@types/express`: extensao da tipagem do Express para incluir `req.user_id`
- `prisma/schema.prisma`: fonte da modelagem do banco
- `prisma/migrations`: historico SQL de migracoes
- `prisma.config.ts`: configuracao do Prisma fora da pasta `prisma`
- `src/config`: configuracoes como `multer` e `cloudinary`

Observacao:

- o Prisma esta configurado para gerar o client em `src/generated/prisma`, embora essa pasta nao esteja versionada no estado atual do projeto

## Inicializacao da aplicacao

O arquivo `src/server.ts` faz:

- import de `dotenv/config`
- criacao do app Express
- `app.use(express.json())`
- `app.use(cors())`
- `app.use(router)`
- middleware global de erro retornando `400` para `Error` e `500` para erros nao tratados
- `app.listen(PORT)`

## Rotas e endpoints implementados

### Usuario

- `POST /users`
  - middlewares: `validateSchema(createUserSchema)`
  - controller: `CreateUserController`
  - service: `CreateUserService`

- `POST /session`
  - middlewares: `validateSchema(authUserSchema)`
  - controller: `AuthUserController`
  - service: `AuthUserService`

- `GET /me`
  - middlewares: `isAuthenticated`
  - controller: `DetailUserController`
  - service: `DetailUserService`

### Categoria

- `GET /category/product`
  - middlewares: `isAuthenticated`, `validateSchema(listProductsByCategorySchema)`
  - query obrigatoria: `category_id`
  - controller: `ListProductsByCategoryController`
  - service: `ListProductsByCategoryService`

- `GET /category`
  - middlewares: `isAuthenticated`
  - controller: `ListCategoriesController`
  - service: `ListCategoriesService`

- `POST /category`
  - middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`
  - controller: `CreateCategoryController`
  - service: `CreateCategoryService`

### Produto

- `GET /products`
  - middlewares: `isAuthenticated`, `validateSchema(listProductsSchema)`
  - query opcional: `disabled`
  - controller: `ListProductsController`
  - service: `ListProductsService`

- `POST /products`
  - middlewares: `isAuthenticated`, `isAdmin`, `upload.single('file')`, `validateSchema(createProductSchema)`
  - controller: `CreateProductController`
  - service: `CreateProductService`

- `DELETE /products`
  - middlewares: `isAuthenticated`, `isAdmin`
  - query obrigatoria: `product_id`
  - controller: `DeleteProductController`
  - service: `DeleteProductService`

### Pedido

- `POST /order`
  - middlewares: `isAuthenticated`, `validateSchema(createOrderSchema)`
  - controller: `CreateOrderController`
  - service: `CreateOrderService`

- `GET /orders`
  - middlewares: `isAuthenticated`
  - query opcional: `draft`
  - controller: `ListOrderController`
  - service: `ListOrderService`

- `POST /order/add`
  - middlewares: `isAuthenticated`, `validateSchema(addItemSchema)`
  - controller: `AddItemController`
  - service: `AddItemOrderService`

- `GET /order/detail`
  - middlewares: `isAuthenticated`, `validateSchema(detailOrderSchema)`
  - query obrigatoria: `order_id`
  - controller: `DetailOrderController`
  - service: `DetailOrderService`

- `DELETE /order/remove`
  - middlewares: `isAuthenticated`, `validateSchema(removeItemSchema)`
  - query obrigatoria: `item_id`
  - controller: `RemoveItemController`
  - service: `RemoveItemOrderService`

- `PUT /order/send`
  - middlewares: `isAuthenticated`, `validateSchema(sendOrderSchema)`
  - body obrigatorio: `order_id`, `name`
  - controller: `SendOrderController`
  - service: `SendOrderService`

- `PUT /order/finish`
  - middlewares: `isAuthenticated`, `validateSchema(finishOrderSchema)`
  - body obrigatorio: `order_id`
  - controller: `FinishOrderController`
  - service: `FinishOrderService`

- `DELETE /order`
  - middlewares: `isAuthenticated`, `validateSchema(deleteOrderSchema)`
  - query obrigatoria: `order_id`
  - controller: `DeleteOrderController`
  - service: `DeleteOrderService`

## Middlewares

### `validateSchema`

Middleware generico para validacao com Zod.

Comportamento:

- valida `body`, `query` e `params`
- usa `schema.parseAsync(...)`
- em erro de validacao responde `400`

### `isAuthenticated`

Middleware de autenticacao JWT.

Comportamento:

- le header `Authorization`
- espera formato `Bearer <token>`
- valida token com `JWT_SECRET`
- injeta `req.user_id` com o `sub` do token
- em falha responde `401`

### `isAdmin`

Middleware de autorizacao por perfil.

Comportamento:

- le `req.user_id`
- busca o usuario no banco
- permite continuar apenas quando `user.role === 'ADMIN'`
- em falha responde `401`

## Schemas de validacao usados

### `createUserSchema`

Valida `req.body` com:

- `name`: `string`, minimo `3`
- `email`: `string`
- `password`: `string`, minimo `6`

### `authUserSchema`

Valida `req.body` com:

- `email`: `string`
- `password`: `string`, minimo `1`

### `createCategorySchema`

Valida `req.body` com:

- `name`: `string`, minimo `2`

### `listProductsByCategorySchema`

Valida `req.query` com:

- `category_id`: `string` nao vazia

### `createProductSchema`

Valida `req.body` com:

- `name`: `string`, minimo `1`
- `price`: `string`, minimo `1`, apenas digitos
- `description`: `string`, minimo `1`
- `category_id`: `string`, minimo `1`

### `listProductsSchema`

Valida `req.query` com:

- `disabled`: opcional, enum `"true"` ou `"false"`, convertido para boolean no schema

### `createOrderSchema`

Valida `req.body` com:

- `table`: inteiro positivo
- `name`: `string`, minimo `1`

### `addItemSchema`

Valida `req.body` com:

- `order_id`: `string`, minimo `1`
- `product_id`: `string`, minimo `1`
- `amount`: `number`, inteiro positivo

### `detailOrderSchema`

Valida `req.query` com:

- `order_id`: `string`, minimo `1`

### `removeItemSchema`

Valida `req.query` com:

- `item_id`: `string`, minimo `1`

### `sendOrderSchema`

Valida `req.body` com:

- `order_id`: `string`, minimo `1`

### `finishOrderSchema`

Valida `req.body` com:

- `order_id`: `string`

### `deleteOrderSchema`

Valida `req.query` com:

- `order_id`: `string`

## Controllers implementados

### Usuario

- `CreateUserController`
- `AuthUserController`
- `DetailUserController`

### Categoria

- `CreateCategoryController`
- `ListCategoriesController`

### Produto

- `CreateProductController`
- `ListProductsByCategoryController`
- `ListProductsController`
- `DeleteProductController`

### Pedido

- `CreateOrderController`
- `ListOrderController`
- `AddItemController`
- `DetailOrderController`
- `RemoveItemController`
- `SendOrderController`
- `FinishOrderController`
- `DeleteOrderController`

## Services implementados

### Usuario

- `CreateUserService`
- `AuthUserService`
- `DetailUserService`

### Categoria

- `CreateCategoryService`
- `ListCategoriesService`

### Produto

- `CreateProductService`
- `ListProductsByCategoryService`
- `ListProductsService`
- `DeleteProductService`

### Pedido

- `CreateOrderService`: cria pedido com `table` e `name`
- `ListOrderService`: lista pedidos filtrando por `draft`; sem query, retorna `draft = false`
- `AddItemOrderService`: adiciona item em um pedido validando pedido e produto
- `DetailOrderService`: retorna os dados completos de um pedido a partir de `order_id`
- `RemoveItemOrderService`: verifica existencia do item e remove do banco
- `SendOrderService`: atualiza `draft` para `false` e sobrescreve `name`
- `FinishOrderService`: atualiza `status` para `true`
- `DeleteOrderService`: remove o pedido do banco

## Banco de dados

### Banco utilizado

- PostgreSQL

### ORM e acesso

- Prisma Client gerado em `src/generated/prisma`
- adapter `@prisma/adapter-pg`
- driver `pg`

### Modelagem atual

#### Enum `Role`

- `STAFF`
- `ADMIN`

#### Tabela `users`

Campos:

- `id`: `TEXT`, chave primaria, `uuid()`
- `name`: `TEXT`
- `email`: `TEXT`, unico
- `password`: `TEXT`
- `role`: enum `Role`, default `STAFF`
- `createAd`: `TIMESTAMP`, default `CURRENT_TIMESTAMP`
- `updateAt`: `TIMESTAMP`, atualizado automaticamente

#### Tabela `categories`

Campos:

- `id`: `TEXT`, chave primaria, `uuid()`
- `name`: `TEXT`
- `createAd`: `TIMESTAMP`, default `CURRENT_TIMESTAMP`
- `updateAt`: `TIMESTAMP`

#### Tabela `product`

Campos:

- `id`: `TEXT`, chave primaria, `uuid()`
- `name`: `TEXT`
- `price`: `INTEGER`
- `description`: `TEXT`
- `banner`: `TEXT`
- `disabel`: `BOOLEAN`, default `false`
- `category_id`: `TEXT`, FK para `categories.id`
- `createAd`: `TIMESTAMP`, default `CURRENT_TIMESTAMP`
- `updateAt`: `TIMESTAMP`

Relacionamentos:

- pertence a uma `Category`
- possui varios `Item`

#### Tabela `orders`

Campos:

- `id`: `TEXT`, chave primaria, `uuid()`
- `table`: `INTEGER`
- `status`: `BOOLEAN`, default `false`
- `draft`: `BOOLEAN`, default `true`
- `name`: `TEXT`, opcional
- `createAd`: `TIMESTAMP`, default `CURRENT_TIMESTAMP`
- `updateAt`: `TIMESTAMP`

Relacionamentos:

- possui varios `Item`

#### Tabela `items`

Campos:

- `id`: `TEXT`, chave primaria, `uuid()`
- `amount`: `INTEGER`
- `order_id`: `TEXT`, FK para `orders.id`
- `product_id`: `TEXT`, FK para `product.id`
- `createAd`: `TIMESTAMP`, default `CURRENT_TIMESTAMP`
- `updateAt`: `TIMESTAMP`

Relacionamentos:

- pertence a um `Orders`
- pertence a um `Product`

### Relacionamentos resumidos

```text
Category 1:N Product
Product 1:N Item
Orders 1:N Item
```

## Prisma

Arquivos principais:

- `prisma/schema.prisma`: define enums, models e mapeamento das tabelas
- `prisma/migrations/20260318021807_create_tables/migration.sql`: migracao inicial
- `prisma/migrations/20260330014102_pizzaria/migration.sql`: segunda migracao versionada no projeto
- `prisma.config.ts`: aponta schema, pasta de migrations e usa `DATABASE_URL`
- `src/prisma/index.ts`: cria a instancia do `PrismaClient`

O Prisma esta configurado para gerar o client em:

```text
src/generated/prisma
```

## Tipagem customizada

O projeto estende a interface do Express para suportar:

```ts
req.user_id: string
```

## Tratamento de erros

Existe um middleware global no `server.ts` com o seguinte comportamento:

- se receber instancia de `Error`, retorna `400` com `error: error.message`
- caso contrario, retorna `500` com `Internal Server Error`

Exemplos de erros de negocio lancados pelos services:

- usuario ja existente
- e-mail ou senha invalidos
- usuario nao encontrado
- categoria nao encontrada
- produto nao encontrado
- pedido nao encontrado
- item nao encontrado
- falha ao criar pedido
- falha ao adicionar item ao pedido
- falha ao listar pedido
- falha ao enviar pedido
- falha ao finalizar pedido
- falha ao deletar pedido

## Estado atual do dominio

### Ja implementado

- autenticacao
- autorizacao por perfil
- cadastro de usuario
- consulta do usuario autenticado
- cadastro e listagem de categorias
- listagem de produtos por categoria
- listagem de produtos com filtro por `disabled`
- cadastro de produto com upload de imagem
- arquivamento de produto
- criacao de pedido
- listagem de pedidos
- adicao e remocao de itens do pedido
- detalhamento de pedido por `order_id`
- envio de pedido
- finalizacao de pedido
- exclusao de pedido

## Observacoes importantes do estado atual

- ha nomes com provavel erro de digitacao no schema, como `createAd` e `disabel`
- o model Prisma de pedidos esta como `Orders` mapeado para a tabela `orders`
- o schema Zod de `email` ainda valida apenas como `string`, sem `.email()`
- `GET /orders` nao usa `validateSchema`; o filtro `draft` e interpretado diretamente no service
- `DELETE /products` nao usa `validateSchema`; o `product_id` e lido diretamente da query no controller
- nao ha testes automatizados configurados no projeto atual

## Resumo executivo

O backend esta estruturado em camadas e cobre usuarios, categorias, produtos e pedidos. Em comparacao com a versao anterior deste documento, o projeto atual tambem inclui envio, finalizacao e exclusao de pedidos, e o detalhamento de pedido acontece por `order_id`, nao por `item_id`.
