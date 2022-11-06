import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { verifyToken, verifyAdmin } from "../middlewares/isAuth";

const adminRouter: Router = Router();

adminRouter.get("/stats", verifyToken, verifyAdmin, adminController.getStats);
adminRouter.get(
  "/productsList",
  verifyToken,
  verifyAdmin,
  adminController.getProductList
);
adminRouter.get(
  "/ordersList",
  verifyToken,
  verifyAdmin,
  adminController.getOrdersList
);
adminRouter.get(
  "/usersList",
  verifyToken,
  verifyAdmin,
  adminController.getUsersList
);
adminRouter.get(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  adminController.getUserById
);
adminRouter.post(
  "/createProduct",
  verifyToken,
  verifyAdmin,
  adminController.createNewProduct
);
adminRouter.put(
  "/editProduct/:id",
  verifyToken,
  verifyAdmin,
  adminController.editProduct
);
adminRouter.put(
  "/deliver/:id",
  verifyToken,
  verifyAdmin,
  adminController.deliverOrder
);
adminRouter.put(
  "/editUser/:id",
  verifyToken,
  verifyAdmin,
  adminController.editUser
);
adminRouter.delete(
  "/deleteProduct",
  verifyToken,
  verifyAdmin,
  adminController.deleteProduct
);
adminRouter.delete(
  "/deleteOrder",
  verifyToken,
  verifyAdmin,
  adminController.deleteOrder
);
adminRouter.delete(
  "/deleteUser",
  verifyToken,
  verifyAdmin,
  adminController.deleteUser
);

export default adminRouter;
