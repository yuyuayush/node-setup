import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
    {
        mobileUrl: {
            type: String,
            required: true
        },
        mobileKey: {
            type: String,
            required: true
        },
        laptopUrl: {
            type: String,
            required: true
        },
        laptopKey: {
            type: String,
            required: true
        },
        desktopUrl: {
            type: String,
            required: true
        },
        desktopKey: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Image = mongoose.model('Image', imageSchema);

export default Image;
