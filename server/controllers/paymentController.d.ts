import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const createCheckoutSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifySession: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=paymentController.d.ts.map