# Sistema de Gestão de Estoque - Sorveteria Gelato

Bem-vindo ao sistema de gestão de estoque da Sorveteria Gelato! Esta API RESTful, construída com Django e Django REST Framework, permite gerenciar o estoque de produtos (sorvetes), com funcionalidades de autenticação, listagem, criação, atualização e exclusão de itens.

## Visão Geral

- **Base URL**: `/api/`
- **Autenticação**: Todos os endpoints (exceto `/api/login/`) requerem o cabeçalho `Authorization: Token <token>`, obtido via login.
- **Formato**: JSON para requisições e respostas.

## Endpoints

### 1. Login
#### `POST /api/login/`
Autentica um usuário e retorna um token de acesso. Um novo token é gerado a cada login, substituindo o anterior.

**Parâmetros de Entrada:**
```json
{
  "username": "string",  // Obrigatório: Nome de usuário
  "password": "string"   // Obrigatório: Senha
}

Respostas:

200 OK:

{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user_id": 1,
  "username": "admin"
}

400 Bad Request:

{
  "non_field_errors": ["Unable to log in with provided credentials."]
}

Exemplo:

curl -X POST http://localhost:8000/api/login/ \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "12345"}'

### 2. Logout
#### POST /api/logout/
Encerra a sessão do usuário, deletando o token de autenticação.

Cabeçalhos:

Authorization: Token <token>

Respostas:

200 OK:

{
  "message": "Logout realizado com sucesso"
}

401 Unauthorized:

{
  "detail": "Invalid token."
}

Exemplo:

curl -X POST http://localhost:8000/api/logout/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

### 3. Listar e Criar Produtos
#### GET /api/estoque/
Lista todos os produtos no estoque.

Cabeçalhos:

Authorization: Token <token>

Respostas:

200 OK:

[
  {
    "id": 1,
    "name": "Chocolate",
    "description": "Sorvete de chocolate",
    "stock": 10,
    "type": {"id": 1, "name": "Sorvete"},
    "value": 5.0,
    "um": {"id": 1, "name_abv": "L", "name": "Litros"}
  }
]

401 Unauthorized:

{
  "detail": "Authentication credentials were not provided."
}

Exemplo:

curl -X GET http://localhost:8000/api/estoque/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

#### POST /api/estoque/
Cria um novo produto no estoque.

Cabeçalhos:

Authorization: Token <token>
Content-Type: application/json

Parâmetros de Entrada:

{
  "name": "string",        // Obrigatório: Nome do produto
  "description": "string", // Obrigatório: Descrição
  "stock": integer,        // Obrigatório: Quantidade
  "type_id": integer,      // Obrigatório: ID do tipo
  "value": float,          // Obrigatório: Valor
  "um_id": integer         // Obrigatório: ID da unidade de medida
}

Respostas:

201 Created:

{
  "id": 3,
  "name": "Morango",
  "description": "Sorvete de morango",
  "stock": 20,
  "type": {"id": 1, "name": "Sorvete"},
  "value": 5.5,
  "um": {"id": 1, "name_abv": "L", "name": "Litros"}
}

400 Bad Request:

{
  "name": ["This field is required."]
}

Exemplo:

curl -X POST http://localhost:8000/api/estoque/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
-H "Content-Type: application/json" \
-d '{"name": "Morango", "description": "Sorvete de morango", "stock": 20, "type_id": 1, "value": 5.5, "um_id": 1}'

### 4. Listar e Criar Unidades de Medida
#### GET /api/medida/
Lista todos as unidades de medida para produtos.

Cabeçalhos:

Authorization: Token <token>

Respostas:

200 OK:

[
	{
		"id": 1,
		"name_abv": "UN",
		"name": "Unidade"
	}
]

401 Unauthorized:

{
  "detail": "Authentication credentials were not provided."
}

Exemplo:

curl -X GET http://localhost:8000/api/medida/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

#### POST /api/medida/
Cria uma nova unidade de medida.

Cabeçalhos:

Authorization: Token <token>
Content-Type: application/json

Parâmetros de Entrada:

{
	"name_abv": "PAC", // Obrigatório: Nome abreviado
	"name": "Pacote"   // Obrigatório: Nome da unidade
}

Respostas:

201 Created:

{
	"id": 3,
	"name_abv": "L",
	"name": "Litros"
}

400 Bad Request:

{
  "name": ["This field is required."]
}

Exemplo:

curl -X POST http://localhost:8000/api/medida/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
-H "Content-Type: application/json" \
-d '{"name_abv": "L", "name": "Litros"}'

### 5. Listar e Criar Tipos de Produtos
#### GET /api/tipo/
Lista todos as unidades de medida para produtos.

Cabeçalhos:

Authorization: Token <token>

Respostas:

200 OK:

[
	{
		"id": 1,
		"name": "Picolé"
	}
]

401 Unauthorized:

{
  "detail": "Authentication credentials were not provided."
}

Exemplo:

curl -X GET http://localhost:8000/api/tipo/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

#### POST /api/tipo/
Cria uma novo tipo para produto.

Cabeçalhos:

Authorization: Token <token>
Content-Type: application/json

Parâmetros de Entrada:

{
  "name": "Massa"  // Obrigatório: Nome do Tipo
}

Respostas:

201 Created:

{
	"id": 2,
	"name": "Massa"
}

400 Bad Request:

{
  "name": ["This field is required."]
}

Exemplo:

curl -X POST http://localhost:8000/api/tipo/ \
-H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
-H "Content-Type: application/json" \
-d '{"name": "Massa"}'


6. Detalhar, Atualizar e Deletar Produto
GET /api/estoque/<int:pk>/
Retorna os detalhes de um produto específico.

Cabeçalhos:

Authorization: Token <token>

Respostas:

200 OK:

{
  "id": 1,
  "name": "Chocolate",
  "description": "Sorvete de chocolate",
  "stock": 10,
  "type": {"id": 1, "name": "Sorvete"},
  "value": 5.0,
  "um": {"id": 1, "name_abv": "L", "name": "Litros"}