import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://gabrielo:gabrielo@cluster0estoqueempresar.ijrpzce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0EstoqueEmpresaR";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
