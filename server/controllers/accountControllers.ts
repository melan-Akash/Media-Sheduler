import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Account } from '../models/account';
import zero from '../config/zuo';

// GET /api/accounts
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// POST /api/accounts
export const addAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { platform, handle, avatarUrl } = req.body;
    
    const account = await Account.create({
      user: req.user.id,
      platform,
      handle,
      avatarUrl
    });

    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE /api/accounts/:id
export const disconnectAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user.id });

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    if (account.zeroAccountId) {
      try {
        await zero.accounts.deleteAccount({ accountId: account.zeroAccountId });
      } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
        return;
      }
    }

    await account.deleteOne();
    res.json({ message: 'Account disconnected successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};