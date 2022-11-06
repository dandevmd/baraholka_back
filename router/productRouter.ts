import { Router, Request, Response } from "express";
import { productController } from "../controllers/productController";
import { verifyToken, verifyAdmin,  } from "../middlewares/isAuth";
const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.get("/slug/:slug", productController.getProductBySlug);
productRouter.get("/categories", productController.getProductCategories);
productRouter.get(
  "/category/:category",
  productController.getProductsByCategory
);
productRouter.get("/search", productController.getProductByQuery);
productRouter.get(
  "/:id",
  verifyToken,
   verifyAdmin,
  productController.getProductById
);
productRouter.post(
  "/:id/reviews",
  verifyToken,
  productController.createProductReview
);

export default productRouter;
