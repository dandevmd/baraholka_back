import { Router } from "express";
import { seedController } from "../controllers/seedController";

const seedRouter = Router();

seedRouter.get("/", seedController.seed1);

export default seedRouter;
