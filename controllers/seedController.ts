import { Request, Response } from "express";

import data from "../data";
import ProductModel from "../models/productModel";
import UserModel from "../models/userModel";

class SeedController {
  seed1 = async (req: Request, res: Response) => {
    try {
      await UserModel.deleteMany({});
      const createdUsers = await UserModel.insertMany(data.users);
      await ProductModel.deleteMany({});
      const createdProducts = await ProductModel.insertMany(data.products);
      res.send({ createdProducts, createdUsers });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      }
    }
  };
}

export const seedController = new SeedController();
