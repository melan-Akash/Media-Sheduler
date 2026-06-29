import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const generateAuthUrl: (req: AuthRequest, res: Response) => Promise<void>;
export declare const syncAccounts: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=socialAuthController.d.ts.map