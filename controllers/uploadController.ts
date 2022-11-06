import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

class UploadController {
  async uploadImage(req: Request, res: Response) {
    //init cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const streamUpload = (req: Request) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        // @ts-ignore
        streamifier.createReadStream(req?.file?.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
}

export const uploadController = new UploadController();
