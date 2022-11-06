import { Router } from "express";
import { uploadController } from "../controllers/uploadController";
import multer from "multer";
import { verifyToken, verifyAdmin } from "../middlewares/isAuth";

const upload = multer();

const uploadRouter = Router();

uploadRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("file"),
  uploadController.uploadImage
);

export default uploadRouter;
