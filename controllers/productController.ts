import { Request, Response } from "express";
import Product from "../models/productModel";

class ProductController {
  public async getAllProducts(req: Request, res: Response) {
    try {
      const products = await Product.find();
      res.send(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const product = await Product.findOne({ slug });
      console.log(product);
      product && res.send(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      product && res.send(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getProductCategories(req: Request, res: Response) {
    try {
      const categories = await Product.find().distinct("category");
      res.send(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getProductsByCategory(req: Request, res: Response) {
    const { category } = req.params;
    try {
      const products = await Product.find({ category });
      if (!products) {
        throw new Error("No products found");
      }
      res.send(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
        console.log(error.message);
      }
      console.log(error);
    }
  }

  public async getProductByQuery(req: Request, res: Response) {
    try {
      const { query } = req;
      const PAGE_SIZE = 3;
      const pageSize = query.pageSize || PAGE_SIZE;
      const page = query.page || 1;
      const category = query.category || "";
      const price = query.price || "";
      const rating = query.rating || "";
      const order = query.order || "";
      const searchQuery = query.query || "";

      const queryFilter =
        searchQuery && searchQuery !== "all"
          ? {
              name: {
                $regex: searchQuery,
                $options: "i",
              },
            }
          : {};

      const categoryFilter = category && category !== "all" ? { category } : {};

      const ratingFilter =
        rating && rating !== "all"
          ? {
              rating: {
                $gte: Number(rating),
              },
            }
          : {};

      const priceFilter =
        price && price !== "all"
          ? {
              // 1-50
              price: {
                // @ts-ignore

                $gte: Number(price.split("-")[0]),
                // @ts-ignore

                $lte: Number(price.split("-")[1]),
              },
            }
          : {};

      const sortOrder =
        order === "featured"
          ? { featured: -1 }
          : order === "lowest"
          ? { price: 1 }
          : order === "highest"
          ? { price: -1 }
          : order === "toprated"
          ? { rating: -1 }
          : order === "newest"
          ? { createdAt: -1 }
          : { _id: -1 };

      const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })
        .sort(
          // @ts-ignore
          sortOrder
        )
        .skip(
          // @ts-ignore

          pageSize * (page - 1)
        )
        .limit(
          // @ts-ignore
          pageSize
        );

      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      });
      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(
          //@ts-ignore
          countProducts / pageSize
        ),
      });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .send({ message: error.message, method: "getProductByQuery" });
        console.log(error.message);
      }
      console.log(error);
    }
  }

  public async createProductReview(req: Request, res: Response) {
    const { id } = req.params;
    const { name, rating, comment } = req.body;
    try {
      const product = await Product.findById(id);
      if (product) {
        const alreadyReviewed =
          product.reviews && product.reviews.find((r) => r.name === name);
        if (alreadyReviewed) {
          res.status(400);
          throw new Error("Product already reviewed");
        }
        const review = {
          name,
          rating: Number(rating),
          comment,
        };
        product.reviews && product.reviews.push(review);
        product.numReviews = product.reviews ? product.reviews.length : 0;
        product.rating =
          product.reviews &&
          product.reviews.reduce((a, c) => c.rating + a, 0) /
            product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
          message: "Review added",
          reviews:
            updatedProduct.reviews &&
            updatedProduct.reviews[updatedProduct.reviews?.length - 1],
          rating: product.rating,
          numReviews: product.numReviews,
        });
      } else {
        res.status(404);
        throw new Error("Product not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }
}

export const productController = new ProductController();
