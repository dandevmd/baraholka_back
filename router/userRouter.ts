import {Router} from 'express';
import { userController } from '../controllers/userController';
import { verifyToken } from '../middlewares/isAuth';

const userRouter = Router();

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.put('/update', verifyToken, userController.updateUser);

export default userRouter