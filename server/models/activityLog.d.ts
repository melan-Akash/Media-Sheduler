import mongoose from 'mongoose';
export declare const ActivityLog: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
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
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    description: string;
    actionType: "post_published" | "ai_reply";
    platform?: string | null | undefined;
    relatedPost?: mongoose.Types.ObjectId | null | undefined;
    generatedText?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=activityLog.d.ts.map