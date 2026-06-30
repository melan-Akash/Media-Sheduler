import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    zeroProfileId: {
        type: String
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'pro', 'agency'],
        default: 'free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'trialing', 'past_due', 'canceled'],
        default: 'inactive'
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    }
}, {
    timestamps: true
});
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map