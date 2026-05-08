import mongoose from 'mongoose';
import User from './src/models/userModel.js';
import Post from './src/models/post.model.js';
import Product from './src/models/product.model.js';
import { config } from './src/config/index.js';

async function checkData() {
    await mongoose.connect(config.mongoose.url);
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const productCount = await Product.countDocuments();
    console.log({ userCount, postCount, productCount });
    await mongoose.disconnect();
}

checkData();
