import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { verifyToken } from "./isAuth";
import mongoose from "mongoose";
import OrderModel from "../models/orderModel";

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.headers.authorization?.split(" ")[1];

  const order = await OrderModel.findById(req.params.id);
  const user = order?.user;
  //@ts-ignore
  const userId = user?.toString();
  

  if (id === userId) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
