import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const getAccounts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addAccount: (req: AuthRequest, res: Response) => Promise<void>;
export declare const disconnectAccount: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=accountControllers.d.ts.map