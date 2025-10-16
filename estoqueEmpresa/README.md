# 🛠 Sistema de Gerenciamento de Estoque

[![Node.js](https://img.shields.io/badge/Node.js-v22.19.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)](https://www.mongodb.com/cloud/atlas)
[![Jest](https://img.shields.io/badge/Tests-Jest-red)](https://jestjs.io/)

Este sistema foi desenvolvido para uma empresa que precisava gerenciar o estoque de ferramentas e itens dos funcionários. Ele permite controlar cadastro, consulta, criação, atualização e exclusão de produtos, além de gerenciar usuários com autenticação JWT.

---

## 🔹 Principais Funcionalidades

* Cadastro de produtos (ferramentas e itens) com `nome`, `tipo`, `descrição` e `quantidade`.
* Listagem de produtos e consulta por ID.
* Criação, edição e remoção de produtos.
* Cadastro e autenticação de usuários (registro e login) com geração de token JWT.
* Rotas protegidas para operações que requerem autenticação.
* Apenas um usuário administrador pode gerenciar o estoque.
* **Testes automatizados** das rotas de produtos com Jest (`produto.test.js`), cobrindo criação, listagem, busca por ID, atualização e exclusão de produtos.

---

## ⚡ Tecnologias Utilizadas

* **Back-end:** Node.js, Express.js
* **Banco de dados:** MongoDB (Atlas)
* **Autenticação:** JWT
* **Testes:** Jest + Supertest

---

## 🚀 Como Rodar o Projeto

### 1. Instale as dependências

```powershell
npm install
```

### 2. Rodar em desenvolvimento (com nodemon)

```powershell
npm run dev
```

### 3. Rodar em produção

```powershell
npm start
```

### 4. Rodar testes automatizados (Jest)

```powershell
npm test
```

> Os testes do arquivo `produto.test.js` garantem que todas as rotas de produtos (`POST`, `GET`, `GET/:id`, `PUT`, `DELETE`) funcionem corretamente.

---

## 📌 Endpoints Principais

### Produtos

| Método | Rota            | Descrição               |
| ------ | --------------- | ----------------------- |
| GET    | `/produtos`     | Lista todos os produtos |
| GET    | `/produtos/:id` | Busca produto por ID    |
| POST   | `/produtos`     | Cria um novo produto    |
| PUT    | `/produtos/:id` | Atualiza um produto     |
| DELETE | `/produtos/:id` | Remove um produto       |

### Usuários

| Método | Rota              | Descrição                         |
| ------ | ----------------- | --------------------------------- |
| POST   | `/users/register` | Registra novo usuário             |
| POST   | `/users/login`    | Autentica usuário e retorna token |

> ⚠️ Apenas o usuário administrador deve acessar o sistema após o registro inicial.

---

## 🧪 Testes Automatizados com Jest

O arquivo `produto.test.js` cobre o CRUD completo de produtos:

1. **Criação de produto (POST)** – verifica se o produto é criado corretamente e retorna `_id`.
2. **Listagem de produtos (GET)** – verifica se todos os produtos são listados corretamente.
3. **Busca por ID (GET/:id)** – garante que o produto retornado é o mesmo que foi criado.
4. **Atualização de produto (PUT/:id)** – valida se os campos do produto foram alterados corretamente.
5. **Remoção de produto (DELETE/:id)** – verifica se a exclusão do produto foi concluída com sucesso.

