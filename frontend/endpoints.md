# Endpoints do Projeto

Este arquivo documenta todos os endpoints existentes no projeto atualmente. No estado atual do repositório, os endpoints estão no módulo [`BackEnd/src/routes.ts`](/c:/Users/acrosoletto.as/Desktop/Sistemas/Curso%20Matheus%20Fraga/ProjetoPizzaria/BackEnd/src/routes.ts).

## Visão geral

- Base URL local sugerida: `http://localhost:3333`
- Formato padrão: `application/json`
- Upload de arquivo: `multipart/form-data`
- Autenticação: `Authorization: Bearer <token>`
- Perfis de usuário: `STAFF` e `ADMIN`

## Convenções importantes

- O backend usa `PORT` do `.env`; se não existir, cai para `3000`.
- O token JWT é retornado no login e expira em `30d`.
- O campo `price` de produto é salvo em centavos.
- O campo interno do banco para produto arquivado é `disabel`, mas as respostas expõem `disabled`.
- As rotas protegidas retornam `401` com `{"error":"No token !"}` quando não há token válido.
- As rotas com validação Zod retornam `400` no formato:

```json
{
  "error": "Erro de validação",
  "details": [
    {
      "campo": "name",
      "message": "O campo é obrigatório"
    }
  ]
}
```

## Autenticação

Use o header abaixo em todas as rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

Exemplo de token obtido em `POST /session`:

```json
{
  "session": {
    "id": "f9f8525c-b2f8-4adf-89f2-d7421e86ddbe",
    "name": "Administrador",
    "email": "admin@pizzaria.com",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 1. Usuários

### POST `/users`

Cria um novo usuário.

Autenticação: não  
Permissão: pública  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `name` | `string` | Sim | mínimo de 3 caracteres |
| `email` | `string` | Sim | sem validação de formato, apenas obrigatório na prática |
| `password` | `string` | Sim | mínimo de 6 caracteres |

#### Exemplo de requisição

```json
{
  "name": "Administrador",
  "email": "admin@pizzaria.com",
  "password": "123456"
}
```

#### Exemplo de resposta `200`

```json
{
  "id": "8d28ac0a-6fd3-4ff5-b3e2-4b520211e9fd",
  "name": "Administrador",
  "email": "admin@pizzaria.com",
  "role": "STAFF"
}
```

#### Possíveis erros

- `400`: usuário já existe
- `400`: erro de validação

#### Exemplo de erro

```json
{
  "error": "User already exists with email: admin@pizzaria.com"
}
```

### POST `/session`

Autentica um usuário e retorna os dados da sessão com JWT.

Autenticação: não  
Permissão: pública  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `email` | `string` | Sim | obrigatório |
| `password` | `string` | Sim | mínimo de 1 caractere na validação atual |

#### Exemplo de requisição

```json
{
  "email": "admin@pizzaria.com",
  "password": "123456"
}
```

#### Exemplo de resposta `200`

```json
{
  "session": {
    "id": "8d28ac0a-6fd3-4ff5-b3e2-4b520211e9fd",
    "name": "Administrador",
    "email": "admin@pizzaria.com",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Possíveis erros

- `400`: email ou senha incorretos
- `400`: erro de validação

### GET `/me`

Retorna os dados do usuário autenticado.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

Nenhum.

#### Exemplo de resposta `200`

```json
{
  "id": "8d28ac0a-6fd3-4ff5-b3e2-4b520211e9fd",
  "name": "Administrador",
  "email": "admin@pizzaria.com",
  "role": "ADMIN"
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: usuário não encontrado

## 2. Categorias

### GET `/category`

Lista todas as categorias.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Exemplo de resposta `200`

```json
[
  {
    "id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
    "name": "Pizzas",
    "createAd": "2026-04-06T18:30:00.000Z"
  },
  {
    "id": "0e6f25f2-e0f9-4d7c-b899-1be16e48ab2e",
    "name": "Bebidas",
    "createAd": "2026-04-06T17:20:00.000Z"
  }
]
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: falha ao listar categorias

### POST `/category`

Cria uma nova categoria.

Autenticação: sim  
Permissão: `ADMIN`  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `name` | `string` | Sim | mínimo de 2 caracteres |

#### Exemplo de requisição

```json
{
  "name": "Pizzas"
}
```

#### Exemplo de resposta `201`

```json
{
  "id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
  "name": "Pizzas",
  "createAd": "2026-04-06T18:30:00.000Z"
}
```

#### Possíveis erros

- `401`: usuário sem permissão
- `400`: erro de validação
- `400`: falha ao criar categoria

### GET `/category/product`

Lista produtos ativos de uma categoria.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `category_id` | `string` | Sim | ID da categoria |

#### Exemplo de chamada

```http
GET /category/product?category_id=8dc1f19d-9316-409e-aea9-468b8876e0d2
```

#### Exemplo de resposta `200`

```json
[
  {
    "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
    "name": "Pizza Calabresa",
    "price": 5990,
    "description": "Calabresa, cebola e queijo",
    "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg",
    "category_id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
    "disabled": false,
    "createAd": "2026-04-06T18:35:00.000Z",
    "category": {
      "id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
      "name": "Pizzas"
    }
  }
]
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: categoria não encontrada
- `400`: erro de validação

## 3. Produtos

### GET `/products`

Lista produtos. Por padrão, retorna apenas produtos ativos.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `disabled` | `"true" \| "false"` | Não | padrão `false` |

#### Exemplo de chamadas

```http
GET /products
GET /products?disabled=true
```

#### Exemplo de resposta `200`

```json
[
  {
    "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
    "name": "Pizza Calabresa",
    "price": 5990,
    "description": "Calabresa, cebola e queijo",
    "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg",
    "category_id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
    "disabled": false,
    "createAd": "2026-04-06T18:35:00.000Z"
  }
]
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: erro de validação do parâmetro `disabled`
- `400`: falha ao listar produtos

### POST `/products`

Cria um novo produto com upload de imagem.

Autenticação: sim  
Permissão: `ADMIN`  
Content-Type: `multipart/form-data`

#### Campos do formulário

| Campo | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `name` | `string` | Sim | nome do produto |
| `price` | `string` | Sim | apenas dígitos; valor em centavos |
| `description` | `string` | Sim | descrição do produto |
| `category_id` | `string` | Sim | ID da categoria |
| `file` | `file` | Sim | `png`, `jpg` ou `jpeg`, até `4 MB` |

#### Exemplo de requisição

```bash
curl -X POST http://localhost:3333/products ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -F "name=Pizza Calabresa" ^
  -F "price=5990" ^
  -F "description=Calabresa, cebola e queijo" ^
  -F "category_id=8dc1f19d-9316-409e-aea9-468b8876e0d2" ^
  -F "file=@C:\imagens\pizza.jpg"
```

#### Exemplo de resposta `200`

```json
{
  "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
  "name": "Pizza Calabresa",
  "price": 5990,
  "description": "Calabresa, cebola e queijo",
  "category_id": "8dc1f19d-9316-409e-aea9-468b8876e0d2",
  "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg",
  "createAd": "2026-04-06T18:35:00.000Z"
}
```

#### Possíveis erros

- `401`: usuário sem permissão
- `400`: imagem obrigatória
- `400`: categoria não encontrada
- `400`: formato de arquivo inválido
- `400`: erro no upload da imagem
- `400`: erro de validação

### DELETE `/products`

Arquiva um produto por soft delete, marcando `disabel = true` no banco.

Autenticação: sim  
Permissão: `ADMIN`  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `product_id` | `string` | Sim na prática | ID do produto |

#### Exemplo de chamada

```http
DELETE /products?product_id=1ee2ea44-ef69-4515-b52a-2a3806f1607a
```

#### Exemplo de resposta `200`

```json
{
  "message": "Produto deletado/arquivado com sucesso"
}
```

#### Observação

A rota lê `product_id` pela query string. Existe um schema `deleteProductSchema`, mas ele não está ligado à rota atual.

#### Possíveis erros

- `401`: usuário sem permissão
- `400`: produto não encontrado

## 4. Pedidos

### POST `/order`

Cria um novo pedido.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `table` | `number` | Sim | inteiro positivo |
| `name` | `string` | Sim | nome do cliente |

#### Exemplo de requisição

```json
{
  "table": 7,
  "name": "Carlos"
}
```

#### Exemplo de resposta `201`

```json
{
  "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "table": 7,
  "name": "Carlos",
  "status": false,
  "draft": true,
  "createAd": "2026-04-06T18:45:00.000Z"
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: erro de validação
- `400`: falha ao criar pedido

### GET `/orders`

Lista pedidos. Sem query, retorna pedidos com `draft=false`.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `draft` | `"true" \| "false"` | Não | sem enviar, o código usa `false` |

#### Exemplo de chamadas

```http
GET /orders
GET /orders?draft=true
```

#### Exemplo de resposta `200`

```json
[
  {
    "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
    "table": 7,
    "name": "Carlos",
    "status": false,
    "draft": false,
    "createAd": "2026-04-06T18:45:00.000Z",
    "itens": [
      {
        "id": "0fa5edc1-3f1f-43e1-906b-df8ec1144ce1",
        "amount": 2,
        "product": {
          "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
          "name": "Pizza Calabresa",
          "price": 5990,
          "description": "Calabresa, cebola e queijo",
          "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg"
        }
      }
    ]
  }
]
```

### GET `/order/detail`

Retorna o detalhamento completo de um pedido.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `order_id` | `string` | Sim | ID do pedido |

#### Exemplo de chamada

```http
GET /order/detail?order_id=fc47794d-3d1d-44fd-8dc4-cfe917be5d71
```

#### Exemplo de resposta `200`

```json
{
  "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "table": 7,
  "name": "Carlos",
  "status": false,
  "draft": false,
  "createAd": "2026-04-06T18:45:00.000Z",
  "itens": [
    {
      "id": "0fa5edc1-3f1f-43e1-906b-df8ec1144ce1",
      "amount": 2,
      "product_id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
      "createAd": "2026-04-06T18:46:00.000Z",
      "product": {
        "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
        "name": "Pizza Calabresa",
        "price": 5990,
        "description": "Calabresa, cebola e queijo",
        "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg"
      }
    }
  ]
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: erro de validação
- `400`: falha ao listar pedido

### POST `/order/add`

Adiciona um item a um pedido.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `order_id` | `string` | Sim | ID do pedido |
| `product_id` | `string` | Sim | ID do produto |
| `amount` | `number` | Sim | inteiro positivo |

#### Exemplo de requisição

```json
{
  "order_id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "product_id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
  "amount": 2
}
```

#### Exemplo de resposta `201`

```json
{
  "id": "0fa5edc1-3f1f-43e1-906b-df8ec1144ce1",
  "amount": 2,
  "order_id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "product_id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
  "createAd": "2026-04-06T18:46:00.000Z",
  "product": {
    "id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a",
    "name": "Pizza Calabresa",
    "price": 5990,
    "description": "Calabresa, cebola e queijo",
    "banner": "https://res.cloudinary.com/demo/image/upload/v1/products/pizza-calabresa.jpg"
  }
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: pedido não encontrado
- `400`: produto não encontrado
- `400`: falha ao adicionar item ao pedido
- `400`: erro de validação

### DELETE `/order/remove`

Remove um item de um pedido.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `item_id` | `string` | Sim | ID do item |

#### Exemplo de chamada

```http
DELETE /order/remove?item_id=0fa5edc1-3f1f-43e1-906b-df8ec1144ce1
```

#### Exemplo de resposta `200`

```json
{
  "message": "Item removido com sucesso",
  "item": {
    "id": "0fa5edc1-3f1f-43e1-906b-df8ec1144ce1",
    "amount": 2,
    "order_id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
    "product_id": "1ee2ea44-ef69-4515-b52a-2a3806f1607a"
  }
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: erro de validação
- `400`: falha ao remover item do pedido

### PUT `/order/send`

Envia um pedido para produção, alterando `draft` para `false`.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `order_id` | `string` | Sim | ID do pedido |
| `name` | `string` | Não no schema atual | o controller e o service aceitam esse campo |

#### Observação

O schema atual valida apenas `order_id`, mas o controller também repassa `name`. Se enviado, o nome do cliente é atualizado no pedido.

#### Exemplo de requisição

```json
{
  "order_id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "name": "Carlos"
}
```

#### Exemplo de resposta `200`

```json
{
  "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "table": 7,
  "name": "Carlos",
  "status": false,
  "draft": false,
  "createAd": "2026-04-06T18:45:00.000Z"
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: erro de validação
- `400`: falha ao enviar pedido

### PUT `/order/finish`

Finaliza um pedido, alterando `status` para `true`.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Body

| Propriedade | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `order_id` | `string` | Sim | ID do pedido |

#### Exemplo de requisição

```json
{
  "order_id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71"
}
```

#### Exemplo de resposta `200`

```json
{
  "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
  "table": 7,
  "name": "Carlos",
  "status": true,
  "draft": false,
  "createAd": "2026-04-06T18:45:00.000Z"
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: falha ao finalizar o pedido
- `400`: erro de validação

### DELETE `/order`

Exclui um pedido fisicamente do banco.

Autenticação: sim  
Permissão: usuário autenticado  
Content-Type: `application/json`

#### Query params

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `order_id` | `string` | Sim | ID do pedido |

#### Exemplo de chamada

```http
DELETE /order?order_id=fc47794d-3d1d-44fd-8dc4-cfe917be5d71
```

#### Exemplo de resposta `200`

```json
{
  "message": "Pedido deletado com sucesso",
  "order": {
    "id": "fc47794d-3d1d-44fd-8dc4-cfe917be5d71",
    "table": 7,
    "status": true,
    "draft": false,
    "name": "Carlos",
    "createAd": "2026-04-06T18:45:00.000Z",
    "updateAt": "2026-04-06T19:10:00.000Z"
  }
}
```

#### Possíveis erros

- `401`: token ausente ou inválido
- `400`: falha ao deletar o pedido
- `400`: erro de validação

## 5. Resumo rápido das rotas

| Método | Endpoint | Auth | Admin | Descrição |
| --- | --- | --- | --- | --- |
| `POST` | `/users` | Não | Não | Criar usuário |
| `POST` | `/session` | Não | Não | Login |
| `GET` | `/me` | Sim | Não | Usuário autenticado |
| `GET` | `/category` | Sim | Não | Listar categorias |
| `POST` | `/category` | Sim | Sim | Criar categoria |
| `GET` | `/category/product` | Sim | Não | Produtos por categoria |
| `GET` | `/products` | Sim | Não | Listar produtos |
| `POST` | `/products` | Sim | Sim | Criar produto |
| `DELETE` | `/products` | Sim | Sim | Arquivar produto |
| `POST` | `/order` | Sim | Não | Criar pedido |
| `GET` | `/orders` | Sim | Não | Listar pedidos |
| `POST` | `/order/add` | Sim | Não | Adicionar item |
| `GET` | `/order/detail` | Sim | Não | Detalhar pedido |
| `DELETE` | `/order/remove` | Sim | Não | Remover item |
| `PUT` | `/order/send` | Sim | Não | Enviar pedido |
| `PUT` | `/order/finish` | Sim | Não | Finalizar pedido |
| `DELETE` | `/order` | Sim | Não | Excluir pedido |

## 6. Observações de implementação

- O frontend atual não expõe endpoints próprios; a API documentada está toda no backend.
- Em `GET /products`, a resposta não inclui o objeto `category`, embora ele seja buscado internamente.
- Em `DELETE /products`, a rota usa `query.product_id`; não existe validação Zod ligada a essa rota.
- Em `PUT /order/send`, há divergência entre schema e controller sobre o campo `name`.
- O projeto possui tratamento global que converte `throw new Error(...)` em resposta `400`.
