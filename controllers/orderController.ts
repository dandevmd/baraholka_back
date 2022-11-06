import { Request, Response } from "express";
import OrderModel from "../models/orderModel";
import UserModel from "../models/userModel";
import ProductModel from "../models/productModel";
import { CartItem } from "../types";
import { mailgun, payOrderEmailTemplate } from "../utils";

class OrderController {
  createOrder = async (req: Request, res: Response) => {
    const {
      cart,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      fullName,
      address,
      city,
      country,
      postalCode,
    } = req.body;

    const orderItems = cart.map((item: CartItem) => ({
      ...item,
      product: item._id,
    }));


    const shippingAddress = {
      fullName,
      address,
      city,
      country,
      postalCode,
    };

    //@ts-ignore
    const { user } = req;
    const userDoc = await UserModel.findOne({ email: user.arg });

    const newOrder = new OrderModel({
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      itemsPrice,
      user: userDoc,
    });

    try {
      const createdOrder = await newOrder.save();
      if (!createdOrder) {
        res.status(400).send("Order not created");
      }
      res.status(201).json(createdOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        res.status(404).send("Order not found");
      }
      res.status(200).send(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  updateOrderToPaid = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const order = await OrderModel.findById(id).populate(
        "user",
        "email name"
      );
      if (!order) {
        return res.status(400).send("Order not updated");
      }
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
        };
      }

      const updatedOrder = await order?.save();
      mailgun()
        .messages()
        .send(
          {
            from: "Baraholka <baraholka@mg.yourdomain.com>",
            // @ts-ignore
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      return res.status(200).send(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const user = req?.headers?.authorization?.split(" ")[2];
      if (!user) {
        return res
          .status(401)
          .send({ message: "user not found", method: "getAllOrders" });
      }
      const ordersDocs = await OrderModel.find({ user });
      if (!ordersDocs) {
        return res.status(404).send("Orders not found or are empty");
      }

      res.status(200).json(ordersDocs);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };
}

export const orderController = new OrderController();
