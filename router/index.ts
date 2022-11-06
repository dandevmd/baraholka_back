import { Router, Request, Response } from "express";
import productRouter from "./productRouter";
import seedRouter from "./seedRouter";
import userRouter from "./userRouter";
import orderRouter from "./orderRouter";
import payPalRouter from "./payPalRouter";
import adminRouter from './adminRouter'
import uploadRouter from './uploadRouter'

const router = Router();

router.use("/seed", seedRouter);
router.use("/upload", uploadRouter);
router.use("/user", userRouter);
router.use('/admin', adminRouter);
router.use("/products", productRouter);
router.use('/orders', orderRouter);
router.use('/paypal', payPalRouter)


export default router;
