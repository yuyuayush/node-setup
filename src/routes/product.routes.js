import express from "express";
import { auth } from "../middleware/auth.js";
const route  = express.Router();
import * as productController from "../controllers/product.controller.js";

route.post("/",auth(),productController.createProduct);
route.get("/",auth(),productController.getProducts);
route.get("/:id",auth(),productController.getProduct);
route.put("/:id",auth(),productController.updateProduct);
route.delete("/:id",auth(),productController.deleteProduct);

export default route;