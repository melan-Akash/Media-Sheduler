import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createCheckoutSession, verifySession } from '../controllers/paymentController.js';
const paymentRouter = express.Router();
paymentRouter.post('/create-checkout-session', protect, createCheckoutSession);
paymentRouter.post('/verify-session', protect, verifySession);
export default paymentRouter;
//# sourceMappingURL=paymentRoutes.js.map