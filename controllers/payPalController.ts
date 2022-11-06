import { Request, Response } from "express";

class PayPalController {
  getPayPalClientID(req: Request, res: Response) {
    return res.send(process.env.PAYPAL_CLIENT_ID || "sb");
  }
}

export const payPalController = new PayPalController();
