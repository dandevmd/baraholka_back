import {Router} from 'express'
import {payPalController} from '../controllers/payPalController'

const payPalRouter = Router();

payPalRouter.get('/', payPalController.getPayPalClientID);


export default payPalRouter