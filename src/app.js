import express from "express";
import productsRouter from "./routes/product.route.js";
import cartsRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./class/productManager.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

const app = express();
const PUERTO = 8080;
//middleware
app.use(express.json());
app.use(express.static("./src/public"));

//configuramos el handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);

const manager = new ProductManager("./src/data/products.json");
//listen
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado el puerto http://localhost:${PUERTO}`);
});

// creamos server de socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado en el backend");

  //*** Send products to front ****/
  socket.on("message", (data) => {
    console.log(data);
  });

  //*** Detele products ****/
  socket.on("deteleID", async (data) => {
    await console.log(data);

    await manager.deleteProduct(data);
    //*** Reload products ***/
    io.emit("products", await manager.getProducts());
  });

  socket.emit("products", await manager.getProducts());
  /*** Add products ***/

  socket.on("productData", async (data) => {
    const newProduct = data;

    await manager.addProduct(newProduct);
    //*** Reload products ***/
    io.emit("products", await manager.getProducts());

    console.log(data);
  });
});
