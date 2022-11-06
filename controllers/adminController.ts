import { Request, Response } from "express";
import OrderModel from "../models/orderModel";
import ProductModel from "../models/productModel";
import UserModel from "../models/userModel";

class AdminController {
  getStats = async (req: Request, res: Response) => {
    try {
      const totalOrdersAndSales = await OrderModel.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: "$totalPrice" },
          },
        },
      ]);

      const totalUsers = await UserModel.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);

      const dailyOrders = await OrderModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            sales: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      const productCategories = await ProductModel.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      if (
        totalOrdersAndSales.length === 0 ||
        totalUsers.length === 0 ||
        dailyOrders.length === 0 ||
        productCategories.length === 0
      ) {
        res.status(400).send("No data found");
      }

      res.status(200).send({
        totalOrders: totalOrdersAndSales[0].numOrders,
        totalSales: totalOrdersAndSales[0].totalSales,
        totalUsers: totalUsers[0].numUsers,
        dailyOrders,
        productCategories,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  getProductList = async (req: Request, res: Response) => {
    try {
      const query = req.query;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 3;

      const products = await ProductModel.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      const countDocuments = await ProductModel.countDocuments();

      if (!products) {
        res.status(400).send("No products found in getProductList method");
      }

      return res.status(200).send({
        products,
        countDocuments,
        page,
        pages: Math.ceil(countDocuments / pageSize),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  createNewProduct = async (req: Request, res: Response) => {
    const { product } = req.body;
    try {
      const newProduct = {
        name: product?.name || "sample name" + Date.now(),
        slug: product?.slug || "sample-slug-" + Date.now(),
        category: product?.category || "sample category",
        price: product?.price || 0,
        image: product?.image || "/images/p1.jpg",
        brand: product?.brand || "sample brand",
        countInStock: product?.countInStock || 0,
        rating: product?.rating || 0,
        numReviews: product?.numReviews || 0,
        description: product?.description || "sample description",
      };

      const createProduct = new ProductModel(newProduct);
      const savedProduct = await createProduct.save();

      if (!savedProduct) {
        res
          .status(400)
          .send("Error creating new product in createNewProduct method");
      }
      res.status(201).send(savedProduct);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        res.status(400).send("Error deleting product in deleteProduct method");
      }
      res.status(200).send(deletedProduct);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
      res.send(error);
    }
  };

  editProduct = async (req: Request, res: Response) => {
    const {
      _id,
      name,
      slug,
      category,
      price,
      image,
      images,
      brand,
      countInStock,
      rating,
      numReviews,
      description,
    } = req.body;
    try {
      const newProduct = {
        name: name || "edited name" + Date.now(),
        slug: slug || "edited-slug-" + Date.now(),
        category: category || "edited category",
        price: price || 0,
        image: image || "/images/p2.jpg",
        images: images || ["/images/p2.jpg", "/images/p3.jpg"],
        brand: brand || "edited brand",
        countInStock: countInStock || 0,
        rating: rating || 0,
        numReviews: numReviews || 0,
        description: description || "edited description",
      };

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        _id,
        newProduct,
        { new: true }
      );
      if (!updatedProduct) {
        res.status(400).send("Error updating product in editProduct method");
      }
      res.status(200).send(updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  getOrdersList = async (req: Request, res: Response) => {
    try {
      const query = req.query;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 3;

      const orders = await OrderModel.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      const countDocuments = await OrderModel.countDocuments();

      if (!orders) {
        res.status(400).send("No products found in getProductList method");
      }

      res.status(200).send({
        orders,
        countDocuments,
        page,
        pages: Math.ceil(countDocuments / pageSize),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  deliverOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        { isDelivered: true, deliveredAt: Date.now() },
        { new: true }
      );
      if (!updatedOrder) {
        res.status(400).send("Error delivering order in deliverOrder method");
      }
      res.status(200).send(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const deletedOrder = await OrderModel.findByIdAndDelete(id);
      if (!deletedOrder) {
        res.status(400).send("Error deleting product in deleteProduct method");
      }
      res.status(200).send(deletedOrder);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
      res.send(error);
    }
  };

  getUsersList = async (req: Request, res: Response) => {
    const query = req.query;
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 3;

    try {
      const users = await UserModel.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);


      if (!users) {
        res.status(400).send("No products found in getProductList method");
      }

      res.status(200).send({
        users,
        countDocuments : users.length,
        page,
        pages: Math.ceil(users.length / pageSize),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(400).send("Error deleting user in deleteUsers method");
      }
      res.status(200).send(deletedUser);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
      res.send(error);
    }
  };
  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        res.status(400).send("Error getting user in getUserById method");
      }
      res.status(200).send(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
      res.send(error);
    }
  };

  editUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;
    try {
      const editedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email, isAdmin },
        { new: true }
      );
      if (!editedUser) {
        res.status(400).send("Error editing user in editUser method");
      }
      res.status(200).send(editedUser);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }
      console.log(error);
    }
  };
}

export const adminController = new AdminController();
