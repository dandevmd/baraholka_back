import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { verifyToken } from "../middlewares/isAuth";
import { isOwner } from "../middlewares/isOwner";

const orderRouter = Router();

orderRouter.post("/", verifyToken, orderController.createOrder);
orderRouter.get("/", verifyToken, orderController.getAllOrders);
orderRouter.get("/:id", isOwner, orderController.getOrderById);
orderRouter.put("/:id/pay", isOwner, orderController.updateOrderToPaid);

export default orderRouter;
