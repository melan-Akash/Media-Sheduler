import zero from '../config/zuo.js';
import { User } from '../models/user.js';
import { Account } from '../models/account.js';
import { sendAccountConnectedEmail } from '../services/emailService.js';
// Helper to ensure user has a ZIO profile
const getOrCreateZeroProfile = async (user) => {
    try {
        const result = await zero.profiles.listProfiles();
        const data = result.data;
        const profiles = Array.isArray(data) ? data : data?.profiles || data?.data || [];
        if (profiles.length > 0) {
            const firstProfile = profiles[0];
            const pId = firstProfile.id || firstProfile._id;
            await User.findByIdAndUpdate(user.id, { zeroProfileId: pId });
            return pId;
        }
        const createResult = await zero.profiles.createProfile({
            body: {
                name: user.name || user.email,
            }
        });
        const created = createResult.data?.profile || createResult.data;
        const pId = created.id || created._id;
        if (!pId)
            throw new Error('Failed to create zero profile, no ID returned');
        await User.findByIdAndUpdate(user.id, { zeroProfileId: pId });
        return pId;
    }
    catch (error) {
        console.error('get or create zero profile error', error.message || error);
        throw error;
    }
};
// GET /api/auth/:platform/url
export const generateAuthUrl = async (req, res) => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZeroProfile(req.user);
        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;
        const result = await zero.connect.getConnectUrl({
            path: { platform: platform },
            query: {
                profileId,
                redirect_url: redirectUrl
            }
        });
        const data = result.data;
        console.log('get connect URL response', JSON.stringify(data, null, 2));
        const url = data.authUrl || data.url;
        if (!url) {
            throw new Error(`zero returned no auth url, full response: ${JSON.stringify(data)}`);
        }
        res.json({ url, authUrl: url });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
// GET /api/auth/sync
export const syncAccounts = async (req, res) => {
    try {
        const profileId = await getOrCreateZeroProfile(req.user);
        const result = await zero.accounts.listAccounts({
            query: { profileId }
        });
        const data = result.data;
        const zAccounts = data.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatforms = ['Twitter', 'LinkedIn', 'Facebook', 'Instagram'];
        const syncedAccounts = [];
        for (const zAccount of zAccounts) {
            const zId = zAccount.id || zAccount._id;
            if (!zId) {
                console.log('skipping account with no ID', zAccount);
                continue;
            }
            const rawPlatform = (zAccount.platform || zAccount.type || '').toLowerCase();
            const normalizedPlatform = supportedPlatforms.find(p => rawPlatform.includes(p.toLowerCase()));
            if (!normalizedPlatform) {
                console.log(`skipping unsupported platform: ${rawPlatform}`);
                continue;
            }
            const existingAccount = await Account.findOne({ zeroAccountId: zId });
            const account = await Account.findOneAndUpdate({ zeroAccountId: zId }, {
                user: req.user.id,
                platform: normalizedPlatform,
                handle: zAccount.username || zAccount.name || zAccount.handle || 'Unknown',
                zeroAccountId: zId,
                status: 'connected',
                avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profileImageUrl
            }, { upsert: true, returnDocument: 'after' });
            // Send email if it is a new account or was previously disconnected
            if (!existingAccount || existingAccount.status !== 'connected') {
                sendAccountConnectedEmail(req.user.email, req.user.name, {
                    name: account.handle,
                    platform: account.platform
                }).catch(err => console.error('Failed to send account connection email', err));
            }
            syncedAccounts.push(account);
        }
        res.json(syncedAccounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
//# sourceMappingURL=socialAuthController.js.map