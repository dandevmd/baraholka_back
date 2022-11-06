import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import router from "./router";
import morgan from "morgan";
import mongoose from "mongoose";

//initialize express
const app: Express = express();

//connect to database
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to database with success"))
  .catch((error) => console.log(error));

//initialize middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//intialize routes
app.use("/", router);

//initialize port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
