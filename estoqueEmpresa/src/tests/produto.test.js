import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";

let produtoId = ""; 

describe("Testes completos das rotas de produtos", () => {
  beforeAll(async () => {//hook do Jest que roda uma vez antes de todos os testes
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb+srv://gabrielo:gabrielo@clusterestoqueempresa.p6sjfve.mongodb.net/?retryWrites=true&w=majority&appName=ClusterEstoqueEmpresa"
      );
    }
  });

  afterAll(async () => {//hook do Jest que roda uma vez depois de todos os testes
    await mongoose.connection.close();
  });

  //Test1
  test("POST /produtos - deve criar um novo produto", async () => {
    const novoProduto = {
      nome: "Caneta Azul",
      tipo: "Escrita",
      descricao: "Tinta azul clássica",
      quantidade: 100,
    };

    const res = await request(app).post("/produtos").send(novoProduto);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nome).toBe("Caneta Azul");

    produtoId = res.body._id;
  });

  //Test2
  test("GET /produtos - deve listar os produtos", async () => {
    const res = await request(app).get("/produtos");

    //expect(*verifica*).toBe(*Se é isso*)
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  //Test3
  test("GET /produtos/:id - deve buscar produto pelo ID", async () => {
    const res = await request(app).get(`/produtos/${produtoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", produtoId);
    expect(res.body.nome).toBe("Caneta Azul");
  });

  //Test4
  test("PUT /produtos/:id - deve atualizar um produto", async () => {
    const atualizacao = { nome: "Caneta Vermelha", quantidade: 150 };

    const res = await request(app).put(`/produtos/${produtoId}`).send(atualizacao);

    expect(res.statusCode).toBe(200);
    expect(res.body.produto.nome).toBe("Caneta Vermelha");
    expect(res.body.produto.quantidade).toBe(150);
  });

  //Test5
  test("DELETE /produtos/:id - deve deletar um produto", async () => {
    const res = await request(app).delete(`/produtos/${produtoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");//Retorno contém a propriedade "message"
  });
});
