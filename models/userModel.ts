import mongoose from "mongoose";

interface User {
  // _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
