import { Request, Response } from "express";
import UserModel from "../models/userModel";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils";

class UserController {
  loginUser = async (req: Request, res: Response) => {
    try {
      //desc from body
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Invalid Email and Password", method: "loginUser" });
      }
      //check candidate in db
      const candidate = await UserModel.findOne({ email });
      if (!candidate) {
        return res
          .status(400)
          .send({ message: "User does not exist!", method: "loginUser" });
      }
      //check candidate password match
      const isMatch = await bcrypt.compare(password, candidate.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Invalid Password", method: "loginUser" });
      }

      //generate token
      const token = generateToken(candidate.email);

      //send right response
      const resp = {
        message: "User logged in successfully",
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        isAdmin: candidate.isAdmin,
        token,
      
      };
      res.status(200).json(resp);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      }
    }
  };
  registerUser = async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    //make sure all field all filled
    if (!name && !email && !password) {
      return res.status(400).send({
        message: "Invalid Email and Password",
        method: "registerUser",
      });
    }
    try {
      //make sure user with same credentials does not exist
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .send({ message: "User already exist!", method: "registerUser" });
      }
      //salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //create new User
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });

      //save user to db
      const user = await newUser.save();

      // if user is saved successfully, generate a token
      if (!user) {
        return res
          .status(400)
          .send({ message: "Error in saving user", method: "registerUser" });
      }
      const token = generateToken(user.email);

      //send right response
      const resp = {
        message: "User registered successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      };

      res.status(200).json(resp);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      }
      console.log(error);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const userId = req.headers.authorization?.split(" ")[2];
    const { name, email, password } = req.body;
    if (!name && !email) {
      return res.status(400).send({
        message: "Invalid/Empty Email ",
        method: "updateUser",
      });
    }
    try {
      const userToUpdate = await UserModel.findById(userId);
      if (!userToUpdate) {
        return res
          .status(400)
          .send({ message: "User does not exist!", method: "updateUser" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //in dependeta de db aici trebuie sa pastrezi datele vechi si sal le schimbi doar pe cele noi
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          password: password !== '' ? hashedPassword : userToUpdate.password,
  
        },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(400)
          .send({ message: "Error in updating user", method: "updateUser" });
      }
      const token = generateToken(updatedUser.email, updatedUser?._id);

      const resp = {
        message: "User updated successfully",
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token,
      };
      console.log(resp);
      res.status(200).json(resp);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
        console.log(error.message);
      }
      console.log(error);
    }
  };
}

export const userController = new UserController();
