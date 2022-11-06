import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send("Access Denied");
    return next();
  }

  try {
    const verified = JWT.verify(token, process.env.JWT_SECRET as string);
    // @ts-ignore
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminField = req.headers.authorization?.split(" ")[3];
  if (adminField === "true") {
    next();
  } else {
    res.status(401).send("Access Denied. Do not have admin privileges");
  }
};


