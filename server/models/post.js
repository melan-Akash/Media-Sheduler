import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ['image', 'video']
    },
    platforms: [{
            type: String,
            enum: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'Facebook page', 'LinkedIn page', 'Instagram business']
        }],
    scheduledFor: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'failed'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});
export const Post = mongoose.model('Post', postSchema);
//# sourceMappingURL=post.js.map