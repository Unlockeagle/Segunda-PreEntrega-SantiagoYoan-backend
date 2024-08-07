import { Router } from "express";
import ProductManager from "../class/productManager.js";

const router = Router();

const manager = new ProductManager("./src/data/products.json")
// Ruta para mostar los productos
router.get("/products", async (req, res) => {
  const products = await manager.getProducts()
  res.render("home", {products});
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

export default router;
