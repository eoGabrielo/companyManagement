import { Router } from "express";
import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
} from "../controllers/produtoController.js";

import { verifyToken } from "../middleware/authMiddleware.js"

const router = Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoById);
router.post("/",verifyToken, createProduto);
router.put("/:id",verifyToken, updateProduto);
router.delete("/:id", verifyToken, deleteProduto);

export default router;
