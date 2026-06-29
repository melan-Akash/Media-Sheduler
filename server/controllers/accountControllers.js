import { Account } from '../models/account.js';
import zero from '../config/zuo.js';
// GET /api/accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        res.json(accounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
// POST /api/accounts
export const addAccount = async (req, res) => {
    try {
        const { platform, handle, avatarUrl } = req.body;
        const account = await Account.create({
            user: req.user.id,
            platform,
            handle,
            avatarUrl
        });
        res.status(201).json(account);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
// DELETE /api/accounts/:id
export const disconnectAccount = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }
        if (account.zeroAccountId) {
            try {
                await zero.accounts.deleteAccount({
                    path: { accountId: account.zeroAccountId }
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Server error' });
                return;
            }
        }
        await account.deleteOne();
        res.json({ message: 'Account disconnected successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
//# sourceMappingURL=accountControllers.js.map