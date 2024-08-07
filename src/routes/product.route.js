import { Router } from "express";
import ProductManager from "../class/productManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

//La ruta raíz GET / deberá listar todos los productos de la base.
router.get("/api/products", async (req, res) => {
  try {
    const arrayProducts = await manager.getProducts();
    res.send(arrayProducts);
  } catch (error) {
    res.send({ status: 401, message: "Error" });
  }
});

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
router.get("/api/products/:pid", async (req, res) => {
  const pid = await req.params.pid;
  const product = await manager.getProductsById(parseInt(pid));
  if (!product) {
    console.log("productId no Encontrado");
    res.send("producto no encontrado");
  } else {
    console.log("Producto encontrado");
    res.send({ status: 200, message: `producto ${pid} encontrado`, product });
  }
});

//La ruta raíz POST / deberá agregar un nuevo producto
router.post("/api/products", async (req, res) => {
  const newProduct = req.body;

  try {
    manager.addProduct(newProduct);

    res.status(200).send({ message: `Producto creado con exito`, newProduct });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error });
  }
});

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
router.put("/api/products/:pid", async (req, res) => {
  //obtenemos el id del producto
  const pid = req.params.pid;
  //obtenemos los datos para actualizar el producto
  const product = req.body;
  try {
    await manager.updateProduct(pid, product);
    res.status(200).send("Producto actualizado");
  } catch (error) {
    console.log(error);
  }
});
//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.
router.delete("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid
  try {
    manager.deleteProduct(pid)
    res.status(400).send("producto eliminado con exito")
  } catch (error) {
    res.status(500).send("Error al eliminar producto")
  }
})

export default router;

