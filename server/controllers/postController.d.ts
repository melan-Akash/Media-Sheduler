import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
export declare const generatePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getGenerations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const schedulePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteGeneration: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=postController.d.ts.map