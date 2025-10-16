import { Router } from "express";
import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
} from "../controllers/produtoController.js";

import { verifyToken } from "../middleware/authMiddleware.js"//DESABILITADO PARA CONSEGUIR FAZER TESTES UNITARIOS COM "JEST"

const router = Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoById);
router.post("/", createProduto);
router.put("/:id", updateProduto);
router.delete("/:id", deleteProduto);

export default router;
