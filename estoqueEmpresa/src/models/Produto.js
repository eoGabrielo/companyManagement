import mongoose from "mongoose";

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  descricao: { type: String, required: true },
  quantidade: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
});

const Produto = mongoose.model("Produto", ProdutoSchema);

export default Produto;
