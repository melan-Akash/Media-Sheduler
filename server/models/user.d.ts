import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    email: string;
    password: string;
    subscriptionPlan: "free" | "pro" | "agency";
    subscriptionStatus: "active" | "inactive" | "trialing" | "past_due" | "canceled";
    zeroProfileId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    stripeSubscriptionId?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.d.ts.map