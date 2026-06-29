import mongoose from 'mongoose';
export declare const Account: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    status: "connected" | "disconnected";
    platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram" | "Facebook page" | "LinkedIn page" | "Instagram business";
    handle: string;
    zeroAccountId?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    tokenExpiresAt?: NativeDate | null | undefined;
    avatarUrl?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=account.d.ts.map