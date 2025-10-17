import express from "express";
import connectDB from "./services/db.js";
import userRoute from "./routes/userRoute.js";
import produtoRoute from "./routes/produtoRoute.js";
import path from 'path';
import { fileURLToPath } from 'url'; 
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use("/users", userRoute);
app.use("/produtos", produtoRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

export default app;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
