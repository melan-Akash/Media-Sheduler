import mongoose from 'mongoose';
const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'Facebook page', 'LinkedIn page', 'Instagram business'],
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    zeroAccountId: {
        type: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    tokenExpiresAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['connected', 'disconnected'],
        default: 'connected'
    },
    avatarUrl: {
        type: String
    }
}, {
    timestamps: true
});
export const Account = mongoose.model('Account', accountSchema);
//# sourceMappingURL=account.js.map