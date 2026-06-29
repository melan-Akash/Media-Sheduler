import mongoose from 'mongoose';
export declare const Generation: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
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
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    content: string;
    prompt: string;
    hashtags: string[];
    mediaUrl?: string | null | undefined;
    mediaType?: "image" | "video" | null | undefined;
    tone?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=generation.d.ts.map