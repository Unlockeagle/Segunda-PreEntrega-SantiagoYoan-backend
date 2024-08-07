import { Router } from "express";
import CartManager from "../class/cartManager.js";

const manager = new CartManager("./src/data/carts.json");
const router = Router();

///api/carts/

router.get("/api/carts", async (req, res) => {
  const arrayCarts = await manager.getCarts();
  res.send(arrayCarts);
});

//La ruta raíz POST / deberá crear un nuevo carrito
router.post("/api/carts", async (req, res) => {
  //Recuperamos el carrito nuevo desde el body
  const cart = req.body;
  try {
    //Creamos el carrito
    await manager.createCart(cart);
    res.status(200).json(cart);
  } catch (error) {
    res.send(error);
  }
});

//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get("/api/carts/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  try {
    const cartById = await manager.getCartById(cid);
    if (cartById) {
      return res.json(cartById);
    } else {
      return res.send("Error ID no Existe");
    }
  } catch (error) {
    return res.send(error);
  }
});

// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto
// Importar los products
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity);
  try {
    const addProduct = await manager.addProductToCart(cid, pid, quantity);
    if (addProduct) {
      res
        .status(200)
        .send({ message: "Producto agregado exitosamente", cart: addProduct });
    }
    req.status(404).send("Error al agregar producto");
  } catch (error) {
    res.send(error);
  }
});

export default router;
