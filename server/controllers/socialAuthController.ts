import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import zero from '../config/zuo.js';
import { User } from '../models/user.js';
import { Account } from '../models/account.js';

// Helper to ensure user has a ZIO profile
const getOrCreateZeroProfile = async (user: any): Promise<string> => {
  try {
    const result = await zero.profiles.listProfiles();
    const data = result.data as any;
    const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data || [];

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
    
    const created = (createResult.data as any)?.profile || createResult.data;
    const pId = created.id || created._id;

    if (!pId) throw new Error('Failed to create zero profile, no ID returned');

    await User.findByIdAndUpdate(user.id, { zeroProfileId: pId });
    return pId;
  } catch (error: any) {
    console.error('get or create zero profile error', error.message || error);
    throw error;
  }
};

// GET /api/auth/:platform/url
export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { platform } = req.params;
    const profileId = await getOrCreateZeroProfile(req.user);
    
    const origin = req.headers.origin;
    const redirectUrl = `${origin}/accounts`;

    const result = await zero.connect.getConnectUrl({
      path: { platform: platform as any },
      query: {
        profileId,
        redirect_url: redirectUrl
      }
    });

    const data = result.data as any;
    console.log('get connect URL response', JSON.stringify(data, null, 2));

    const url = data.authUrl || data.url;

    if (!url) {
      throw new Error(`zero returned no auth url, full response: ${JSON.stringify(data)}`);
    }

    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/auth/sync
export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profileId = await getOrCreateZeroProfile(req.user);
    const result = await zero.accounts.listAccounts({
      query: { profileId }
    });
    const data = result.data as any;
    
    const zAccounts: any[] = data.accounts || (Array.isArray(data) ? data : []);
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

      const account = await Account.findOneAndUpdate(
        { zeroAccountId: zId },
        {
          user: req.user.id,
          platform: normalizedPlatform,
          handle: zAccount.username || zAccount.name || zAccount.handle || 'Unknown',
          zeroAccountId: zId,
          status: 'connected',
          avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profileImageUrl
        },
        { upsert: true, returnDocument: 'after' }
      );

      syncedAccounts.push(account);
    }

    res.json(syncedAccounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};