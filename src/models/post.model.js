import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);
postSchema.index({createdAt:1})
const Post = mongoose.model('Post', postSchema);

export default Post;
